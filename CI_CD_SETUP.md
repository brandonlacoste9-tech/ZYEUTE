# 🔄 CI/CD Pipeline Setup Guide

Complete guide for Zyeuté's CI/CD pipeline and automated workflows.

---

## 📋 Overview

Zyeuté uses GitHub Actions for comprehensive CI/CD automation, optimized for self-hosted runners. The pipeline includes:

- ✅ **Automated testing** (unit, integration, E2E)
- ✅ **Code quality checks** (linting, type checking, formatting)
- ✅ **Security scanning** (vulnerabilities, secrets, CodeQL)
- ✅ **Deployment automation** (preview, staging, production)
- ✅ **Performance monitoring** (bundle size tracking)

---

## 🏗️ Pipeline Architecture

### Main Workflow: `.github/workflows/ci.yml`

The primary CI/CD pipeline runs on every PR and push to `main`, `develop`, or `master`.

**Pipeline Stages:**

```
┌──────────────────────────────────────────────────────────┐
│                    Code Quality Checks                    │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────┐      ┌──────────────────┐         │
│  │ Lint & Format    │      │ Type Check       │         │
│  │ (ESLint/Prettier)│      │ (TypeScript)     │         │
│  └──────────────────┘      └──────────────────┘         │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│                     Build & Test                          │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────┐      ┌──────────────────┐         │
│  │ Build            │      │ Unit Tests       │         │
│  │ (Vite)           │      │ (Vitest)         │         │
│  └──────────────────┘      └──────────────────┘         │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│                    Security Scanning                      │
├──────────────────────────────────────────────────────────┤
│  • npm audit (dependency vulnerabilities)                 │
│  • Secret scanning (API keys, tokens)                     │
│  • Bundle size monitoring                                 │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│                    E2E Tests (optional)                   │
├──────────────────────────────────────────────────────────┤
│  • Playwright tests across browsers                       │
│  • Critical user journey validation                       │
│  • Only runs on main/master branch pushes                 │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│                      Deployment                           │
├──────────────────────────────────────────────────────────┤
│  PR:       → Preview deployment                           │
│  develop:  → Staging deployment                           │
│  main:     → Production deployment (with approval)        │
└──────────────────────────────────────────────────────────┘
```

### Additional Workflows

#### `.github/workflows/codeql.yml`
- **Purpose**: Advanced security vulnerability scanning
- **Trigger**: PRs, pushes, weekly schedule (Sundays)
- **Analysis**: JavaScript/TypeScript security patterns
- **Reports**: Security tab in GitHub

#### `.github/dependabot.yml`
- **Purpose**: Automated dependency updates
- **Schedule**: Weekly (Mondays at 9:00 AM)
- **Scope**: npm packages and GitHub Actions
- **Limits**: 10 npm PRs, 5 GitHub Actions PRs

---

## 🚀 Self-Hosted Runner Setup

Zyeuté's CI/CD is optimized for self-hosted runners, providing:
- ⚡ **Faster builds** (no queue time)
- 💰 **Cost-effective** (no usage limits)
- 🐳 **Docker support** (consistent environments)
- ⏱️ **No time limits** (longer tests allowed)

### Runner Requirements

**System:**
- Ubuntu 20.04+ or similar Linux
- Node.js 20.19.0 installed
- Docker available (for containerized tests)
- Minimum 10GB disk space
- Minimum 4GB RAM

**Network:**
- Access to GitHub API
- Access to Netlify API (for deployments)
- Outbound HTTPS (443)

### Setting Up a Self-Hosted Runner

1. **Go to Repository Settings**
   ```
   GitHub Repo → Settings → Actions → Runners → New self-hosted runner
   ```

2. **Follow GitHub's Instructions**
   ```bash
   # Download runner
   mkdir actions-runner && cd actions-runner
   curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
     https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
   
   # Extract
   tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz
   
   # Configure
   ./config.sh --url https://github.com/brandonlacoste9-tech/Zyeute --token YOUR_TOKEN
   
   # Install as service
   sudo ./svc.sh install
   sudo ./svc.sh start
   ```

3. **Verify Runner**
   - Check Settings → Actions → Runners
   - Runner should show as "Idle" and online

