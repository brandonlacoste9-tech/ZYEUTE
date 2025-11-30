# 🚀 Colony OS - Quick Start Guide

Get your AI Operating System running in 5 minutes!

## Prerequisites

- Python 3.8+
- Supabase account (project: **zyeuté**)
- Supabase service_role key

## Step 1: Setup Environment (2 minutes)

### Create `.env` file

**Option A: Use helper script**
```bash
cd colony-os
python create_env.py
```

**Option B: Create manually**
Create `colony-os/.env`:
```bash
SUPABASE_URL="https://vuanulvyqkfefmjcikfk.supabase.co"
SUPABASE_KEY="your-service-role-key-here"
```

**Get your service_role key:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Project: **zyeuté**
3. **Project Settings** > **API**
4. Copy **`service_role`** key (⚠️ not `anon` key)

## Step 2: Install Dependencies (1 minute)

```bash
cd colony-os
pip install -r requirements.txt
```

## Step 3: Test Connection (1 minute)

```bash
python example_usage.py
```

**Expected output:**
```
✅ Supabase client initialized
✅ Registered worker: DocBee
🚀 Dispatching task...
📝 Task persisted to DB: [uuid]
🔄 Task [uuid] status: in_progress
✅ Task [uuid] status: completed
✅ Task completed: {...}
```

## Step 4: Verify in Supabase (1 minute)

1. Go to **Supabase Dashboard** > **Table Editor** > **tasks**
2. You should see your task with:
   - `type`: "document_summary"
   - `status`: "completed"
   - `result`: JSON with processing result

## ✅ Success!

Your Colony OS Kernel is now:
- ✅ Connected to Supabase
- ✅ Persisting all tasks
- ✅ Tracking task lifecycle
- ✅ Ready for LLM integration

## Next: Run the Server

```bash
uvicorn app.main:app --reload --port 8000
```

Then connect your Zyeuté app to `http://localhost:8000`

---

**The Hive is alive and has memory!** 🐝🧠

