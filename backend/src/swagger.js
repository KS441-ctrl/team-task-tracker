module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Team Task Tracker API',
    version: '1.0.0',
    description: 'Task tracker backend with RBAC, JWT auth, Redis caching, and Docker deployment.'
  },
  servers: [{ url: 'http://localhost:4000/api' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'MEMBER'] }
        }
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          organization_id: { type: 'string' },
          created_by: { type: 'string' }
        }
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
          status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED'] },
          assignee_id: { type: 'string' },
          project_id: { type: 'string' },
          organization_id: { type: 'string' },
          due_date: { type: 'string', format: 'date-time' },
          created_by: { type: 'string' }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'MEMBER'] },
                  organizationName: { type: 'string' }
                },
                required: ['name', 'email', 'password', 'organizationName']
              }
            }
          }
        },
        responses: {
          201: { description: 'User registered' },
          400: { description: 'Validation error' }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Authenticate user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          200: { description: 'Authenticated successfully' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/auth/refresh': {
      post: {
        summary: 'Rotate refresh token and issue a new access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' },
                  userId: { type: 'string' }
                },
                required: ['refreshToken', 'userId']
              }
            }
          }
        },
        responses: {
          200: { description: 'Token refreshed' },
          401: { description: 'Invalid refresh token' }
        }
      }
    },
    '/auth/logout': {
      post: {
        summary: 'Logout and revoke the refresh token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' },
                  userId: { type: 'string' }
                },
                required: ['refreshToken', 'userId']
              }
            }
          }
        },
        responses: {
          200: { description: 'Logged out successfully' }
        }
      }
    },
    '/users': {
      get: {
        summary: 'List organization users',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Users listed', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } },
          403: { description: 'Forbidden' }
        }
      }
    },
    '/projects': {
      post: {
        summary: 'Create a project',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' }
                },
                required: ['name']
              }
            }
          }
        },
        responses: {
          201: { description: 'Project created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } }
        }
      },
      get: {
        summary: 'List organization projects',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Projects listed', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Project' } } } } }
        }
      }
    },
    '/projects/{id}': {
      get: {
        summary: 'Get a single project',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Project found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } },
          404: { description: 'Not found' }
        }
      },
      put: {
        summary: 'Update project details',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' }
                },
                required: ['name']
              }
            }
          }
        },
        responses: {
          200: { description: 'Project updated' }
        }
      },
      delete: {
        summary: 'Delete a project',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Project deleted' }
        }
      }
    },
    '/tasks': {
      post: {
        summary: 'Create a task',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
                  assignee_id: { type: 'string' },
                  project_id: { type: 'string' },
                  due_date: { type: 'string', format: 'date-time' }
                },
                required: ['title']
              }
            }
          }
        },
        responses: {
          201: { description: 'Task created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } }
        }
      },
      get: {
        summary: 'List tasks',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'priority', in: 'query', schema: { type: 'string' } },
          { name: 'assignee_id', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Tasks listed', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } } } } }
        }
      }
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get task details',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Task found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
          404: { description: 'Not found' }
        }
      },
      put: {
        summary: 'Update task',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
                  assignee_id: { type: 'string' },
                  project_id: { type: 'string' },
                  due_date: { type: 'string', format: 'date-time' }
                },
                required: ['title']
              }
            }
          }
        },
        responses: {
          200: { description: 'Task updated' }
        }
      },
      delete: {
        summary: 'Delete a task',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Task deleted' }
        }
      }
    },
    '/tasks/{id}/status': {
      patch: {
        summary: 'Change task workflow status',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED'] }
                },
                required: ['status']
              }
            }
          }
        },
        responses: {
          200: { description: 'Status updated' }
        }
      }
    }
  }
};
