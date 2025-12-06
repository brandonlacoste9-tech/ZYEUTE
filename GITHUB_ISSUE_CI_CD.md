# GitHub Issue #5: CI/CD Pipeline

**Title:** Set up comprehensive CI/CD pipeline with automated testing and quality checks

**Priority:** High  
**Labels:** `ci/cd`, `testing`, `automation`, `enhancement`

---

## Description

Set up a comprehensive CI/CD pipeline using GitHub Actions optimized for self-hosted runners. The pipeline includes automated testing, code quality checks, security scanning, and deployment automation.

## Why Self-Hosted Runners?

- ⚡ **Faster builds** - No queue time, dedicated resources
- 🐳 **Docker support** - Consistent test environments
- 🎛️ **Full control** - Customize environment as needed
- 💰 **Cost-effective** - No per-minute charges for frequent builds
- ⏱️ **No time limits** - Run longer tests without restrictions

---

## Tasks

### 1. ✅ GitHub Actions Workflow (High Priority)
- [x] Create `.github/workflows/ci.yml`
- [x] Run linting, type checking, tests on every PR
- [x] Build and deploy on merge to main
- [x] Use self-hosted runner for faster builds
- [x] Add concurrency control to cancel in-progress runs

### 2. ✅ Automated Testing (High Priority)
- [x] Set up Vitest for unit tests
- [x] Set up Playwright for E2E tests
- [x] Configure test coverage (target: 70%+)
- [x] Create example test files
- [ ] Write tests for critical user journeys:
  - [ ] Signup flow
  - [ ] Post creation
  - [ ] Admin access
  - [ ] Payment flow

### 3. ✅ Code Quality Checks (Medium Priority)
- [x] ESLint on every PR
- [x] TypeScript strict mode checking
- [x] Prettier formatting checks
- [x] Bundle size monitoring
- [x] Integration test configuration

### 4. ✅ Security Scanning (High Priority)
- [x] `npm audit` for dependencies
- [x] Secret scanning (TruffleHog)
- [x] CodeQL for vulnerability scanning
- [x] Dependabot for automated updates

### 5. ✅ Performance Monitoring (Medium Priority)
- [x] Lighthouse CI on deployments
- [x] Bundle size tracking
- [x] Performance score thresholds (90+)

### 6. ✅ Deployment Automation (High Priority)
- [x] Auto-deploy staging on `develop` branch
- [x] Production deployment with approval on `main`
- [x] Deployment notifications
- [x] Preview deployments for PRs
- [ ] Rollback capability (manual for now)

---

## Acceptance Criteria

### Phase 1: Basic CI/CD ✅
- [x] GitHub Actions workflow created
- [x] Linting runs on every PR
- [x] Type checking runs on every PR
- [x] Build runs on every PR
- [x] Basic unit tests set up

### Phase 2: Testing ✅ (Infrastructure Ready)
- [x] Unit tests (70%+ coverage threshold)
- [x] Integration tests configuration
- [x] E2E tests for critical journeys (examples provided)
- [x] Test coverage reporting
- [ ] **TODO:** Write actual test implementations

### Phase 3: Security & Quality ✅
- [x] Security scanning automated
- [x] Dependency scanning automated
- [x] Code quality checks automated
- [x] Bundle size monitoring
- [x] Dependabot configured

### Phase 4: Deployment ✅
- [x] Staging auto-deployment
- [x] Production deployment with approval
- [x] Deployment notifications
- [x] Preview deployments for PRs
- [ ] Rollback capability (can be added later)

---

## Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Build time | < 5 minutes | ⏱️ To be measured |
| Test coverage | > 70% | 📊 Configured |
| Security vulnerabilities | 0 critical | 🛡️ Scanning enabled |
| Bundle size | < 500KB (gzipped) | 📦 Monitoring enabled |
| Lighthouse Performance | > 90 | ⚡ CI configured |

---

## Workflow Overview

The CI/CD pipeline consists of 10 jobs:

