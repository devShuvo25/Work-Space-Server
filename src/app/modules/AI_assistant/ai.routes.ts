import express from 'express';
import { AIController } from './ai.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { AIValidation } from './ai_validation';

const router = express.Router();
router.post(
  '/chat',
  auth(UserRole.FREELANCER,UserRole.ADMIN,UserRole.FREELANCER),
  validateRequest(AIValidation.aiChatSchema),
  AIController.chatWithAI
);

export const AIRoutes = router;