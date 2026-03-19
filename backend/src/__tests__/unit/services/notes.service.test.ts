import { notesService } from '../../../modules/notes/service/notes.service';
import { notesRepository } from '../../../modules/notes/repository/notes.repository';
import { groupRepository } from '../../../modules/group/repository/group.repository';
import { AppError } from '../../../common/errors/AppError';

jest.mock('../../../modules/notes/repository/notes.repository');
jest.mock('../../../modules/group/repository/group.repository');

const mockedNotesRepo = notesRepository as jest.Mocked<typeof notesRepository>;
const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;

describe('notesService', () => {
  const mockNote = {
    id: 'note-1',
    user_id: 'user-1',
    problem_id: 'prob-1',
    group_id: null,
    content: 'Use a hash map for O(n) time',
    visibility: 'personal',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a personal note', async () => {
      mockedNotesRepo.create.mockResolvedValue(mockNote);

      const result = await notesService.create('user-1', 'prob-1', 'My note', 'personal');

      expect(mockedNotesRepo.create).toHaveBeenCalledWith(
        'user-1', 'prob-1', 'My note', 'personal', undefined
      );
      expect(result).toEqual(mockNote);
    });

    it('should create a group note when user is a member', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedNotesRepo.create.mockResolvedValue({ ...mockNote, visibility: 'group', group_id: 'g1' });

      const result = await notesService.create('user-1', 'prob-1', 'Group note', 'group', 'g1');

      expect(mockedGroupRepo.isMember).toHaveBeenCalledWith('g1', 'user-1');
      expect(mockedNotesRepo.create).toHaveBeenCalledWith(
        'user-1', 'prob-1', 'Group note', 'group', 'g1'
      );
      expect(result.visibility).toBe('group');
    });

    it('should throw badRequest when group note has no groupId', async () => {
      await expect(
        notesService.create('user-1', 'prob-1', 'content', 'group')
      ).rejects.toThrow('groupId required for group notes');
    });

    it('should throw forbidden when user is not a group member', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(false);

      await expect(
        notesService.create('user-1', 'prob-1', 'content', 'group', 'g1')
      ).rejects.toThrow('Not a member of this group');
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      mockedNotesRepo.update.mockResolvedValue({ ...mockNote, content: 'Updated content' });

      const result = await notesService.update('note-1', 'user-1', 'Updated content');

      expect(result.content).toBe('Updated content');
    });

    it('should throw notFound when note not found or not owned', async () => {
      mockedNotesRepo.update.mockResolvedValue(null);

      await expect(
        notesService.update('note-1', 'wrong-user', 'content')
      ).rejects.toThrow('Note not found or not owned by you');
    });
  });

  describe('delete', () => {
    it('should delete a note', async () => {
      mockedNotesRepo.delete.mockResolvedValue(true);

      await expect(notesService.delete('note-1', 'user-1')).resolves.toBeUndefined();
    });

    it('should throw notFound when note not found or not owned', async () => {
      mockedNotesRepo.delete.mockResolvedValue(false);

      await expect(
        notesService.delete('note-1', 'wrong-user')
      ).rejects.toThrow('Note not found or not owned by you');
    });
  });

  describe('getPersonalNotes', () => {
    it('should return personal notes for a problem', async () => {
      mockedNotesRepo.getPersonalNotes.mockResolvedValue([mockNote]);

      const result = await notesService.getPersonalNotes('user-1', 'prob-1');

      expect(result).toEqual([mockNote]);
    });
  });

  describe('getGroupNotes', () => {
    it('should return group notes when user is a member', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedNotesRepo.getGroupNotes.mockResolvedValue([]);

      const result = await notesService.getGroupNotes('g1', 'prob-1', 'user-1');

      expect(result).toEqual([]);
    });

    it('should throw forbidden when user is not a member', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(false);

      await expect(
        notesService.getGroupNotes('g1', 'prob-1', 'user-1')
      ).rejects.toThrow('Not a member of this group');
    });
  });
});
