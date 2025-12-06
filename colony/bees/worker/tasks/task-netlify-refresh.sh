#!/bin/bash
# Colony OS Worker Bee Task: Refresh Netlify Build
# 
# Triggers a new Netlify build via build hook

set -e

NETLIFY_BUILD_HOOK="${NETLIFY_BUILD_HOOK:-}"

if [ -z "$NETLIFY_BUILD_HOOK" ]; then
  echo "❌ NETLIFY_BUILD_HOOK environment variable not set"
  exit 1
fi

echo "🐝 Triggering Netlify build..."
echo "Build hook: ${NETLIFY_BUILD_HOOK}"

response=$(curl -X POST -f -s "$NETLIFY_BUILD_HOOK")

if [ $? -eq 0 ]; then
  echo "✅ Netlify build triggered successfully"
  echo "Response: $response"
else
  echo "❌ Failed to trigger Netlify build"
  exit 1
fi

