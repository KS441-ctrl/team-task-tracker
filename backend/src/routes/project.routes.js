const express = require('express');
const {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject
} = require('../controllers/project.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/rbac.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const { projectSchema } = require('../validators/project.validator');

const router = express.Router();

router.use(authenticate);
router.post('/', authorizeRoles('ADMIN', 'MANAGER'), validateBody(projectSchema), createProject);
router.get('/', authorizeRoles('ADMIN', 'MANAGER', 'MEMBER'), listProjects);
router.get('/:id', authorizeRoles('ADMIN', 'MANAGER', 'MEMBER'), getProject);
router.put('/:id', authorizeRoles('ADMIN', 'MANAGER'), validateBody(projectSchema), updateProject);
router.delete('/:id', authorizeRoles('ADMIN', 'MANAGER'), deleteProject);

module.exports = router;
