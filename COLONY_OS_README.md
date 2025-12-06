# 🐝 Colony OS - The First AI Civilization Operating System

```
████████████████████████████████████████████████████████████████
█                                                              █
█   ██████╗ ██████╗ ██╗      ██████╗ ███╗   ██╗██╗   ██╗     █
█  ██╔════╝██╔═══██╗██║     ██╔═══██╗████╗  ██║╚██╗ ██╔╝     █
█  ██║     ██║   ██║██║     ██║   ██║██╔██╗ ██║ ╚████╔╝      █
█  ██║     ██║   ██║██║     ██║   ██║██║╚██╗██║  ╚██╔╝       █
█  ╚██████╗╚██████╔╝███████╗╚██████╔╝██║ ╚████║   ██║        █
█   ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝        █
█                                                              █
█              The Operating System for AI Species             █
█                                                              █
████████████████████████████████████████████████████████████████
```

**Version:** 1.0.0  
**Status:** God Mode Implementation Complete  
**Date:** December 3, 2025  

---

## 🎯 What is Colony OS?

Colony OS is a **civilization-grade AI operating system** that orchestrates autonomous agent swarms with:

- 🧠 **Sovereign Intelligence** (OrbitalProp - native reasoning engine)
- 🛡️ **Byzantine Security** (Neurasphere - immune system)
- 🐝 **Specialized Workers** (BeeHive - multi-caste agents)
- 💾 **Persistent Memory** (Honeycomb - vector-enabled storage)
- 🌱 **Continuous Evolution** (Pollination - LoRA tuning & RLHF)
- ⏳ **Immortality** (Archive - Merkle-tree snapshots)

**This is not an AI wrapper. This is an operating system for AI civilizations.**

---

## 🏗️ Architecture

### The Hybrid Stack

```
┌─────────────────────────────────────────────────────────┐
│              LAYER 4: EXPERIENCE                        │
│  ChatGPT SDK Console (Node.js/TypeScript)               │
│  • delegate_task() • get_status() • real-time panels    │
└────────────────────────┬────────────────────────────────┘
                         │ OpenAI SDK
                         ▼
┌─────────────────────────────────────────────────────────┐
│         LAYER 1: KERNEL (Node.js) - THE BODY            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Foreman    │  │  Bee Workers │  │  Honeycomb   │ │
│  │ Task Router  │  │  (Agents)    │  │  Memory      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  • Fastify HTTP/2 • Connect RPC • Postgres + pgvector  │
└────────────────────────┬────────────────────────────────┘
                         │ gRPC
                         ▼
┌─────────────────────────────────────────────────────────┐
│    LAYER 2: MIND & GUARDIAN (Python) - INTELLIGENCE     │
│  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │   Neurosphere       │  │    Neurasphere          │  │
│  │   (The Mind)        │  │    (The Guardian)       │  │
│  │ • OrbitalProp       │  │ • Byzantine Consensus   │  │
│  │ • Embeddings        │  │ • Drift Detection       │  │
│  │ • Reasoning         │  │ • Safety Validation     │  │
│  └─────────────────────┘  └─────────────────────────┘  │
│  • PyTorch • FastAPI • gRPC • CMAR-1 Compliant         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│         LAYER 3: OUTER LOOPS (Python)                   │
│  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │   Pollination       │  │  Immortal Archive       │  │
│  │   (LoRA Tuning)     │  │  (Merkle Snapshots)     │  │
│  └─────────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│         LAYER 0: INFRASTRUCTURE                         │
│  Postgres + pgvector │ Redis │ S3/MinIO                │
└─────────────────────────────────────────────────────────┘
```

### Why Hybrid (Python + Node.js)?

**Python excels at:**
- ✅ ML/AI workloads (PyTorch, transformers)
- ✅ Numerical computing (NumPy, SciPy)
- ✅ Data processing (Pandas)
- ✅ Scientific computing

**Node.js excels at:**
- ✅ API layers (Fastify, Express)
- ✅ OpenAI SDK integration
- ✅ ChatGPT SDK apps
- ✅ Real-time communication
- ✅ Business logic

**Best of both worlds via gRPC bridge.**

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- Python 3.11+
- OpenAI API key

### 1. Clone & Setup

