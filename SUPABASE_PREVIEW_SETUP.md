# 🌿 Supabase Preview Branches Setup Guide

This guide explains how to set up and use Supabase database branches for isolated preview environments in Zyeuté.

---

## 📋 What are Supabase Preview Branches?

Supabase preview branches allow you to create isolated database environments for testing changes before they go to production. Each Git branch (e.g., `main`, `develop`, `feature/xyz`) can have its own Supabase database branch with separate data and schema.

### Benefits

- **🔒 Safe Testing**: Test database migrations and schema changes without affecting production
- **🚀 Fast Iteration**: Developers can work with realistic data in isolated environments
- **🔄 Easy Cleanup**: Preview branches can be deleted when no longer needed
- **📊 Data Isolation**: Each preview environment has its own database state
- **🛡️ Risk Reduction**: Catch breaking changes before they reach production

---

## 🏗️ Branch Configuration

### Production Branch

- **Git Branch**: `main`
- **Supabase Project**: Production project (configured via `VITE_SUPABASE_URL`)
- **Usage**: Production deployments only
- **Data**: Real production data

### Preview Branch for Main

- **Git Branch**: `main` (for pull requests and preview deployments)
- **Supabase Branch**: `dev-preview-main`
- **Usage**: Preview deployments, PR checks, CI/CD testing
- **Data**: Isolated test data, not connected to production
- **Connection**: Configured via `VITE_SUPABASE_URL_PREVIEW` environment variable

---

## 🚀 Setup Instructions

### Prerequisites

1. **Supabase CLI** installed globally:
   ```bash
   npm install -g supabase
   ```

2. **Supabase Account** with an active project

3. **Git Repository** cloned locally

### Step 1: Login to Supabase CLI

```bash
# Login to your Supabase account
supabase login

# This will open a browser window for authentication
# After successful login, you'll see: "Logged in successfully"
```

### Step 2: Link Your Project

```bash
# Navigate to your project directory
cd /path/to/zyeute

# Link to your Supabase project
# Get your project reference ID from: Supabase Dashboard > Settings > General > Reference ID
supabase link --project-ref your-project-ref-id

# Verify the link
supabase projects list
```

### Step 3: Create the Preview Branch

```bash
# Create the 'dev-preview-main' branch
supabase branches create dev-preview-main

# You'll see output like:
# Created branch dev-preview-main for project your-project-ref-id
# Branch ID: branch_xxxxxxxxxxxxx
```

### Step 4: Get Preview Branch Connection Details

```bash
# Get the connection details for the preview branch
supabase branches get dev-preview-main

# This will show:
# - Database URL
# - API URL
# - Anon Key
# - Service Role Key
# - Connection strings
```

### Step 5: Configure Environment Variables

Add the preview branch credentials to your deployment platform:

#### For Local Development (.env.local)

```bash
# Production Supabase (default)
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...production-key

# Preview Supabase (for testing)
VITE_SUPABASE_URL_PREVIEW=https://your-preview-project.supabase.co
VITE_SUPABASE_ANON_KEY_PREVIEW=eyJhbGc...preview-key
```

#### For Vercel

```bash
# Add preview environment variables (for preview deployments)
vercel env add VITE_SUPABASE_URL_PREVIEW preview
vercel env add VITE_SUPABASE_ANON_KEY_PREVIEW preview

# Add production environment variables (for production deployments)
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

#### For Netlify

1. Go to **Site Settings** → **Environment variables**
2. Add preview variables with scope: **Preview deploys**
   - `VITE_SUPABASE_URL_PREVIEW`
   - `VITE_SUPABASE_ANON_KEY_PREVIEW`
3. Add production variables with scope: **Production deploys**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

## 🔧 Using Preview Branches

### Automatic Preview Branch Selection

The application can automatically detect preview environments and use the appropriate Supabase connection:

```typescript
// src/lib/supabase.ts
const isPreview = import.meta.env.VITE_VERCEL_ENV === 'preview' || 
                  import.meta.env.CONTEXT === 'deploy-preview';

const supabaseUrl = isPreview 
  ? import.meta.env.VITE_SUPABASE_URL_PREVIEW 
  : import.meta.env.VITE_SUPABASE_URL;

const supabaseKey = isPreview 
  ? import.meta.env.VITE_SUPABASE_ANON_KEY_PREVIEW 
  : import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Manual Preview Branch Usage

To manually test against the preview branch:

```bash
# Set preview environment variables in your terminal
export VITE_SUPABASE_URL=$VITE_SUPABASE_URL_PREVIEW
export VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY_PREVIEW

# Run development server
npm run dev
```

---

## 🗄️ Database Migrations

### Running Migrations on Preview Branches

