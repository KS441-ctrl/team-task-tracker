const taskService = require('../services/task.service');

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask({ ...req.body, user: req.user });
    return res.status(201).json({ status: 201, code: 'TASK_CREATED', data: task });
  } catch (error) {
    next(error);
  }
};

const listTasks = async (req, res, next) => {
  try {
    const { status, priority, assignee_id, page, limit } = req.query;
    const tasks = await taskService.listTasks({ user: req.user, status, priority, assignee_id, page, limit });
    return res.status(200).json({ status: 200, code: 'TASKS_LISTED', data: tasks });
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTask(req.params.id);
    return res.status(200).json({ status: 200, code: 'TASK_FOUND', data: task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user);
    return res.status(200).json({ status: 200, code: 'TASK_UPDATED', data: task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id);
    return res.status(200).json({ status: 200, code: 'TASK_DELETED', message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const changeTaskStatus = async (req, res, next) => {
  try {
    const task = await taskService.changeTaskStatus(req.params.id, req.body.status, req.user);
    return res.status(200).json({ status: 200, code: 'TASK_STATUS_UPDATED', data: task });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, listTasks, getTask, updateTask, deleteTask, changeTaskStatus };
