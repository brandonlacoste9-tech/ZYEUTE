# 🔧 Add @relations Hint to Posts View

## Copy/Paste This Into Supabase AI

---

```
Yes, please add the @relations hint to the posts view. Apply this:

COMMENT ON VIEW public.posts IS '@foreignKey (user_id) references public.user_profiles (id)\n@relations (user_id) user_profiles(id)';

This will add the additional hint format that some PostgREST versions prefer, making the relationship more explicit.
```

---

## What This Does

Adds an additional `@relations` hint to the posts view that some PostgREST versions prefer. Combined with the code fix (explicit link syntax), this ensures maximum compatibility.

---

## After Both Fixes

1. Code fix: Uses explicit `!user_id` syntax (already pushed)
2. DB fix: Adds `@relations` hint (ask Supabase AI to apply)

Both together ensure the joins work reliably.

