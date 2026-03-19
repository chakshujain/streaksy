import request from 'supertest';
import app from '../../app';
import { notesRepository } from '../../modules/notes/repository/notes.repository';
import { groupRepository } from '../../modules/group/repository/group.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/notes/repository/notes.repository');
jest.mock('../../modules/group/repository/group.repository');

const mockedNotesRepo = notesRepository as jest.Mocked<typeof notesRepository>;
const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;

describe('Notes Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockNote = {
    id: 'note-1',
    user_id: 'user-1',
    problem_id: '550e8400-e29b-41d4-a716-446655440000',
    group_id: null,
    content: 'Hash map approach for O(n)',
    visibility: 'personal',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/notes', () => {
    it('should create a personal note', async () => {
      mockedNotesRepo.create.mockResolvedValue(mockNote);

      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          problemId: '550e8400-e29b-41d4-a716-446655440000',
          content: 'Hash map approach for O(n)',
          visibility: 'personal',
        });

      expect(res.status).toBe(201);
      expect(res.body.note.content).toBe('Hash map approach for O(n)');
    });

    it('should return 400 for invalid problemId', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          problemId: 'not-a-uuid',
          content: 'Content',
        });

      expect(res.status).toBe(400);
    });

    it('should return 400 for empty content', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          problemId: '550e8400-e29b-41d4-a716-446655440000',
          content: '',
        });

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/notes')
        .send({
          problemId: '550e8400-e29b-41d4-a716-446655440000',
          content: 'notes',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update a note', async () => {
      mockedNotesRepo.update.mockResolvedValue({ ...mockNote, content: 'Updated' });

      const res = await request(app)
        .put('/api/notes/note-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Updated' });

      expect(res.status).toBe(200);
      expect(res.body.note.content).toBe('Updated');
    });

    it('should return 404 when note not found', async () => {
      mockedNotesRepo.update.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/notes/nonexistent')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Updated' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete a note', async () => {
      mockedNotesRepo.delete.mockResolvedValue(true);

      const res = await request(app)
        .delete('/api/notes/note-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Note deleted');
    });

    it('should return 404 when note not found', async () => {
      mockedNotesRepo.delete.mockResolvedValue(false);

      const res = await request(app)
        .delete('/api/notes/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/notes/personal/:problemId', () => {
    it('should return personal notes for a problem', async () => {
      mockedNotesRepo.getPersonalNotes.mockResolvedValue([mockNote]);

      const res = await request(app)
        .get('/api/notes/personal/prob-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.notes).toHaveLength(1);
    });
  });

  describe('GET /api/notes/group/:groupId/:problemId', () => {
    it('should return group notes when user is member', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedNotesRepo.getGroupNotes.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/notes/group/group-1/prob-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.notes).toEqual([]);
    });

    it('should return 403 when user is not a member', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(false);

      const res = await request(app)
        .get('/api/notes/group/group-1/prob-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });
});
