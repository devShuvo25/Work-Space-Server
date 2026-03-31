import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const chatWithAI = async (messages: any[], systemPrompt: string) => {
  // This returns an object containing textStream (an AsyncIterable)
  
  return streamText({
    model:google('gemini-2.5-flash'),
    system: systemPrompt,
    messages: messages,
  });
};

export const AIService = { chatWithAI };