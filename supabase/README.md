# 🗄️ Supabase Configuration & Migrations

This directory contains all Supabase-related configuration files and database migrations for the Zyeuté project.

---

## 📁 Directory Structure

```
supabase/
├── config.toml              # Supabase project configuration and branching setup
├── migrations/              # Database migration SQL files
│   ├── 001_moderation_system.sql
│   ├── 002_achievements.sql
│   ├── 003_creator_subscriptions.sql
│   ├── 004_live_streaming.sql
│   ├── 005_daily_challenges.sql
│   ├── 006_marketplace.sql
│   └── 007_email_system.sql
└── README.md                # This file
```

---

## ⚙️ Configuration File

### `config.toml`

This file contains:
- **Project settings**: Database port, API settings, authentication config
- **Branching configuration**: Preview branch setup for isolated environments
- **Local development settings**: Studio, Inbucket, Storage configurations

Key configuration sections:
- `[api]`: API endpoint settings
- `[db]`: Database connection settings
- `[auth]`: Authentication and redirect URL configuration
- `[branching]`: Preview branch setup for `dev-preview-main`

---

## 🗄️ Database Migrations

Migrations are SQL files that define the database schema. They must be run in order.

### Migration Files

1. **001_moderation_system.sql**
   - Content reporting and moderation features
   - Tables: `content_reports`, `content_reviews`, `moderation_actions`

2. **002_achievements.sql**
   - Gamification achievements system
   - Tables: `achievements`, `user_achievements`

3. **003_creator_subscriptions.sql**
   - Creator subscription and payout system
   - Tables: `creator_subscriptions`, `subscription_tiers`, `creator_payouts`, `exclusive_content`

4. **004_live_streaming.sql**
   - Live streaming functionality
   - Tables: `live_streams`, `stream_viewers`

5. **005_daily_challenges.sql**
   - Daily challenge system
   - Tables: `daily_challenges`, `user_challenges`

6. **006_marketplace.sql**
   - E-commerce marketplace
   - Tables: `marketplace_products`, `marketplace_orders`, `marketplace_reviews`

7. **007_email_system.sql**
   - Email campaign management
   - Tables: `email_campaigns`, `email_preferences`

8. **007_fix_rls_001_critical.sql**
   - Critical RLS (Row Level Security) fixes
   - Security patches for existing tables

9. **20250102000000_fix_table_names.sql**
   - Table name corrections and standardization
   - Schema consistency improvements

10. **20250102000001_fix_posts_view_joins.sql**
    - Post view query optimizations
    - Join performance improvements

11. **20251201224600_setup_preview_branches.sql** ⭐ NEW
    - Preview branch metadata tracking
    - Tables: `preview_branch_metadata`
    - Functions: `get_preview_branch_config()`
    - Enables Supabase preview branch support for isolated testing environments

### Running Migrations

#### Production Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Run each migration file in order (001, 002, 003, etc.)
5. Verify success before running the next migration

#### Preview Branch Database

Using Supabase CLI:

```bash
# Switch to preview branch
supabase db branch switch dev-preview-main

# Run migrations
supabase db push

# Verify migrations
supabase db diff
```

---

## 🌿 Preview Branches

The `config.toml` file includes configuration for the `dev-preview-main` Supabase branch.

### What is a Preview Branch?

A preview branch is an isolated database environment that allows you to:
- Test schema changes without affecting production
- Develop features with realistic data structures
- Run preview deployments with isolated databases
- Safely experiment with database changes

### Preview Branch Setup

#### Quick Setup

```bash
npm run setup:preview-branch
```

#### Manual Setup

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link project
supabase link --project-ref your-project-id

# 4. Create preview branch
supabase branches create dev-preview-main

