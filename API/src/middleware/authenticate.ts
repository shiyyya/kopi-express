import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

interface TokenPayload extends jwt.JwtPayload { sub: string }

export const authenticate: RequestHandler = asyncHandler(async (request, _response, next) => {
  const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) throw new ApiError(401, 'Authentication required', 'UNAUTHORIZED');

  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
  } catch {
    throw new ApiError(401, 'Invalid or expired token', 'INVALID_TOKEN');
  }

  const user = await User.findByPk(payload.sub);
  if (!user || user.status !== 'active') throw new ApiError(401, 'Account is unavailable', 'ACCOUNT_UNAVAILABLE');
  request.user = user;
  next();
});
