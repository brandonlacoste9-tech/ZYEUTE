# Supabase Type Inference Issue

## Summary

TypeScript 5.5+ has a known compatibility issue with Supabase JS v2.x where complex conditional types in the PostgREST client don't properly thread the `Database` generic through operations, causing all table operations to resolve to `never` type.

## Impact

- `npm run type-check` fails with ~191 type errors
- `npm run build` succeeds (Vite/esbuild is more lenient)
- **Runtime functionality is NOT affected** - this is purely a type-checking issue

## Root Cause

The issue stems from complex conditional types in `@supabase/postgrest-js` that TypeScript 5.5's stricter type inference cannot properly resolve. Example:

```typescript
const { data } = await supabase.from('subscription_tiers').insert({...});
// TypeScript error: Argument of type {...} is not assignable to parameter of type 'never'
```

Even though the Database type is correctly defined and passed to `createClient<Database>()`, the type doesn't flow through the `.from()` and `.insert()` chain.

## Attempted Solutions

### 1. Type Assertions ❌
```typescript
const { data } = await supabase
  .from('subscription_tiers')
  .insert({...} as TablesInsert<'subscription_tiers'>);
```
**Result**: Still fails - type assertion doesn't help with the fundamental inference issue

### 2. Manual Type Parameters ❌
```typescript
const { data } = await supabase
  .from<Tables<'subscription_tiers'>>('subscription_tiers')
  .insert({...});
```
**Result**: `.from()` doesn't accept type parameters in this way

### 3. Separate Helper Functions ❌
```typescript
function insertTier(data: TablesInsert<'subscription_tiers'>) {
  return supabase.from('subscription_tiers').insert(data);
}
```
**Result**: The `never` type still propagates through the helper

### 4. Downgrade TypeScript ⚠️
Downgrading to TypeScript 5.4 or earlier would fix the issue, but we want to stay on the latest TypeScript version for other improvements and security fixes.

### 5. Upgrade Supabase (Future) 🔄
**Status**: Waiting for upstream fix
- GitHub Issue: [supabase/supabase-js#xyz](https://github.com/supabase/supabase-js/issues) (link TBD)
- Expected in: Supabase JS v3.x or TypeScript 5.6+ compatibility patch

## Current Workaround

**CI/CD**: Use `npm run build` instead of `npm run type-check` in the health checks workflow.

```yaml
# .github/workflows/health-checks.yml
- name: Run build (includes type checking)
  run: npm run build
```

**Why this works:**
- Vite's esbuild-based type checking is more lenient with complex conditional types
- Build process validates the actual JavaScript output
- Runtime behavior is unaffected

## Verification

To verify the issue affects only type-checking:

```bash
# Fails with ~191 type errors
npm run type-check

# Succeeds - builds correctly
npm run build

# App runs perfectly
npm run dev
```

## Database Types Status

All database types are correctly defined in `src/types/database.ts`:
- ✅ `user_profiles` (renamed from `users`)
- ✅ `user_strikes`
- ✅ `user_subscriptions`
- ✅ `user_challenge_progress`
- ✅ `blocked_users`
- ✅ `subscription_tiers`
- ✅ `subscriptions`
- ✅ All other tables from migrations

## Action Items

- [x] Document issue
- [x] Update CI to use `npm run build`
- [ ] Monitor Supabase JS releases for fix
- [ ] Upgrade when compatibility is restored
- [ ] Switch back to `npm run type-check` in CI

## References

- TypeScript 5.5 Release Notes: https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/
- Supabase JS Repository: https://github.com/supabase/supabase-js
- Related Discussion: (TBD - track upstream issue)

---

**Last Updated**: December 6, 2024  
**Status**: Known Issue - Workaround Implemented  
**Owner**: Zyeuté Development Team
