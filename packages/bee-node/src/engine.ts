/**
 * Bee Worker Engine
 * 
 * Main worker loop that:
 * 1. Pulls tasks from Foreman
 * 2. Executes with specialized executor
 * 3. Reports results
 * 4. Sends heartbeats
 * 
 * Each Bee worker runs this engine with a specific role.
 */

import { createPromiseClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import pino from 'pino';

// Generated protobuf types
// import { ForemanService } from '../gen/foreman_connect';

// Executors
import { executorRegistry, type BeeRole } from './executors';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname'
    }
  }
});

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const BEE_ID = process.env.BEE_ID || crypto.randomUUID();
const BEE_ROLE = (process.env.BEE_ROLE || 'GeneralBee') as BeeRole;
const FOREMAN_URL = process.env.FOREMAN_URL || 'http://localhost:3000';
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '5000');
const HEARTBEAT_INTERVAL_MS = parseInt(process.env.HEARTBEAT_INTERVAL_MS || '30000');

// ═══════════════════════════════════════════════════════════════
// BEE WORKER CLASS
// ═══════════════════════════════════════════════════════════════

class BeeWorker {
  private beeId: string;
  private role: BeeRole;
  private capabilities: string[];
  private foremanClient: any;  // Will be typed with generated code
  private running: boolean = false;
  private currentTaskId: string | null = null;
  private metrics = {
    tasksCompleted: 0,
    tasksFailed: 0,
    totalExecutionTime: 0
  };
  
  constructor(beeId: string, role: BeeRole) {
    this.beeId = beeId;
    this.role = role;
    this.capabilities = this.getCapabilities(role);
    
    // Create Foreman client
    // this.foremanClient = createPromiseClient(
    //   ForemanService,
    //   createGrpcTransport({ baseUrl: FOREMAN_URL })
    // );
  }
  
  /**
   * Get capabilities for a role
   */
  private getCapabilities(role: BeeRole): string[] {
    const capabilityMap: Record<BeeRole, string[]> = {
      DocBee: ['writing', 'documentation', 'summarization', 'content_generation'],
      CodeBee: ['programming', 'testing', 'debugging', 'code_review'],
      VisionBee: ['image_analysis', 'ocr', 'video_processing', 'visual_generation'],
      MemoryBee: ['search', 'recall', 'indexing', 'knowledge_management'],
      OpsBee: ['deployment', 'monitoring', 'infrastructure', 'automation'],
      GeneralBee: ['general_purpose', 'flexible']
    };
    
    return capabilityMap[role] || [];
  }
  
  /**
   * Start the worker loop
   */
  async start() {
    this.running = true;
    
    logger.info('');
    logger.info('████████████████████████████████████████████████████████');
    logger.info('█                                                      █');
    logger.info(`█   🐝 ${this.role.toUpperCase().padEnd(48)} █`);
    logger.info('█                                                      █');
    logger.info('████████████████████████████████████████████████████████');
    logger.info('');
    logger.info(`🆔 Bee ID: ${this.beeId}`);
    logger.info(`🎯 Role: ${this.role}`);
    logger.info(`💪 Capabilities: ${this.capabilities.join(', ')}`);
    logger.info(`🔗 Foreman: ${FOREMAN_URL}`);
    logger.info('');
    
    // Register with Foreman
    await this.register();
    
    // Start heartbeat loop
    this.startHeartbeat();
    
    // Start main work loop
    await this.workLoop();
  }
  
  /**
   * Register with Foreman
   */
  private async register() {
    try {
      logger.info('📝 Registering with Foreman...');
      
      // const result = await this.foremanClient.registerWorker({
      //   beeId: this.beeId,
      //   role: this.role,
      //   skills: this.capabilities,
      //   config: {}
      // });
      
      // logger.info('  ✅ Registered successfully');
      logger.info('  ⚠️  Foreman client not connected (protobuf generation pending)');
      
    } catch (err) {
      logger.error('  ❌ Registration failed:', err);
      throw err;
    }
  }
  
