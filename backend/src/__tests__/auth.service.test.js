const authService = require('../services/auth.service');
const userRepository = require('../repositories/user.repository');
const organizationRepository = require('../repositories/organization.repository');
const tokenRepository = require('../repositories/token.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../repositories/user.repository');
jest.mock('../repositories/organization.repository');
jest.mock('../repositories/token.repository');
jest.mock('bcrypt');

describe('Auth service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jwt.sign = jest.fn().mockReturnValue('test-access-token');
  });

  it('should reject registration when email already exists', async () => {
    userRepository.findByEmail.mockResolvedValue({ id: 'existing', email: 'jane@example.com' });

    await expect(
      authService.register({ name: 'Jane', email: 'jane@example.com', password: 'password', organizationName: 'TeamCo' })
    ).rejects.toMatchObject({ status: 400, code: 'VALIDATION_ERROR' });
  });

  it('should create a new user with a new organization', async () => {
    userRepository.findByEmail.mockResolvedValue(undefined);
    organizationRepository.findByName.mockResolvedValue(undefined);
    organizationRepository.create.mockResolvedValue({ id: 'org-1', name: 'TeamCo' });
    bcrypt.hash.mockResolvedValue('hashed-password');
    userRepository.create.mockImplementation(async (user) => user);

    const user = await authService.register({ name: 'Jane', email: 'jane@example.com', password: 'password', role: 'MEMBER', organizationName: 'TeamCo' });

    expect(userRepository.create).toHaveBeenCalled();
    expect(user).toMatchObject({ email: 'jane@example.com', role: 'MEMBER', organization_id: 'org-1' });
  });

  it('should login valid users and return tokens', async () => {
    userRepository.findByEmail.mockResolvedValue({ id: 'user-1', email: 'jane@example.com', password: 'hashed-password', role: 'MEMBER', organization_id: 'org-1' });
    bcrypt.compare.mockResolvedValue(true);
    bcrypt.hash.mockResolvedValue('hashed-refresh');
    tokenRepository.revokeByUser.mockResolvedValue();
    tokenRepository.create.mockResolvedValue();

    const response = await authService.login({ email: 'jane@example.com', password: 'password' });

    expect(response).toHaveProperty('accessToken', 'test-access-token');
    expect(response).toHaveProperty('refreshToken');
    expect(response.user).toMatchObject({ id: 'user-1', email: 'jane@example.com' });
  });
});