1. **🔍 Lint & Format Check** - ESLint, Prettier, TypeScript
2. **🧪 Unit Tests** - Vitest with coverage reporting
3. **🔗 Integration Tests** - API and service tests
4. **🎭 E2E Tests** - Playwright browser tests
5. **🛡️ Security Scan** - npm audit, CodeQL, secret scanning
6. **🏗️ Build & Analyze** - Build + bundle size analysis
7. **⚡ Lighthouse CI** - Performance monitoring
8. **🚀 Deploy Staging** - Auto-deploy on `develop`
9. **🚀 Deploy Production** - Deploy on `main` (with approval)
10. **🔍 Deploy Preview** - Preview deployments for PRs

---

## Required GitHub Secrets

Add these secrets to your GitHub repository:

### Deployment
- `NETLIFY_AUTH_TOKEN` - Netlify personal access token
- `NETLIFY_SITE_ID` - Production site ID
- `NETLIFY_SITE_ID_STAGING` - Staging site ID

### Testing (Optional)
- `VITE_SUPABASE_URL_TEST` - Test Supabase project URL
- `VITE_SUPABASE_ANON_KEY_TEST` - Test Supabase anon key

### Security (Optional)
- `GEMINI_API_KEY` - For SecurityBee audit (if using)

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Vitest and testing utilities
- Playwright for E2E tests
- Lighthouse CI
- Prettier for formatting

### 2. Run Tests Locally

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:coverage

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

### 3. Check Code Quality

```bash
# Lint
npm run lint

# Format check
npm run format:check

# Type check
npm run type-check
```

### 4. Configure Self-Hosted Runner

1. Go to repository Settings → Actions → Runners
2. Click "New self-hosted runner"
3. Follow the setup instructions for your OS
4. Label the runner (e.g., "self-hosted")
5. Update workflow to use `runs-on: self-hosted`

### 5. Set Up GitHub Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Add required secrets (see list above)

### 6. Enable Environments (Optional)

For production deployment approval:
1. Go to repository Settings → Environments
2. Create "production" environment
3. Add required reviewers
4. Configure deployment protection rules

---

## File Structure

```
.github/
├── workflows/
│   └── ci.yml              # Main CI/CD workflow
└── dependabot.yml          # Automated dependency updates

e2e/
├── example.spec.ts         # Example E2E tests
└── auth.spec.ts            # Authentication E2E tests

src/
├── test/
│   ├── setup.ts            # Vitest setup
│   ├── setup.integration.ts # Integration test setup
│   └── utils.tsx           # Test utilities
└── components/
    └── Button.test.tsx     # Example unit test

vitest.config.ts            # Vitest configuration
vitest.config.integration.ts # Integration test config
playwright.config.ts        # Playwright configuration
.lighthouserc.js            # Lighthouse CI config
```

---

## Next Steps

1. **Write Tests** - Implement actual test cases for:
   - Components (Button, Avatar, Header, etc.)
   - Pages (Feed, Profile, Upload, etc.)
   - Services (Supabase, OpenAI, Stripe)
   - Critical user flows (signup, post creation, payments)

2. **Set Up Test Data** - Create test fixtures and mock data

3. **Configure Test Environment** - Set up test Supabase project

4. **Monitor Coverage** - Aim for 70%+ coverage on critical paths

5. **Optimize Build Times** - Cache dependencies, parallelize jobs

---

## Timeline

**Estimated:** 4 weeks (20-30 hours)

- Week 1: Infrastructure setup ✅
- Week 2: Write unit tests
- Week 3: Write integration & E2E tests
- Week 4: Optimize, document, and refine

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Self-Hosted Runners Guide](https://docs.github.com/en/actions/hosting-your-own-runners)

---

## Notes

- All jobs run on self-hosted runners for faster execution
- Tests are configured but need actual implementations
- Coverage threshold is set to 70% (configurable in `vitest.config.ts`)
- Bundle size threshold is 500KB gzipped (configurable in workflow)
- Lighthouse performance threshold is 90 (configurable in `.lighthouserc.js`)

---

**Status:** ✅ Infrastructure Complete - Ready for Test Implementation
