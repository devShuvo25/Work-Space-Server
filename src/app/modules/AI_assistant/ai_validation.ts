import { z } from 'zod';

const aiChatSchema = z.object({
  body: z.object({
    messages: z.array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string({ required_error: 'Content is required' }),
      })
    ),
    systemPrompt: z.string().optional(),
  }),
});

export const AIValidation = {
  aiChatSchema,
};