# 🐝 Colony OS Worker Bee System

> **⚠️ DEPLOYMENT NOTE**: Zyeuté now deploys with Vercel; Netlify artifacts and CLI are unsupported.  
> This document is retained for historical reference only.


Distributed task execution system for Zyeuté using Supabase queue and GitHub self-hosted runners.

## Architecture

```
Zyeuté App → Creates Task → Supabase Queue → Worker Bee Poller → Executes Task → Reports Status
```

## Components

### 1. **Supabase Task Queue** (`supabase/migrations/014_create_colony_tasks.sql`)
- Stores tasks in `colony_tasks` table
- Supports priority queuing
- Tracks execution status and results

### 2. **Worker Bee Poller** (`colony/queue/poller.js`)
- Polls Supabase for pending tasks
- Executes tasks via GitHub Actions or directly
- Updates task status and results

### 3. **Task Scripts** (`colony/bees/worker/tasks/`)
- Reusable task scripts
- Examples: `task-netlify-refresh.sh`, `task-clean-cache.sh`

### 4. **Zyeuté Integration** (`src/components/ColonyTriggerButton.tsx`)
- Admin UI for creating tasks
- Real-time task status monitoring

### 5. **GitHub Actions Workflow** (`.github/workflows/colony-worker-bee.yml`)
- Executes tasks on self-hosted runner
- Guardian safety checks
- Status reporting

## Setup

### 1. Run Migration
```sql
-- Apply migration in Supabase SQL Editor
-- File: supabase/migrations/014_create_colony_tasks.sql
```

### 2. Configure Environment Variables

**For Poller (self-hosted runner):**
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export GITHUB_TOKEN="your-github-token"  # Optional: for workflow dispatch
export GITHUB_REPO="brandonlacoste9-tech/Zyeute"
export WORKER_ID="worker-1"
export POLL_INTERVAL="5000"  # 5 seconds
export USE_WORKFLOW_DISPATCH="false"  # true to use GitHub Actions, false for direct execution
```

### 3. Start Poller
```bash
cd Zyeute-app
node colony/queue/poller.js
```

Or run as a service:
```bash
pm2 start colony/queue/poller.js --name colony-worker-bee
```

## Usage

### From Zyeuté UI (Admin Only)
1. Navigate to admin panel
2. Find "Colony Worker Bee Control" component
3. Enter command (e.g., `npm run build`, `task-netlify-refresh.sh`)
4. Select priority
5. Click "Send Task to Worker Bee"

### From Code
```typescript
import { createColonyTask } from '@/integrations/colony/zyeute-trigger';

await createColonyTask({
  command: 'npm run build',
  origin: 'Zyeute',
  priority: 'high'
});
```

### From GitHub Actions
```yaml
- uses: actions/github-script@v6
  with:
    script: |
      github.rest.actions.createWorkflowDispatch({
        owner: 'brandonlacoste9-tech',
        repo: 'Zyeute',
        workflow_id: 'colony-worker-bee.yml',
        ref: 'main',
        inputs: {
          task: 'npm run build',
          origin: 'GitHub Actions',
          priority: 'normal'
        }
      });
```

## Task Examples

### Build Zyeuté
```bash
npm run build
```

### Refresh Netlify
```bash
task-netlify-refresh.sh
```

### Clean Cache
```bash
task-clean-cache.sh
```

### Custom Script
```bash
echo "Hello from Colony OS"
```

## Monitoring

### View Tasks in Supabase
```sql
SELECT * FROM colony_tasks 
ORDER BY created_at DESC 
LIMIT 10;
```

### View Recent Tasks in Zyeuté UI
The ColonyTriggerButton component shows the 5 most recent tasks with their status.

## Security

- **Guardian Safety Checks**: Blocks dangerous commands (rm -rf, delete, format)
- **RLS Policies**: Only authenticated users can create tasks
- **Service Role**: Only service role can update task status (for worker bees)

## Troubleshooting

### Poller Not Finding Tasks
- Check Supabase connection (URL and service key)
- Verify `colony_tasks` table exists
- Check RLS policies allow service role to read/update

### Tasks Not Executing
- Check poller is running
- Verify task scripts are executable (`chmod +x`)
- Check GitHub Actions workflow if using workflow dispatch

### Tasks Failing
- Check task logs in Supabase (`result` and `error_message` columns)
- Verify environment variables are set
- Check script permissions

## Next Steps

- [ ] Add task retry logic
- [ ] Add task scheduling (cron-like)
- [ ] Add task dependencies
- [ ] Add task result webhooks
- [ ] Add task history dashboard

