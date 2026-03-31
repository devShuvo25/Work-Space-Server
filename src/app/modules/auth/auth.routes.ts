// auth.route.ts (adding register)
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import {
  loginUserSchema,
  registerSchema,
} from './auth.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
const router = express.Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  AuthController.register,
);

router.post('/login',validateRequest(loginUserSchema), AuthController.login);
router.post('/google-signin', AuthController.googleSignIn);
router.get('/me',auth(UserRole.ADMIN, UserRole.CLIENT,UserRole.FREELANCER), AuthController.getMe);

export const AuthRoutes = router;