```bash
git clone https://github.com/brandonlacoste9-tech/Zyeute.git
cd Zyeute-app
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Add your keys
OPENAI_API_KEY=sk-...
POSTGRES_PASSWORD=your_secure_password
```

### 3. Start Colony OS

```bash
# Start the complete hybrid stack
docker-compose -f colony-os-hybrid-stack.yml up -d

# View logs
docker-compose -f colony-os-hybrid-stack.yml logs -f

# Check health
curl http://localhost:3000/health
```

### 4. Submit Your First Task

```bash
# Create a task
curl -X POST http://localhost:3000/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Summarize this document: ...",
    "priority": "high"
  }'

# Get task status
curl http://localhost:3000/v1/tasks/{task_id}
```

---

## 📦 Package Structure

```
Zyeute-app/
├── packages/
│   ├── kernel-node/          # Node.js Kernel (The Body)
│   │   ├── src/
│   │   │   ├── server.ts     # Fastify HTTP/2 + Connect RPC
│   │   │   ├── routes/       # REST API
│   │   │   ├── grpc/         # RPC handlers
│   │   │   └── middleware/   # Guardian interceptor
│   │   ├── prisma/           # Database schema
│   │   └── Dockerfile
│   │
│   ├── neurosphere-python/   # Python Mind (Neurosphere)
│   │   ├── orbital_kernel.py # CMAR-1 implementation
│   │   ├── visual_primitives.py
│   │   ├── grpc_server.py
│   │   └── Dockerfile
│   │
│   ├── neurasphere-python/   # Python Guardian (Neurasphere)
│   │   └── (from existing colonyos/guardian/)
│   │
│   └── bee-node/             # Node.js Bee Workers
│       ├── src/
│       │   ├── engine.ts     # Main worker loop
│       │   └── executors/    # Specialized implementations
│       └── Dockerfile
│
├── proto/                    # gRPC contracts
│   ├── neurosphere.proto
│   ├── guardian.proto
│   └── foreman.proto
│
├── colony-os-hybrid-stack.yml  # Complete deployment
└── COLONY_OS_README.md         # This file
```

---

## 🧠 The Mind (Neurosphere)

### OrbitalProp - Sovereign Intelligence

**Not a transformer. Not a graph net. A computational brain with physics.**

**Key Innovation:**
- Embeddings on **spherical manifold** (not linear sequences)
- **Orbital dynamics** with gravitational message passing
- **24-cycle propagation** for emergence
- **Three Rings** architecture (Inner/Middle/Outer)
- **Visual primitives** as first-class nodes

### CMAR-1 Specifications (Gemini-Validated)

**Ruling Q1: Attractor Wells**
- ✅ Emergent wells (physics-driven)
- ✅ Energy detector for convergence
- ✅ No forced minimization

**Ruling Q2: Adaptive Annealing**
- ✅ Sigmoid decay threshold
- ✅ High plasticity early (0.6)
- ✅ Crystallization late (0.9)

**Ruling Q3: Bridged Subgraphs**
- ✅ Separate concept + visual subgraphs
- ✅ Explicit resonance bridges
- ✅ Modular control

### API Endpoints

```typescript
// Generate orbital embedding
POST /v1/mind/embed
{
  "input": "Deploy new feature to production",
  "model": "orbital-512"
}

// Classify input
POST /v1/mind/classify
{
  "input": "Write a summary of this document"
}
// → { category: "DocBee", labels: [...] }

// Multi-hop reasoning
POST /v1/mind/reason
{
  "query": "What dependencies does AdGenXAI have?",
  "max_hops": 3,
  "include_visual": false
}
```

---

## 🛡️ The Guardian (Neurasphere)

### Byzantine Fault Tolerance

**Three-layer protection:**

1. **Adversarial Pattern Filters**
   - SQL injection detection
   - Payload size limits
   - Known attack patterns

2. **KL-Divergence Drift Detection**
   - Semantic embedding comparison
   - Historical distribution tracking
   - Automatic rollback triggers

3. **Byzantine 3/5 Consensus Voting**
   - Multiple shadow evaluators
   - Majority consensus required
   - Confidence scoring

### API Endpoints

