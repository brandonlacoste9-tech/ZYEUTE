#!/usr/bin/env node
/**
 * Colony OS Worker Bee Poller
 * 
 * Polls Supabase for pending tasks and executes them via GitHub Actions workflow dispatch
 * or directly executes commands on the self-hosted runner.
 * 
 * Usage:
 *   node colony/queue/poller.js
 * 
 * Environment Variables:
 *   SUPABASE_URL - Supabase project URL
 *   SUPABASE_SERVICE_KEY - Supabase service role key
 *   GITHUB_TOKEN - GitHub personal access token (for workflow dispatch)
 *   GITHUB_REPO - GitHub repo in format "owner/repo"
 *   WORKER_ID - Unique identifier for this worker bee
 */

import { createClient } from '@supabase/supabase-js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'brandonlacoste9-tech/Zyeute';
const WORKER_ID = process.env.WORKER_ID || `worker-${Date.now()}`;
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || '5000', 10); // 5 seconds default
const USE_WORKFLOW_DISPATCH = process.env.USE_WORKFLOW_DISPATCH === 'true';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Get next pending task from Supabase
 */
async function getNextTask() {
  try {
    const { data, error } = await supabase.rpc('get_next_colony_task', {
      worker_id: WORKER_ID
    });

    if (error) {
      console.error('❌ Error fetching task:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('❌ Exception fetching task:', error);
    return null;
  }
}

/**
 * Execute task via GitHub Actions workflow dispatch
 */
async function executeViaWorkflow(task) {
  try {
    const [owner, repo] = GITHUB_REPO.split('/');
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/colony-worker-bee.yml/dispatches`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: {
          task: task.command,
          origin: task.origin,
          priority: task.priority || 'normal',
          task_id: task.id
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    console.log(`✅ Task ${task.id} dispatched to GitHub Actions workflow`);
    return { success: true, method: 'workflow' };
  } catch (error) {
    console.error('❌ Error dispatching workflow:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Execute task directly on this runner
 */
async function executeDirect(task) {
  try {
    console.log(`🐝 Worker ${WORKER_ID} executing task: ${task.command}`);
    
    // Check if command is a script file
    const scriptPath = path.join(process.cwd(), 'colony', 'bees', 'worker', 'tasks', task.command);
    
    let commandToRun = task.command;
    
    // If it's a script file, execute it
    try {
      await fs.access(scriptPath);
      commandToRun = `bash ${scriptPath}`;
      console.log(`📜 Executing script: ${scriptPath}`);
    } catch {
      // Not a script file, execute command directly
    }

    const { stdout, stderr } = await execAsync(commandToRun, {
      cwd: process.cwd(),
      timeout: 300000, // 5 minute timeout
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });

    const result = stdout || stderr || 'Task completed successfully';
    
    // Update task status
    await supabase
      .from('colony_tasks')
      .update({
        status: 'done',
        result: result,
        executed_at: new Date().toISOString()
      })
      .eq('id', task.id);

    console.log(`✅ Task ${task.id} completed successfully`);
    return { success: true, method: 'direct', result };
  } catch (error) {
    console.error(`❌ Task ${task.id} failed:`, error);
    
    // Update task status with error
    await supabase
      .from('colony_tasks')
      .update({
        status: 'error',
        error_message: error.message,
        result: error.stderr || error.stdout || String(error),
        executed_at: new Date().toISOString()
      })
      .eq('id', task.id);

    return { success: false, error: error.message };
  }
}

/**
 * Main polling loop
 */
async function poll() {
  try {
    const task = await getNextTask();
    
    if (!task) {
      // No tasks available, wait and poll again
      return;
    }

    console.log(`\n🐝 Found task: ${task.id}`);
    console.log(`   Origin: ${task.origin}`);
    console.log(`   Priority: ${task.priority}`);
    console.log(`   Command: ${task.command}`);

    let result;
    
    if (USE_WORKFLOW_DISPATCH && GITHUB_TOKEN) {
      // Execute via GitHub Actions workflow
      result = await executeViaWorkflow(task);
    } else {
      // Execute directly on this runner
      result = await executeDirect(task);
    }

    if (!result.success) {
      console.error(`❌ Task ${task.id} execution failed`);
    }
  } catch (error) {
    console.error('❌ Error in poll loop:', error);
  }
}

/**
 * Start the poller
 */
function start() {
  console.log('🐝 Colony OS Worker Bee Poller Starting...');
  console.log(`   Worker ID: ${WORKER_ID}`);
  console.log(`   Poll Interval: ${POLL_INTERVAL}ms`);
  console.log(`   Execution Method: ${USE_WORKFLOW_DISPATCH ? 'GitHub Actions Workflow' : 'Direct'}`);
  console.log(`   Supabase URL: ${SUPABASE_URL}`);
  console.log('');

  // Poll immediately, then set interval
  poll();
  setInterval(poll, POLL_INTERVAL);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Worker Bee poller...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down Worker Bee poller...');
  process.exit(0);
});

// Start polling
start();

