import { ZodError } from 'zod';

export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, req, res, next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.errors
    });
  }

  const statusCode = error.statusCode || 500;
  const payload = {
    success: false,
    message: error.message || 'Internal server error'
  };

  if (error.details) payload.details = error.details;
  if (process.env.NODE_ENV !== 'production') payload.stack = error.stack;

  return res.status(statusCode).json(payload);
}
