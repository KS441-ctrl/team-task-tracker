const { z } = require('zod');

const projectSchema = z.object({
  name: z.string().min(2, 'Project name is required'),
  description: z.string().optional().nullable()
});

module.exports = { projectSchema };