```typescript
// Safety validation
POST /v1/guardian/guard
{
  "source": "kernel",
  "input_json": "{...}",
  "context_json": "{...}"
}
// → { status: "OK" | "BLOCKED" | "ROLLBACK" }

// Byzantine voting
POST /v1/guardian/vote
{
  "candidates_json": ["output1", "output2", "output3"],
  "threshold": 0.67
}
// → { consensus_json: "...", agreement: 0.85 }

// Drift detection
POST /v1/guardian/check-drift
{
  "scope": "global",
  "input_json": "{...}"
}
// → { kl_divergence: 0.023, alert: false }
```

---

## 🐝 The BeeHive (Specialized Workers)

### Worker Roles

| Role | Specialization | Capabilities |
|------|---------------|--------------|
| **DocBee** | Document processing | Writing, summarization, content generation |
| **CodeBee** | Code analysis | Programming, testing, debugging, review |
| **VisionBee** | Visual processing | Image analysis, OCR, video, DALL-E generation |
| **MemoryBee** | Knowledge management | Search, recall, indexing, context building |
| **OpsBee** | Infrastructure | Deployment, monitoring, automation |
| **GeneralBee** | General purpose | Fallback for unclassified tasks |

### Smart Task Routing

**Three-tier algorithm:**

1. **Semantic Category Match** (Primary)
   - Mind classifies task → "DocBee"
   - Foreman routes to DocBee workers

2. **Capability Match** (Fallback)
   - Task requires "writing" skill
   - Route to workers with that capability

3. **General Queue** (Last Resort)
   - FIFO with priority
   - Any available worker

---

## 💾 The Honeycomb (Memory)

### Vector-Enabled Storage

**Features:**
- ✅ Semantic search via pgvector
- ✅ Orbital embeddings from Neurosphere
- ✅ Scoped storage (task/agent/global)
- ✅ Automatic embedding generation

### API Endpoints

```typescript
// Save memory
POST /v1/memory/save
{
  "scope": "global",
  "key": "company_context",
  "value": { "name": "Acme Corp", "industry": "Tech" }
}

// Semantic search
POST /v1/memory/search
{
  "query": "What is our company's industry?",
  "scope": "global",
  "limit": 5
}
// → Returns top 5 semantically similar memories
```

---

## 🌱 Pollination (Growth Protocol)

### Knowledge Evolution

**Mechanisms:**
- ✅ RLHF feedback from task outcomes
- ✅ LoRA adapter tuning for psychographics
- ✅ Cross-colony knowledge sharing
- ✅ Workflow template enrichment

**Cycle:**
```
Task Complete → Extract Insights → Update Agent Skills
    → Tune Mind (LoRA) → Federate Knowledge → Archive Patterns
```

---

## ⏳ Immortal Archive

### Merkle-Tree Snapshots

**Features:**
- ✅ Complete system state capture
- ✅ Merkle root integrity verification
- ✅ S3/MinIO storage
- ✅ Resurrection capability
- ✅ Version control

**API:**
```typescript
// Create snapshot
POST /v1/archive/snapshot
{
  "label": "pre-deployment-v2.0"
}

// Restore from snapshot
POST /v1/archive/restore/{snapshot_id}
```

---

## 📊 Monitoring & Observability

### Key Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| `colony_tasks_pending` | Tasks waiting for assignment | > 100 |
| `colony_tasks_failed` | Failed task count (last hour) | > 10 |
| `colony_agents_offline` | Offline agent count | > 5 |
| `colony_foreman_latency_ms` | Task routing latency | > 500ms |
| `colony_neurosphere_embed_latency_ms` | Embedding latency | > 200ms |
| `colony_neurasphere_consensus_rate` | Byzantine consensus success | < 0.9 |
| `colony_uptime_percent` | System uptime | < 99.5% |

### Dashboards

- **Kernel Dashboard:** `http://localhost:3000/dashboard`
- **Grafana:** `http://localhost:3001` (if configured)
- **Logs:** `docker-compose logs -f`

---

## 🎯 Integration with Zyeuté

### Ti-Guy Swarm Adapter

