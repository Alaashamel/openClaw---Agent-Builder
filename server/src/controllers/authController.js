import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(128)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128)
  })
});

function signToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

export const register = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) throw new ApiError(409, 'Email already registered.');

  const user = await User.create(req.body);
  res.status(201).json({ success: true, token: signToken(user), user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }
  res.json({ success: true, token: signToken(user), user: publicUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});
