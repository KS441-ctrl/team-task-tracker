const { authorizeRoles, authorizeTaskAccess } = require('../middleware/rbac.middleware');
const taskRepository = require('../repositories/task.repository');

jest.mock('../repositories/task.repository');

describe('RBAC middleware', () => {
  const createResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('blocks unauthorized roles', async () => {
    const req = { user: { role: 'MEMBER' } };
    const res = createResponse();
    const next = jest.fn();

    await authorizeRoles('ADMIN', 'MANAGER')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows authorized roles', async () => {
    const req = { user: { role: 'MANAGER' } };
    const res = createResponse();
    const next = jest.fn();

    await authorizeRoles('ADMIN', 'MANAGER')(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('returns 404 when task is missing', async () => {
    taskRepository.findById.mockResolvedValue(undefined);
    const req = { params: { id: 'task-1' }, user: { role: 'ADMIN', id: 'user-1' } };
    const res = createResponse();
    const next = jest.fn();

    await authorizeTaskAccess()(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  it('denies MEMBER who is not assignee', async () => {
    taskRepository.findById.mockResolvedValue({ assignee_id: 'user-2' });
    const req = { params: { id: 'task-1' }, user: { role: 'MEMBER', id: 'user-1' } };
    const res = createResponse();
    const next = jest.fn();

    await authorizeTaskAccess()(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows assignee for task access', async () => {
    taskRepository.findById.mockResolvedValue({ assignee_id: 'user-1' });
    const req = { params: { id: 'task-1' }, user: { role: 'MEMBER', id: 'user-1' } };
    const res = createResponse();
    const next = jest.fn();

    await authorizeTaskAccess()(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('allows MANAGER to update task status', async () => {
    taskRepository.findById.mockResolvedValue({ assignee_id: 'user-2' });
    const req = { params: { id: 'task-1' }, user: { role: 'MANAGER', id: 'manager-1' } };
    const res = createResponse();
    const next = jest.fn();

    await authorizeTaskAccess(true)(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
