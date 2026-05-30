const { v4: uuidv4 } = require('uuid');
const taskRepository = require('../repositories/task.repository');
const { buildTaskCacheKey, getCachedTasks, setCachedTasks, clearTaskCacheForAssignee, clearAllTaskCache } = require('../utils/cache');
const { canTransition } = require('../utils/taskStatus');

const createTask = async ({ title, description, priority, assignee_id, project_id, due_date, user }) => {
  const task = {
    id: uuidv4(),
    title,
    description,
    priority,
    status: 'TODO',
    assignee_id: assignee_id || null,
    project_id: project_id || null,
    organization_id: user.organization_id,
    due_date: due_date || null,
    created_by: user.id
  };

  const created = await taskRepository.create(task);
  await clearAllTaskCache();
  if (created.assignee_id) {
    await clearTaskCacheForAssignee(created.assignee_id);
  }
  return created;
};

const listTasks = async ({ user, assignee_id, status, priority, page = 1, limit = 20 }) => {
  const key = buildTaskCacheKey({ assigneeId: assignee_id || (user.role === 'MEMBER' ? user.id : 'all'), status, priority, page, limit });
  const cached = await getCachedTasks(key);
  if (cached) {
    return cached;
  }

  const tasks = await taskRepository.paginationQuery({ organization_id: user.organization_id, assignee_id, status, priority, page: Number(page), limit: Number(limit), currentUser: user });
  await setCachedTasks(key, tasks);
  return tasks;
};

const getTask = async (id) => {
  const task = await taskRepository.findById(id);
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  return task;
};

const updateTask = async (id, patch, user) => {
  const task = await taskRepository.findById(id);
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (user.role === 'MEMBER' && task.assignee_id !== user.id) {
    const error = new Error('Members may only update their own tasks');
    error.status = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  const updated = await taskRepository.update(id, patch);
  await clearAllTaskCache();
  return updated;
};

const changeTaskStatus = async (id, status, user) => {
  const task = await taskRepository.findById(id);
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (!canTransition(task.status, status)) {
    const error = new Error(`Invalid status transition from ${task.status} to ${status}`);
    error.status = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  if (user.role === 'MEMBER' && task.assignee_id !== user.id) {
    const error = new Error('Members may only update status on tasks assigned to them');
    error.status = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  const updated = await taskRepository.updateStatus(id, status);
  await clearAllTaskCache();
  return updated;
};

const deleteTask = async (id) => {
  const task = await taskRepository.findById(id);
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  await taskRepository.remove(id);
  await clearAllTaskCache();
};

module.exports = { createTask, listTasks, getTask, updateTask, changeTaskStatus, deleteTask };
