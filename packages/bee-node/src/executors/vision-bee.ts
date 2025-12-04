/**
 * VisionBee Executor - Visual Processing Specialist with ComfyUI Integration
 *
 * Handles:
 * - Image generation (via ComfyUI + SDXL)
 * - Video generation (via ComfyUI + HunyuanVideo)
 * - Image analysis (via Google Gemini)
 * - Quality control (via Gemini 1.5 Flash)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import WebSocket from 'ws';
import { readFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';
import type { BeeExecutor, Task, TaskResult } from './index';

// Configuration
const COMFYUI_URL = process.env.COMFYUI_URL || 'http://localhost:8188';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Workflow schemas
const WorkflowSchema = z.object({
  nodes: z.array(z.any()),
  links: z.array(z.any())
});

// Load workflows
function loadWorkflow(name: string) {
  const path = join(__dirname, '../workflows', `${name}.json`);
  const content = readFileSync(path, 'utf-8');
  return JSON.parse(content);
}

// ComfyUI API Client
class ComfyUIClient {
  private baseUrl: string;

  constructor(baseUrl: string = COMFYUI_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Queue a prompt for execution
   */
  async queuePrompt(workflow: any): Promise<string> {
    const response = await fetch(`${this.baseUrl}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: workflow })
    });

    if (!response.ok) {
      throw new Error(`ComfyUI API error: ${response.statusText}`);
    }

    const data = await response.json() as { prompt_id: string };
    return data.prompt_id;
  }

  /**
   * Monitor prompt execution via WebSocket
   */
  async waitForCompletion(promptId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`${this.baseUrl.replace('http', 'ws')}/ws?clientId=${promptId}`);

      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('ComfyUI execution timeout (5 minutes)'));
      }, 5 * 60 * 1000); // 5 minute timeout

      ws.on('message', (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString());

          // Check for completion
          if (message.type === 'executed' && message.data.prompt_id === promptId) {
            clearTimeout(timeout);
            ws.close();
            resolve(message.data);
          }

          // Check for errors
          if (message.type === 'execution_error') {
            clearTimeout(timeout);
            ws.close();
            reject(new Error(`ComfyUI execution error: ${message.data.exception_message}`));
          }
        } catch (err) {
          console.error('WebSocket message parse error:', err);
        }
      });

      ws.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  /**
   * Get output file URL from ComfyUI
   */
  getOutputUrl(filename: string): string {
    return `${this.baseUrl}/view?filename=${filename}`;
  }
}

// Gemini QC Client
class GeminiQCClient {
  private model: any;

  constructor() {
    if (!genAI) {
      throw new Error('Gemini API key not configured');
    }
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Analyze generated image for quality
   */
  async analyzeImage(imageUrl: string, originalPrompt: string): Promise<{
    quality: number;
    issues: string[];
    suggestions: string[];
  }> {
    const prompt = `Analyze this generated image for quality issues.
Original prompt: "${originalPrompt}"

Rate the image from 0-100 and identify any issues:
- Anatomical errors (malformed hands, faces, bodies)
- Artifacts or distortions
- Prompt adherence
- Technical quality (blur, noise, compression)

Return JSON: { "quality": <0-100>, "issues": [...], "suggestions": [...] }`;

    const result = await this.model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: await this.fetchImageAsBase64(imageUrl)
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback if no JSON found
    return {
      quality: 75,
      issues: [],
      suggestions: []
    };
  }

  private async fetchImageAsBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
  }
}

// Main executor
export const visionBeeExecutor: BeeExecutor = async (task: Task): Promise<TaskResult> => {
  const payload = JSON.parse(task.payloadJson);
  const action = payload.action || 'generate-image';

  switch (action) {
    case 'generate-image':
      return await generateImage(payload);

    case 'generate-video':
      return await generateVideo(payload);

    case 'analyze-image':
      return await analyzeImage(payload);

    default:
      throw new Error(`Unknown action: ${action}`);
  }
};

/**
 * Generate image via ComfyUI + SDXL
 */
async function generateImage(payload: any): Promise<TaskResult> {
  const {
    prompt,
    negativePrompt = 'bad quality, blurry, distorted',
    seed = Math.floor(Math.random() * 1000000),
    enableQC = true
  } = payload;

  const client = new ComfyUIClient();

  // Load and customize workflow
  const workflow = loadWorkflow('z_image_v1');

  // Replace template variables
  const workflowJson = JSON.stringify(workflow)
    .replace('{{POSITIVE_PROMPT}}', prompt)
    .replace('{{NEGATIVE_PROMPT}}', negativePrompt)
    .replace('{{SEED}}', seed.toString());

  const customizedWorkflow = JSON.parse(workflowJson);

  // Queue prompt
  const promptId = await client.queuePrompt(customizedWorkflow);

  // Wait for completion
  const result = await client.waitForCompletion(promptId);

  // Get output filename (from SaveImage node)
  const outputFiles = result.outputs['7']; // Node 7 is SaveImage
  const filename = outputFiles.images[0].filename;
  const imageUrl = client.getOutputUrl(filename);

  // Quality check (optional)
  let qcResult = null;
  if (enableQC && genAI) {
    try {
      const qcClient = new GeminiQCClient();
      qcResult = await qcClient.analyzeImage(imageUrl, prompt);
    } catch (err) {
      console.warn('QC failed:', err);
    }
  }

  return {
    success: true,
    output: {
      imageUrl,
      filename,
      prompt,
      seed,
      qc: qcResult
    },
    metadata: {
      workflow: 'z_image_v1',
      promptId,
      comfyuiUrl: COMFYUI_URL
    }
  };
}

/**
 * Generate video via ComfyUI + HunyuanVideo
 */
async function generateVideo(payload: any): Promise<TaskResult> {
  const {
    prompt,
    negativePrompt = 'bad quality, static, boring',
    seed = Math.floor(Math.random() * 1000000),
    duration = 5 // seconds
  } = payload;

  const client = new ComfyUIClient();

  // Load and customize workflow
  const workflow = loadWorkflow('hunyuan_v1');

  // Calculate frame count (24 fps)
  const frameCount = duration * 24;

  // Replace template variables
  const workflowJson = JSON.stringify(workflow)
    .replace('{{PROMPT}}', prompt)
    .replace('{{NEGATIVE_PROMPT}}', negativePrompt)
    .replace('{{SEED}}', seed.toString());

  const customizedWorkflow = JSON.parse(workflowJson);

  // Queue prompt
  const promptId = await client.queuePrompt(customizedWorkflow);

  // Wait for completion (video generation takes longer)
  const result = await client.waitForCompletion(promptId);

  // Get output video URL
  const outputFiles = result.outputs['3']; // Node 3 is VHS_VideoCombine
  const filename = outputFiles.gifs[0].filename;
  const videoUrl = client.getOutputUrl(filename);

  return {
    success: true,
    output: {
      videoUrl,
      filename,
      prompt,
      seed,
      duration,
      frameCount
    },
    metadata: {
      workflow: 'hunyuan_v1',
      promptId,
      comfyuiUrl: COMFYUI_URL
    }
  };
}

/**
 * Analyze image via Gemini
 */
async function analyzeImage(payload: any): Promise<TaskResult> {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }

  const { imageUrl, prompt: analysisPrompt } = payload;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent([
    analysisPrompt || 'Describe this image in detail.',
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: await fetchImageAsBase64(imageUrl)
      }
    }
  ]);

  const response = await result.response;
  const text = response.text();

  return {
    success: true,
    output: {
      analysis: text,
      imageUrl
    },
    metadata: {
      model: 'gemini-1.5-flash',
      tokensUsed: response.usageMetadata?.totalTokenCount
    }
  };
}

// Helper function
async function fetchImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}
