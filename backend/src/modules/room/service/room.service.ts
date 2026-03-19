import crypto from 'crypto';
import { roomRepository } from '../repository/room.repository';
import { AppError } from '../../../common/errors/AppError';

export const roomService = {
  async createRoom(hostId: string, name: string, problemId: string, timeLimitMinutes: number) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    const room = await roomRepository.create(name, code, problemId, hostId, timeLimitMinutes);
    await roomRepository.addParticipant(room.id, hostId);
    return roomRepository.findById(room.id);
  },

  async joinRoom(code: string, userId: string) {
    const room = await roomRepository.findByCode(code);
    if (!room) throw AppError.notFound('Room not found');
    if (room.status === 'finished') throw AppError.badRequest('Room has ended');
    await roomRepository.addParticipant(room.id, userId);
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
    if (room.status !== 'waiting') throw AppError.badRequest('Room already started');
    await roomRepository.updateStatus(roomId, 'active');
    return roomRepository.findById(roomId);
  },

  async endRoom(roomId: string, userId: string) {
    const room = await roomRepository.findById(roomId);
    if (!room) throw AppError.notFound('Room not found');
    if (room.host_id !== userId) throw AppError.forbidden('Only the host can end the room');
    await roomRepository.updateStatus(roomId, 'finished');
    return roomRepository.findById(roomId);
  },

  async markSolved(roomId: string, userId: string, data?: { code?: string; language?: string; runtimeMs?: number; memoryKb?: number }) {
    const room = await roomRepository.findById(roomId);
    if (!room) throw AppError.notFound('Room not found');
    if (room.status !== 'active') throw AppError.badRequest('Room is not active');
    await roomRepository.markSolved(roomId, userId, data?.code || null, data?.language || null, data?.runtimeMs || null, data?.memoryKb || null);
    return roomRepository.getParticipants(roomId);
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
};
