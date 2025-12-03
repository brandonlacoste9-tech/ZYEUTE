/**
 * GeneralBee Executor - General Purpose Worker
 * 
 * Handles:
 * - Unclassified tasks
 * - Fallback processing
 * - Generic operations
 */

import OpenAI from 'openai';
import type { BeeExecutor, Task, TaskResult } from './index';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generalBeeExecutor: BeeExecutor = async (task: Task): Promise<TaskResult> => {
  const payload = JSON.parse(task.payloadJson);
  
  // Use GPT-4 for general-purpose processing
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a general-purpose AI assistant. Process requests accurately and helpfully.'
      },
      {
        role: 'user',
        content: payload.instruction || payload.prompt || JSON.stringify(payload)
      }
    ],
    temperature: 0.7
  });
  
  return {
    success: true,
    output: {
      result: response.choices[0].message.content
    },
    metadata: {
      model: 'gpt-4o',
      tokensUsed: response.usage?.total_tokens
    }
  };
};

