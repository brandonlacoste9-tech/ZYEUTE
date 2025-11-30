# feat(infra): Associate main branch with 'dev-preview-main' Supabase branch

## 📋 Summary

This PR implements Supabase database branching for isolated preview environments in Zyeuté. The main Git branch is now associated with a dedicated Supabase branch called `dev-preview-main`, allowing developers to test changes in isolation without affecting the production database.

## 🎯 Objective

Enable safe, isolated testing of database changes and features through Supabase preview branches:
- Prevent accidental production database modifications during development
- Allow parallel development on multiple features
- Test migrations and schema changes before production deployment
- Provide realistic testing environments for preview deployments

## 🔧 Changes Made

### 1. Configuration Files

#### `supabase/config.toml` (NEW)
- Complete Supabase project configuration
- Preview branch setup for `dev-preview-main`
- API, Database, Auth, and Storage settings
- Branching configuration mapping Git branches to Supabase branches
- Includes setup instructions and comments

#### `.env.example` (UPDATED)
- Added preview branch environment variables:
  - `VITE_SUPABASE_URL_PREVIEW`
  - `VITE_SUPABASE_ANON_KEY_PREVIEW`
  - `SUPABASE_PROJECT_REF`
- Clear comments explaining preview vs production credentials
- Instructions for obtaining preview branch credentials

### 2. Documentation

#### `SUPABASE_PREVIEW_SETUP.md` (NEW) - 9.5KB
Comprehensive guide covering:
- What are Supabase preview branches and their benefits
- Branch configuration (production and preview)
- Step-by-step setup instructions
- Environment variable configuration for Vercel/Netlify
- Using preview branches (automatic and manual)
- Database migrations on preview branches
- Testing in preview environments
- Managing and maintaining preview branches
- Data seeding for preview branches
- Security considerations
- Troubleshooting guide
- Quick reference commands

#### `PREVIEW_BRANCH_CHECKLIST.md` (NEW) - 7.2KB
Complete setup checklist including:
- Pre-setup requirements
- Local setup steps
- Preview branch creation (automated and manual)
- Database setup and migrations
- Deployment platform configuration (Vercel/Netlify)
- GitHub secrets setup for CI/CD
- Testing procedures (local and preview deployments)
- Documentation tasks
- Maintenance tasks
- Troubleshooting checklist
- Completion verification

#### `supabase/README.md` (NEW) - 7.5KB
Supabase directory documentation:
- Directory structure overview
- Configuration file explanation
- Database migrations documentation
- Preview branches overview
- Local development setup
- Common tasks and commands
- Environment variables reference
- Troubleshooting guide
- Contributing guidelines

#### `SETUP_GUIDE.md` (UPDATED)
- Added Step 7 in Supabase setup section
- Instructions for setting up preview branches
- Quick setup commands
- Reference to detailed documentation

#### `README.md` (UPDATED)
- Added reference to `SUPABASE_PREVIEW_SETUP.md`
- Brief mention of preview environments for isolated testing

### 3. Automation & Scripts

#### `scripts/setup-preview-branch.sh` (NEW) - Executable
Interactive setup script that:
- Checks for Supabase CLI installation
- Verifies user is logged in
- Links project to Supabase
- Creates the `dev-preview-main` branch
- Displays connection credentials
- Optionally updates `.env.local`
- Provides next steps guidance

#### `package.json` (UPDATED)
- Added npm script: `"setup:preview-branch": "bash scripts/setup-preview-branch.sh"`
- Allows easy setup with: `npm run setup:preview-branch`

### 4. CI/CD Configuration

#### `.github/workflows/deploy.yml` (UPDATED)
- Enhanced preview deployment job with detailed comments
- Added instructions for enabling Supabase preview branches in CI/CD
- Environment variable mapping for preview deployments
- Reference to setup documentation

#### `netlify.toml` (UPDATED)
- Added comprehensive comments for preview deployment context
- Instructions for setting up preview branch environment variables
- Scope configuration guidance (Deploy previews vs Production)
- Reference to setup documentation

#### `vercel.json` (UPDATED)
- Added JSON schema reference
- Explicit build command and output directory
- Better structure for future preview configuration

## 🚀 How to Use

### Quick Setup (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Run setup script
npm run setup:preview-branch

# Follow the prompts
```

### Manual Setup

1. **Install and login to Supabase CLI:**
   ```bash
   npm install -g supabase
   supabase login
   ```

2. **Link your project:**
   ```bash
   supabase link --project-ref your-project-id
   ```

3. **Create preview branch:**
   ```bash
   supabase branches create dev-preview-main
   ```

4. **Get credentials:**
   ```bash
   supabase branches get dev-preview-main
   ```

5. **Configure environment variables:**
   - Add to `.env.local` for local testing
   - Add to Vercel/Netlify for preview deployments
   - Add to GitHub Secrets for CI/CD

### Testing Preview Branch

#### Local Testing
```bash
export VITE_SUPABASE_URL=$VITE_SUPABASE_URL_PREVIEW
export VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY_PREVIEW
npm run dev
```

#### Preview Deployment Testing
1. Create a pull request
2. Preview deployment automatically uses `dev-preview-main`
3. Test features in isolation
4. Verify no production data is affected

## 📊 Configuration Structure

```
Main Git Branch (main)
    ↓
Supabase Preview Branch (dev-preview-main)
    ↓
