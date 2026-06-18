import { z } from 'zod';
import { Evaluation } from '../models/Evaluation.js';
import { analyzeTrace } from '../services/traceAnalyzer.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const evaluationCreateSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(120),
    trace: z.record(z.any()),
    rubric: z.any().optional().nullable()
  })
});

export const evaluationUpdateSchema = z.object({
  params: z.object({ id: z.string().min(12) }),
  body: z.object({
    title: z.string().min(2).max(120).optional(),
    trace: z.record(z.any()).optional(),
    rubric: z.any().optional().nullable()
  })
});

export const createEvaluation = asyncHandler(async (req, res) => {
  const result = analyzeTrace(req.body.trace, req.body.rubric);
  const evaluation = await Evaluation.create({
    title: req.body.title,
    trace: req.body.trace,
    rubric: req.body.rubric || null,
    result,
    owner: req.user._id
  });
  res.status(201).json({ success: true, evaluation });
});

export const analyzeOnly = asyncHandler(async (req, res) => {
  const result = analyzeTrace(req.body.trace, req.body.rubric);
  res.json({ success: true, result });
});

export const listEvaluations = asyncHandler(async (req, res) => {
  const evaluations = await Evaluation.find({ owner: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, evaluations });
});

export const getEvaluation = asyncHandler(async (req, res) => {
  const evaluation = await Evaluation.findOne({ _id: req.params.id, owner: req.user._id });
  if (!evaluation) throw new ApiError(404, 'Evaluation not found.');
  res.json({ success: true, evaluation });
});

export const updateEvaluation = asyncHandler(async (req, res) => {
  const evaluation = await Evaluation.findOne({ _id: req.params.id, owner: req.user._id });
  if (!evaluation) throw new ApiError(404, 'Evaluation not found.');

  if (req.body.title) evaluation.title = req.body.title;
  if (req.body.trace) evaluation.trace = req.body.trace;
  if ('rubric' in req.body) evaluation.rubric = req.body.rubric;
  if (req.body.trace || 'rubric' in req.body) evaluation.result = analyzeTrace(evaluation.trace, evaluation.rubric);

  await evaluation.save();
  res.json({ success: true, evaluation });
});

export const deleteEvaluation = asyncHandler(async (req, res) => {
  const deleted = await Evaluation.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!deleted) throw new ApiError(404, 'Evaluation not found.');
  res.json({ success: true, message: 'Evaluation deleted.' });
});
