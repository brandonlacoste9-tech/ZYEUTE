# 🚀 GitHub Issue: CI/CD Pipeline & Automated Testing

## Issue #5: Set up comprehensive CI/CD pipeline with automated testing

**Title:** Set up comprehensive CI/CD pipeline with automated testing and quality checks

**Priority:** High  
**Labels:** `ci/cd`, `testing`, `automation`, `enhancement`

**Description:**

Set up a comprehensive CI/CD pipeline using GitHub Actions that runs on self-hosted runners. This pipeline should include automated testing, code quality checks, security scanning, and deployment automation.

**Current State:**
- Self-hosted runner available
- Basic build process exists (Netlify)
- No automated testing
- No automated code quality checks
- No automated security scanning
- Manual deployment process

**Goals:**
1. Automate testing (unit tests, integration tests, E2E tests)
2. Automate code quality checks (linting, type checking, formatting)
3. Automate security scanning (dependencies, secrets, vulnerabilities)
4. Automate performance monitoring (bundle size, Lighthouse scores)
5. Automate deployment (staging/production with approvals)

---

## Tasks

### 1. **Set up GitHub Actions Workflow** (High Priority)

Create `.github/workflows/ci.yml` with:

**On Push/PR:**
- Run linting (ESLint)
- Run type checking (TypeScript)
- Run unit tests
- Run integration tests
- Check code formatting (Prettier)
- Check bundle size (fail if exceeds threshold)

**On Merge to Main:**
- Run all above checks
- Run E2E tests
- Build production bundle
- Run security scanning
- Deploy to staging (auto)
- Deploy to production (with approval)

**Example Workflow:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-type-check:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.19.0'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run format:check

  test:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.19.0'
      - run: npm ci
      - run: npm run test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    runs-on: self-hosted
    needs: [lint-and-type-check, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.19.0'
      - run: npm ci
      - run: npm run build
      - name: Check bundle size
        run: |
          SIZE=$(du -sk dist | cut -f1)
          if [ $SIZE -gt 500 ]; then
            echo "Bundle size exceeds 500KB: ${SIZE}KB"
            exit 1
          fi

  security-scan:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.19.0'
      - run: npm ci
      - run: npm audit --audit-level=moderate
      - uses: github/super-linter@v4
        env:
          DEFAULT_BRANCH: main
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  deploy-staging:
    runs-on: self-hosted
    needs: [build, security-scan]
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Netlify Staging
        uses: netlify/actions/cli@master
        with:
          args: deploy --dir=dist --prod=false
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID_STAGING }}

  deploy-production:
    runs-on: self-hosted
    needs: [build, security-scan]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://zyeute.netlify.app
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Netlify Production
        uses: netlify/actions/cli@master
        with:
          args: deploy --dir=dist --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

### 2. **Set up Automated Testing** (High Priority)

**Unit Tests:**
- Set up Vitest or Jest
- Write tests for critical functions:
  - `src/lib/utils.ts` (formatNumber, getTimeAgo, extractSupabaseProjectRef)
  - `src/lib/admin.ts` (isAdmin)
  - `src/services/api.ts` (API functions)
- Target: 70%+ code coverage

**Integration Tests:**
- Test API endpoints
- Test Supabase queries
- Test authentication flows
- Use Playwright or Cypress

**E2E Tests:**
- Test critical user journeys:
  - Signup → Login → Create Post → Comment
  - Admin access control
  - Premium subscription flow
- Use Playwright (already available)

**Example Test Setup:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/'],
    },
  },
});
```

---

### 3. **Set up Code Quality Checks** (Medium Priority)

**Linting:**
- ESLint configuration
- Run on every PR
- Fail PR if linting errors

**Type Checking:**
- TypeScript strict mode
- Run on every PR
- Fail PR if type errors

**Formatting:**
- Prettier configuration
- Run on every PR
- Auto-fix on commit (pre-commit hook)

**Bundle Size Monitoring:**
- Track bundle size over time
- Fail if bundle exceeds threshold
- Generate bundle analysis report

---

### 4. **Set up Security Scanning** (High Priority)

**Dependency Scanning:**
- `npm audit` on every PR
- Fail if critical vulnerabilities found
- Use Dependabot for automated updates

**Secret Scanning:**
- Scan for exposed secrets (API keys, tokens)
- Use GitHub's secret scanning
- Fail if secrets found

**Code Security:**
- Use CodeQL or similar
- Scan for common vulnerabilities
- Review security findings

**Example Dependabot Config:**
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

---

### 5. **Set up Performance Monitoring** (Medium Priority)

**Bundle Size Tracking:**
- Track bundle size over time
- Generate reports
- Alert if size increases significantly

**Lighthouse CI:**
- Run Lighthouse on every deployment
- Track performance scores
- Fail if score drops below threshold

**Example Lighthouse CI:**
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  deployment:

jobs:
  lighthouse:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://zyeute.netlify.app
            https://zyeute.netlify.app/feed
          uploadArtifacts: true
          temporaryPublicStorage: true
```

