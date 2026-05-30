const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'MANAGER', 'MEMBER']).optional(),
  organizationName: z.string().min(2, 'Organization name is required')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
  userId: z.string().uuid('Invalid user id')
});

const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
  userId: z.string().uuid('Invalid user id')
});

module.exports = { registerSchema, loginSchema, refreshSchema, logoutSchema };