  /**
   * Main work loop
   */
  private async workLoop() {
    logger.info('🚀 Starting work loop...\n');
    
    while (this.running) {
      try {
        // Pull next task
        const assignment = await this.pullTask();
        
        if (!assignment || !assignment.task) {
          // No tasks available, wait and retry
          await this.sleep(POLL_INTERVAL_MS);
          continue;
        }
        
        const { task, leaseId } = assignment;
        this.currentTaskId = task.id;
        
        logger.info(`📋 Task assigned: ${task.id}`);
        logger.info(`  Type: ${task.type}`);
        logger.info(`  Priority: ${task.priority}`);
        logger.info(`  Lease: ${leaseId}`);
        
        // Execute task
        const startTime = Date.now();
        
        try {
          const result = await this.executeTask(task);
          const executionTime = Date.now() - startTime;
          
          // Report success
          await this.reportResult(task.id, leaseId, result, executionTime);
          
          this.metrics.tasksCompleted++;
          this.metrics.totalExecutionTime += executionTime;
          
          logger.info(`  ✅ Completed in ${executionTime}ms\n`);
          
        } catch (err: any) {
          const executionTime = Date.now() - startTime;
          
          // Report failure
          await this.reportFailure(task.id, leaseId, err.message, err.stack);
          
          this.metrics.tasksFailed++;
          
          logger.error(`  ❌ Failed after ${executionTime}ms`);
          logger.error(`  Error: ${err.message}\n`);
        }
        
        this.currentTaskId = null;
        
      } catch (err) {
        logger.error('Work loop error:', err);
        await this.sleep(5000);  // Back off on errors
      }
    }
  }
  
  /**
   * Pull next task from Foreman
   */
  private async pullTask(): Promise<any> {
    try {
      // const result = await this.foremanClient.pullTask({
      //   beeId: this.beeId,
      //   role: this.role,
      //   capabilities: this.capabilities
      // });
      
      // return result;
      
      // Placeholder until protobuf generation
      return null;
      
    } catch (err) {
      logger.error('Pull task error:', err);
      return null;
    }
  }
  
  /**
   * Execute task with specialized executor
   */
  private async executeTask(task: any): Promise<any> {
    const executor = executorRegistry[this.role];
    
    if (!executor) {
      throw new Error(`No executor found for role: ${this.role}`);
    }
    
    logger.info(`  🔧 Executing with ${this.role} executor...`);
    
    const result = await executor(task);
    
    return result;
  }
  
  /**
   * Report successful result
   */
  private async reportResult(
    taskId: string,
    leaseId: string,
    result: any,
    executionTimeMs: number
  ) {
    try {
      // await this.foremanClient.reportResult({
      //   taskId,
      //   leaseId,
      //   resultJson: JSON.stringify(result),
      //   executionTimeMs
      // });
      
      logger.debug('  📤 Result reported');
      
    } catch (err) {
      logger.error('Report result error:', err);
    }
  }
  
  /**
   * Report failure
   */
  private async reportFailure(
    taskId: string,
    leaseId: string,
    error: string,
    errorTrace?: string
  ) {
    try {
      // await this.foremanClient.reportFailure({
      //   taskId,
      //   leaseId,
      //   error,
      //   errorTrace,
      //   retryable: true
      // });
      
      logger.debug('  📤 Failure reported');
      
    } catch (err) {
      logger.error('Report failure error:', err);
    }
  }
  
  /**
   * Start heartbeat loop
   */
  private startHeartbeat() {
    setInterval(async () => {
      try {
        // await this.foremanClient.heartbeat({
        //   beeId: this.beeId,
        //   status: this.currentTaskId ? 'busy' : 'idle',
        //   currentTaskId: this.currentTaskId,
        //   metrics: {
        //     cpuUsage: 0,  // TODO: Actual metrics
        //     memoryUsage: 0,
        //     tasksCompleted: this.metrics.tasksCompleted,
        //     tasksFailed: this.metrics.tasksFailed
        //   }
        // });
        
        logger.debug('💓 Heartbeat sent');
        
      } catch (err) {
        logger.error('Heartbeat error:', err);
      }
    }, HEARTBEAT_INTERVAL_MS);
  }
  
  /**
   * Stop the worker
   */
  stop() {
    logger.info('🛑 Stopping worker...');
    this.running = false;
  }
  
  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  const worker = new BeeWorker(BEE_ID, BEE_ROLE);
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    logger.info('\n🛑 Received SIGINT, shutting down...');
    worker.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    logger.info('\n🛑 Received SIGTERM, shutting down...');
    worker.stop();
    process.exit(0);
  });
  
  await worker.start();
}

if (require.main === module) {
  main().catch((err) => {
    logger.error('Fatal error:', err);
    process.exit(1);
  });
}

export { BeeWorker };

