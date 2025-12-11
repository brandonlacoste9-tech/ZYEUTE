/**
 * Colony OS Task Trigger for Zyeuté
 *
 * Allows Zyeuté app to create tasks in the Colony OS task queue
 *
 * Usage:
 *   import { createColonyTask } from '@/integrations/colony/zyeute-trigger';
 *
 *   await createColonyTask({
 *     command: 'npm run build',
 *     origin: 'Zyeute',
 *     priority: 'high'
 *   });
 */

import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export interface ColonyTaskInput {
  command: string;
  origin: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

export interface ColonyTask {
  id: string;
  created_at: string;
  status: 'pending' | 'running' | 'done' | 'error' | 'cancelled';
  origin: string;
  priority: string;
  command: string;
  result?: string;
  error_message?: string;
  executed_at?: string;
}

/**
 * Create a new task in the Colony OS task queue
 */
export async function createColonyTask(input: ColonyTaskInput): Promise<ColonyTask | null> {
  try {
    const { data, error } = await supabase
      .from('colony_tasks')
      .insert({
        command: input.command,
        origin: input.origin,
        priority: input.priority || 'normal',
        metadata: input.metadata || {},
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating Colony task:', error);
      return null;
    }

    console.log('✅ Colony task created:', data.id);
    return data as ColonyTask;
  } catch (error) {
    console.error('Exception creating Colony task:', error);
    return null;
  }
}

/**
 * Get task status by ID
 */
export async function getColonyTaskStatus(taskId: string): Promise<ColonyTask | null> {
  try {
    const { data, error } = await supabase
      .from('colony_tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      console.error('Error fetching Colony task:', error);
      return null;
    }

    return data as ColonyTask;
  } catch (error) {
    console.error('Exception fetching Colony task:', error);
    return null;
  }
}

/**
 * Get recent tasks
 */
export async function getRecentColonyTasks(limit: number = 10): Promise<ColonyTask[]> {
  try {
    const { data, error } = await supabase
      .from('colony_tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching Colony tasks:', error);
      return [];
    }

    return (data || []) as ColonyTask[];
  } catch (error) {
    console.error('Exception fetching Colony tasks:', error);
    return [];
  }
}

/**
 * Cancel a pending task
 */
export async function cancelColonyTask(taskId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('colony_tasks')
      .update({ status: 'cancelled' })
      .eq('id', taskId)
      .eq('status', 'pending')
      .select()
      .single();

    if (error) {
      console.error('Error cancelling Colony task:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Exception cancelling Colony task:', error);
    return false;
  }
}
