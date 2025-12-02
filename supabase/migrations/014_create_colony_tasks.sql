-- ============================================
-- Colony OS Task Queue
-- Enables distributed task execution via Worker Bees
-- ============================================

-- Create colony_tasks table
CREATE TABLE IF NOT EXISTS colony_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'done', 'error', 'cancelled')),
  origin TEXT NOT NULL, -- e.g., 'Zyeute', 'Neurosphere', 'Cursor', 'Admin'
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  command TEXT NOT NULL, -- The actual command/script to execute
  result TEXT, -- stdout/stderr output
  error_message TEXT, -- Error details if failed
  executed_at TIMESTAMPTZ,
  executed_by TEXT, -- Worker bee identifier
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional context
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3
);

-- Create index for efficient polling
CREATE INDEX IF NOT EXISTS idx_colony_tasks_status_created ON colony_tasks(status, created_at);
CREATE INDEX IF NOT EXISTS idx_colony_tasks_priority_status ON colony_tasks(priority DESC, status, created_at);

-- Enable RLS
ALTER TABLE colony_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read tasks (for monitoring)
CREATE POLICY "Anyone can read colony tasks"
  ON colony_tasks FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert tasks
CREATE POLICY "Authenticated users can create tasks"
  ON colony_tasks FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Service role can update tasks (for worker bees)
CREATE POLICY "Service role can update tasks"
  ON colony_tasks FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_colony_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_colony_tasks_timestamp
  BEFORE UPDATE ON colony_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_colony_tasks_updated_at();

-- Function to get next pending task (for worker bees)
CREATE OR REPLACE FUNCTION get_next_colony_task(worker_id TEXT DEFAULT 'worker-1')
RETURNS TABLE (
  id UUID,
  command TEXT,
  origin TEXT,
  priority TEXT
) AS $$
DECLARE
  task_id UUID;
BEGIN
  -- Lock and fetch the next pending task (ordered by priority, then created_at)
  SELECT colony_tasks.id INTO task_id
  FROM colony_tasks
  WHERE status = 'pending'
  ORDER BY 
    CASE priority
      WHEN 'critical' THEN 1
      WHEN 'high' THEN 2
      WHEN 'normal' THEN 3
      WHEN 'low' THEN 4
    END,
    created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  -- If task found, mark it as running
  IF task_id IS NOT NULL THEN
    UPDATE colony_tasks
    SET 
      status = 'running',
      executed_by = worker_id,
      updated_at = NOW()
    WHERE colony_tasks.id = task_id;

    -- Return the task
    RETURN QUERY
    SELECT 
      colony_tasks.id,
      colony_tasks.command,
      colony_tasks.origin,
      colony_tasks.priority
    FROM colony_tasks
    WHERE colony_tasks.id = task_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON colony_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE ON colony_tasks TO service_role;
GRANT EXECUTE ON FUNCTION get_next_colony_task TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_colony_task TO service_role;

-- Add helpful comments
COMMENT ON TABLE colony_tasks IS 'Colony OS distributed task queue for Worker Bee execution';
COMMENT ON COLUMN colony_tasks.origin IS 'Source of the task: Zyeute, Neurosphere, Cursor, Admin, etc.';
COMMENT ON COLUMN colony_tasks.command IS 'Command or script path to execute';
COMMENT ON COLUMN colony_tasks.metadata IS 'Additional context: environment, user_id, etc.';