When you have database migrations, run them on the preview branch first:

```bash
# Switch to the preview branch
supabase db branch switch dev-preview-main

# Run your migrations
supabase db push

# Verify migrations
supabase db diff
```

### Migration Workflow

1. **Develop locally**: Create migration files in `supabase/migrations/`
2. **Test on preview**: Push to preview branch for testing
3. **Review changes**: Verify in preview environment
4. **Deploy to production**: Once tested, deploy migrations to production

---

## 🧪 Testing in Preview Environments

### Pull Request Workflow

1. **Create a PR** against `main` branch
2. **CI/CD triggers** a preview deployment (Vercel/Netlify)
3. **Preview uses** `dev-preview-main` Supabase branch automatically
4. **Test the PR** in isolation without affecting production
5. **Merge when ready** - production deployment uses production Supabase

### Preview Environment URLs

- **Vercel Preview**: `https://zyeute-git-{branch}-{user}.vercel.app`
- **Netlify Preview**: `https://deploy-preview-{pr-number}--zyeute.netlify.app`

Each preview deployment connects to the `dev-preview-main` Supabase branch.

---

## 🛠️ Managing Preview Branches

### List All Branches

```bash
supabase branches list
```

### Get Branch Details

```bash
supabase branches get dev-preview-main
```

### Delete a Preview Branch

```bash
# When no longer needed (be careful!)
supabase branches delete dev-preview-main
```

### Reset Preview Branch Data

```bash
# Reset to match production schema (keeps structure, clears data)
supabase db reset --db-url [preview-branch-url]
```

---

## 📊 Data Seeding for Preview Branches

### Seed Test Data

Create a seed script for your preview branch:

```sql
-- supabase/seed.sql
-- Insert test users
INSERT INTO public.users (id, username, display_name, bio)
VALUES 
  (gen_random_uuid(), 'testuser1', 'Test User 1', 'Test account for previews'),
  (gen_random_uuid(), 'testuser2', 'Test User 2', 'Another test account');

-- Insert test posts
INSERT INTO public.posts (user_id, caption, media_url, media_type)
SELECT 
  u.id,
  'Test post ' || generate_series,
  'https://picsum.photos/400/400?random=' || generate_series,
  'image'
FROM public.users u
CROSS JOIN generate_series(1, 5);
```

Run the seed script:

```bash
# Switch to the preview branch first
supabase db branch switch dev-preview-main

# Then seed the database
supabase db seed
```

---

## 🔐 Security Considerations

### Environment Variable Protection

- **Never commit** real credentials to Git
- **Use placeholder values** in `.env.example`
- **Configure secrets** in deployment platform (Vercel/Netlify)
- **Restrict access** to preview branches in Supabase dashboard

### Row Level Security (RLS)

- Preview branches **inherit RLS policies** from production
- Test RLS policies thoroughly in preview before production
- Use test users with different roles to verify permissions

---

## 🐛 Troubleshooting

### Issue: Preview branch not found

**Solution**: Create the branch first:
```bash
supabase branches create dev-preview-main
```

### Issue: Connection refused to preview branch

**Solution**: Check that environment variables are correctly set:
```bash
echo $VITE_SUPABASE_URL_PREVIEW
echo $VITE_SUPABASE_ANON_KEY_PREVIEW
```

### Issue: Migrations failing on preview branch

**Solution**: Ensure you're connected to the right branch:
```bash
supabase db branch switch dev-preview-main
supabase db reset
supabase db push
```

### Issue: Preview environment using production database

**Solution**: Verify preview environment detection:
- Check `import.meta.env.VITE_VERCEL_ENV` or `import.meta.env.CONTEXT`
- Ensure preview variables are set in deployment platform
- Test with console logs to verify which URL is being used

---

## 📚 Additional Resources

- **Supabase Branching Docs**: https://supabase.com/docs/guides/platform/branching
- **Supabase CLI Reference**: https://supabase.com/docs/reference/cli
- **Vercel Preview Deployments**: https://vercel.com/docs/concepts/deployments/preview-deployments
- **Netlify Deploy Previews**: https://docs.netlify.com/site-deploys/deploy-previews/

---

## 🎯 Quick Reference

### Create Branch
```bash
supabase branches create dev-preview-main
```

### Get Credentials
```bash
supabase branches get dev-preview-main
```

### List Branches
```bash
supabase branches list
```

### Switch Branch
```bash
supabase db branch switch dev-preview-main
```

### Run Migrations
```bash
supabase db push
```

### Delete Branch
```bash
supabase branches delete dev-preview-main
```

---

**🔥⚜️ Made with ❤️ in Quebec 🇨🇦**

*For support, check the main SETUP_GUIDE.md or open an issue on GitHub*
