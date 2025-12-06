# Netlify Redirect Configuration Fix

## Problem Statement

The deployed app on Netlify was showing a persistent black screen. The root cause was improper redirect rules that intercepted static asset requests and served them as HTML instead of their correct MIME types.

### Key Issues

1. **Static Asset Interception**: The catch-all SPA redirect rule (`/* /index.html 200`) was matching requests for JavaScript and CSS files in the `/assets/` directory, causing them to be served as `text/html` instead of `application/javascript` and `text/css`.

2. **MIME Type Errors**: Browsers would receive HTML content when expecting JavaScript modules, causing errors like:
   ```
   Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html"
   ```

3. **Conflicting Configuration**: A leftover `vercel.json` file was present in the repository, potentially confusing build/deploy systems and interfering with Netlify's routing.

## Solution Implemented

### 1. Removed `vercel.json`

The `vercel.json` file was Vercel-specific configuration and is not needed for Netlify deployments. Its presence could cause conflicts with Netlify's build system.

### 2. Updated `public/_redirects`

Added comprehensive static asset rules **BEFORE** the SPA fallback:

```
# STATIC ASSETS - Serve as-is (MUST BE FIRST)
/assets/*  /assets/:splat  200
/sw.js  /sw.js  200
/manifest.json  /manifest.json  200
/*.js    /:splat  200
/*.css   /:splat  200
/*.png   /:splat  200
# ... (additional static file extensions)

# SPA FALLBACK - MUST BE LAST
/*  /index.html  200
```

**Critical**: The order matters! Static asset rules must come first to prevent the catch-all from intercepting them.

### 3. Updated `netlify.toml`

Added corresponding redirect rules in the Netlify configuration file to ensure consistent behavior:

```toml
# Vite build outputs all hashed JS/CSS to /assets/ directory
[[redirects]]
  from = "/assets/*"
  to = "/assets/:splat"
  status = 200

# Common static file extensions
[[redirects]]
  from = "/*.js"
  to = "/:splat"
  status = 200

# ... (additional rules)

# SPA FALLBACK - MUST BE LAST
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4. Updated `public/_headers`

Added explicit MIME type headers for JavaScript and CSS files:

```
# JavaScript files - ensure correct MIME type
/assets/*.js
  Content-Type: application/javascript; charset=utf-8
  Cache-Control: public, max-age=31536000, immutable

# CSS files - ensure correct MIME type
/assets/*.css
  Content-Type: text/css; charset=utf-8
  Cache-Control: public, max-age=31536000, immutable
```

## Test Plan

### Local Testing

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Verify build output**:
   - Check that `dist/assets/` contains hashed JS and CSS files
   - Verify `dist/_redirects` and `dist/_headers` are correctly copied

3. **Serve locally** (optional):
   ```bash
   npm run preview
   ```
   - Test that the app loads without errors
   - Check browser console for MIME type errors

### Netlify Preview Testing

1. **Deploy to Netlify preview**:
   - Netlify will automatically deploy the PR branch
   - Wait for build to complete

2. **Test the preview deployment**:
   - Visit the preview URL
   - Open browser DevTools (F12) → Network tab
   - Check that:
     - JS files in `/assets/` folder load with `Content-Type: application/javascript`
     - CSS files load with `Content-Type: text/css`
     - No MIME type errors in console
     - App renders correctly (no black screen)

3. **Verify specific asset loading**:
   - Filter Network tab by "JS" and "CSS"
   - Check Status codes (should be 200)
   - Check Response headers for correct MIME types
   - Verify Content-Security-Policy headers are present

### Production Testing

After PR is merged and deployed to production:

1. **Clear browser cache** or test in incognito mode
2. **Visit** `https://zyeute.com` (or production domain)
3. **Verify**:
   - App loads successfully
   - No black screen
   - No console errors
   - All features work as expected

## Post-Merge Verification Steps

1. Monitor Netlify deploy logs for any errors
2. Check Netlify Analytics for:
   - 404 errors (should be minimal)
   - Page load times
   - Error rates

3. Test from different locations/networks:
   - Desktop browsers (Chrome, Firefox, Safari)
   - Mobile browsers (iOS Safari, Chrome Android)
   - Different network speeds (3G, 4G, WiFi)

## Rollback Plan

If issues are discovered after deployment:

### Option 1: Quick Rollback via Netlify UI

1. Go to Netlify Dashboard → Deploys
2. Find the last working deploy (before this PR)
3. Click "Publish deploy" to rollback

### Option 2: Revert via Git

1. Create a revert commit:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. Netlify will auto-deploy the revert

### Option 3: Restore Previous Config

If only config needs to be reverted:

1. Restore previous versions of:
   - `public/_redirects`
   - `netlify.toml`
   - `public/_headers`
   - `vercel.json` (if needed)

2. Commit and push

## Risk Assessment

**Risk Level**: Minimal

**Why**: 
- Changes only affect routing and configuration, not application code
- Follows Netlify's official best practices for Vite SPAs
- Addresses a critical bug that prevents app from loading

**Potential Issues**:
- If asset paths or URL patterns don't match expectations, some assets might 404
  - **Mitigation**: Comprehensive testing on preview before production merge

## Technical Details

### How Vite Builds Assets

Vite's build process:
1. Compiles all JS/TS files into optimized bundles
2. Generates hashed filenames (e.g., `index-DDJZ5h3P.js`)
3. Outputs to `dist/assets/` directory
4. Updates `index.html` with correct asset paths

### How Netlify Redirect Rules Work

Netlify processes `_redirects` and `[[redirects]]` rules in order:
- First matching rule wins
- Status 200 = rewrite (serves different content, keeps URL)
- Status 301/302 = redirect (changes URL)
- `/:splat` = captures and replays path segments

### Why Order Matters

Given these rules:
```
/*  /index.html  200
/assets/*  /assets/:splat  200
```

Request for `/assets/index-abc123.js`:
- First rule matches: `/*` → serves `index.html` ❌
- Second rule never checked

Correct order:
```
/assets/*  /assets/:splat  200
/*  /index.html  200
```

Request for `/assets/index-abc123.js`:
- First rule matches: `/assets/*` → serves actual JS file ✅
- Second rule not needed

## References

- [Netlify Redirects Documentation](https://docs.netlify.com/routing/redirects/)
- [Vite Build Documentation](https://vitejs.dev/guide/build.html)
- [MDN: HTTP Content-Type Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)

## Changelog

### Changed

- **netlify.toml**: Added comprehensive static asset redirect rules before SPA fallback
- **public/_redirects**: Added explicit rules for `/assets/*`, service worker, manifest, and common static extensions
- **public/_headers**: Added explicit MIME type headers for JS and CSS files with long-term caching

### Removed

- **vercel.json**: Removed Vercel-specific configuration that conflicts with Netlify

### Impact

- ✅ Fixes black screen issue on deployed app
- ✅ Ensures correct MIME types for all static assets
- ✅ Improves asset caching with immutable cache headers
- ✅ Removes configuration conflicts between Vercel and Netlify
- ✅ Follows Netlify best practices for Vite SPAs
