/**
 * Test Routes - For Comet Validation
 * 
 * Simple endpoints for Comet to test Colony OS functionality
 */

import { FastifyPluginAsync } from 'fastify';

export const createTestRoutes: FastifyPluginAsync = async (app) => {
  
  /**
   * GET /v1/test/health - Simple health check
   */
  app.get('/test/health', async () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        kernel: 'online',
        mind: app.mind ? 'connected' : 'not connected',
        guardian: app.guardian ? 'connected' : 'not connected'
      }
    };
  });
  
  /**
   * POST /v1/test/task - Create a test task for Comet
   */
  app.post('/test/task', async (request, reply) => {
    try {
      const { description, priority } = request.body as {
        description?: string;
        priority?: string;
      };
      
      // Create a simple test task
      const task = await app.db.task.create({
        data: {
          type: 'test',
          payload: {
            test: true,
            description: description || 'Test task from Comet',
            timestamp: new Date().toISOString()
          },
          priority: priority || 'medium',
          status: 'pending',
          semanticCategory: 'GeneralBee',
          semanticLabels: ['test', 'validation'],
          attempts: 0
        }
      });
      
      app.log.info(`✅ Test task created: ${task.id}`);
      
      return {
        success: true,
        task: {
          id: task.id,
          type: task.type,
          status: task.status,
          priority: task.priority,
          createdAt: task.createdAt.toISOString()
        },
        message: 'Test task created successfully'
      };
      
    } catch (err: any) {
      app.log.error('Test task creation error:', err);
      return reply.code(500).send({
        success: false,
        error: err.message
      });
    }
  });
  
  /**
   * GET /v1/test/tasks - List all test tasks
   */
  app.get('/test/tasks', async () => {
    const tasks = await app.db.task.findMany({
      where: {
        type: 'test'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    return {
      success: true,
      count: tasks.length,
      tasks: tasks.map(t => ({
        id: t.id,
        status: t.status,
        priority: t.priority,
        semanticCategory: t.semanticCategory,
        createdAt: t.createdAt.toISOString(),
        assignedTo: t.assignedTo
      }))
    };
  });
  
  /**
   * GET /v1/test/stats - Get system statistics
   */
  app.get('/test/stats', async () => {
    const [totalTasks, pendingTasks, completedTasks, failedTasks] = await Promise.all([
      app.db.task.count(),
      app.db.task.count({ where: { status: 'pending' } }),
      app.db.task.count({ where: { status: 'done' } }),
      app.db.task.count({ where: { status: 'failed' } })
    ]);
    
    const agents = await app.db.agent.count({
      where: { active: true }
    });
    
    return {
      success: true,
      stats: {
        tasks: {
          total: totalTasks,
          pending: pendingTasks,
          completed: completedTasks,
          failed: failedTasks
        },
        agents: {
          active: agents
        },
        timestamp: new Date().toISOString()
      }
    };
  });
  
  /**
   * POST /v1/test/memory - Test memory storage
   */
  app.post('/test/memory', async (request, reply) => {
    try {
      const { key, value } = request.body as {
        key?: string;
        value?: any;
      };
      
      const memory = await app.db.memory.create({
        data: {
          scope: 'global',
          key: key || `test_${Date.now()}`,
          value: value || { test: true, timestamp: new Date().toISOString() }
        }
      });
      
      app.log.info(`✅ Test memory saved: ${memory.id}`);
      
      return {
        success: true,
        memory: {
          id: memory.id,
          scope: memory.scope,
          key: memory.key,
          createdAt: memory.createdAt.toISOString()
        },
        message: 'Test memory saved successfully'
      };
      
    } catch (err: any) {
      app.log.error('Test memory error:', err);
      return reply.code(500).send({
        success: false,
        error: err.message
      });
    }
  });
  
  /**
   * GET /v1/test/memory/:key - Retrieve test memory
   */
  app.get('/test/memory/:key', async (request, reply) => {
    try {
      const { key } = request.params as { key: string };
      
      const memory = await app.db.memory.findFirst({
        where: {
          scope: 'global',
          key
        }
      });
      
      if (!memory) {
        return reply.code(404).send({
          success: false,
          error: 'Memory not found'
        });
      }
      
      return {
        success: true,
        memory: {
          id: memory.id,
          key: memory.key,
          value: memory.value,
          createdAt: memory.createdAt.toISOString()
        }
      };
      
    } catch (err: any) {
      app.log.error('Get memory error:', err);
      return reply.code(500).send({
        success: false,
        error: err.message
      });
    }
  });
};

