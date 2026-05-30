const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json({ status: 201, code: 'USER_REGISTERED', message: 'User registered successfully', data: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    return res.status(200).json({ status: 200, code: 'LOGIN_SUCCESS', message: 'Logged in successfully', data });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const data = await authService.refresh(req.body);
    return res.status(200).json({ status: 200, code: 'REFRESH_SUCCESS', message: 'Token refreshed', data });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.body);
    return res.status(200).json({ status: 200, code: 'LOGOUT_SUCCESS', message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refreshToken, logout };
