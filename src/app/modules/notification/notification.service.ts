// app/modules/notification/notification.service.ts
import { Notification } from "@prisma/client";
import prisma from "../../utils/prisma";

const createNotification = async (data: Partial<Notification>) => {
  return await prisma.notification.create({
    data: {
      recipientId: data.recipientId as string,
      senderId: data.senderId,
      title: data.title as string,
      message: data.message as string,
      type: data.type as string,
    },
  });
};

const getMyNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { 
      recipientId: userId 
    },
    orderBy: { 
      createdAt: "desc" 
    },
    take: 30,
  });
};

const markAsRead = async (userId: string) => {
  return await prisma.notification.updateMany({
    where: { 
      recipientId: userId, 
      isRead: false 
    },
    data: { 
      isRead: true 
    },
  });
};

const deleteNotification = async (id: string) => {
  return await prisma.notification.delete({
    where: { 
      id 
    },
  });
};
const deleteAllNotifications = async (userId: string) => {
  return await prisma.notification.deleteMany({
    where: { 
      recipientId: userId 
    },
  });
};
const getUnreadCount = async (userId: string): Promise<number> => {
  return await prisma.notification.count({
    where: {
      recipientId: userId,
      isRead: false,
    },
  });
};
export const NotificationService = {
  createNotification,
  getMyNotifications,
  markAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount
};