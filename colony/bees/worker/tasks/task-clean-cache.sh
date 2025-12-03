#!/bin/bash
# Colony OS Worker Bee Task: Clean Build Cache
# 
# Cleans npm cache, node_modules, and build artifacts

set -e

echo "🐝 Cleaning build cache..."

# Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force || true

# Remove node_modules
if [ -d "node_modules" ]; then
  echo "Removing node_modules..."
  rm -rf node_modules
fi

# Remove build artifacts
if [ -d "dist" ]; then
  echo "Removing dist directory..."
  rm -rf dist
fi

# Remove .next if exists (for Next.js)
if [ -d ".next" ]; then
  echo "Removing .next directory..."
  rm -rf .next
fi

echo "✅ Cache cleaned successfully"

