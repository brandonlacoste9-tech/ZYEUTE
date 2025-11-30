# ✅ Supabase Preview Branch Setup Checklist

Use this checklist to ensure your preview branch is properly configured for the Zyeuté project.

---

## 📋 Pre-Setup Checklist

- [ ] Supabase CLI installed globally (`npm install -g supabase`)
- [ ] Logged into Supabase CLI (`supabase login`)
- [ ] Have Supabase project reference ID ready
- [ ] Have access to deployment platform (Vercel/Netlify)
- [ ] Have admin access to GitHub repository settings

---

## 🔧 Local Setup Checklist

- [ ] Clone the repository
- [ ] Install project dependencies (`npm install`)
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add production Supabase credentials to `.env.local`
- [ ] Link project to Supabase (`supabase link --project-ref <id>`)
- [ ] Verify link with `supabase projects list`

---

## 🌿 Preview Branch Creation Checklist

### Option A: Using the Setup Script (Recommended)

- [ ] Run `npm run setup:preview-branch`
- [ ] Follow the interactive prompts
- [ ] Copy preview credentials displayed
- [ ] Add credentials to `.env.local`

### Option B: Manual Setup

- [ ] Create preview branch: `supabase branches create dev-preview-main`
- [ ] Get branch details: `supabase branches get dev-preview-main`
- [ ] Copy the following from output:
  - [ ] API URL (for `VITE_SUPABASE_URL_PREVIEW`)
  - [ ] Anon Key (for `VITE_SUPABASE_ANON_KEY_PREVIEW`)
  - [ ] Service Role Key (optional, for admin operations)
- [ ] Add to `.env.local`:
  ```bash
  VITE_SUPABASE_URL_PREVIEW=<API URL>
  VITE_SUPABASE_ANON_KEY_PREVIEW=<Anon Key>
  ```

---

## 🗄️ Database Setup Checklist

- [ ] Switch to preview branch: `supabase db branch switch dev-preview-main`
- [ ] Run migrations: `supabase db push`
- [ ] Verify migrations applied: `supabase db diff`
- [ ] (Optional) Seed test data: `supabase db seed`
- [ ] Verify schema matches production
- [ ] Create test users in preview database
- [ ] Test authentication works

---

## 🚀 Deployment Platform Setup Checklist

### For Vercel

- [ ] Add preview environment variables:
  - [ ] `VITE_SUPABASE_URL_PREVIEW` (scope: Preview)
  - [ ] `VITE_SUPABASE_ANON_KEY_PREVIEW` (scope: Preview)
- [ ] Add production environment variables:
  - [ ] `VITE_SUPABASE_URL` (scope: Production)
  - [ ] `VITE_SUPABASE_ANON_KEY` (scope: Production)
- [ ] Deploy a test preview to verify configuration
- [ ] Check preview deployment uses correct Supabase branch

### For Netlify

- [ ] Go to Site Settings → Environment variables
- [ ] Add preview variables (scope: Deploy previews):
  - [ ] `VITE_SUPABASE_URL_PREVIEW`
  - [ ] `VITE_SUPABASE_ANON_KEY_PREVIEW`
- [ ] Add production variables (scope: Production):
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Deploy a test preview to verify configuration
- [ ] Check preview deployment logs for correct URL

---

## 🔐 GitHub Secrets Setup Checklist (for CI/CD)

- [ ] Go to GitHub repository → Settings → Secrets and variables → Actions
- [ ] Add the following secrets:
  - [ ] `VITE_SUPABASE_URL_PREVIEW` (preview branch API URL)
  - [ ] `VITE_SUPABASE_ANON_KEY_PREVIEW` (preview branch anon key)
  - [ ] `VITE_SUPABASE_URL` (production API URL)
  - [ ] `VITE_SUPABASE_ANON_KEY` (production anon key)
  - [ ] `SUPABASE_PROJECT_REF` (project reference ID)
