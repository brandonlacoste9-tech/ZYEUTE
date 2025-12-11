/**
 * VisionBee Executor - Visual Processing Specialist
 *
 * Handles:
 * - Image analysis
 * - OCR (text extraction)
 * - Video processing
 * - Visual generation (DALL-E)
 * - Image editing
 */

import OpenAI from 'openai';
import type { BeeExecutor, Task, TaskResult } from './index';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const visionBeeExecutor: BeeExecutor = async (task: Task): Promise<TaskResult> => {
  const payload = JSON.parse(task.payloadJson);
  const action = payload.action || 'analyze';

  switch (action) {
    case 'analyze-image':
      return await analyzeImage(payload);

    case 'generate-image':
      return await generateImage(payload);

    case 'extract-text':
      return await extractText(payload);

    case 'describe-video':
      return await describeVideo(payload);

    default:
      return await processVisual(payload);
  }
};

async function analyzeImage(payload: any): Promise<TaskResult> {
  const { imageUrl, prompt } = payload;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text:
              prompt ||
              'Analyze this image in detail. Describe the subject, composition, lighting, mood, and style.',
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    temperature: 0.3,
  });

  return {
    success: true,
    output: {
      analysis: response.choices[0].message.content,
    },
    metadata: {
      model: 'gpt-4o',
      tokensUsed: response.usage?.total_tokens,
    },
  };
}

async function generateImage(payload: any): Promise<TaskResult> {
  const { prompt, size, quality } = payload;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    size: size || '1024x1024',
    quality: quality || 'standard',
    n: 1,
  });

  return {
    success: true,
    output: {
      imageUrl: response.data?.[0]?.url || '',
      revisedPrompt: response.data?.[0]?.revised_prompt || '',
    },
    metadata: {
      model: 'dall-e-3',
      size,
      quality,
    },
  };
}

async function extractText(payload: any): Promise<TaskResult> {
  const { imageUrl } = payload;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extract all text from this image. Return only the extracted text, preserving formatting.',
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    temperature: 0.1,
  });

  return {
    success: true,
    output: {
      text: response.choices[0].message.content,
    },
    metadata: {
      model: 'gpt-4o',
      tokensUsed: response.usage?.total_tokens,
    },
  };
}

async function describeVideo(payload: any): Promise<TaskResult> {
  const { frameUrls, prompt } = payload;

  // Analyze key frames
  const frameAnalyses = [];

  for (const frameUrl of frameUrls.slice(0, 5)) {
    // Max 5 frames
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Describe this video frame briefly.',
            },
            {
              type: 'image_url',
              image_url: { url: frameUrl },
            },
          ],
        },
      ],
      temperature: 0.3,
    });

    frameAnalyses.push(response.choices[0].message.content);
  }

  // Synthesize video description
  const synthesis = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'Synthesize frame descriptions into a coherent video description.',
      },
      {
        role: 'user',
        content: `Frame descriptions:\n${frameAnalyses.map((a, i) => `Frame ${i + 1}: ${a}`).join('\n')}`,
      },
    ],
    temperature: 0.5,
  });

  return {
    success: true,
    output: {
      description: synthesis.choices[0].message.content,
      frameCount: frameUrls.length,
      framesAnalyzed: frameAnalyses.length,
    },
    metadata: {
      model: 'gpt-4o',
    },
  };
}

async function processVisual(payload: any): Promise<TaskResult> {
  return {
    success: true,
    output: {
      message: 'Generic visual processing not yet implemented',
    },
  };
}
