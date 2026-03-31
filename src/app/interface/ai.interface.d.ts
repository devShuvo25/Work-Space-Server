import { CoreMessage } from 'ai';

/**
 * Interface for AI Chat Request Body
 */
export interface IAIChatRequest {
  messages: CoreMessage[]; 
  systemPrompt?: string;   
  userId?: string;         
}

/**
 * Interface for Non-streaming AI Service Response
 * Useful for one-off generations like Summaries or Proposal drafts
 */
export interface IAIResponse {
  success: boolean;
  message: string;
  data?: {
    content: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  };
}

/**
 * Interface for saving Chat History in Database (MongoDB/PostgreSQL)
 */
export interface IAIChatHistory {
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  contextId?: string; 
}