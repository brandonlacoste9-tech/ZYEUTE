/**
 * CodeBee Executor - Code Analysis & Generation Specialist
 * 
 * Handles:
 * - Code explanation
 * - Code review
 * - Test generation
 * - Bug fixing
 * - Refactoring
 */

import OpenAI from 'openai';
import type { BeeExecutor, Task, TaskResult } from './index';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const codeBeeExecutor: BeeExecutor = async (task: Task): Promise<TaskResult> => {
  const payload = JSON.parse(task.payloadJson);
  const action = payload.action || 'analyze';
  
  switch (action) {
    case 'explain':
      return await explainCode(payload);
    
    case 'review':
      return await reviewCode(payload);
    
    case 'generate-tests':
      return await generateTests(payload);
    
    case 'fix-bug':
      return await fixBug(payload);
    
    case 'refactor':
      return await refactorCode(payload);
    
    default:
      return await analyzeCode(payload);
  }
};

async function explainCode(payload: any): Promise<TaskResult> {
  const { code, language } = payload;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a code explanation specialist. Explain code clearly and concisely.'
      },
      {
        role: 'user',
        content: `Explain this ${language || ''} code:\n\n\`\`\`\n${code}\n\`\`\``
      }
    ],
    temperature: 0.3
  });
  
  return {
    success: true,
    output: {
      explanation: response.choices[0].message.content
    },
    metadata: {
      model: 'gpt-4o',
      tokensUsed: response.usage?.total_tokens
    }
  };
}

async function reviewCode(payload: any): Promise<TaskResult> {
  const { code, language } = payload;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a code review specialist. Identify bugs, security issues, and improvement opportunities.'
      },
      {
        role: 'user',
        content: `Review this ${language || ''} code:\n\n\`\`\`\n${code}\n\`\`\``
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2
  });
  
  return {
    success: true,
    output: JSON.parse(response.choices[0].message.content || '{}'),
    metadata: {
      model: 'gpt-4o',
      tokensUsed: response.usage?.total_tokens
    }
  };
}

async function generateTests(payload: any): Promise<TaskResult> {
  const { code, language, framework } = payload;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a test generation specialist. Generate comprehensive tests using ${framework || 'appropriate testing framework'}.`
      },
      {
        role: 'user',
        content: `Generate tests for this ${language || ''} code:\n\n\`\`\`\n${code}\n\`\`\``
      }
    ],
    temperature: 0.3
  });
  
  return {
    success: true,
    output: {
      tests: response.choices[0].message.content
    },
    metadata: {
      model: 'gpt-4o',
      tokensUsed: response.usage?.total_tokens
    }
  };
}

async function fixBug(payload: any): Promise<TaskResult> {
  const { code, language, bugDescription } = payload;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a debugging specialist. Fix bugs and explain the solution.'
      },
      {
        role: 'user',
        content: `Fix this bug in ${language || ''} code:\n\nBug: ${bugDescription}\n\nCode:\n\`\`\`\n${code}\n\`\`\``
      }
    ],
    temperature: 0.2
  });
  
  return {
    success: true,
    output: {
      fixed: response.choices[0].message.content
    },
    metadata: {
      model: 'gpt-4o',
      tokensUsed: response.usage?.total_tokens
    }
  };
}

async function refactorCode(payload: any): Promise<TaskResult> {
  const { code, language, goal } = payload;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a refactoring specialist. Improve code quality${goal ? ` focusing on: ${goal}` : ''}.`
      },
      {
        role: 'user',
        content: `Refactor this ${language || ''} code:\n\n\`\`\`\n${code}\n\`\`\``
      }
    ],
    temperature: 0.3
  });
  
  return {
    success: true,
    output: {
      refactored: response.choices[0].message.content
    },
    metadata: {
      model: 'gpt-4o',
      tokensUsed: response.usage?.total_tokens
    }
  };
}

async function analyzeCode(payload: any): Promise<TaskResult> {
  const { code, language } = payload;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a code analysis specialist. Analyze code structure, complexity, and quality.'
      },
      {
        role: 'user',
        content: `Analyze this ${language || ''} code:\n\n\`\`\`\n${code}\n\`\`\``
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2
  });
  
  return {
    success: true,
    output: JSON.parse(response.choices[0].message.content || '{}'),
    metadata: {
      model: 'gpt-4o',
      tokensUsed: response.usage?.total_tokens
    }
  };
}

