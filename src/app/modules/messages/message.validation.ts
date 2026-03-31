import { z } from 'zod';

const createMessageSchema = z.object({
  body: z.object({
    conversationId: z.string({
      required_error: 'Conversation ID is required',
    }),
    senderId: z.string({
      required_error: 'Sender ID is required',
    }),
    content: z.string({
      required_error: 'Message content cannot be empty',
    }).min(1, "Message is too short").max(2000, "Message is too long"),
  }),
});

const accessConversationSchema = z.object({
  body: z.object({
    partnerId: z.string({
      required_error: 'Partner User ID is required to start a chat',
    }),
  }),
});

export const MessageValidation = {
  createMessageSchema,
  accessConversationSchema,
};