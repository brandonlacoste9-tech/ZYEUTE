/**
 * Executor Registry - Specialized Bee Implementations
 * 
 * Each Bee role has a specialized executor that handles
 * tasks specific to that domain.
 */

import { docBeeExecutor } from './doc-bee';
import { codeBeeExecutor } from './code-bee';
import { visionBeeExecutor } from './vision-bee';
import { memoryBeeExecutor } from './memory-bee';
import { opsBeeExecutor } from './ops-bee';
import { generalBeeExecutor } from './general-bee';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type BeeRole = 
  | 'DocBee'
  | 'CodeBee'
  | 'VisionBee'
  | 'MemoryBee'
  | 'OpsBee'
  | 'GeneralBee';

export interface Task {
  id: string;
  type: string;
  payloadJson: string;
  priority: string;
  semanticCategory?: string;
  semanticLabels?: string[];
  attempts: number;
}

export interface TaskResult {
  success: boolean;
  output?: any;
  metadata?: Record<string, any>;
}

export type BeeExecutor = (task: Task) => Promise<TaskResult>;

// ═══════════════════════════════════════════════════════════════
// EXECUTOR REGISTRY
// ═══════════════════════════════════════════════════════════════

export const executorRegistry: Record<BeeRole, BeeExecutor> = {
  DocBee: docBeeExecutor,
  CodeBee: codeBeeExecutor,
  VisionBee: visionBeeExecutor,
  MemoryBee: memoryBeeExecutor,
  OpsBee: opsBeeExecutor,
  GeneralBee: generalBeeExecutor,
};

/**
 * Get executor for a role
 */
export function getExecutor(role: BeeRole): BeeExecutor {
  const executor = executorRegistry[role];
  
  if (!executor) {
    throw new Error(`No executor found for role: ${role}`);
  }
  
  return executor;
}