---

## 🔐 Required Secrets

Configure these secrets in: **Settings → Secrets and variables → Actions**

### Deployment Secrets

```yaml
# Netlify (for deployments)
NETLIFY_AUTH_TOKEN        # Your Netlify personal access token
NETLIFY_SITE_ID           # Production site ID
NETLIFY_SITE_ID_STAGING   # Staging site ID (optional)

# Supabase (for integration tests - optional)
VITE_SUPABASE_URL         # Test environment URL
VITE_SUPABASE_ANON_KEY    # Test environment anon key

# Stripe (for payment tests - optional)
STRIPE_SECRET_KEY         # Test mode secret key
```

### How to Get Secrets

#### Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. User Settings → Applications → Personal access tokens
3. Create new token with full access
4. Site Settings → General → Site details → API ID

#### Supabase (Test Environment)
1. Create separate Supabase project for testing
2. Settings → API → Project URL and anon key
3. Never use production credentials in CI!

#### Stripe
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers → API keys
3. Use **test mode** keys only
4. Never use live keys in CI!

---

## 📊 Workflow Jobs Explained

### 1. Lint & Format Check (`lint-and-format`)

**Purpose**: Ensure code follows style guidelines

**Checks:**
- ESLint (JavaScript/TypeScript linting)
- Prettier (code formatting)

**Configuration:**
- `.eslintrc.json`
- `.prettierrc`

