# Phase 2 Migration Plan - SECURITY DEFINER Views

## ⚠️ IMPORTANT: Requires Maintenance Window

**Risk Level:** Medium  
**Downtime:** Recommended maintenance window  
**Testing:** Full regression testing required

## Overview

Phase 2 involves converting SECURITY DEFINER views to SECURITY INVOKER (default) to improve security posture.

## Affected Views (9 total)

1. `publication_engagement_breakdown`
2. `trending_publications`
3. `top_publications_last_7d`
4. `publication_reaction_counts`
5. `recent_publications`
6. `v_user_profile_feed`
7. `v_publication_detail`
8. `v_user_counts`
9. `v_public_profiles`

## Pre-Migration Steps

### 1. Review Each View Definition

```sql
-- Get current definition for each view
SELECT pg_get_viewdef('public.trending_publications', true);
SELECT pg_get_viewdef('public.v_user_counts', true);
-- ... repeat for all views
```

### 2. Identify Dependencies

- Check which views are used by the app
- Check which views are used by other views
- Document any breaking changes

### 3. Test Current Behavior

- Run queries against each view
- Document expected results
- Create test cases

## Migration Strategy

### Option A: Convert to INVOKER (Recommended)

**If underlying tables have proper RLS:**

```sql
-- Example for trending_publications
DROP VIEW IF EXISTS public.trending_publications CASCADE;
CREATE VIEW public.trending_publications AS
-- Paste definition from pg_get_viewdef
SELECT ...;
```

**Benefits:**
- Views respect caller's RLS
- More secure
- Simpler

**Risks:**
- May break if views rely on owner privileges
- Need to ensure RLS is correct on underlying tables

### Option B: Replace with SECURITY DEFINER Function

**If views need privileged access:**

```sql
-- Create function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_trending_publications()
RETURNS TABLE(...)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT ...;  -- Original view logic
END;
$$;

-- Revoke execute from public, grant to specific roles
REVOKE EXECUTE ON FUNCTION public.get_trending_publications() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_trending_publications() TO authenticated;
```

**Benefits:**
- More controlled access
- Can add input validation
- Better security

**Risks:**
- Requires app code changes
- More complex migration

## Migration Checklist

### Pre-Migration
- [ ] Review all view definitions
- [ ] Identify app dependencies
- [ ] Create test cases
- [ ] Schedule maintenance window
- [ ] Backup database

### Migration
- [ ] Convert views one by one
- [ ] Test each conversion
- [ ] Verify RLS on underlying tables
- [ ] Update app code if needed
- [ ] Run full regression tests

### Post-Migration
- [ ] Verify all views work correctly
- [ ] Check app functionality
- [ ] Monitor for errors
- [ ] Update documentation

## Rollback Plan

If issues occur:

```sql
-- Recreate view as SECURITY DEFINER (if needed)
CREATE OR REPLACE VIEW public.trending_publications
WITH (security_definer = true)  -- PostgreSQL 15+
AS
SELECT ...;  -- Original definition
```

## Recommended Approach

1. **Start with low-risk views** (not used by app)
2. **Test thoroughly** before proceeding
3. **Convert one at a time** to minimize risk
4. **Have rollback ready** for each view

## Timeline Estimate

- **Planning:** 2-4 hours
- **Migration:** 2-4 hours (with testing)
- **Total:** 4-8 hours

## Status

⏳ **Deferred** - Schedule for next maintenance window

---

**Note:** This is a complex migration. Take time to plan and test thoroughly.

