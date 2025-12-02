# Fix Remaining Posts Queries

## Files Still Using `posts` View (Need Fix)

1. **PostDetail.tsx** - Line ~57
2. **Player.tsx** - Lines ~33, 48, 56, 78, 112
3. **Upload.tsx** - Line ~84
4. **Analytics.tsx** - Lines ~69, 76, 98
5. **SearchBar.tsx** - Line ~72
6. **subscriptionService.ts** - Line ~481
7. **achievementService.ts** - Lines ~237, 289
8. **Moderation.tsx** - Line ~225 (delete operation)

## Fix Pattern

**Change from:**
```typescript
.from('posts')
.select('*, user:user_profiles!user_id(*)')
```

**To:**
```typescript
.from('publications')
.select('*, user:user_profiles!user_id(*)')
.eq('visibilite', 'public')  // If needed
.is('est_masque', null)      // If needed
.is('deleted_at', null)      // If needed
```

**Column Mapping:**
- `fire_count` → `reactions_count`
- `caption` → `content`
- `visibility` → `visibilite`
- `is_hidden` → `est_masque`

## Priority Order

1. **PostDetail.tsx** - Critical (post detail page)
2. **Player.tsx** - Critical (video player)
3. **Upload.tsx** - Important (post creation)
4. **SearchBar.tsx** - Important (search functionality)
5. **Analytics.tsx** - Lower priority
6. **Services** - Lower priority (background tasks)

## Status

- ✅ **getFeedPosts** - Fixed
- ✅ **getUserPosts** - Fixed  
- ✅ **Explore.tsx** - Fixed
- ⏳ **PostDetail.tsx** - Needs fix
- ⏳ **Player.tsx** - Needs fix
- ⏳ **Upload.tsx** - Needs fix
- ⏳ **Others** - Needs fix