- [ ] Update `.github/workflows/deploy.yml` if needed
- [ ] Test GitHub Actions workflow

---

## 🧪 Testing Checklist

### Local Testing

- [ ] Set preview environment variables:
  ```bash
  export VITE_SUPABASE_URL=$VITE_SUPABASE_URL_PREVIEW
  export VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY_PREVIEW
  ```
- [ ] Run dev server: `npm run dev`
- [ ] Verify connection to preview database
- [ ] Test authentication (sign up, login, logout)
- [ ] Test creating a post
- [ ] Test viewing feed
- [ ] Verify data is isolated from production

### Preview Deployment Testing

- [ ] Create a test PR
- [ ] Wait for preview deployment
- [ ] Visit preview URL
- [ ] Verify preview uses preview Supabase branch (check network tab)
- [ ] Test core features:
  - [ ] User authentication
  - [ ] Post creation
  - [ ] Comment functionality
  - [ ] Profile updates
  - [ ] File uploads
- [ ] Verify no data appears in production database
- [ ] Check for console errors

---

## 📚 Documentation Checklist

- [ ] Read `SUPABASE_PREVIEW_SETUP.md`
- [ ] Update team documentation with setup instructions
- [ ] Document preview branch naming conventions
- [ ] Add preview branch info to onboarding docs
- [ ] Share credentials securely with team (use password manager)
- [ ] Document how to test against preview branch

---

## 🔄 Maintenance Checklist

### Regular Tasks

- [ ] Monitor preview branch database size
- [ ] Clean up old test data periodically
- [ ] Verify migrations sync between preview and production
- [ ] Review preview branch access logs
- [ ] Update preview branch when production schema changes

### When Merging PRs

- [ ] Ensure migrations run on production after merge
- [ ] Verify production deployment successful
- [ ] (Optional) Reset preview branch to match production
- [ ] Clean up test data from preview branch

### Monthly Tasks

- [ ] Review preview branch costs (if applicable)
- [ ] Verify preview branch is still needed
- [ ] Update documentation if processes changed
- [ ] Review team access to preview environments

---

## 🆘 Troubleshooting Checklist

### Preview branch not connecting

- [ ] Verify environment variables are set correctly
- [ ] Check preview branch exists: `supabase branches list`
- [ ] Verify credentials are for preview branch, not production
- [ ] Check network connectivity to Supabase
- [ ] Review browser console for connection errors

### Migrations failing on preview branch

- [ ] Verify you're on the correct branch: `supabase db branch list`
- [ ] Check migration files for syntax errors
- [ ] Try resetting branch: `supabase db reset`
- [ ] Verify production migrations work first
- [ ] Check Supabase dashboard for migration logs

### Preview deployment using wrong database

- [ ] Verify environment variables in deployment platform
- [ ] Check deployment logs for which URL is being used
- [ ] Verify preview scope is set correctly for env vars
- [ ] Test locally with same env vars
- [ ] Check code for hardcoded URLs

### Data not isolated between environments

- [ ] Verify different URLs are being used (check network tab)
- [ ] Confirm preview and production have different project IDs
- [ ] Check that preview env vars are actually being used
- [ ] Review database connection code for issues
- [ ] Verify RLS policies are working correctly

---

## 📞 Support

If you encounter issues not covered here:

1. Check `SUPABASE_PREVIEW_SETUP.md` for detailed guides
2. Review Supabase branching documentation
3. Check deployment platform docs (Vercel/Netlify)
4. Open an issue on GitHub with details
5. Contact the development team

---

## ✅ Completion

- [ ] All setup steps completed
- [ ] Preview branch working locally
- [ ] Preview deployments working
- [ ] Team members trained on usage
- [ ] Documentation updated
- [ ] CI/CD pipeline configured

**Date Completed**: _______________

**Completed By**: _______________

**Notes**: 

---

**🔥⚜️ Made with ❤️ in Quebec 🇨🇦**
