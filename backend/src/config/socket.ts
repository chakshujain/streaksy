import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from './env';
import { logger } from './logger';
import { roomService } from '../modules/room/service/room.service';
import { roomRepository } from '../modules/room/repository/room.repository';

let io: Server;

export function initSocketServer(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const payload = jwt.verify(token, env.jwt.secret) as { userId: string; email: string };
      (socket as any).userId = payload.userId;
      (socket as any).email = payload.email;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    logger.info({ userId }, 'Socket connected');

    // Join a room
    socket.on('room:join', async (roomId: string) => {
      try {
        socket.join(roomId);
        const participants = await roomRepository.getParticipants(roomId);
        io.to(roomId).emit('room:participants', participants);
        logger.info({ userId, roomId }, 'User joined room socket');
      } catch (err) {
        socket.emit('room:error', { message: 'Failed to join room' });
      }
    });

    // Leave a room
    socket.on('room:leave', (roomId: string) => {
      socket.leave(roomId);
    });

    // Host starts the room
    socket.on('room:start', async (roomId: string) => {
      try {
        const room = await roomService.startRoom(roomId, userId);
        io.to(roomId).emit('room:started', room);
      } catch (err: any) {
        socket.emit('room:error', { message: err.message || 'Failed to start' });
      }
    });

    // Host ends the room
    socket.on('room:end', async (roomId: string) => {
      try {
        const room = await roomService.endRoom(roomId, userId);
        const participants = await roomRepository.getParticipants(roomId);
        io.to(roomId).emit('room:ended', { room, participants });
      } catch (err: any) {
        socket.emit('room:error', { message: err.message || 'Failed to end' });
      }
    });

    // User solved the problem
    socket.on('room:solved', async (data: { roomId: string; code?: string; language?: string; runtimeMs?: number; memoryKb?: number }) => {
      try {
        const participants = await roomService.markSolved(data.roomId, userId, data);
        io.to(data.roomId).emit('room:participants', participants);

        // Notify everyone
        const solver = participants.find(p => p.user_id === userId);
        io.to(data.roomId).emit('room:solve_event', {
          userId,
          displayName: solver?.display_name,
          solvedAt: solver?.solved_at,
          language: data.language,
          runtimeMs: data.runtimeMs,
        });
      } catch (err: any) {
        socket.emit('room:error', { message: err.message || 'Failed to record solve' });
      }
    });

    // Chat message
    socket.on('room:message', async (data: { roomId: string; content: string }) => {
      try {
        if (!data.content || data.content.length > 2000) return;
        const message = await roomService.sendMessage(data.roomId, userId, data.content);
        // Get display name
        const enriched = { ...message, display_name: '' };
        const participants = await roomRepository.getParticipants(data.roomId);
        const user = participants.find(p => p.user_id === userId);
        enriched.display_name = user?.display_name || '';
        io.to(data.roomId).emit('room:new_message', enriched);
      } catch (err) {
        socket.emit('room:error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('room:typing', (data: { roomId: string; displayName: string }) => {
      socket.to(data.roomId).emit('room:user_typing', { userId, displayName: data.displayName });
    });

    socket.on('disconnect', () => {
      logger.info({ userId }, 'Socket disconnected');
    });
  });

  return io;
}

export function getIO(): Server {
  return io;
}
