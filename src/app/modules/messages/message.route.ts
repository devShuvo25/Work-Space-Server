import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { ChatController } from './message.controller';
import validateRequest from '../../middlewares/validateRequest';
import { MessageValidation } from './message.validation'; // নিশ্চিত করুন পাথ সঠিক আছে

const router = express.Router();

/**
 * ১. কনভারসেশন এক্সেস করা (আইডি খুঁজে বের করা বা নতুন তৈরি করা)
 * যখন কেউ চ্যাট শুরু করতে ক্লিক করবে তখন এটি কল হবে।
 */
router.post(
  '/access',
  auth(UserRole.ADMIN, UserRole.CLIENT, UserRole.FREELANCER),
  validateRequest(MessageValidation.accessConversationSchema), 
  ChatController.accessConversation
);

/**
 * ২. ইউজারের ইনবক্স/চ্যাট লিস্ট নিয়ে আসা
 * ড্যাশবোর্ডে কার কার সাথে চ্যাট হয়েছে তা দেখার জন্য।
 */
router.get(
  '/inbox',
  auth(UserRole.ADMIN, UserRole.CLIENT, UserRole.FREELANCER),
  ChatController.getMyInbox
);

/**
 * ৩. নির্দিষ্ট কনভারসেশনের সব মেসেজ (Chat History) লোড করা
 */
router.get(
  '/messages/:conversationId',
  auth(UserRole.ADMIN, UserRole.CLIENT, UserRole.FREELANCER),
  ChatController.getMessages
);

export const ChatRoutes = router;