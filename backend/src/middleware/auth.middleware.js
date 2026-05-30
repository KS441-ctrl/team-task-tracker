const jwt = require('jsonwebtoken');
const config = require('../config');
const userRepository = require('../repositories/user.repository');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 401, code: 'UNAUTHORIZED', message: 'Missing authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, config.jwt.secret);
    const user = await userRepository.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ status: 401, code: 'UNAUTHORIZED', message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, code: 'UNAUTHORIZED', message: 'Invalid token' });
  }
};

module.exports = { authenticate };
