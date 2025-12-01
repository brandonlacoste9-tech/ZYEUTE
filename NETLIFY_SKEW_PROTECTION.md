# Netlify Skew Protection Setup

## What is Skew Protection?

Netlify Skew Protection prevents "chunk-load errors" during deploys when users have old HTML cached but new assets are deployed (or vice versa). This is the recommended solution for Vite SPAs with hashed filenames.

## How to Enable

1. **Go to Netlify Dashboard:**
   - Site settings → Build & deploy → Deploy settings
   - Look for "Skew Protection" section

2. **Enable Skew Protection:**
   - Toggle it ON
   - This handles the "old HTML + new assets" / "new HTML + old assets" mismatch automatically

## Alternative Solutions (if Skew Protection not available)

### Option 1: Disable File Hashing (Simplest)
In `vite.config.ts`:
```typescript
build: {
  rollupOptions: {
    output: {
      entryFileNames: 'assets/[name].js',
      chunkFileNames: 'assets/[name].js',
      assetFileNames: 'assets/[name].[ext]'
    }
  }
}
```
**Trade-off:** Loses cache-busting benefits, but eliminates hash mismatch issues

### Option 2: Use Deploy Permalinks (Advanced)
Configure Vite to use Netlify's deploy permalinks as the base URL. This requires Netlify Functions or Edge Functions.

### Option 3: Service Worker Strategy
Implement a service worker that handles asset versioning and fallbacks. More complex but gives full control.

## Current Status

✅ **Standard SPA rewrite configured** (`/*` → `/index.html` 200)
✅ **Asset caching configured** (hashed assets cached for 1 year)
⏳ **Skew Protection:** Enable in Netlify Dashboard (recommended)

## References

- [Netlify: Code-splitting guide](https://docs.netlify.com/integrations/frameworks/vite/)
- [Netlify: JS SPAs](https://docs.netlify.com/routing/redirects/rewrites-proxies/#spa-fallback)
- [Netlify: Caching overview](https://docs.netlify.com/edge/cache-overview/)