# 5. Get connection details
supabase branches get dev-preview-main
```

### Branch Configuration

In `config.toml`, the preview branch is configured as:

```toml
[branching.preview]
git_branch = "main"
supabase_branch = "dev-preview-main"
description = "Isolated Supabase branch for main branch preview deployments"
auto_create = true
reset_on_deploy = false
preserve_data = true
```

This means:
- Git branch `main` is associated with Supabase branch `dev-preview-main`
- Preview deployments use this isolated database
- Data is preserved between deployments
- Branch is automatically created if it doesn't exist

### Preview Branch Metadata Tracking

The migration `20251201224600_setup_preview_branches.sql` creates infrastructure to track preview branch configurations:

- **`preview_branch_metadata` table**: Stores information about configured preview branches
- **`get_preview_branch_config()` function**: Retrieves preview branch configuration for a given Git branch
- **Row Level Security (RLS)**: Ensures secure access to preview branch metadata

This allows the application to programmatically determine which Supabase branch to use based on the current Git branch or deployment environment.

---

## 🔧 Local Development

### Setup Local Supabase

If you want to run Supabase locally:

```bash
# Start local Supabase (requires Docker)
supabase start

# Stop local Supabase
supabase stop

# Reset local database
supabase db reset
```

Local Supabase runs on:
- **API**: http://localhost:54321
- **Database**: postgresql://localhost:54322
- **Studio**: http://localhost:54323
- **Inbucket (Email)**: http://localhost:54324

### Connecting to Local Supabase

Update your `.env.local`:

```bash
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<local-anon-key>
```

Get the local anon key from `supabase status`.

---

## 🛠️ Common Tasks

### Check Migration Status

```bash
# List all migrations
supabase migration list

# Check pending migrations
supabase db diff
```

### Create New Migration

```bash
# Create a new migration file
supabase migration new your_migration_name

# Edit the file in supabase/migrations/
# Then push to database
supabase db push
```

### Reset Database

```bash
# Reset to initial state and rerun all migrations
supabase db reset
```

### Generate TypeScript Types

```bash
# Generate types from database schema
supabase gen types typescript --local > src/types/database.ts
```

---

## 🔐 Environment Variables

Required environment variables for Supabase:

### Production

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Preview Branch

```bash
VITE_SUPABASE_URL_PREVIEW=https://your-preview-project.supabase.co
VITE_SUPABASE_ANON_KEY_PREVIEW=your-preview-anon-key
```

### Project Reference

```bash
SUPABASE_PROJECT_REF=your-project-ref-id
```

See `.env.example` for a complete template.

---

## 📚 Documentation

For more detailed information, see:

- **[SUPABASE_PREVIEW_SETUP.md](../SUPABASE_PREVIEW_SETUP.md)** - Complete preview branch setup guide
- **[PREVIEW_BRANCH_CHECKLIST.md](../PREVIEW_BRANCH_CHECKLIST.md)** - Setup checklist
- **[SETUP_GUIDE.md](../SETUP_GUIDE.md)** - General Zyeuté setup guide
- **[Supabase Docs](https://supabase.com/docs)** - Official Supabase documentation
- **[Supabase CLI Reference](https://supabase.com/docs/reference/cli)** - CLI command reference

---

## 🐛 Troubleshooting

### Migration Fails

**Problem**: Migration fails with error
**Solution**: 
1. Check SQL syntax in migration file
2. Verify tables don't already exist
3. Check for missing dependencies (foreign keys, etc.)
4. Try running in Supabase SQL Editor to see detailed error

### Can't Connect to Preview Branch

**Problem**: Preview branch connection refused
**Solution**:
1. Verify branch exists: `supabase branches list`
2. Check environment variables are set correctly
3. Verify credentials are for preview branch, not production
4. Test connection in browser network tab

### Migrations Out of Sync

**Problem**: Local migrations don't match remote
**Solution**:
1. Pull latest migrations: `supabase db pull`
2. Reset local database: `supabase db reset`
3. Push migrations: `supabase db push`

---

## 🤝 Contributing

When adding new migrations:

1. Create migration file with descriptive name
2. Test locally first: `supabase db reset && supabase db push`
3. Test on preview branch before production
4. Document the migration in this README
5. Update TypeScript types: `supabase gen types typescript`
6. Commit both migration file and updated types

---

**🔥⚜️ Made with ❤️ in Quebec 🇨🇦**