---

### 6. **Set up Deployment Automation** (High Priority)

**Staging Deployment:**
- Auto-deploy on merge to `develop` branch
- Run smoke tests after deployment
- Notify team on Slack/Discord

**Production Deployment:**
- Require approval before deployment
- Deploy on merge to `main` branch
- Run full test suite before deployment
- Rollback capability

**Deployment Notifications:**
- Slack/Discord notifications
- Email notifications for production deployments
- Deployment status badges

---

## Acceptance Criteria

### Phase 1: Basic CI/CD (Week 1)
- [ ] GitHub Actions workflow created
- [ ] Linting runs on every PR
- [ ] Type checking runs on every PR
- [ ] Build runs on every PR
- [ ] Basic unit tests set up (at least 5 tests)

### Phase 2: Testing (Week 2)
- [ ] Unit tests for critical functions (70%+ coverage)
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user journeys
- [ ] Test coverage reporting

### Phase 3: Security & Quality (Week 3)
- [ ] Security scanning automated
- [ ] Dependency scanning automated
- [ ] Code quality checks automated
- [ ] Bundle size monitoring

### Phase 4: Deployment Automation (Week 4)
- [ ] Staging auto-deployment working
- [ ] Production deployment with approval
- [ ] Deployment notifications
- [ ] Rollback capability

---

## Technical Requirements

**Self-Hosted Runner:**
- Node.js 20.19.0 installed
- Docker available (for containerized tests)
- Sufficient disk space (for builds and artifacts)
- Network access to Netlify API

**GitHub Secrets Needed:**
- `NETLIFY_AUTH_TOKEN` - Netlify authentication token
- `NETLIFY_SITE_ID` - Production site ID
- `NETLIFY_SITE_ID_STAGING` - Staging site ID
- `SUPABASE_URL` - For integration tests
- `SUPABASE_ANON_KEY` - For integration tests
- `STRIPE_SECRET_KEY` - For payment tests (test mode)

**Dependencies to Add:**
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.57.0",
    "prettier": "^3.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0"
  }
}
```

---

## Success Metrics

**CI/CD Metrics:**
- Build time: < 5 minutes
- Test execution time: < 3 minutes
- Deployment time: < 2 minutes
- Pipeline success rate: > 95%

**Quality Metrics:**
- Code coverage: > 70%
- Linting errors: 0
- Type errors: 0
- Security vulnerabilities: 0 critical

**Performance Metrics:**
- Bundle size: < 500KB (gzipped)
- Lighthouse Performance: > 90
- Lighthouse Accessibility: > 90
- Lighthouse Best Practices: > 90

---

## Documentation

**Create:**
- `.github/workflows/ci.yml` - Main CI/CD workflow
- `.github/workflows/lighthouse.yml` - Performance monitoring
- `.github/dependabot.yml` - Dependency updates
- `vitest.config.ts` - Test configuration
- `playwright.config.ts` - E2E test configuration
- `CONTRIBUTING.md` - Contribution guidelines (include testing instructions)

---

## Timeline

**Week 1:** Basic CI/CD setup  
**Week 2:** Testing infrastructure  
**Week 3:** Security & quality checks  
**Week 4:** Deployment automation  

**Total Estimated Time:** 20-30 hours

---

## Notes

- Leverage self-hosted runner for faster builds (no queue time)
- Use Docker for consistent test environments
- Set up monitoring/alerting for pipeline failures
- Document all workflows for team members
- Consider adding performance budgets

---

**Created:** After delegation strategy  
**Status:** Ready for GitHub Actions/self-hosted runner  
**Priority:** High (enables faster iteration and quality assurance)

