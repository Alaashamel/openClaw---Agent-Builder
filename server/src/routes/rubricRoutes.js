import { Router } from 'express';
import { createRubric, deleteRubric, listRubrics, rubricSchema, updateRubric } from '../controllers/rubricController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.use(protect);
router.get('/', listRubrics);
router.post('/', validate(rubricSchema), createRubric);
router.patch('/:id', validate(rubricSchema), updateRubric);
router.delete('/:id', deleteRubric);
export default router;
