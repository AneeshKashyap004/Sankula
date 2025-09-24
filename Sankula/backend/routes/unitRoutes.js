import express from 'express';
import { body } from 'express-validator';
import { listUnits, getUnit, createUnit, updateUnit, deleteUnit } from '../controllers/unitController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All unit routes require auth; write ops require Admin/Committee
router.use(protect);

router.get('/', authorize('Admin', 'Committee Member'), listUnits);
router.get('/:id', authorize('Admin', 'Committee Member'), getUnit);

router.post(
  '/',
  authorize('Admin', 'Committee Member'),
  [
    body('unitNumber').notEmpty().withMessage('unitNumber is required'),
    body('block').notEmpty().withMessage('block is required'),
    body('owner').optional().isMongoId().withMessage('owner must be a valid id'),
    body('tenants').optional().isArray().withMessage('tenants must be an array'),
  ],
  createUnit
);

router.patch(
  '/:id',
  authorize('Admin', 'Committee Member'),
  [
    body('owner').optional().isMongoId().withMessage('owner must be a valid id'),
    body('tenants').optional().isArray().withMessage('tenants must be an array'),
  ],
  updateUnit
);

router.delete('/:id', authorize('Admin', 'Committee Member'), deleteUnit);

export default router;