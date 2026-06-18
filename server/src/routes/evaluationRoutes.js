import { Router } from 'express';
import {
  analyzeOnly,
  createEvaluation,
  deleteEvaluation,
  evaluationCreateSchema,
  evaluationUpdateSchema,
  getEvaluation,
  listEvaluations,
  updateEvaluation
} from '../controllers/evaluationController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.use(protect);
router.get('/', listEvaluations);
router.post('/analyze', validate(evaluationCreateSchema), analyzeOnly);
router.post('/', validate(evaluationCreateSchema), createEvaluation);
router.get('/:id', getEvaluation);
router.patch('/:id', validate(evaluationUpdateSchema), updateEvaluation);
router.delete('/:id', deleteEvaluation);
export default router;
