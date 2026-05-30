const taskRepository = require('../repositories/task.repository');

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ status: 403, code: 'FORBIDDEN', message: 'Insufficient permissions' });
  }
  next();
};

const authorizeTaskAccess = (statusUpdate = false) => async (req, res, next) => {
  const task = await taskRepository.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ status: 404, code: 'NOT_FOUND', message: 'Task not found' });
  }

  const isAssignee = task.assignee_id === req.user.id;
  const isManager = req.user.role === 'MANAGER';
  const isAdmin = req.user.role === 'ADMIN';

  if (statusUpdate) {
    if (!isAssignee && !isManager && !isAdmin) {
      return res.status(403).json({ status: 403, code: 'FORBIDDEN', message: 'Only assignee or manager can change task status' });
    }
  } else {
    if (!isAssignee && !isManager && !isAdmin) {
      return res.status(403).json({ status: 403, code: 'FORBIDDEN', message: 'Insufficient permissions for task access' });
    }
  }

  req.task = task;
  next();
};

module.exports = { authorizeRoles, authorizeTaskAccess };
