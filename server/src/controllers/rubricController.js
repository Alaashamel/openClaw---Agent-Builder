import { z } from 'zod';
import { Rubric } from '../models/Rubric.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const criterion = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(500).optional(),
  weight: z.number().min(0.1).max(10).optional(),
  maxScore: z.number().min(1).max(10).optional()
});

export const rubricSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(120),
    description: z.string().max(1000).optional(),
    criteria: z.array(criterion).min(1).max(12)
  })
});

export const listRubrics = asyncHandler(async (req, res) => {
  const rubrics = await Rubric.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, rubrics });
});

export const createRubric = asyncHandler(async (req, res) => {
  const rubric = await Rubric.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, rubric });
});

export const updateRubric = asyncHandler(async (req, res) => {
  const rubric = await Rubric.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true });
  if (!rubric) throw new ApiError(404, 'Rubric not found.');
  res.json({ success: true, rubric });
});

export const deleteRubric = asyncHandler(async (req, res) => {
  const deleted = await Rubric.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!deleted) throw new ApiError(404, 'Rubric not found.');
  res.json({ success: true, message: 'Rubric deleted.' });
});
