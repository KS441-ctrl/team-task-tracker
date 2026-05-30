const express = require('express');
const { listUsers } = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/rbac.middleware');

const router = express.Router();

router.get('/', authenticate, authorizeRoles('ADMIN'), listUsers);

module.exports = router;
