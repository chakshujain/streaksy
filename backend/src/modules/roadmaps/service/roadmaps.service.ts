import { roadmapsRepository } from '../repository/roadmaps.repository';
import { AppError } from '../../../common/errors/AppError';
import { queryOne } from '../../../config/database';
import { streaksEngine, PointBreakdown } from '../../streak/service/streaks-engine';
import { generateRoadmapGuidance } from '../../ai/service/ai.service';
import { checkAIRateLimit } from '../../../common/utils/aiRateLimit';
import { env } from '../../../config/env';

export const roadmapsService = {
  async getCategories() {
    return roadmapsRepository.getCategories();
  },

  async getTemplates(categorySlug?: string) {
    return roadmapsRepository.getTemplates(categorySlug);
  },

  async getTemplateBySlug(slug: string) {
    const template = await roadmapsRepository.getTemplateBySlug(slug);
    if (!template) throw AppError.notFound('Template not found');
    return template;
  },

  async getFeaturedTemplates() {
    return roadmapsRepository.getFeaturedTemplates();
  },

  async createUserRoadmap(
    userId: string,
    data: {
      templateId?: string;
      groupId?: string;
      name: string;
      categoryId?: string;
      durationDays: number;
      startDate?: string;
      customTasks?: unknown;
      warRoomSchedule?: { day?: string; time?: string; recurrence?: string };
    }
  ) {
    if (!data.name || data.name.trim().length === 0) {
      throw AppError.badRequest('Roadmap name is required');
    }
    if (!Number.isInteger(data.durationDays) || data.durationDays < 1 || data.durationDays > 365) {
      throw AppError.badRequest('Duration must be between 1 and 365 days');
    }
    if (data.groupId) {
      const member = await queryOne<{ user_id: string }>(
        'SELECT user_id FROM group_members WHERE group_id = $1 AND user_id = $2',
        [data.groupId, userId]
      );
      if (!member) throw AppError.forbidden('Not a member of this group');
    }
    const roadmap = await roadmapsRepository.createUserRoadmap(userId, data);

    // Auto-add user as participant on the template
    if (data.templateId) {
      await roadmapsRepository.addParticipant(data.templateId, userId, roadmap.id);
    }

    // Auto-create Google Calendar events (non-blocking)
    import('../../calendar/service/calendar.service').then(m => {
      m.calendarService.createRoadmapEvents(userId, {
        id: roadmap.id,
        name: data.name,
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        durationDays: data.durationDays,
        hoursPerDay: (data as any).hoursPerDay,
      }).catch(() => {});
    }).catch(() => {});

    // Auto-create war rooms for entire roadmap duration (non-blocking)
    if (data.warRoomSchedule) {
      import('../../room/service/room.service').then(m => {
        const schedule = data.warRoomSchedule!;
        const recurrence = schedule.recurrence || 'weekly';
        const [hours, minutes] = (schedule.time || '10:00').split(':').map(Number);
        const dayMap: Record<string, number> = {
          sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
          thursday: 4, friday: 5, saturday: 6,
        };
        const targetDay = dayMap[(schedule.day || 'saturday').toLowerCase()] ?? 6;

        const start = data.startDate ? new Date(data.startDate) : new Date();
        const endDate = new Date(start);
        endDate.setDate(endDate.getDate() + data.durationDays);

        // Generate all scheduled dates based on recurrence
        const dates: Date[] = [];
        const cursor = new Date(start);
        cursor.setHours(hours, minutes, 0, 0);

        if (recurrence === 'daily') {
          // If start is already past today's time, begin tomorrow
          if (cursor <= new Date()) cursor.setDate(cursor.getDate() + 1);
          while (cursor <= endDate) {
            dates.push(new Date(cursor));
            cursor.setDate(cursor.getDate() + 1);
          }
        } else if (recurrence === 'weekdays') {
          if (cursor <= new Date()) cursor.setDate(cursor.getDate() + 1);
          while (cursor <= endDate) {
            const dow = cursor.getDay();
            if (dow >= 1 && dow <= 5) dates.push(new Date(cursor));
            cursor.setDate(cursor.getDate() + 1);
          }
        } else if (recurrence === 'weekends') {
          if (cursor <= new Date()) cursor.setDate(cursor.getDate() + 1);
          while (cursor <= endDate) {
            const dow = cursor.getDay();
            if (dow === 0 || dow === 6) dates.push(new Date(cursor));
            cursor.setDate(cursor.getDate() + 1);
          }
        } else if (recurrence === 'monthly') {
          // Find first occurrence of the target day from start
          let diff = targetDay - start.getDay();
          if (diff <= 0) diff += 7;
          cursor.setDate(start.getDate() + diff);
          cursor.setHours(hours, minutes, 0, 0);
          while (cursor <= endDate) {
            dates.push(new Date(cursor));
            // Jump roughly one month, then find the next target day
            cursor.setMonth(cursor.getMonth() + 1);
            // Snap back to the correct day of week
            const dow = cursor.getDay();
            let adj = targetDay - dow;
            if (adj < 0) adj += 7;
            cursor.setDate(cursor.getDate() + adj);
            cursor.setHours(hours, minutes, 0, 0);
          }
        } else {
          // weekly (default)
          let diff = targetDay - start.getDay();
          if (diff <= 0) diff += 7;
          cursor.setDate(start.getDate() + diff);
          cursor.setHours(hours, minutes, 0, 0);
          while (cursor <= endDate) {
            dates.push(new Date(cursor));
            cursor.setDate(cursor.getDate() + 7);
          }
        }

        // Create a room for each date
        const recurrenceLabel = recurrence === 'daily' ? 'Day' : recurrence === 'weekdays' ? 'Day' : recurrence === 'weekends' ? 'Weekend' : recurrence === 'monthly' ? 'Month' : 'Week';
        dates.forEach((d, i) => {
          m.roomService.createRoom(userId, `${data.name} — ${recurrenceLabel} ${i + 1} Solve Room`, null, 60, {
            scheduledAt: d.toISOString(),
            mode: 'multi',
            groupId: data.groupId || undefined,
            roadmapId: roadmap.id || undefined,
          }).catch(() => {});
        });
      }).catch(() => {});
    }

    return roadmap;
  },

  async getActiveRoadmaps(userId: string) {
    return roadmapsRepository.getActiveRoadmaps(userId);
  },

  async getAllRoadmaps(userId: string) {
    return roadmapsRepository.getAllRoadmaps(userId);
  },

  async getRoadmapById(id: string, userId: string) {
    const roadmap = await roadmapsRepository.getRoadmapById(id);
    if (!roadmap) throw AppError.notFound('Roadmap not found');

    // Get tasks (from template or custom)
    let tasks = null;
    if (roadmap.template_id) {
      tasks = await roadmapsRepository.getTemplateTasks(roadmap.template_id);
    }

    // Get progress
    const progress = await roadmapsRepository.getDayProgress(id, userId);

    // Get streak
    const streak = await roadmapsRepository.getStreak(id, userId);

    return { roadmap, tasks, progress, streak };
  },

  async updateRoadmap(id: string, userId: string, data: { status?: string; name?: string }) {
    const roadmap = await roadmapsRepository.getRoadmapById(id);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    if (roadmap.user_id !== userId) throw AppError.forbidden('Not your roadmap');
    return roadmapsRepository.updateRoadmap(id, data);
  },

  async deleteRoadmap(id: string, userId: string) {
    const roadmap = await roadmapsRepository.getRoadmapById(id);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    if (roadmap.user_id !== userId) throw AppError.forbidden('Not your roadmap');

    // Clean up calendar events (non-blocking)
    import('../../calendar/service/calendar.service').then(m => {
      m.calendarService.deleteEventsForReference(userId, id).catch(() => {});
    }).catch(() => {});

    await roadmapsRepository.deleteRoadmap(id);
  },

  async updateDayProgress(roadmapId: string, userId: string, dayNumber: number, completed: boolean) {
    // Validate dayNumber
    if (!Number.isInteger(dayNumber) || dayNumber < 1) {
      throw AppError.badRequest('Day number must be a positive integer');
    }
    if (typeof completed !== 'boolean') {
      throw AppError.badRequest('Completed must be a boolean');
    }

    const roadmap = await roadmapsRepository.getRoadmapById(roadmapId);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    if (roadmap.user_id !== userId) throw AppError.forbidden('Not your roadmap');

    if (dayNumber > roadmap.duration_days) {
      throw AppError.badRequest(`Day ${dayNumber} exceeds roadmap duration of ${roadmap.duration_days} days`);
    }

    const progress = await roadmapsRepository.updateDayProgress(roadmapId, userId, dayNumber, completed);

    let streak = null;
    let pointsEarned = 0;
    let pointBreakdown: PointBreakdown | null = null;

    if (completed) {
      // Update streak
      streak = await roadmapsRepository.updateStreak(roadmapId, userId);

      // Use streaks engine for rich multiplier-based points
      pointBreakdown = await streaksEngine.calculatePoints(
        userId,
        streak.current_streak,
        roadmap.group_id,
        new Date()
      );
      pointsEarned = pointBreakdown.totalPoints;

      // Add to global total_points
      await roadmapsRepository.addPoints(userId, pointsEarned);

      // Check if roadmap is now complete
      const allProgress = await roadmapsRepository.getDayProgress(roadmapId, userId);
      const completedCount = allProgress.filter(p => p.completed).length;
      if (completedCount >= roadmap.duration_days && roadmap.status !== 'completed') {
        await roadmapsRepository.updateRoadmap(roadmapId, { status: 'completed' });

        // Post feed event for roadmap completion
        import('../../feed/service/feed.service').then(m => {
          m.feedService.postEvent(userId, 'roadmap_complete', `Completed "${roadmap.name}"!`, undefined, { roadmapId });
        }).catch(() => {});

        // Award completion bonus
        const { bonus } = streaksEngine.calculateCompletionBonus(
          completedCount,
          roadmap.duration_days,
          roadmap.start_date
        );
        await roadmapsRepository.addPoints(userId, bonus);
        pointsEarned += bonus;
      }

      // Cache multiplier preview for dashboard
      streaksEngine.cacheMultiplierPreview(userId, roadmap.group_id).catch(() => {});
    }

    return { progress, streak, pointsEarned, pointBreakdown };
  },

  async getDayProgress(roadmapId: string, userId?: string) {
    return roadmapsRepository.getDayProgress(roadmapId, userId);
  },

  async getStreak(roadmapId: string, userId: string) {
    return roadmapsRepository.getStreak(roadmapId, userId);
  },

  async getLeaderboard(roadmapId: string) {
    const roadmap = await roadmapsRepository.getRoadmapById(roadmapId);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    return roadmapsRepository.getLeaderboard(roadmapId);
  },

  async getByShareCode(code: string) {
    const roadmap = await roadmapsRepository.getByShareCode(code);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    return roadmap;
  },

  async linkGroup(roadmapId: string, userId: string, groupId: string) {
    const roadmap = await roadmapsRepository.getRoadmapById(roadmapId);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    if (roadmap.user_id !== userId) throw AppError.forbidden('Not your roadmap');

    const member = await queryOne<{ user_id: string }>(
      'SELECT user_id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );
    if (!member) throw AppError.forbidden('Not a member of this group');

    await roadmapsRepository.linkGroup(roadmapId, groupId);
  },

  async getTodayTasks(userId: string) {
    return roadmapsRepository.getTodayTasks(userId);
  },

  async getGlobalLeaderboard() {
    return roadmapsRepository.getGlobalLeaderboard(50);
  },

  async getParticipants(slug: string) {
    const template = await roadmapsRepository.getTemplateBySlug(slug);
    if (!template) throw AppError.notFound('Template not found');
    return roadmapsRepository.getParticipants(template.id);
  },

  async getDiscussions(slug: string, limit?: number, offset?: number) {
    const template = await roadmapsRepository.getTemplateBySlug(slug);
    if (!template) throw AppError.notFound('Template not found');
    return roadmapsRepository.getDiscussions(template.id, limit, offset);
  },

  async createDiscussion(slug: string, userId: string, content: string, parentId?: string) {
    const template = await roadmapsRepository.getTemplateBySlug(slug);
    if (!template) throw AppError.notFound('Template not found');
    if (!content || content.trim().length === 0) throw AppError.badRequest('Content is required');
    return roadmapsRepository.createDiscussion(template.id, userId, content.trim(), parentId);
  },

  async getAIGuidance(roadmapId: string, userId: string) {
    if (!env.ai.apiKey) {
      throw new AppError(503, 'AI generation is not available. NVIDIA_API_KEY is not configured.');
    }

    await checkAIRateLimit(userId);

    const roadmap = await roadmapsRepository.getRoadmapById(roadmapId);
    if (!roadmap) throw AppError.notFound('Roadmap not found');

    // Get progress to determine current day
    const progress = await roadmapsRepository.getDayProgress(roadmapId, userId);
    const completedDays = progress.filter(p => p.completed).length;
    const currentDay = completedDays + 1;

    // Get template tasks for today's task description
    let todayTask = `Day ${currentDay} tasks`;
    if (roadmap.template_id) {
      const tasks = await roadmapsRepository.getTemplateTasks(roadmap.template_id);
      const todayTaskData = tasks?.find((t: any) => t.day_number === currentDay);
      if (todayTaskData) {
        todayTask = (todayTaskData as any).title || (todayTaskData as any).description || todayTask;
      }
    }

    // Get category name
    const category = roadmap.category_slug || roadmap.category_id || 'General';

    const guidance = await generateRoadmapGuidance({
      roadmapName: roadmap.name,
      category: String(category),
      currentDay,
      totalDays: roadmap.duration_days,
      todayTask,
      completedDays,
    });

    if (!guidance) {
      throw new AppError(502, 'AI service failed to generate guidance. Please try again later.');
    }

    return guidance;
  },

  async inviteFriends(roadmapId: string, senderUserId: string, recipientUserIds: string[]) {
    const roadmap = await roadmapsRepository.getRoadmapById(roadmapId);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    if (roadmap.user_id !== senderUserId) throw AppError.forbidden('Not your roadmap');

    // Get sender name
    const sender = await queryOne<{ display_name: string }>('SELECT display_name FROM users WHERE id = $1', [senderUserId]);
    const senderName = sender?.display_name || 'A friend';

    const { notificationService } = await import('../../notification/service/notification.service');

    for (const userId of recipientUserIds.slice(0, 20)) {
      // In-app notification
      await notificationService.notify(
        userId,
        'roadmap_invite',
        `${senderName} invited you to join "${roadmap.name}"`,
        `Tap to join this roadmap and start your journey together!`,
        { roadmapId, shareCode: roadmap.share_code, senderName }
      ).catch(() => {});

      // Email notification
      try {
        const recipient = await queryOne<{ email: string; display_name: string }>('SELECT email, display_name FROM users WHERE id = $1', [userId]);
        if (recipient?.email) {
          const { sendEmail } = await import('../../../config/email');
          await sendEmail(
            recipient.email,
            `${senderName} invited you to "${roadmap.name}" on Streaksy`,
            `<p>Hi ${recipient.display_name || 'there'},</p>
<p>${senderName} has invited you to join their roadmap <strong>"${roadmap.name}"</strong> on Streaksy.</p>
<p><a href="https://streaksy.in/roadmaps/join/${roadmap.share_code}">Join Roadmap</a></p>
<p>Happy learning!<br>Streaksy Team</p>`
          ).catch(() => {});
        }
      } catch {}
    }
  },

  async joinByShareCode(shareCode: string, userId: string) {
    const original = await roadmapsRepository.getByShareCode(shareCode);
    if (!original) throw AppError.notFound('Roadmap not found');

    // Create a copy for the joining user with same template and group
    const roadmap = await roadmapsRepository.createUserRoadmap(userId, {
      templateId: original.template_id || undefined,
      groupId: original.group_id || undefined,
      name: original.name,
      categoryId: original.category_id || undefined,
      durationDays: original.duration_days,
      startDate: new Date().toISOString().split('T')[0],
    });

    // Add as participant on the template
    if (original.template_id) {
      await roadmapsRepository.addParticipant(original.template_id, userId, roadmap.id);
    }

    // Add to group if exists
    if (original.group_id) {
      try {
        await queryOne('INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [original.group_id, userId]);
      } catch {}
    }

    return roadmap;
  },
};
