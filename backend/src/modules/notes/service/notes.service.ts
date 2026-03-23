import { notesRepository } from '../repository/notes.repository';
import { groupRepository } from '../../group/repository/group.repository';
import { AppError } from '../../../common/errors/AppError';
import { enhanceNotes } from '../../ai/service/ai.service';
import { checkAIRateLimit } from '../../../common/utils/aiRateLimit';
import { env } from '../../../config/env';
import { queryOne, query } from '../../../config/database';

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

  async enhanceWithAI(userId: string, noteId: string) {
    if (!env.ai.apiKey) {
      throw new AppError(503, 'AI generation is not available. NVIDIA_API_KEY is not configured.');
    }

    await checkAIRateLimit(userId);

    // Get the note
    const notes = await query<{ id: string; user_id: string; problem_id: string; content: string }>(
      'SELECT id, user_id, problem_id, content FROM notes WHERE id = $1',
      [noteId]
    );
    const note = notes[0];
    if (!note) throw AppError.notFound('Note not found');
    if (note.user_id !== userId) throw AppError.forbidden('Not your note');

    if (!note.content || note.content.trim().length === 0) {
      throw AppError.badRequest('Note is empty. Write some notes first before enhancing.');
    }

    // Get problem details
    const problem = await queryOne<{ title: string; difficulty: string }>(
      'SELECT title, difficulty FROM problems WHERE id = $1',
      [note.problem_id]
    );
    if (!problem) throw AppError.notFound('Problem not found');

    // Get problem tags
    const tags = await query<{ name: string }>(
      'SELECT t.name FROM tags t JOIN problem_tags pt ON pt.tag_id = t.id WHERE pt.problem_id = $1',
      [note.problem_id]
    );

    const enhanced = await enhanceNotes(
      problem.title,
      problem.difficulty,
      tags.map(t => t.name),
      note.content
    );

    if (!enhanced) {
      throw new AppError(502, 'AI service failed to enhance notes. Please try again later.');
    }

    return enhanced;
  },
};
