# VS Code - Start Code Quality Improvements NOW

Hey VS Code! 👋

While the team is deploying Colony OS infrastructure, I need you to start the code quality improvements immediately. This work can happen in parallel with deployment.

---

## Your Immediate Task

**Replace all `console.log` with production-safe `logger` utility**

**Priority:** HIGH  
**Time Estimate:** 2-3 hours  
**Can Start:** RIGHT NOW (no dependencies)

---

## Step 1: Audit Phase (30 minutes)

Run these searches to find all console usage:

```bash
# Find all console.log
grep -r "console\.log" src/ netlify/functions/ --include="*.ts" --include="*.tsx" --include="*.js"

# Find all console.error
grep -r "console\.error" src/ netlify/functions/ --include="*.ts" --include="*.tsx" --include="*.js"

# Find all console.warn
grep -r "console\.warn" src/ netlify/functions/ --include="*.ts" --include="*.tsx" --include="*.js"
```

**Document your findings:**
- Total count of console statements
- Files with most usage
- Any sensitive data being logged

---

## Step 2: Priority Files (90 minutes)

Replace console statements in these files first:

### File 1: `src/services/api.ts`
**Current pattern:**
```typescript
console.log('Fetching posts...');
```

**Replace with:**
```typescript
import { logger } from '@/lib/logger';
logger.debug('Fetching posts');
```

### File 2: `netlify/functions/stripe-webhook.js`
**Current pattern:**
```javascript
console.log('✅ Stripe event submitted');
console.error('Webhook error:', error);
```

**Replace with:**
```javascript
// Note: This is a Netlify Function, so logger needs to be imported
// For now, keep console but add structured logging:
console.log(JSON.stringify({ 
  level: 'info', 
  message: 'Stripe event submitted',
  timestamp: new Date().toISOString()
}));
```

### File 3: `src/lib/supabase.ts`
**Already uses logger** - verify and ensure consistency

### File 4: All React components in `src/`
**Pattern:**
```typescript
// Before
console.log('User action:', data);

// After
logger.info('User action', { data });
```

---

## Step 3: Sensitive Data Check (30 minutes)

**Critical:** Ensure NO sensitive data is logged:

**Never log:**
- API keys (`STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
- User passwords
- Session tokens
- Private keys

**Safe to log:**
- User IDs (UUIDs)
- Event types
- Timestamps
- Status codes

**Pattern for safe logging:**
```typescript
// Bad
logger.info('User logged in', { user: fullUserObject });

// Good
logger.info('User logged in', { userId: user.id });
```

---

## Step 4: Verification (30 minutes)

After replacements:

```bash
# Verify no console.log remains (except in tests)
grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" | grep -v "test"

# Build and verify no errors
npm run build

# Check production bundle doesn't include debug logs
npm run build && grep -r "logger.debug" dist/
```

---

## Success Criteria

- [ ] Zero `console.log` in production code
- [ ] Zero `console.error` in production code  
- [ ] All logs use `logger` utility
- [ ] No sensitive data logged
- [ ] Build succeeds
- [ ] TypeScript passes

---

## What You'll Get Back

When you complete this:
- Cleaner, production-ready logging
- Environment-based log control
- No sensitive data leakage
- Better debugging in production

**This is exactly the kind of systematic work you excel at!**

---

## Report Back

When done, create a summary:
- Files modified
- Console statements replaced
- Any issues found
- Build status

---

**Start now! This can run in parallel with Colony OS deployment.** 🚀

**Reference:** `VS_CODE_DELEGATION.md` for complete task details

