const { z } = require('zod');

const taskSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('LOW'),
  assignee_id: z.string().uuid('Assignee must be a valid user id').optional().nullable(),
  project_id: z.string().uuid('Project id must be valid').optional().nullable(),
  due_date: z.string().optional().nullable().refine((date) => {
    if (!date) return true;
    const parsed = new Date(date);
    return !Number.isNaN(parsed.getTime()) && parsed > new Date();
  }, { message: 'due_date must be a future date' })
});

const taskStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED'])
});

module.exports = { taskSchema, taskStatusSchema };
