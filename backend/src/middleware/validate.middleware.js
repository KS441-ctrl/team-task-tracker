const { ZodError } = require('zod');

const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.errors.map((err) => err.message).join(', ');
      return res.status(400).json({ status: 400, code: 'VALIDATION_ERROR', message });
    }
    next(error);
  }
};

module.exports = { validateBody };
