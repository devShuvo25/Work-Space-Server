import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const MessageService = {
  /**
   * দুইজন ইউজারের মধ্যে আগে থেকে কনভারসেশন আছে কি না চেক করে, 
   * না থাকলে নতুন একটি রুম তৈরি করে।
   */
  getOrCreateConversation: async (userIds: string[]) => {
    // ১. চেক করা এই দুইজন ইউজারকে নিয়ে কোনো রুম অলরেডি আছে কি না
    let conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: userIds,
        },
      },
      include: {
        participants: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // ২. যদি না থাকে, তবে নতুন কনভারসেশন তৈরি করো
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: userIds,
        },
        include: {
          participants: {
            select: { id: true, name: true, image: true },
          },
        },
      });

      // ৩. ইউজার মডেলের conversationIds আপডেট করা (MongoDB এর Many-to-Many রিলেশনের জন্য জরুরি)
      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: {
          conversationIds: {
            push: conversation.id,
          },
        },
      });
    }

    return conversation;
  },

  /**
   * নতুন মেসেজ সেভ করা এবং একই সাথে কনভারসেশনের lastMessage আপডেট করা।
   */
  saveMessage: async (data: { content: string; senderId: string; conversationId: string }) => {
    return await prisma.$transaction(async (tx) => {
      // ১. মেসেজ টেবিল এ ডাটা সেভ
      const newMessage = await tx.message.create({
        data: {
          content: data.content,
          senderId: data.senderId,
          conversationId: data.conversationId,
        },
        include: {
          sender: { select: { id: true, name: true, image: true } },
        },
      });

      // ২. কনভারসেশন টেবিল এর 'lastMessage' এবং 'updatedAt' আপডেট
      await tx.conversation.update({
        where: { id: data.conversationId },
        data: {
          lastMessage: data.content,
          updatedAt: new Date(),
        },
      });

      return newMessage;
    });
  },

  /**
   * একটি রুমের সব চ্যাট হিস্ট্রি লোড করা
   */
  getChatHistory: async (conversationId: string) => {
    return await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });
  },

  /**
   * ইউজারের ইনবক্স লিস্ট (সবগুলো কনভারসেশন) নিয়ে আসা
   */
  getUserConversations: async (userId: string) => {
    return await prisma.conversation.findMany({
      where: {
        participantIds: { has: userId },
      },
      orderBy: { updatedAt: "desc" },
      include: {
        participants: {
          where: { id: { not: userId } }, // শুধু অপোজিট ইউজারের ডেটা লোড করার জন্য
          select: { id: true, name: true, image: true },
        },
      },
    });
  }
};

export const {
  getOrCreateConversation,
  saveMessage,
  getChatHistory,
  getUserConversations
} = MessageService;