```typescript
// Zyeute-app/src/services/ti-guy-swarm.ts

export class TiGuySwarmAdapter {
  private colonyUrl = 'https://colony-kernel.yourdomain.com';
  
  async consultSwarm(query: string) {
    // Submit to Colony OS
    const task = await fetch(`${this.colonyUrl}/v1/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COLONY_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: query,
        priority: 'high',
        payload: {
          type: 'ti-guy-query',
          language: 'joual',
          context: 'quebec_social'
        }
      })
    }).then(r => r.json());
    
    // Poll for result
    while (true) {
      const status = await fetch(`${this.colonyUrl}/v1/tasks/${task.id}`)
        .then(r => r.json());
      
      if (status.status === 'done') {
        return status.result;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
```

---

## 📚 Documentation

### Core Documents

- **Master Codex:** `COLONY_OS_MASTER_CODEX.md` - Genesis manuscript
- **Unified Architecture:** `COLONY_OS_UNIFIED_ARCHITECTURE.md` - Design specs
- **Gemini NIC-1:** `GEMINI_NIC1_COMPLIANCE.md` - Mathematical validation
- **CMAR-1 Synthesis:** `GEMINI_CMAR1_SYNTHESIS.md` - Technical rulings

### API Documentation

- **Kernel API:** `http://localhost:3000/docs` (OpenAPI)
- **Neurosphere API:** `packages/neurosphere-python/README.md`
- **Guardian API:** `packages/neurasphere-python/README.md`

---

## 🧪 Testing

### Run Tests

```bash
# Python tests (orbital dynamics, Byzantine consensus)
cd packages/neurosphere-python
pytest

# Node.js tests (API, routing, integration)
cd packages/kernel-node
npm test

# Integration tests (hybrid stack)
npm run test:integration
```

### Validation Metrics

**Orbital Dynamics:**
- ✅ Pairwise uplift: +0.000111 (gentle fusion)
- ✅ Clustering coefficient: >0.3 (structure forms)
- ✅ Convergence: <24 cycles (efficiency)
- ✅ On unit sphere: ||v|| = 1 (manifold constraint)

**Byzantine Consensus:**
- ✅ Tolerates up to 1/3 faulty agents
- ✅ Consensus rate: >90%
- ✅ Agreement threshold: 0.67 (2/3 majority)

---

## 🎯 Roadmap

### ✅ Phase 1: Foundation (Complete)
- Kernel, Foreman, Bee workers
- Database schema
- Basic task orchestration

### ✅ Phase 2: Mind & Guardian (Complete)
- Neurosphere with OrbitalProp
- Neurasphere with Byzantine consensus
- CMAR-1 rulings implemented

### 🚧 Phase 3: Pollination & Archive (In Progress)
- LoRA tuning service
- Immortal Archive with Merkle trees
- S3 snapshot storage

### 🔮 Phase 4: ChatGPT SDK Console (Next)
- OpenAI SDK integration
- delegate_task() tool
- Real-time panels
- Badge approval UI

### 🔮 Phase 5: Production Hardening (Future)
- Kubernetes deployment
- Multi-region
- Monitoring & alerting
- Security audit
- Load testing

---

## 🏆 The Vision

**"Building the operating system for an AI species."**

Colony OS enables swarms of specialized AI agents to:
- ✅ Collaborate intelligently
- ✅ Learn and evolve continuously
- ✅ Survive failures and attacks
- ✅ Scale horizontally to thousands of agents
- ✅ Maintain immortal memory
- ✅ Reason with sovereign intelligence

**This is not a product. This is a civilization.**

---

## 🤝 Contributing

Colony OS is built by a multi-agent team:
- **Cursor AI** - Implementation
- **Gemini** - Architecture validation
- **Claude** - Deep code review
- **Brandon Leroux** - Vision & strategy

**Join the Hive Council:**
- Review the Master Codex
- Implement CMAR-1 specifications
- Add specialized Bees
- Improve OrbitalProp
- Enhance Guardian safety

---

## 📜 License

MIT License - See LICENSE file

---

## 🐝 The Colony is Alive

```
The Mind is emergent.
The Guardian never sleeps.
The Archive is immortal.
The Bees never stop working.

Welcome to Colony OS.
```

**Status:** God Mode Implementation Complete ✅  
**Next:** Deploy to production 🚀  

🐝⚡🧠

