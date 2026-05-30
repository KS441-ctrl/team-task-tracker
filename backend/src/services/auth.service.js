const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const userRepository = require('../repositories/user.repository');
const organizationRepository = require('../repositories/organization.repository');
const tokenRepository = require('../repositories/token.repository');

const createAccessToken = (user) => jwt.sign({ userId: user.id, role: user.role, organizationId: user.organization_id }, config.jwt.secret, { expiresIn: config.jwt.accessTokenExpiresIn });

const createRefreshToken = async (user) => {
  const refreshToken = uuidv4() + '.' + uuidv4();
  const tokenHash = await bcrypt.hash(refreshToken, 10);
  const expiresAt = new Date(Date.now() + parseDuration(config.jwt.refreshTokenExpiresIn));
  await tokenRepository.revokeByUser(user.id);
  await tokenRepository.create({ id: uuidv4(), token_hash: tokenHash, user_id: user.id, expires_at: expiresAt, revoked: false });
  return refreshToken;
};

const parseDuration = (duration) => {
  if (typeof duration !== 'string') return 0;
  if (duration.endsWith('m')) return parseInt(duration, 10) * 60 * 1000;
  if (duration.endsWith('h')) return parseInt(duration, 10) * 60 * 60 * 1000;
  if (duration.endsWith('d')) return parseInt(duration, 10) * 24 * 60 * 60 * 1000;
  return parseInt(duration, 10) * 1000;
};

const register = async ({ name, email, password, role, organizationName }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    const error = new Error('Email already in use');
    error.status = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  let organization = await organizationRepository.findByName(organizationName);
  if (!organization) {
    organization = await organizationRepository.create({ id: uuidv4(), name: organizationName });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    name,
    email,
    password: passwordHash,
    role: role || 'MEMBER',
    organization_id: organization.id
  };

  return userRepository.create(user);
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    error.code = 'AUTHENTICATION_ERROR';
    throw error;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    error.code = 'AUTHENTICATION_ERROR';
    throw error;
  }

  const accessToken = createAccessToken(user);
  const refreshToken = await createRefreshToken(user);
  return { accessToken, refreshToken, user };
};

const refresh = async ({ refreshToken, userId }) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error('Invalid refresh payload');
    error.status = 401;
    error.code = 'AUTHENTICATION_ERROR';
    throw error;
  }

  const tokens = await tokenRepository.findActiveByUserId(userId);
  const validToken = await tokens.reduce(async (accP, row) => {
    const acc = await accP;
    if (acc) return acc;
    const matches = await bcrypt.compare(refreshToken, row.token_hash);
    return matches ? row : null;
  }, Promise.resolve(null));

  if (!validToken) {
    const error = new Error('Invalid refresh token');
    error.status = 401;
    error.code = 'AUTHENTICATION_ERROR';
    throw error;
  }

  await tokenRepository.revokeById(validToken.id);
  const accessToken = createAccessToken(user);
  const newRefreshToken = await createRefreshToken(user);

  return { accessToken, refreshToken: newRefreshToken };
};

const logout = async ({ userId, refreshToken }) => {
  const tokens = await tokenRepository.findActiveByUserId(userId);
  const validToken = await tokens.reduce(async (accP, row) => {
    const acc = await accP;
    if (acc) return acc;
    const matches = await bcrypt.compare(refreshToken, row.token_hash);
    return matches ? row : null;
  }, Promise.resolve(null));
  if (validToken) {
    await tokenRepository.revokeById(validToken.id);
  }
};

module.exports = { register, login, refresh, logout, createAccessToken };
