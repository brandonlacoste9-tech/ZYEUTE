-- Colony OS Initial Migration
-- 
-- Sets up complete database schema with pgvector extension

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ═══════════════════════════════════════════════════════════════
-- TASKS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    priority VARCHAR(8) DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
    status VARCHAR(16) DEFAULT 'pending' CHECK (status IN ('pending','running','done','failed','cancelled')),
    
    -- Semantic classification (from Neurosphere)
    semantic_category TEXT,
    semantic_labels TEXT[] DEFAULT '{}',
    
    -- Assignment & leasing
    lease_id UUID,
    lease_expires_at TIMESTAMPTZ,
    attempts INT DEFAULT 0,
    assigned_to UUID,
    
    -- Results
    result JSONB,
    error TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_status_priority ON tasks(status, priority, created_at);
CREATE INDEX idx_tasks_semantic_category ON tasks(semantic_category);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_lease_expires ON tasks(lease_expires_at) WHERE lease_expires_at IS NOT NULL;

-- ═══════════════════════════════════════════════════════════════
-- AGENTS (BEE WORKERS)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(64) NOT NULL,  -- 'DocBee', 'CodeBee', 'VisionBee', etc.
    skills TEXT[] DEFAULT '{}',
    state JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agents_role ON agents(role);
CREATE INDEX idx_agents_active ON agents(active);

-- Foreign key for task assignment
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_assigned_agent 
    FOREIGN KEY (assigned_to) REFERENCES agents(id);

-- ═══════════════════════════════════════════════════════════════
-- MEMORIES (HONEYCOMB WITH PGVECTOR)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope VARCHAR(16) NOT NULL CHECK (scope IN ('task','agent','global')),
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    
    -- Orbital embedding from Neurosphere (512-dim)
    embedding vector(512),
    
    -- Relations
    task_id UUID REFERENCES tasks(id),
    agent_id UUID REFERENCES agents(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(scope, key)
);

CREATE INDEX idx_memories_scope ON memories(scope);
CREATE INDEX idx_memories_key ON memories(key);

-- Vector similarity index (IVFFlat for fast approximate search)
CREATE INDEX idx_memories_embedding ON memories 
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- ═══════════════════════════════════════════════════════════════
-- AGENT HEARTBEATS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE agent_heartbeats (
    id BIGSERIAL PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES agents(id),
    ts TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(16) DEFAULT 'ok'
);

CREATE INDEX idx_heartbeats_agent_ts ON agent_heartbeats(agent_id, ts);

-- ═══════════════════════════════════════════════════════════════
-- EVENTS (MESSAGE BUS PERSISTENCE)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    source VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_type_created ON events(type, created_at);

-- ═══════════════════════════════════════════════════════════════
-- SNAPSHOTS (IMMORTAL ARCHIVE)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(128) NOT NULL,
    merkle_root VARCHAR(128) NOT NULL,
    storage_url TEXT NOT NULL,  -- S3/MinIO URL
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_snapshots_created ON snapshots(created_at);

-- ═══════════════════════════════════════════════════════════════
-- APPROVAL REQUESTS (BADGE AUTH)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL,
    action TEXT NOT NULL,
    context JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    approved_by VARCHAR(100),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_approval_status_created ON approval_requests(status, created_at);

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA (INITIAL AGENTS)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO agents (id, role, skills, state) VALUES
    (gen_random_uuid(), 'DocBee', ARRAY['writing', 'documentation', 'summarization'], '{"version": "1.0"}'),
    (gen_random_uuid(), 'CodeBee', ARRAY['programming', 'testing', 'debugging'], '{"version": "1.0"}'),
    (gen_random_uuid(), 'VisionBee', ARRAY['image_analysis', 'ocr', 'video_processing'], '{"version": "1.0"}'),
    (gen_random_uuid(), 'MemoryBee', ARRAY['search', 'recall', 'indexing'], '{"version": "1.0"}'),
    (gen_random_uuid(), 'OpsBee', ARRAY['deployment', 'monitoring', 'infrastructure'], '{"version": "1.0"}'),
    (gen_random_uuid(), 'GeneralBee', ARRAY['general_purpose'], '{"version": "1.0"}');

-- ═══════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- Function to clean up expired leases
CREATE OR REPLACE FUNCTION cleanup_expired_leases()
RETURNS void AS $$
BEGIN
    UPDATE tasks
    SET 
        status = 'pending',
        lease_id = NULL,
        lease_expires_at = NULL,
        assigned_to = NULL
    WHERE 
        status = 'running'
        AND lease_expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get task statistics
CREATE OR REPLACE FUNCTION get_task_stats()
RETURNS TABLE(
    status VARCHAR(16),
    count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.status,
        COUNT(*)::BIGINT
    FROM tasks t
    GROUP BY t.status;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON agents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════
-- GRANTS (FOR APPLICATION USER)
-- ═══════════════════════════════════════════════════════════════

-- Assuming application connects as 'colony_app' user
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO colony_app;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO colony_app;

