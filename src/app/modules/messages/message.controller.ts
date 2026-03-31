import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MessageService } from "./massege.service";

/**
 * দুইজন ইউজারের মধ্যে কনভারসেশন এক্সেস করা (খুঁজে বের করা বা নতুন তৈরি করা)
 */
const accessConversation = catchAsync(async (req: Request, res: Response) => {
  const { partnerId } = req.body;
  const currentUserId = req.user?.id || req.user?.userId;

  // সার্ভিস কল করে কনভারসেশন আইডি নিয়ে আসা
  const result = await MessageService.getOrCreateConversation([currentUserId, partnerId]);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Conversation accessed successfully",
    data: result,
  });
});

/**
 * লগ-ইন করা ইউজারের সব চ্যাট লিস্ট (Inbox) নিয়ে আসা
 */
const getMyInbox = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id || req.user?.userId;

  const result = await MessageService.getUserConversations(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Inbox retrieved successfully",
    data: result,
  });
});

/**
 * নির্দিষ্ট কোনো রুমের পুরনো সব মেসেজ (Chat History) লোড করা
 */
const getMessages = catchAsync(async (req: Request, res: Response) => {
  const { conversationId } = req.params;

  const result = await MessageService.getChatHistory(conversationId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Chat history retrieved successfully",
    data: result,
  });
});

export const ChatController = {
  accessConversation,
  getMyInbox,
  getMessages,
};