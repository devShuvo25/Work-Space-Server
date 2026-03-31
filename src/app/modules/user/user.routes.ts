// user.route.ts
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { userValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { upload } from '../../../config/upload.config';
// Assume you have auth middleware for roles, e.g., auth('SUPERADMIN', 'ADMIN')
const router = express.Router();

router.get('/',auth(UserRole.ADMIN, UserRole.FREELANCER,UserRole.CLIENT), UserController.getAllUsers); // Add auth('SUPERADMIN')

// Change .get to .patch
router.patch(
  '/:id', 
  upload.single('image'), 
  UserController.updateUser // Ensure this points to the update controller
);

router.patch(
  '/:id',
  validateRequest(userValidation.updateUser),
  UserController.updateUser,
); 

export const UserRoutes = router;
