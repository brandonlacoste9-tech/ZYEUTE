/**
 * Task Management Routes
 * 
 * REST API for task lifecycle:
 * - POST /v1/tasks - Create new task
 * - GET /v1/tasks/:id - Get task status
 * - GET /v1/tasks - List tasks
 * - DELETE /v1/tasks/:id - Cancel task
 */

import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// REQUEST/RESPONSE SCHEMAS
// ═══════════════════════════════════════════════════════════════

const CreateTaskSchema = z.object({
  description: z.string().min(1).max(10000),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  payload: z.record(z.any()).optional(),
  type: z.string().optional(),
});

const TaskResponseSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  description: z.string(),
  status: z.enum(['pending', 'running', 'done', 'failed', 'cancelled']),
  priority: z.string(),
  semanticCategory: z.string().optional(),
  semanticLabels: z.array(z.string()).optional(),
  assignedTo: z.string().uuid().optional(),
  result: z.any().optional(),
  error: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ═══════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════

export const createTaskRoutes: FastifyPluginAsync = async (app) => {
  
  /**
   * POST /v1/tasks - Create new task
   * 
   * Flow:
   * 1. Validate input
   * 2. Classify via Mind (Neurosphere)
   * 3. Guard via Guardian (Neurasphere)
   * 4. Create task in database
   * 5. Emit event for Foreman
   */
  app.post('/tasks', async (request, reply) => {
    try {
      // Parse and validate
      const body = CreateTaskSchema.parse(request.body);
      
      app.log.info(`📝 Creating task: ${body.description.substring(0, 50)}...`);
      
      // ═══════════════════════════════════════════════════════════
      // STEP 1: CLASSIFY VIA MIND (NEUROSPHERE)
      // ═══════════════════════════════════════════════════════════
      
      let semanticCategory = 'GeneralBee';
      let semanticLabels: string[] = [];
      
      if (app.mind) {
        try {
          const classification = await app.mind.classify({
            input: body.description
          });
          
          semanticCategory = classification.category;
          semanticLabels = classification.labels;
          
          app.log.info(`  🧠 Mind classified: ${semanticCategory}`);
        } catch (err) {
          app.log.warn(`  ⚠️  Mind unavailable, using fallback classification`);
        }
      }
      
      // ═══════════════════════════════════════════════════════════
      // STEP 2: GUARD VIA GUARDIAN (NEURASPHERE)
      // ═══════════════════════════════════════════════════════════
      
      if (app.guardian) {
        try {
          const guardResult = await app.guardian.guard({
            source: 'kernel',
            inputJson: JSON.stringify(body),
            contextJson: JSON.stringify({ endpoint: '/v1/tasks' })
          });
          
          if (guardResult.status === 'BLOCKED') {
            app.log.warn('  🛡️  Guardian BLOCKED request');
            return reply.code(403).send({
              error: 'Request blocked by Guardian',
              violations: guardResult.violations
            });
          }
          
          if (guardResult.status === 'ROLLBACK') {
            app.log.info('  🛡️  Guardian sanitized input');
            // Use sanitized version
            const sanitized = JSON.parse(guardResult.safeOutputJson);
            body.description = sanitized.description || body.description;
          }
          
          app.log.info('  🛡️  Guardian approved');
        } catch (err) {
          app.log.warn('  ⚠️  Guardian unavailable, proceeding without validation');
        }
      }
      
      // ═══════════════════════════════════════════════════════════
      // STEP 3: CREATE TASK IN DATABASE
      // ═══════════════════════════════════════════════════════════
      
      const task = await app.db.task.create({
        data: {
          type: body.type || 'generic',
          payload: body.payload || {},
          priority: body.priority,
          status: 'pending',
          semanticCategory,
          semanticLabels,
          attempts: 0,
        }
      });
      
      app.log.info(`  ✅ Task created: ${task.id}`);
      
      // ═══════════════════════════════════════════════════════════
      // STEP 4: EMIT EVENT (FOR FOREMAN)
      // ═══════════════════════════════════════════════════════════
      
      await app.redis.publish('colony:task:created', JSON.stringify({
        taskId: task.id,
        category: semanticCategory,
        priority: body.priority,
        timestamp: new Date().toISOString()
      }));
      
      // Return response
      return reply.code(201).send({
        id: task.id,
        type: task.type,
        description: body.description,
        status: task.status,
        priority: task.priority,
        semanticCategory: task.semanticCategory,
        semanticLabels: task.semanticLabels,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString()
      });
      
    } catch (err) {
      app.log.error('Task creation error:', err);
      
      if (err instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation error',
          details: err.errors
        });
      }
      
      return reply.code(500).send({
        error: 'Internal server error'
      });
    }
  });
  
  /**
   * GET /v1/tasks/:id - Get task status
   */
  app.get('/tasks/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      
      const task = await app.db.task.findUnique({
        where: { id },
        include: {
          assignedAgent: true
        }
      });
      
      if (!task) {
        return reply.code(404).send({
          error: 'Task not found'
        });
      }
      
      return {
        id: task.id,
        type: task.type,
        status: task.status,
        priority: task.priority,
        semanticCategory: task.semanticCategory,
        semanticLabels: task.semanticLabels,
        assignedTo: task.assignedTo,
        result: task.result,
        error: task.error,
        attempts: task.attempts,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString()
      };
      
    } catch (err) {
      app.log.error('Get task error:', err);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  /**
   * GET /v1/tasks - List tasks
   */
  app.get('/tasks', async (request, reply) => {
    try {
      const query = request.query as {
        status?: string;
        category?: string;
        limit?: string;
      };
      
      const where: any = {};
      
      if (query.status) {
        where.status = query.status;
      }
      
      if (query.category) {
        where.semanticCategory = query.category;
      }
      
      const limit = parseInt(query.limit || '100');
      
      const tasks = await app.db.task.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit
      });
      
      return tasks.map(task => ({
        id: task.id,
        type: task.type,
        status: task.status,
        priority: task.priority,
        semanticCategory: task.semanticCategory,
        assignedTo: task.assignedTo,
        createdAt: task.createdAt.toISOString()
      }));
      
    } catch (err) {
      app.log.error('List tasks error:', err);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  /**
   * DELETE /v1/tasks/:id - Cancel task
   */
  app.delete('/tasks/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      
      const task = await app.db.task.findUnique({
        where: { id }
      });
      
      if (!task) {
        return reply.code(404).send({ error: 'Task not found' });
      }
      
      // Can only cancel pending tasks
      if (task.status !== 'pending') {
        return reply.code(400).send({
          error: 'Can only cancel pending tasks',
          currentStatus: task.status
        });
      }
      
      // Update status
      await app.db.task.update({
        where: { id },
        data: {
          status: 'cancelled',
          updatedAt: new Date()
        }
      });
      
      app.log.info(`🚫 Task cancelled: ${id}`);
      
      return reply.code(204).send();
      
    } catch (err) {
      app.log.error('Cancel task error:', err);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
};

