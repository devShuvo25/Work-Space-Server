import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { AIService } from './ai.service';

const chatWithAI = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { messages, systemPrompt } = req.body;

  const result = await AIService.chatWithAI(messages, systemPrompt);

  // Set headers to prevent buffering and enable streaming
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('X-Accel-Buffering', 'no'); // Critical for Nginx/Proxies
  res.setHeader('Cache-Control', 'no-cache');

  try {
    for await (const textPart of result.textStream) {
      if (textPart) {
        res.write(textPart);
        // If you use compression middleware, you MUST flush
        // @ts-ignore
        if (typeof res.flush === 'function') res.flush();
      }
    }
  } catch (error: unknown) {
    console.error('AI Stream Error:', error);
  } finally {
    res.end(); // Always close the connection
  }
});

export const AIController = { chatWithAI };