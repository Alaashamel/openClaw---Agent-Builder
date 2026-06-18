import { z } from 'zod';
import { simulateWorkflow } from '../services/workflowSimulator.js';
import { analyzeTrace } from '../services/traceAnalyzer.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const workflowSchema = z.object({
  body: z.object({
    type: z.enum(['order_status', 'refund', 'support_ticket']),
    userRequest: z.string().min(2).max(1000),
    orderId: z.string().max(80).optional(),
    confirmed: z.boolean().optional()
  })
});

export const runWorkflow = asyncHandler(async (req, res) => {
  const trace = simulateWorkflow({ ...req.body, userEmail: req.user.email });
  const result = analyzeTrace(trace);
  res.json({ success: true, trace, result });
});
