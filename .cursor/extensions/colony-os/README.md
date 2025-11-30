# 🐝 Colony OS Kernel - Python Backend

**Distributed AI Operating System with Supabase Integration**

## Overview

The Colony OS Kernel manages Worker Bees (AI agents) and dispatches tasks to them. All task execution is now persisted to Supabase for long-term memory and tracking.

## Architecture

```
Task Request
    ↓
Foreman (dispatcher)
    ↓
1. Insert task into Supabase (status: 'pending')
    ↓
2. Route to Worker Bee (DocBee, CodeBee, etc.)
    ↓
3. Worker executes and updates Supabase (status: 'completed')
    ↓
Result returned
```

## Setup

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Set Environment Variables:**
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase service role key

## Usage

### Basic Example

```python
from app.kernel.foreman import Foreman
from app.kernel.bees.doc_bee import DocBee

# Initialize
foreman = Foreman()
doc_bee = DocBee()
foreman.register_worker("DocBee", doc_bee)

# Dispatch a task
task = {
    "type": "document_summary",
    "payload": {
        "text": "Your document text here...",
        "task_type": "summarize"
    },
    "priority": "high"
}

result = await foreman.dispatch(task)
```

### Task Lifecycle

1. **Task Created** → Inserted into `tasks` table with `status: 'pending'`
2. **Task Assigned** → Status updated to `'assigned'`
3. **Task In Progress** → Status updated to `'in_progress'`
4. **Task Completed** → Status updated to `'completed'` with `result` JSONB
5. **Task Failed** → Status updated to `'failed'` with `error` message

## Database Schema

The kernel uses three Supabase tables:

- **`agents`**: Worker Bee registry
- **`tasks`**: Task dispatch log (all tasks are persisted here)
- **`memories`**: Knowledge Graph / Long-Term Memory

See `COLONY_OS_KERNEL_INITIALIZED.md` for full schema details.

## Components

### `app/services/database.py`
- Supabase client initialization
- Singleton pattern for connection reuse

### `app/kernel/foreman.py`
- Task dispatcher
- Routes tasks to appropriate Worker Bees
- Persists tasks to Supabase before execution

### `app/kernel/bees/doc_bee.py`
- Document processing Worker Bee
- Updates task status in Supabase during execution
- Example implementation (replace with your AI logic)

## Next Steps

1. **Implement Other Bees:**
   - `code_bee.py` for code generation
   - `vision_bee.py` for image processing
   - `data_bee.py` for analytics

2. **Add AI Integration:**
   - Replace mock processing in `DocBee._process_document()` with actual AI calls
   - Use LiteLLM, OpenAI, or your preferred AI service

3. **Memory System:**
   - Store embeddings in `memories` table
   - Use `search_memories()` function for semantic retrieval

## Environment Variables

```bash
SUPABASE_URL=https://vuanulvyqkfefmjcikfk.supabase.co
SUPABASE_KEY=your-service-role-key
```

---

**The Kernel is now connected to Supabase!** 🎉

