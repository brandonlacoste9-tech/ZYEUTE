# ✅ Colony OS Kernel - Verification Checklist

## Pre-Flight Checks

- [ ] `.env` file exists in `colony-os/` directory
- [ ] `SUPABASE_URL` is set correctly
- [ ] `SUPABASE_KEY` is set to your **service_role** key (not anon key)
- [ ] Dependencies installed: `pip install -r requirements.txt`

## Code Verification

### ✅ Database Service (`app/services/database.py`)
- [x] Uses `os.getenv("SUPABASE_URL")` and `os.getenv("SUPABASE_KEY")`
- [x] Singleton pattern for client reuse
- [x] Error handling for missing environment variables

### ✅ Foreman (`app/kernel/foreman.py`)
- [x] Imports `get_supabase_client` from database service
- [x] Inserts task into `tasks` table **before** calling worker
- [x] Sets `status: 'pending'` on insert
- [x] Updates to `status: 'assigned'` after routing
- [x] Passes `task_id` to worker's `execute()` method
- [x] Error handling updates task to `status: 'failed'`

### ✅ BaseBee (`app/kernel/bees/base.py`)
- [x] Abstract base class for all Worker Bees
- [x] Provides `update_task_status()` helper method
- [x] Integrates Supabase client

### ✅ DocBee (`app/kernel/bees/doc_bee.py`)
- [x] Extends `BaseBee` class
- [x] Accepts `task_id` parameter in `execute()` method
- [x] Updates task to `status: 'in_progress'` at start
- [x] Updates task to `status: 'completed'` with result at end
- [x] Updates task to `status: 'failed'` on error

## Testing Steps

### 1. Test Database Connection
```bash
cd colony-os
python -c "from app.services.database import get_supabase_client; client = get_supabase_client(); print('✅ Connected!')"
```

### 2. Test Task Dispatch
```bash
python example_usage.py
```

Expected output:
```
✅ Supabase client initialized
✅ Registered worker: DocBee
🚀 Dispatching task...
📝 Task persisted to DB: [uuid] (type: document_summary)
🔄 Task [uuid] status: in_progress
✅ Task [uuid] status: completed
✅ Task completed: {...}
```

### 3. Verify in Supabase Dashboard

1. Go to **Table Editor** > **tasks**
2. You should see a new row with:
   - `type`: "document_summary"
   - `status`: "completed"
   - `payload`: JSON with your input
   - `result`: JSON with the processing result
   - `created_at`: Timestamp
   - `updated_at`: Timestamp
   - `completed_at`: Timestamp

### 4. Test Persistence (Memory Test)

1. **Dispatch a task** (creates row in database)
2. **Restart your server**
3. **Check Supabase** - the task should still be there!
4. ✅ **Amnesia cured!** The Hive remembers.

## Common Issues

### ❌ "SUPABASE_URL environment variable is not set"
- **Fix:** Make sure `.env` file exists and `SUPABASE_URL` is set
- **Fix:** Load environment variables: `python-dotenv` should load `.env` automatically

### ❌ "Failed to create task record in database"
- **Fix:** Check that `SUPABASE_KEY` is the **service_role** key (not anon key)
- **Fix:** Verify RLS policies allow service_role to insert

### ❌ Task status stuck at "pending"
- **Fix:** Check that worker's `execute()` method is being called
- **Fix:** Verify worker updates task status in Supabase

## Success Indicators

✅ Tasks appear in Supabase `tasks` table  
✅ Task status progresses: `pending` → `assigned` → `in_progress` → `completed`  
✅ Results are stored in `result` JSONB column  
✅ Tasks persist after server restart  
✅ Error messages are captured in `error` column  

---

**Once all checks pass, your Colony OS Kernel has full memory!** 🧠🐝

