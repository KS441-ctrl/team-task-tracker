const express = require('express');
const { register, login, refreshToken, logout } = require('../controllers/auth.controller');
const { validateBody } = require('../middleware/validate.middleware');
const { registerSchema, loginSchema, refreshSchema, logoutSchema } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', validateBody(refreshSchema), refreshToken);
router.post('/logout', validateBody(logoutSchema), logout);

module.exports = router;
