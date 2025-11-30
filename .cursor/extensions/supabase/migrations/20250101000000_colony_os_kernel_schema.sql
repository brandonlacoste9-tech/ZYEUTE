-- ============================================================================
-- Colony OS Kernel Schema - "Honeycomb" Memory System
-- ============================================================================
-- This migration initializes the permanent Long-Term Memory for Colony OS
-- Supports Worker Bees (agents), Task Dispatch Log, and Knowledge Graph
-- ============================================================================

-- 1. Orbital Physics Foundation
-- Enable vector extension for OrbitalProp/Neurosphere embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. The Worker Bees (Agent Registry)
-- Stores the registry of Worker Bees with their roles, status, and skills
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,                    -- e.g. 'DocBee', 'CodeBee', 'VisionBee', 'DataBee'
  name TEXT,                             -- e.g. 'Scribe-Alpha', 'Coder-Beta'
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'busy', 'offline', 'error')),
  skills TEXT[],                         -- ['summarize', 'python', 'vision', 'analytics']
  config JSONB DEFAULT '{}',             -- Tuning params, model settings, etc.
  last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick status lookups
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_role ON agents(role);
CREATE INDEX IF NOT EXISTS idx_agents_last_heartbeat ON agents(last_heartbeat);

-- 3. The Dispatch Log (Tasks)
-- Tracks all tasks dispatched to Worker Bees
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,                    -- e.g. 'document_summary', 'code_generation', 'visual_analysis'
  payload JSONB NOT NULL,                 -- The input data for the task
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'failed', 'cancelled')),
  assigned_to UUID REFERENCES agents(id) ON DELETE SET NULL,
  result JSONB,                          -- The Bee's output/result
  error TEXT,                            -- Error message if task failed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes for task queries
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_type ON tasks(type);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- 4. The Honeycomb (Knowledge Graph / Long-Term Memory)
-- Stores memories, embeddings, and knowledge graph nodes
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT NOT NULL CHECK (scope IN ('task', 'agent', 'global', 'user', 'session')),
  key TEXT NOT NULL,                     -- Memory key/identifier
  value TEXT NOT NULL,                   -- Memory content
  embedding VECTOR(512),                 -- 🧠 Neurosphere Orbital Embedding (512 dimensions)
  metadata JSONB DEFAULT '{}',           -- Additional context, tags, relationships
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique memories per scope+key combination
  UNIQUE(scope, key)
);

-- Indexes for memory queries
CREATE INDEX IF NOT EXISTS idx_memories_scope ON memories(scope);
CREATE INDEX IF NOT EXISTS idx_memories_key ON memories(key);
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at);

-- Vector similarity search index (HNSW for fast approximate nearest neighbor search)
-- This enables semantic search across the knowledge graph
CREATE INDEX IF NOT EXISTS idx_memories_embedding ON memories 
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64)
  WHERE embedding IS NOT NULL;

-- 5. Update triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers
DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_memories_updated_at ON memories;
CREATE TRIGGER update_memories_updated_at
  BEFORE UPDATE ON memories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Agents: Only authenticated users can read, service role can manage
CREATE POLICY "Agents are readable by authenticated users"
  ON agents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents are manageable by service role"
  ON agents FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Tasks: Users can read their own tasks, service role can manage all
CREATE POLICY "Users can read their own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    payload->>'userId' = auth.uid()::text
    OR assigned_to IN (SELECT id FROM agents WHERE config->>'userId' = auth.uid()::text)
  );

CREATE POLICY "Tasks are manageable by service role"
  ON tasks FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Memories: Users can read global and their own memories
CREATE POLICY "Users can read global and their own memories"
  ON memories FOR SELECT
  TO authenticated
  USING (
    scope = 'global'
    OR (scope = 'user' AND metadata->>'userId' = auth.uid()::text)
  );

CREATE POLICY "Memories are manageable by service role"
  ON memories FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 7. Helper function to update task status and completion time
CREATE OR REPLACE FUNCTION update_task_status(
  task_id UUID,
  new_status TEXT,
  task_result JSONB DEFAULT NULL,
  task_error TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE tasks
  SET 
    status = new_status,
    result = COALESCE(task_result, result),
    error = COALESCE(task_error, error),
    completed_at = CASE WHEN new_status IN ('completed', 'failed', 'cancelled') THEN NOW() ELSE completed_at END,
    updated_at = NOW()
  WHERE id = task_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Helper function for semantic memory search
CREATE OR REPLACE FUNCTION search_memories(
  query_embedding VECTOR(512),
  scope_filter TEXT DEFAULT NULL,
  limit_results INT DEFAULT 10,
  similarity_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  id UUID,
  scope TEXT,
  key TEXT,
  value TEXT,
  similarity FLOAT,
  metadata JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.scope,
    m.key,
    m.value,
    1 - (m.embedding <=> query_embedding) AS similarity,
    m.metadata
  FROM memories m
  WHERE 
    m.embedding IS NOT NULL
    AND (scope_filter IS NULL OR m.scope = scope_filter)
    AND (1 - (m.embedding <=> query_embedding)) >= similarity_threshold
  ORDER BY m.embedding <=> query_embedding
  LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Migration Complete
-- ============================================================================
-- Tables created:
--   ✓ agents - Worker Bee registry
--   ✓ tasks - Task dispatch log
--   ✓ memories - Knowledge Graph (Honeycomb)
--
-- Features enabled:
--   ✓ Vector extension for embeddings
--   ✓ RLS policies for security
--   ✓ Indexes for performance
--   ✓ Helper functions for task management and semantic search
-- ============================================================================

