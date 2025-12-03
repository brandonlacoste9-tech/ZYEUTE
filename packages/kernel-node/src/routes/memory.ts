/**
 * Memory Routes - Honeycomb API
 * 
 * Vector-enabled memory service with Neurosphere embeddings.
 * 
 * Endpoints:
 * - POST /v1/memory/save - Store memory
 * - GET /v1/memory/:key - Retrieve memory
 * - POST /v1/memory/search - Semantic search
 * - DELETE /v1/memory/:key - Delete memory
 */

import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// SCHEMAS
// ═══════════════════════════════════════════════════════════════

const SaveMemorySchema = z.object({
  scope: z.enum(['task', 'agent', 'global']),
  key: z.string().min(1).max(256),
  value: z.record(z.any()),
  taskId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional(),
});

const SearchMemorySchema = z.object({
  query: z.string().min(1),
  scope: z.enum(['task', 'agent', 'global']).optional(),
  limit: z.number().int().min(1).max(100).default(10),
});

// ═══════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════

export const createMemoryRoutes: FastifyPluginAsync = async (app) => {
  
  /**
   * POST /v1/memory/save - Store memory with embedding
   */
  app.post('/memory/save', async (request, reply) => {
    try {
      const body = SaveMemorySchema.parse(request.body);
      
      app.log.info(`💾 Saving memory: ${body.scope}/${body.key}`);
      
      // ═══════════════════════════════════════════════════════════
      // GENERATE EMBEDDING VIA MIND
      // ═══════════════════════════════════════════════════════════
      
      let embedding: number[] | null = null;
      
      if (app.mind) {
        try {
          // Embed the value for semantic search
          const valueStr = JSON.stringify(body.value);
          const embedResult = await app.mind.embed({ input: valueStr });
          embedding = embedResult.embedding;
          
          app.log.info('  🧠 Embedding generated');
        } catch (err) {
          app.log.warn('  ⚠️  Mind unavailable, saving without embedding');
        }
      }
      
      // ═══════════════════════════════════════════════════════════
      // SAVE TO DATABASE
      // ═══════════════════════════════════════════════════════════
      
      const memory = await app.db.memory.create({
        data: {
          scope: body.scope,
          key: body.key,
          value: body.value,
          taskId: body.taskId,
          agentId: body.agentId,
          embedding: embedding ? `[${embedding.join(',')}]` : null,  // pgvector format
        }
      });
      
      app.log.info(`  ✅ Memory saved: ${memory.id}`);
      
      return {
        saved: true,
        id: memory.id,
        hasEmbedding: !!embedding
      };
      
    } catch (err) {
      app.log.error('Save memory error:', err);
      
      if (err instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation error',
          details: err.errors
        });
      }
      
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  /**
   * GET /v1/memory/:scope/:key - Retrieve memory
   */
  app.get('/memory/:scope/:key', async (request, reply) => {
    try {
      const { scope, key } = request.params as { scope: string; key: string };
      
      const memory = await app.db.memory.findFirst({
        where: {
          scope,
          key
        }
      });
      
      if (!memory) {
        return reply.code(404).send({ error: 'Memory not found' });
      }
      
      return {
        id: memory.id,
        scope: memory.scope,
        key: memory.key,
        value: memory.value,
        taskId: memory.taskId,
        agentId: memory.agentId,
        createdAt: memory.createdAt.toISOString()
      };
      
    } catch (err) {
      app.log.error('Get memory error:', err);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  /**
   * POST /v1/memory/search - Semantic search via embeddings
   */
  app.post('/memory/search', async (request, reply) => {
    try {
      const body = SearchMemorySchema.parse(request.body);
      
      app.log.info(`🔍 Searching memory: "${body.query}"`);
      
      // ═══════════════════════════════════════════════════════════
      // EMBED QUERY VIA MIND
      // ═══════════════════════════════════════════════════════════
      
      if (!app.mind) {
        return reply.code(503).send({
          error: 'Mind service unavailable',
          message: 'Semantic search requires Neurosphere connection'
        });
      }
      
      const embedResult = await app.mind.embed({ input: body.query });
      const queryEmbedding = embedResult.embedding;
      
      app.log.info('  🧠 Query embedded');
      
      // ═══════════════════════════════════════════════════════════
      // VECTOR SIMILARITY SEARCH (PGVECTOR)
      // ═══════════════════════════════════════════════════════════
      
      // Build pgvector query
      const embeddingStr = `[${queryEmbedding.join(',')}]`;
      
      const where: any = {};
      if (body.scope) {
        where.scope = body.scope;
      }
      
      // Raw SQL for vector similarity (Prisma doesn't support pgvector operators yet)
      const results = await app.db.$queryRaw`
        SELECT 
          id,
          scope,
          key,
          value,
          task_id,
          agent_id,
          created_at,
          1 - (embedding <=> ${embeddingStr}::vector) AS score
        FROM memories
        WHERE 
          ${body.scope ? app.db.$queryRaw`scope = ${body.scope}` : app.db.$queryRaw`TRUE`}
          AND embedding IS NOT NULL
        ORDER BY embedding <=> ${embeddingStr}::vector
        LIMIT ${body.limit}
      `;
      
      app.log.info(`  ✅ Found ${results.length} results`);
      
      return {
        results: results.map((r: any) => ({
          id: r.id,
          scope: r.scope,
          key: r.key,
          value: r.value,
          score: r.score,
          taskId: r.task_id,
          agentId: r.agent_id,
          createdAt: r.created_at.toISOString()
        }))
      };
      
    } catch (err) {
      app.log.error('Search memory error:', err);
      
      if (err instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation error',
          details: err.errors
        });
      }
      
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  /**
   * DELETE /v1/memory/:scope/:key - Delete memory
   */
  app.delete('/memory/:scope/:key', async (request, reply) => {
    try {
      const { scope, key } = request.params as { scope: string; key: string };
      
      await app.db.memory.deleteMany({
        where: {
          scope,
          key
        }
      });
      
      app.log.info(`🗑️  Memory deleted: ${scope}/${key}`);
      
      return reply.code(204).send();
      
    } catch (err) {
      app.log.error('Delete memory error:', err);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
};

