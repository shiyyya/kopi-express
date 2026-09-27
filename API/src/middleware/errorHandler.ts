import type { ErrorRequestHandler, RequestHandler } from 'express';
import { UniqueConstraintError } from 'sequelize';
import { ApiError } from '../utils/ApiError.js';

export const notFound: RequestHandler = (request, _response, next) => {
  next(new ApiError(404, `Route ${request.method} ${request.path} not found`, 'NOT_FOUND'));
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof ApiError) {
    response.status(error.status).json({ error: { code: error.code, message: error.message, details: error.details } });
    return;
  }
  if (error instanceof UniqueConstraintError) {
    response.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'Email is already registered' } });
    return;
  }
  console.error(error);
  response.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
};
