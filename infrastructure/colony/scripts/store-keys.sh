#!/bin/bash
# Colony OS Key Storage Script
#
# Stores generated keys in GitHub Secrets using GitHub CLI
#
# Prerequisites:
#   - GitHub CLI installed (gh)
#   - Authenticated with GitHub (gh auth login)
#   - Keys generated (run generate-keys.sh first)
#
# Usage: ./store-keys.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KEYS_DIR="$SCRIPT_DIR/../keys"

echo "🔐 Colony OS Key Storage"
echo "========================"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not found!"
    echo ""
    echo "Please install GitHub CLI first:"
    echo "  - Visit: https://cli.github.com/"
    echo "  - Or: brew install gh (macOS)"
    echo "  - Or: winget install GitHub.cli (Windows)"
    echo ""
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub!"
    echo ""
    echo "Please authenticate first:"
    echo "  gh auth login"
    echo ""
    exit 1
fi

echo "✅ GitHub CLI authenticated"
echo ""

# Check if keys exist
if [ ! -f "$KEYS_DIR/colony.key" ] || [ ! -f "$KEYS_DIR/user.key" ] || [ ! -f "$KEYS_DIR/executor.key" ]; then
    echo "❌ Keys not found!"
    echo ""
    echo "Please generate keys first:"
    echo "  ./generate-keys.sh"
    echo ""
    exit 1
fi

echo "✅ Keys found"
echo ""

# Get repository (current directory)
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "📦 Repository: $REPO"
echo ""

# Store Colony key
echo "1. Storing Colony key..."
gh secret set COLONIES_COLONY_PRVKEY < "$KEYS_DIR/colony.key"
echo "   ✅ COLONIES_COLONY_PRVKEY stored"

# Store User key
echo "2. Storing User key..."
gh secret set COLONIES_USER_PRVKEY < "$KEYS_DIR/user.key"
echo "   ✅ COLONIES_USER_PRVKEY stored"

# Store Executor key
echo "3. Storing Executor key..."
gh secret set COLONIES_EXECUTOR_PRVKEY < "$KEYS_DIR/executor.key"
echo "   ✅ COLONIES_EXECUTOR_PRVKEY stored"

echo ""
echo "✅ All keys stored in GitHub Secrets!"
echo ""
echo "🔒 Security notes:"
echo "   - Keys are encrypted in GitHub Secrets"
echo "   - Only accessible to GitHub Actions workflows"
echo "   - Rotate keys quarterly"
echo ""
echo "📋 Next steps:"
echo "   1. Deploy Finance Bee with executor key"
echo "   2. Configure Zyeute API with user key"
echo "   3. Test end-to-end flow"
echo ""

