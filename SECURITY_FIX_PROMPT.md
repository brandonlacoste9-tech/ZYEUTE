# 🔒 Security Fix Prompt for Supabase AI

## Copy/Paste This Into Supabase AI Chat

---

```
fix security definer views

I need to address the SECURITY DEFINER views flagged by the security advisor. These views could bypass RLS:

- publication_engagement_breakdown
- trending_publications
- top_publications_last_7d
- publication_reaction_counts
- recent_publications
- v_user_profile_feed
- v_publication_detail
- v_public_profiles

Please:
1. Review each view to determine if SECURITY DEFINER is necessary
2. If not necessary, convert them to SECURITY INVOKER or normal views
3. If SECURITY DEFINER is needed, document why and ensure RLS is properly enforced
4. Generate safe ALTER/CREATE scripts to replace them
5. Test that queries still work after the change

I want to ensure RLS is not bypassed and security is hardened.
```

---

## After Security Views Are Fixed

Then enable leaked password protection:

1. Go to: https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk/settings/auth
2. Find "Password" section
3. Enable "Leaked password protection"
4. Save

---

## Testing Checklist

After fixes:
- [ ] Test app - 404s should be gone
- [ ] Test posts query - should return 200
- [ ] Test stories query - should return 200
- [ ] Test notifications - should work
- [ ] Verify SECURITY DEFINER views are fixed
- [ ] Verify leaked password protection is enabled

