import { notesRepository } from '../repository/notes.repository';
import { groupRepository } from '../../group/repository/group.repository';
import { AppError } from '../../../common/errors/AppError';

export const notesService = {
  async create(
    userId: string,
    problemId: string,
    content: string,
    visibility: string,
    groupId?: string
  ) {
    if (visibility === 'group') {
      if (!groupId) throw AppError.badRequest('groupId required for group notes');
      const isMember = await groupRepository.isMember(groupId, userId);
      if (!isMember) throw AppError.forbidden('Not a member of this group');
    }

    return notesRepository.create(userId, problemId, content, visibility, groupId);
  },

  async update(noteId: string, userId: string, content: string) {
    const note = await notesRepository.update(noteId, userId, content);
    if (!note) throw AppError.notFound('Note not found or not owned by you');
    return note;
  },

  async delete(noteId: string, userId: string) {
    const deleted = await notesRepository.delete(noteId, userId);
    if (!deleted) throw AppError.notFound('Note not found or not owned by you');
  },

  async getPersonalNotes(userId: string, problemId: string) {
    return notesRepository.getPersonalNotes(userId, problemId);
  },

  async getGroupNotes(groupId: string, problemId: string, userId: string) {
    const isMember = await groupRepository.isMember(groupId, userId);
    if (!isMember) throw AppError.forbidden('Not a member of this group');
    return notesRepository.getGroupNotes(groupId, problemId);
  },
};
