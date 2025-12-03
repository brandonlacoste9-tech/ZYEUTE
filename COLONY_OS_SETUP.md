# 🐝 Colony OS Worker Bee - Quick Setup Guide

## ✅ What's Been Created

1. **Supabase Task Queue** (`supabase/migrations/014_create_colony_tasks.sql`)
   - Database table for task queue
   - Priority-based task execution
   - Status tracking

2. **Worker Bee Poller** (`colony/queue/poller.js`)
   - Polls Supabase for tasks
   - Executes tasks on self-hosted runner

3. **Task Scripts** (`colony/bees/worker/tasks/`)
   - `task-netlify-refresh.sh` - Refresh Netlify build
   - `task-clean-cache.sh` - Clean build cache
   - `task-example.sh` - Template for new tasks

4. **Zyeuté UI Component** (`src/components/ColonyTriggerButton.tsx`)
   - Admin-only task trigger button
   - Real-time task status

5. **GitHub Actions Workflow** (`.github/workflows/colony-worker-bee.yml`)
   - Executes tasks via workflow dispatch
   - Guardian safety checks

## 🚀 Quick Start

### Step 1: Apply Database Migration

Go to Supabase Dashboard → SQL Editor → Run:
```sql
-- Copy contents of: supabase/migrations/014_create_colony_tasks.sql
```

### Step 2: Add Component to Admin Page

Add to your admin/moderation page:
```tsx
import { ColonyTriggerButton } from '@/components/ColonyTriggerButton';

// In your admin page component:
<ColonyTriggerButton />
```

### Step 3: Start Worker Bee Poller (Optional)

If you want direct execution (not via GitHub Actions):

```bash
# Set environment variables
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export WORKER_ID="worker-1"
export POLL_INTERVAL="5000"

# Start poller
node colony/queue/poller.js
```

### Step 4: Test It!

1. Go to admin page in Zyeuté
2. Find "Colony Worker Bee Control"
3. Enter command: `npm run build`
4. Click "Send Task to Worker Bee"
5. Check task status in the UI

## 📋 Example Tasks

### Build Zyeuté
```
npm run build
```

### Refresh Netlify
```
task-netlify-refresh.sh
```

### Clean Cache
```
task-clean-cache.sh
```

### Custom Command
```
echo "Hello from Colony OS"
```

## 🔧 Configuration

### Environment Variables (for poller)

```bash
SUPABASE_URL              # Your Supabase project URL
SUPABASE_SERVICE_ROLE_KEY # Service role key (from Supabase dashboard)
GITHUB_TOKEN              # Optional: GitHub token for workflow dispatch
GITHUB_REPO               # Optional: "owner/repo" format
WORKER_ID                 # Unique worker identifier
POLL_INTERVAL             # Poll interval in ms (default: 5000)
USE_WORKFLOW_DISPATCH     # "true" for GitHub Actions, "false" for direct
```

## 🎯 How It Works

1. **Create Task**: Zyeuté UI or code creates task in Supabase
2. **Queue**: Task stored in `colony_tasks` table with status "pending"
3. **Poll**: Worker Bee poller checks for pending tasks
4. **Execute**: Task executed via GitHub Actions or directly
5. **Update**: Status updated to "done" or "error" with results

## 🔒 Security

- **Guardian Safety Checks**: Blocks dangerous commands
- **RLS Policies**: Only authenticated users can create tasks
- **Admin Only**: UI component only visible to admins

## 📊 Monitoring

View tasks in Supabase:
```sql
SELECT * FROM colony_tasks 
ORDER BY created_at DESC 
LIMIT 10;
```

Or use the Zyeuté UI component which shows recent tasks.

## 🐛 Troubleshooting

### Tasks Not Appearing
- Check Supabase migration was applied
- Verify RLS policies allow inserts

### Tasks Not Executing
- Check poller is running (if using direct execution)
- Verify GitHub Actions workflow exists
- Check task scripts have execute permissions

### Tasks Failing
- Check `error_message` column in Supabase
- Verify environment variables are set
- Check script paths are correct

## 🎉 Next Steps

- [ ] Add ColonyTriggerButton to admin page
- [ ] Apply Supabase migration
- [ ] Test creating a task
- [ ] Set up poller (optional)
- [ ] Create custom task scripts

---

**Status:** ✅ Ready to use  
**Created:** After Colony OS integration  
**Documentation:** See `colony/README.md` for full details

