import { Router } from 'express';
import { runWorkflow, workflowSchema } from '../controllers/workflowController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.use(protect);
router.post('/run', validate(workflowSchema), runWorkflow);
export default router;
