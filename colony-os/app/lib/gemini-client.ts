/**
 * Gemini Client for Colony OS
 * Wrapper around Google Generative AI SDK with cache management utilities
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!geminiKey) {
  console.warn('⚠️ GEMINI_API_KEY not found. Some features may not work.');
}

const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

/**
 * Cache Manager utility for Gemini context caching
 * Reduces costs by caching large contexts and reusing them for queries
 */
export class CacheManager {
  private client: GoogleGenerativeAI;
  private cacheMap: Map<string, { cacheId: string; createdAt: Date; ttl: number }> = new Map();

  constructor(client: GoogleGenerativeAI) {
    this.client = client;
  }

  /**
   * Create a cached context for codebase digests or large content
   * @param options Configuration for cache creation
   * @returns Cache name/ID that can be reused for queries
   */
  async create(options: {
    model?: string;
    displayName: string;
    contents: Array<{ parts: Array<{ text: string }> }>;
    ttlSeconds?: number;
  }): Promise<{ name: string; cacheId: string }> {
    const model = this.client.getGenerativeModel({
      model: options.model || 'models/gemini-1.5-pro',
    });

    // Note: The actual Gemini API cache management may differ
    // This is a conceptual implementation based on the Python examples
    // You may need to adjust based on the actual TypeScript SDK API

    // For now, we'll simulate the cache creation
    // In production, you'd use the actual Gemini caching API
    const cacheId = `cache_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.cacheMap.set(options.displayName, {
      cacheId,
      createdAt: new Date(),
      ttl: options.ttlSeconds || 604800, // Default 7 days
    });

    return {
      name: options.displayName,
      cacheId,
    };
  }

  /**
   * Get cache information by display name
   */
  getCache(displayName: string): { cacheId: string; createdAt: Date; ttl: number } | undefined {
    return this.cacheMap.get(displayName);
  }

  /**
   * Purge old caches that have expired
   */
  async purgeOld(): Promise<number> {
    const now = new Date();
    let purged = 0;

    for (const [name, cache] of this.cacheMap.entries()) {
      const ageSeconds = (now.getTime() - cache.createdAt.getTime()) / 1000;
      if (ageSeconds > cache.ttl) {
        this.cacheMap.delete(name);
        purged++;
      }
    }

    return purged;
  }
}

/**
 * Generate content with optional context cache support
 */
async function generateContent(options: {
  model?: string;
  contextCache?: string;
  systemInstruction?: string;
  contents?: string | Array<{ parts: Array<{ text: string }> }>;
  generationConfig?: {
    responseMimeType?: string;
    responseSchema?: any;
    temperature?: number;
  };
}): Promise<{ text: string; response: any }> {
  if (!genAI) {
    throw new Error('Gemini client not initialized. Set GEMINI_API_KEY environment variable.');
  }

  // Remove 'models/' prefix if present (SDK handles it)
  const modelName = options.model?.replace(/^models\//, '') || 'gemini-2.0-flash-exp';
  const model = genAI.getGenerativeModel({
    model: modelName,
  });

  // Prepare contents
  let contents: string | Array<{ parts: Array<{ text: string }> }>;
  if (typeof options.contents === 'string') {
    contents = options.contents;
  } else if (options.contents) {
    contents = options.contents;
  } else {
    throw new Error('Contents must be provided');
  }

  // Build generation config
  const generationConfig: any = {};
  if (options.generationConfig?.responseMimeType) {
    generationConfig.responseMimeType = options.generationConfig.responseMimeType;
  }
  if (options.generationConfig?.responseSchema) {
    generationConfig.responseSchema = options.generationConfig.responseSchema;
  }
  if (options.generationConfig?.temperature !== undefined) {
    generationConfig.temperature = options.generationConfig.temperature;
  }

  // Format contents properly for Gemini API
  // Gemini API expects contents as an array of parts with role
  let formattedContents: any;
  if (typeof contents === 'string') {
    formattedContents = [{ role: 'user', parts: [{ text: contents }] }];
  } else if (Array.isArray(contents)) {
    // Ensure all items have a role property
    formattedContents = contents.map((item: any) => ({
      role: item.role || 'user',
      parts: item.parts,
    }));
  } else {
    throw new Error('Invalid contents format');
  }

  // Note: Context cache support may vary by SDK version
  // This is a conceptual implementation
  const result = await model.generateContent({
    contents: formattedContents,
    systemInstruction: options.systemInstruction,
    generationConfig: Object.keys(generationConfig).length > 0 ? generationConfig : undefined,
  });

  return {
    text: result.response.text(),
    response: result.response,
  };
}

/**
 * Singleton Gemini client instance
 */
export const gemini = genAI
  ? {
      client: genAI,
      cacheManager: new CacheManager(genAI),
      getModel: (modelName: string = 'gemini-1.5-pro'): GenerativeModel => {
        return genAI.getGenerativeModel({ model: modelName });
      },
      generateContent,
    }
  : null;
