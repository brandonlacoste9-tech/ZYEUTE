/**
 * Foreman Handler - Task Router & Worker Coordinator
 * 
 * Connect RPC handler for Bee workers.
 * 
 * Implements smart task scheduling:
 * 1. Semantic category match (primary)
 * 2. Capability match (fallback)
 * 3. General queue (last resort)
 */

import type { FastifyInstance } from 'fastify';
// import type { ForemanService } from '../gen/foreman_connect';

/**
 * Create Foreman RPC handler
 */
export function createForemanHandler(app: FastifyInstance) {
  return {
    /**
     * PullTask - Get next task for Bee worker
     * 
     * Smart routing algorithm:
     * 1. Try semantic category match (e.g., DocBee → tasks classified as 'DocBee')
     * 2. Fall back to capability match (e.g., 'writing' skill → doc tasks)
     * 3. Fall back to general queue (FIFO with priority)
     */
    async pullTask(request: any) {
      const { beeId, role, capabilities } = request;
      
      app.log.info(`🐝 ${role} (${beeId}) pulling task...`);
      
      // ═══════════════════════════════════════════════════════════
      // TIER 1: SEMANTIC CATEGORY MATCH (PRIMARY)
      // ═══════════════════════════════════════════════════════════
      
      let task = await app.db.task.findFirst({
        where: {
          status: 'pending',
          semanticCategory: role
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' }
        ]
      });
      
      if (task) {
        app.log.info(`  ✅ Semantic match: ${task.id}`);
      }
      
      // ═══════════════════════════════════════════════════════════
      // TIER 2: CAPABILITY MATCH (FALLBACK)
      // ═══════════════════════════════════════════════════════════
      
      if (!task && capabilities.length > 0) {
        task = await app.db.task.findFirst({
          where: {
            status: 'pending',
            semanticLabels: {
              hasSome: capabilities
            }
          },
          orderBy: [
            { priority: 'desc' },
            { createdAt: 'asc' }
          ]
        });
        
        if (task) {
          app.log.info(`  ✅ Capability match: ${task.id}`);
        }
      }
      
      // ═══════════════════════════════════════════════════════════
      // TIER 3: GENERAL QUEUE (LAST RESORT)
      // ═══════════════════════════════════════════════════════════
      
      if (!task) {
        task = await app.db.task.findFirst({
          where: {
            status: 'pending'
          },
          orderBy: [
            { priority: 'desc' },
            { createdAt: 'asc' }
          ]
        });
        
        if (task) {
          app.log.info(`  ✅ General queue: ${task.id}`);
        }
      }
      
      // No tasks available
      if (!task) {
        app.log.info('  ⏸️  No tasks available');
        return { task: null, leaseId: null, leaseExpiresAt: 0 };
      }
      
      // ═══════════════════════════════════════════════════════════
      // ASSIGN TASK WITH LEASE
      // ═══════════════════════════════════════════════════════════
      
      const leaseId = crypto.randomUUID();
      const leaseExpiresAt = new Date(Date.now() + 5 * 60 * 1000);  // 5 min lease
      
      await app.db.task.update({
        where: { id: task.id },
        data: {
          status: 'running',
          assignedTo: beeId,
          leaseId,
          leaseExpiresAt,
          attempts: { increment: 1 },
          updatedAt: new Date()
        }
      });
      
      app.log.info(`  🔒 Lease granted: ${leaseId} (expires in 5min)`);
      
      // Emit event
      await app.redis.publish('colony:task:assigned', JSON.stringify({
        taskId: task.id,
        beeId,
        role,
        timestamp: new Date().toISOString()
      }));
      
      return {
        task: {
          id: task.id,
          type: task.type,
          payloadJson: JSON.stringify(task.payload),
          priority: task.priority,
          semanticCategory: task.semanticCategory,
          semanticLabels: task.semanticLabels,
          attempts: task.attempts
        },
        leaseId,
        leaseExpiresAt: leaseExpiresAt.getTime()
      };
    },
    
    /**
     * ReportResult - Task completed successfully
     */
    async reportResult(request: any) {
      const { taskId, leaseId, resultJson, executionTimeMs } = request;
      
      app.log.info(`✅ Task completed: ${taskId} (${executionTimeMs}ms)`);
      
      // Verify lease
      const task = await app.db.task.findUnique({
        where: { id: taskId }
      });
      
      if (!task || task.leaseId !== leaseId) {
        app.log.warn(`  ⚠️  Invalid lease: ${leaseId}`);
        return { acknowledged: false };
      }
      
      // Update task
      await app.db.task.update({
        where: { id: taskId },
        data: {
          status: 'done',
          result: JSON.parse(resultJson),
          leaseId: null,
          leaseExpiresAt: null,
          updatedAt: new Date()
        }
      });
      
      // Emit event
      await app.redis.publish('colony:task:completed', JSON.stringify({
        taskId,
        executionTimeMs,
        timestamp: new Date().toISOString()
      }));
      
      return { acknowledged: true };
    },
    
    /**
     * ReportFailure - Task failed
     */
    async reportFailure(request: any) {
      const { taskId, leaseId, error, errorTrace, retryable } = request;
      
      app.log.error(`❌ Task failed: ${taskId}`);
      app.log.error(`  Error: ${error}`);
      
      // Verify lease
      const task = await app.db.task.findUnique({
        where: { id: taskId }
      });
      
      if (!task || task.leaseId !== leaseId) {
        app.log.warn(`  ⚠️  Invalid lease: ${leaseId}`);
        return { acknowledged: false, willRetry: false, retryCount: 0 };
      }
      
      // Determine if should retry
      const maxRetries = 3;
      const willRetry = retryable && task.attempts < maxRetries;
      
      // Update task
      await app.db.task.update({
        where: { id: taskId },
        data: {
          status: willRetry ? 'pending' : 'failed',
          error,
          leaseId: null,
          leaseExpiresAt: null,
          assignedTo: null,
          updatedAt: new Date()
        }
      });
      
      if (willRetry) {
        app.log.info(`  🔄 Will retry (attempt ${task.attempts + 1}/${maxRetries})`);
      } else {
        app.log.info(`  💀 Failed permanently`);
      }
      
      // Emit event
      await app.redis.publish('colony:task:failed', JSON.stringify({
        taskId,
        error,
        willRetry,
        timestamp: new Date().toISOString()
      }));
      
      return {
        acknowledged: true,
        willRetry,
        retryCount: task.attempts
      };
    },
    
    /**
     * Heartbeat - Worker liveness signal
     */
    async heartbeat(request: any) {
      const { beeId, status, currentTaskId, metrics } = request;
      
      // Update agent heartbeat
      await app.db.agentHeartbeat.create({
        data: {
          agentId: beeId,
          status,
          ts: new Date()
        }
      });
      
      // Update agent status
      await app.db.agent.update({
        where: { id: beeId },
        data: {
          state: {
            status,
            currentTaskId,
            metrics,
            lastHeartbeat: new Date().toISOString()
          },
          updatedAt: new Date()
        }
      });
      
      return {
        acknowledged: true,
        command: 'continue'  // Could be 'pause', 'restart' for control
      };
    },
    
    /**
     * RegisterWorker - Register new Bee worker
     */
    async registerWorker(request: any) {
      const { beeId, role, skills, config } = request;
      
      app.log.info(`🐝 Registering worker: ${role} (${beeId})`);
      
      // Check if already exists
      const existing = await app.db.agent.findUnique({
        where: { id: beeId }
      });
      
      if (existing) {
        app.log.info('  ℹ️  Worker already registered');
        return { registered: true, workerId: beeId };
      }
      
      // Create agent
      await app.db.agent.create({
        data: {
          id: beeId,
          role,
          skills,
          state: {
            config,
            status: 'idle',
            registeredAt: new Date().toISOString()
          },
          active: true
        }
      });
      
      app.log.info(`  ✅ Worker registered`);
      
      // Emit event
      await app.redis.publish('colony:worker:registered', JSON.stringify({
        beeId,
        role,
        skills,
        timestamp: new Date().toISOString()
      }));
      
      return {
        registered: true,
        workerId: beeId
      };
    }
  };
}

