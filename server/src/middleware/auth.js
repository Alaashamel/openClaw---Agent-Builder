import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new ApiError(401, 'Authentication required.');

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) throw new ApiError(401, 'User no longer exists.');
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, 'Invalid or expired token.');
  }
});
