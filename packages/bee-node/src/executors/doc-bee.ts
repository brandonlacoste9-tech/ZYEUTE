/**
 * DocBee Executor - Document Processing Specialist
 * 
 * Handles:
 * - Document summarization
 * - Content generation
 * - Metadata extraction
 * - Format conversion
 * - Writing assistance
 */

import OpenAI from 'openai';
import type { BeeExecutor, Task, TaskResult } from './index';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * DocBee executor implementation
 */
export const docBeeExecutor: BeeExecutor = async (task: Task): Promise<TaskResult> => {
  const payload = JSON.parse(task.payloadJson);
  const action = payload.action || 'process';
  
  switch (action) {
    case 'summarize':
      return await summarizeDocument(payload);
    
    case 'generate':
      return await generateContent(payload);
    
    case 'extract-metadata':
      return await extractMetadata(payload);
    
    case 'convert-format':
      return await convertFormat(payload);
    
    default:
      return await processGenericDoc(payload);
  }
};

/**
 * Summarize document
 */
async function summarizeDocument(payload: any): Promise<TaskResult> {
  const { text, maxLength } = payload;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a document summarization specialist. Create concise, accurate summaries.'
      },
      {
        role: 'user',
        content: `Summarize this document${maxLength ? ` in ${maxLength} words or less` : ''}:\n\n${text}`
      }
    ],
    temperature: 0.3
  });
  
  const summary = response.choices[0].message.content;
  
  return {
    success: true,
    output: {
      summary,
      originalLength: text.length,
      summaryLength: summary?.length || 0
    },
    metadata: {
      model: 'gpt-4o-mini',
      tokensUsed: response.usage?.total_tokens
    }
  };
}

/**
 * Generate content
 */
async function generateContent(payload: any): Promise<TaskResult> {
  const { prompt, style, length } = payload;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a content generation specialist. ${style ? `Write in ${style} style.` : ''}`
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: length || 1000
  });
  
  const content = response.choices[0].message.content;
  
  return {
    success: true,
    output: {
      content
    },
    metadata: {
      model: 'gpt-4o',
      tokensUsed: response.usage?.total_tokens
    }
  };
}

/**
 * Extract metadata from document
 */
async function extractMetadata(payload: any): Promise<TaskResult> {
  const { text } = payload;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Extract structured metadata from documents. Return JSON with: title, author, date, topics, keywords, summary.'
      },
      {
        role: 'user',
        content: text
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1
  });
  
  const metadata = JSON.parse(response.choices[0].message.content || '{}');
  
  return {
    success: true,
    output: metadata,
    metadata: {
      model: 'gpt-4o-mini',
      tokensUsed: response.usage?.total_tokens
    }
  };
}

/**
 * Convert document format
 */
async function convertFormat(payload: any): Promise<TaskResult> {
  const { text, fromFormat, toFormat } = payload;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Convert documents from ${fromFormat} to ${toFormat} format. Preserve all content and structure.`
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: 0.1
  });
  
  const converted = response.choices[0].message.content;
  
  return {
    success: true,
    output: {
      converted,
      fromFormat,
      toFormat
    },
    metadata: {
      model: 'gpt-4o-mini',
      tokensUsed: response.usage?.total_tokens
    }
  };
}

/**
 * Generic document processing
 */
async function processGenericDoc(payload: any): Promise<TaskResult> {
  const { text, instruction } = payload;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a document processing assistant. Follow instructions precisely.'
      },
      {
        role: 'user',
        content: instruction || `Process this document:\n\n${text}`
      }
    ],
    temperature: 0.5
  });
  
  const output = response.choices[0].message.content;
  
  return {
    success: true,
    output: {
      result: output
    },
    metadata: {
      model: 'gpt-4o',
      tokensUsed: response.usage?.total_tokens
    }
  };
}

