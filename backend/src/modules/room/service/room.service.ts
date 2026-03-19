import crypto from 'crypto';
import { roomRepository } from '../repository/room.repository';
import { AppError } from '../../../common/errors/AppError';

export const roomService = {
  async createRoom(
    hostId: string,
    name: string,
    problemId: string | null,
    timeLimitMinutes: number,
    opts?: { problemIds?: string[]; sheetId?: string; scheduledAt?: string; mode?: string; recurrence?: string; meetLink?: string }
  ) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    const mode = opts?.mode || 'single';
    const scheduledAt = opts?.scheduledAt || null;
    const sheetId = opts?.sheetId || null;
    const status = scheduledAt ? 'scheduled' : 'waiting';
    const recurrence = opts?.recurrence || null;
    const meetLink = opts?.meetLink || null;

    const room = await roomRepository.create(name, code, problemId, hostId, timeLimitMinutes, {
      mode,
      scheduledAt,
      sheetId,
      status,
      recurrence,
      meetLink,
    });
    await roomRepository.addParticipant(room.id, hostId);

    // Add multiple problems if provided
    if (opts?.problemIds && opts.problemIds.length > 0) {
      await roomRepository.addProblems(room.id, opts.problemIds);
    } else if (problemId) {
      await roomRepository.addProblems(room.id, [problemId]);
    }

    return roomRepository.findById(room.id);
  },

  async joinRoom(code: string, userId: string) {
    const room = await roomRepository.findByCode(code);
    if (!room) throw AppError.notFound('Room not found');
    if (room.status === 'finished') throw AppError.badRequest('Room has ended');
    await roomRepository.addParticipant(room.id, userId);

    // Notify host
    import('../../notification/service/notification.service').then(m => {
      m.notificationService.notify(room.host_id, 'room_join', 'Someone joined your room!', `A participant joined "${room.name}"`, { roomId: room.id });
    }).catch(() => {});

    return room;
  },

  async getRoom(roomId: string) {
    const room = await roomRepository.findById(roomId);
    if (!room) throw AppError.notFound('Room not found');
    const participants = await roomRepository.getParticipants(roomId);
    const messages = await roomRepository.getMessages(roomId);
    return { ...room, participants, messages };
  },

  async startRoom(roomId: string, userId: string) {
    const room = await roomRepository.findById(roomId);
    if (!room) throw AppError.notFound('Room not found');
    if (room.host_id !== userId) throw AppError.forbidden('Only the host can start the room');
    if (room.status !== 'waiting' && room.status !== 'scheduled') throw AppError.badRequest('Room already started');
    await roomRepository.updateStatus(roomId, 'active');

    // Notify all participants
    const participants = await roomRepository.getParticipants(roomId);
    import('../../notification/service/notification.service').then(m => {
      participants.forEach(p => {
        if (p.user_id !== userId) {
          m.notificationService.notify(p.user_id, 'room_start', 'Room started! \u{1F3C1}', `"${room!.name}" has started. Time to solve!`, { roomId });
        }
      });
    }).catch(() => {});

    return roomRepository.findById(roomId);
  },

  async endRoom(roomId: string, userId: string) {
    const room = await roomRepository.findById(roomId);
    if (!room) throw AppError.notFound('Room not found');
    if (room.host_id !== userId) throw AppError.forbidden('Only the host can end the room');
    await roomRepository.updateStatus(roomId, 'finished');

    // Update stats for all participants
    const participants = await roomRepository.getParticipants(roomId);
    for (const p of participants) {
      await roomRepository.updateStats(p.user_id);
    }

    // Notify all participants
    import('../../notification/service/notification.service').then(m => {
      participants.forEach(p => {
        if (p.user_id !== userId) {
          m.notificationService.notify(p.user_id, 'room_end', 'Room ended! \u{1F3C6}', `"${room!.name}" has ended. Check the results!`, { roomId });
        }
      });
    }).catch(() => {});

    // Create next recurrence if applicable
    if (room.recurrence) {
      this.createNextRecurrence(room).catch(() => {});
    }

    return roomRepository.findById(roomId);
  },

  async createNextRecurrence(room: { id: string; name: string; host_id: string; problem_id: string; time_limit_minutes: number; mode: string; sheet_id: string | null; recurrence: string | null; meet_link: string | null; scheduled_at: Date | null }) {
    if (!room.recurrence || !room.scheduled_at) return null;

    const prev = new Date(room.scheduled_at);
    let next: Date;

    switch (room.recurrence) {
      case 'daily':
        next = new Date(prev.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'weekdays': {
        next = new Date(prev.getTime() + 24 * 60 * 60 * 1000);
        // Skip weekends
        while (next.getDay() === 0 || next.getDay() === 6) {
          next = new Date(next.getTime() + 24 * 60 * 60 * 1000);
        }
        break;
      }
      case 'weekends': {
        next = new Date(prev.getTime() + 24 * 60 * 60 * 1000);
        // Skip weekdays
        while (next.getDay() !== 0 && next.getDay() !== 6) {
          next = new Date(next.getTime() + 24 * 60 * 60 * 1000);
        }
        break;
      }
      case 'weekly':
        next = new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly': {
        next = new Date(prev);
        next.setMonth(next.getMonth() + 1);
        break;
      }
      default:
        return null;
    }

    return this.createRoom(
      room.host_id,
      room.name,
      room.problem_id || null,
      room.time_limit_minutes,
      {
        mode: room.mode,
        scheduledAt: next.toISOString(),
        sheetId: room.sheet_id || undefined,
        recurrence: room.recurrence,
        meetLink: room.meet_link || undefined,
      }
    );
  },

  async markSolved(roomId: string, userId: string, data?: { code?: string; language?: string; runtimeMs?: number; memoryKb?: number }) {
    const room = await roomRepository.findById(roomId);
    if (!room) throw AppError.notFound('Room not found');
    if (room.status !== 'active') throw AppError.badRequest('Room is not active');
    await roomRepository.markSolved(roomId, userId, data?.code || null, data?.language || null, data?.runtimeMs || null, data?.memoryKb || null);

    // Trigger full sync pipeline (progress, streak, badges, feed, leaderboard)
    const roomData = await roomRepository.findById(roomId);
    if (roomData?.problem_slug) {
      import('../../../modules/sync/service/sync.service').then(m => {
        m.syncService.syncLeetcode(userId, roomData.problem_slug!, 'solved', {
          language: data?.language,
          code: data?.code,
          runtimeMs: data?.runtimeMs,
          memoryKb: data?.memoryKb,
        }).catch(() => {});
      }).catch(() => {});
    }

    // Also track per-problem solve if room has problem_id
    if (roomData?.problem_id) {
      await roomRepository.markProblemSolved(roomId, userId, roomData.problem_id, data?.code || null, data?.language || null, data?.runtimeMs || null, data?.memoryKb || null);
    }

    // Notify all participants
    const participants = await roomRepository.getParticipants(roomId);
    import('../../notification/service/notification.service').then(m => {
      participants.forEach(p => {
        if (p.user_id !== userId) {
          m.notificationService.notify(p.user_id, 'room_solve', 'Someone solved it! \u{1F389}', `A participant solved the problem in "${roomData?.name}"`, { roomId });
        }
      });
    }).catch(() => {});

    return participants;
  },

  async sendMessage(roomId: string, userId: string, content: string) {
    return roomRepository.addMessage(roomId, userId, content);
  },

  async getUserRooms(userId: string) {
    return roomRepository.getRecentRooms(userId);
  },

  async getActiveRooms(userId: string) {
    return roomRepository.getUserActiveRooms(userId);
  },

  async autoStartScheduledRooms() {
    const rooms = await roomRepository.getScheduledReady();
    for (const room of rooms) {
      await roomRepository.updateStatus(room.id, 'active');
      const participants = await roomRepository.getParticipants(room.id);
      import('../../notification/service/notification.service').then(m => {
        participants.forEach(p => {
          m.notificationService.notify(p.user_id, 'room_start', 'Room started! \u{1F3C1}', `"${room.name}" has started. Time to solve!`, { roomId: room.id });
        });
      }).catch(() => {});
    }
    return rooms.length;
  },

  async getUpcoming() {
    return roomRepository.getUpcoming();
  },

  async getLeaderboard() {
    return roomRepository.getLeaderboard();
  },

  async getUserStats(userId: string) {
    await roomRepository.updateStats(userId);
    const lb = await roomRepository.getLeaderboard(1000);
    return lb.find(e => e.user_id === userId) || null;
  },
};
