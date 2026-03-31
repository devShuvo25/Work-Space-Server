// app/modules/notification/notification.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationService } from './notification.service';

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id || req.user?.userId;

  const result = await NotificationService.getMyNotifications(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications retrieved successfully',
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id || req.user?.userId;

  const result = await NotificationService.markAsRead(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications marked as read',
    data: result,
  });
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NotificationService.deleteNotification(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification deleted successfully',
    data: result,
  });
});
const deleteAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id || req.user?.userId;

  const result = await NotificationService.deleteAllNotifications(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All notifications cleared successfully',
    data: result,
  });
});
const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id || req.user?.userId;

  const result = await NotificationService.getUnreadCount(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unread count fetched successfully',
    data: result, // This will be a number
  });
});
export const NotificationController = {
  getMyNotifications,
  markAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount
};