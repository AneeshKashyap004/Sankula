import express from 'express';
import { body } from 'express-validator';
import { listUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// All user routes require auth; write ops require Admin/Committee
router.use(protect);

router.get('/', authorize('Admin', 'Committee Member'), listUsers);
router.get('/:id', authorize('Admin', 'Committee Member'), getUser);

router.post(
  '/',
  authorize('Admin', 'Committee Member'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password min length 6'),
    body('role')
      .optional()
      .isIn(['Admin', 'Committee Member', 'Resident', 'Staff', 'Vendor'])
      .withMessage('Invalid role'),
  ],
  validate,
  createUser
);

router.patch(
  '/:id',
  authorize('Admin', 'Committee Member'),
  [
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('role')
      .optional()
      .isIn(['Admin', 'Committee Member', 'Resident', 'Staff', 'Vendor'])
      .withMessage('Invalid role'),
  ],
  validate,
  updateUser
);

router.delete('/:id', authorize('Admin', 'Committee Member'), deleteUser);

export default router;