Preview Deployments
    ├── Vercel Preview: uses VITE_SUPABASE_URL_PREVIEW
    ├── Netlify Deploy Preview: uses VITE_SUPABASE_URL_PREVIEW
    └── GitHub Actions PR: uses VITE_SUPABASE_URL_PREVIEW

Production Deployments
    ↓
Supabase Production Project
    ↓
Production URLs: uses VITE_SUPABASE_URL
```

## 🔐 Security Notes

- All example configurations use **placeholder values only**
- No real credentials or secrets are included in the repository
- Environment variables must be configured separately in:
  - `.env.local` (local development - not committed)
  - Vercel/Netlify dashboard (deployment platforms)
  - GitHub Secrets (CI/CD)
- Preview branch credentials should be separate from production

## ✅ Testing Checklist

### Before Merging

- [x] Build succeeds: `npm run build` ✓
- [x] TypeScript compiles (existing errors pre-exist): `npm run type-check`
- [x] All documentation files created and complete
- [x] Setup script is executable and well-commented
- [x] Environment variable examples use placeholders
- [x] No sensitive information committed
- [ ] Manual testing of setup script (requires Supabase account)
- [ ] Preview deployment test (requires configured deployment platform)

### After Merging

- [ ] Update team documentation/wiki
- [ ] Share setup guide with development team
- [ ] Configure preview branch in Supabase dashboard
- [ ] Add preview environment variables to Vercel/Netlify
- [ ] Add GitHub secrets for CI/CD
- [ ] Test preview deployment with a test PR
- [ ] Verify preview isolation (production data not affected)

## 📚 Documentation Reference

| Document | Purpose | Size |
|----------|---------|------|
| `SUPABASE_PREVIEW_SETUP.md` | Complete setup guide | 9.5KB |
| `PREVIEW_BRANCH_CHECKLIST.md` | Setup verification checklist | 7.2KB |
| `supabase/README.md` | Supabase config & migrations | 7.5KB |
| `supabase/config.toml` | Supabase configuration | 4.3KB |
| `scripts/setup-preview-branch.sh` | Automated setup script | 4.8KB |

## 🔄 Changelog

### Added
- Supabase config.toml with preview branch configuration
- SUPABASE_PREVIEW_SETUP.md comprehensive guide
- PREVIEW_BRANCH_CHECKLIST.md setup checklist
- supabase/README.md for migrations and config
- scripts/setup-preview-branch.sh automated setup
- Preview branch environment variables to .env.example
- npm script 'setup:preview-branch' for easy setup

### Updated
- .env.example with preview branch variables
- SETUP_GUIDE.md with preview branch instructions
- README.md with preview documentation reference
- .github/workflows/deploy.yml with preview comments
- netlify.toml with preview deployment context
- vercel.json with build configuration
- package.json with setup script

## 💡 Manual Steps Required

After merging this PR, team members must:

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Run setup script**:
   ```bash
   npm run setup:preview-branch
   ```
   OR follow manual steps in `SUPABASE_PREVIEW_SETUP.md`

3. **Configure deployment platform**:
   - Vercel: Add preview environment variables with "Preview" scope
   - Netlify: Add environment variables with "Deploy previews" scope

4. **Add GitHub Secrets** (for CI/CD):
   - `VITE_SUPABASE_URL_PREVIEW`
   - `VITE_SUPABASE_ANON_KEY_PREVIEW`

5. **Test preview deployment**:
   - Create a test PR
   - Verify preview uses isolated database
   - Confirm production is unaffected

## 🤝 Team Collaboration

### For Developers
- Review `SUPABASE_PREVIEW_SETUP.md` before starting
- Use `npm run setup:preview-branch` for easy setup
- Test locally with preview branch before pushing
- Follow `PREVIEW_BRANCH_CHECKLIST.md` to verify setup

### For DevOps/Admins
- Configure preview environment variables in deployment platforms
- Add GitHub Secrets for CI/CD
- Monitor preview branch usage and costs
- Set up automated cleanup for old preview data (optional)

### For QA/Testing
- Use preview deployments for feature testing
- Test against `dev-preview-main` branch for isolated testing
- Verify preview data doesn't leak to production
- Report issues found during preview testing

## 🎯 Success Criteria

This PR is successful when:
- ✅ All documentation is clear and comprehensive
- ✅ Setup script works for developers
- ✅ Environment variables are properly documented
- ✅ No secrets or credentials are committed
- ✅ Build and type-check pass
- ✅ Preview deployments use isolated database
- ✅ Production database remains unaffected
- ✅ Team can easily set up and use preview branches

## 🚦 Next Steps

1. **Immediate** (post-merge):
   - Team members run setup script
   - Configure deployment platforms
   - Add GitHub secrets

2. **Short-term** (within a week):
   - Test preview deployments with real PRs
   - Gather feedback on documentation
   - Refine setup process based on team feedback

3. **Long-term** (ongoing):
   - Monitor preview branch usage
   - Add additional preview branches for other environments (staging, develop)
   - Implement automated data seeding for preview branches
   - Set up automated cleanup for stale preview data

## 📞 Support

For questions or issues:
1. Check `SUPABASE_PREVIEW_SETUP.md` for detailed guides
2. Review `PREVIEW_BRANCH_CHECKLIST.md` for troubleshooting
3. Consult `supabase/README.md` for configuration details
4. Open a GitHub issue with details
5. Contact the development team

---

**🔥⚜️ Made with ❤️ in Quebec 🇨🇦**

*This PR implements infrastructure improvements for safer, more efficient development workflows through database branching.*