**Status**: `continue-on-error: true` (warns but doesn't fail)

---

### 2. Type Check (`type-check`)

**Purpose**: Validate TypeScript types

**Checks:**
- TypeScript compiler (tsc --noEmit)
- Type errors and warnings

**Configuration:**
- `tsconfig.json`

**Status**: `continue-on-error: true` (warns but doesn't fail)

---

### 3. Build (`build`)

**Purpose**: Verify production build succeeds

**Steps:**
1. Install dependencies (`npm ci`)
2. Build production bundle (`npm run build`)
3. Check build output and size
4. Upload artifacts for deployment

**Artifacts:**
- `dist-{sha}`: Production build files

**Bundle Size Warning**: Triggers if > 1MB

---

### 4. Unit Tests (`test-unit`)

**Purpose**: Run fast unit and integration tests

**Framework**: Vitest + React Testing Library

**Steps:**
1. Install dependencies
2. Run tests (`npm run test`)
3. Generate coverage report

**Coverage**: Currently aspirational (building test suite)

---

### 5. Security Scan (`security-scan`)

**Purpose**: Detect security vulnerabilities

**Checks:**
1. **npm audit**: Dependency vulnerabilities
2. **Secret scanning**: Exposed API keys/tokens
3. **Pattern matching**: Known security issues

**Severity Levels:**
- Low: Informational only
- Moderate: Warning
- High: Should fix ASAP
- Critical: Blocks deployment

---

### 6. E2E Tests (`test-e2e`)

**Purpose**: Validate complete user journeys

**Framework**: Playwright

**Browsers**: Chromium, Firefox, WebKit

**When**: Only runs on pushes to `main`/`master`

**Tests:**
- Homepage loading
- Navigation
- User authentication
- Post creation
- Admin access

---

### 7. Deployment

#### Preview (`deploy-preview`)
- **Trigger**: Pull requests
- **Target**: Netlify preview URL
- **Purpose**: Test changes in isolated environment

#### Staging (`deploy-staging`)
- **Trigger**: Push to `develop` branch
- **Target**: Staging environment
- **Purpose**: Pre-production testing

#### Production (`deploy-production`)
- **Trigger**: Push to `main`/`master` branch
- **Target**: Production (zyeute.netlify.app)
- **Approval**: Requires manual approval
- **Purpose**: Live deployment

---

## 📈 Monitoring & Notifications

### GitHub Actions Dashboard

View workflow runs:
```
Repository → Actions tab → CI/CD Pipeline
```

**Useful Filters:**
- Status: Success, Failed, In Progress
- Branch: main, develop
- Actor: Who triggered the run

### Job Summaries

Each workflow generates a summary:
- Job status (✅ or ❌)
- Build information
- Test results
- Coverage reports
- Deployment URLs

### Artifacts

Download build artifacts and reports:
```
Workflow run → Artifacts section
```

**Available Artifacts:**
- `dist-{sha}`: Production build
- Test results (when implemented)
- Coverage reports (when implemented)

---

## 🔧 Customization

### Adjusting Pipeline Behavior

#### Skip CI for Specific Commits

Add to commit message:
```bash
git commit -m "docs: update README [skip ci]"
```

#### Run Only Specific Jobs

Use workflow dispatch with manual trigger:
```
Actions → CI/CD Pipeline → Run workflow
```

#### Modify Coverage Thresholds

Edit `vitest.config.ts`:
```typescript
coverage: {
  thresholds: {
    lines: 70,      // Adjust as needed
    functions: 70,
    branches: 70,
    statements: 70,
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Fails with "ENOSPC" Error
**Cause**: Not enough disk space

**Solution**:
```bash
# On self-hosted runner
df -h                           # Check disk space
npm cache clean --force          # Clear npm cache
docker system prune -a           # Clean Docker
```

#### 2. Tests Timeout
**Cause**: Slow network or resources

**Solution**: Increase timeout in workflow:
```yaml
- name: Run tests
  run: npm run test
  timeout-minutes: 10  # Increase from default 5
```

#### 3. Deployment Fails
**Cause**: Missing secrets or wrong configuration

**Solution**:
```bash
# Verify secrets are set
Settings → Secrets → Check NETLIFY_AUTH_TOKEN exists

# Check Netlify CLI locally
npm install -g netlify-cli
netlify login
netlify deploy --dir=dist
```

#### 4. Self-Hosted Runner Offline
**Cause**: Runner service stopped

**Solution**:
```bash
# Check runner status
sudo systemctl status actions.runner.*.service

# Restart runner
sudo systemctl restart actions.runner.*.service
```

---

## 📝 Best Practices

### Commit Messages

Follow conventional commits:
```bash
feat: add new feature
fix: fix bug
docs: update documentation
test: add tests
chore: maintenance tasks
refactor: code refactoring
```

### Pull Request Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit
3. Push branch: `git push origin feature/my-feature`
4. Create PR on GitHub
5. Wait for CI checks to pass (✅)
6. Request review
7. Merge after approval

### Deployment Strategy

**Development Cycle:**
```
feature/* → develop → staging → main → production
     ↓          ↓         ↓        ↓         ↓
   local   → preview → staging → approval → prod
```

---

## 🎯 Success Metrics

### Target Metrics

- **Build Time**: < 5 minutes
- **Test Execution**: < 3 minutes
- **Deployment Time**: < 2 minutes
- **Pipeline Success Rate**: > 95%
- **Test Coverage**: > 70% (goal)
- **Security Vulnerabilities**: 0 critical

### Current Status

- ✅ Build: ~4 minutes
- ✅ Tests: ~1 minute (unit tests only)
- ⚪ Coverage: Building test suite
- ✅ Security: 0 critical vulnerabilities

---

## 📚 Additional Resources

### Documentation
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [Netlify CLI Docs](https://docs.netlify.com/cli/get-started/)

### Project Documentation
- `TESTING_GUIDE.md` - Testing documentation
- `README.md` - Project overview
- `CONTRIBUTING.md` - Contribution guidelines

---

## 🚀 Next Steps

### Phase 1: Current State ✅
- [x] Basic CI/CD pipeline
- [x] Lint and type checking
- [x] Build verification
- [x] Security scanning
- [x] Unit test infrastructure

### Phase 2: In Progress 🔄
- [ ] Expand test coverage (70%+ goal)
- [ ] Add component tests
- [ ] Enable E2E tests in CI
- [ ] Coverage enforcement

### Phase 3: Future 📋
- [ ] Performance budgets
- [ ] Lighthouse CI
- [ ] Visual regression testing
- [ ] Automated changelog generation

---

**Questions?** Open an issue or check the [GitHub Discussions](https://github.com/brandonlacoste9-tech/Zyeute/discussions)

**Contributing?** See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines

---

🔥⚜️ **Made with ❤️ in Quebec** 🇨🇦
