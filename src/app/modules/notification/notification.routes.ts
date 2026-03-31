// app/modules/notification/notification.routes.ts
import express from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middlewares/auth'; // Ensure this matches your auth middleware path
import { UserRole } from '@prisma/client';

const router = express.Router();

// Get all notifications for the logged-in user
router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.FREELANCER, UserRole.CLIENT), // Add roles if needed: auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.FREELANCER)
  NotificationController.getMyNotifications,
);

// Mark all unread notifications as read
router.patch(
  '/mark-as-read',
  auth(UserRole.ADMIN, UserRole.FREELANCER, UserRole.CLIENT), // Add roles if needed: auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.FREELANCER)

  NotificationController.markAsRead,
);

// Delete a specific notification by ID
router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.FREELANCER, UserRole.CLIENT), // Add roles if needed: auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.FREELANCER)

  NotificationController.deleteNotification,
);

router.delete(
  '/',
  auth(UserRole.ADMIN, UserRole.FREELANCER, UserRole.CLIENT),
  NotificationController.deleteAllNotifications,
);
router.get(
  '/unread-count',
  auth(UserRole.ADMIN, UserRole.FREELANCER, UserRole.CLIENT),
  NotificationController.getUnreadCount,
);
export const NotificationRoutes = router;
