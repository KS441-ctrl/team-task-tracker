const express = require('express');
const {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
  changeTaskStatus
} = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles, authorizeTaskAccess } = require('../middleware/rbac.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const { taskSchema, taskStatusSchema } = require('../validators/task.validator');

const router = express.Router();

router.use(authenticate);
router.post('/', authorizeRoles('ADMIN', 'MANAGER'), validateBody(taskSchema), createTask);
router.get('/', authorizeRoles('ADMIN', 'MANAGER', 'MEMBER'), listTasks);
router.get('/:id', authorizeRoles('ADMIN', 'MANAGER', 'MEMBER'), getTask);
router.put('/:id', authorizeRoles('ADMIN', 'MANAGER', 'MEMBER'), validateBody(taskSchema), authorizeTaskAccess(), updateTask);
router.delete('/:id', authorizeRoles('ADMIN', 'MANAGER'), deleteTask);
router.patch('/:id/status', authorizeRoles('ADMIN', 'MANAGER', 'MEMBER'), validateBody(taskStatusSchema), authorizeTaskAccess(true), changeTaskStatus);

module.exports = router;
