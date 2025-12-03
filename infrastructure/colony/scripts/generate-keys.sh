#!/bin/bash
# Colony OS Cryptographic Key Generation Script
#
# Generates Ed25519 key pairs for Colony OS components
# Keys are stored in infrastructure/colony/keys/ directory
#
# Usage: ./generate-keys.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KEYS_DIR="$SCRIPT_DIR/../keys"

echo "🔐 Colony OS Key Generation"
echo "============================"
echo ""

# Create keys directory if it doesn't exist
mkdir -p "$KEYS_DIR"

# Check if colonies CLI is installed
if ! command -v colonies &> /dev/null; then
    echo "❌ Colony OS CLI not found!"
    echo ""
    echo "Please install Colony OS CLI first:"
    echo "  - Visit: https://github.com/colonyos/colonies"
    echo "  - Or: go install github.com/colonyos/colonies/cmd/colonies@latest"
    echo ""
    exit 1
fi

echo "✅ Colony OS CLI found"
echo ""

# Generate Colony key
echo "1. Generating Colony key..."
colonies key generate > "$KEYS_DIR/colony.key"
COLONY_ID=$(colonies key id < "$KEYS_DIR/colony.key")
echo "   Colony ID: $COLONY_ID"
echo "   Saved to: $KEYS_DIR/colony.key"
echo ""

# Generate User key (for Zyeute API)
echo "2. Generating User key (for Zyeute API)..."
colonies key generate > "$KEYS_DIR/user.key"
USER_ID=$(colonies key id < "$KEYS_DIR/user.key")
echo "   User ID: $USER_ID"
echo "   Saved to: $KEYS_DIR/user.key"
echo ""

# Generate Executor key (for Finance Bee)
echo "3. Generating Executor key (for Finance Bee)..."
colonies key generate > "$KEYS_DIR/executor.key"
EXECUTOR_ID=$(colonies key id < "$KEYS_DIR/executor.key")
echo "   Executor ID: $EXECUTOR_ID"
echo "   Saved to: $KEYS_DIR/executor.key"
echo ""

# Create key summary file
cat > "$KEYS_DIR/KEY_SUMMARY.md" <<EOF
# Colony OS Cryptographic Keys

Generated: $(date)

## Key IDs

- **Colony ID:** \`$COLONY_ID\`
- **User ID:** \`$USER_ID\`
- **Executor ID:** \`$EXECUTOR_ID\`

## Key Files

- \`colony.key\` - Colony owner key (for server administration)
- \`user.key\` - User key (for Zyeute API to submit tasks)
- \`executor.key\` - Executor key (for Finance Bee to execute tasks)

## Security

⚠️ **NEVER commit these keys to Git!**

- Keys are in \`.gitignore\`
- Store in GitHub Secrets for CI/CD
- Rotate keys quarterly
- Revoke compromised keys immediately

## GitHub Secrets

Add these secrets to your repository:

\`\`\`
COLONIES_COLONY_PRVKEY=$(cat colony.key)
COLONIES_USER_PRVKEY=$(cat user.key)
COLONIES_EXECUTOR_PRVKEY=$(cat executor.key)
\`\`\`

## Usage

- **Colony key**: Used by Colonies Server for administration
- **User key**: Used by Zyeute API to submit tasks to Colony Server
- **Executor key**: Used by Finance Bee to authenticate with Colony Server
EOF

echo "✅ Key generation complete!"
echo ""
echo "📄 Key summary saved to: $KEYS_DIR/KEY_SUMMARY.md"
echo ""
echo "⚠️  IMPORTANT: Store these keys securely!"
echo "   - Add to GitHub Secrets"
echo "   - Never commit to Git"
echo "   - Rotate quarterly"
echo ""
echo "📋 Next steps:"
echo "   1. Review $KEYS_DIR/KEY_SUMMARY.md"
echo "   2. Add keys to GitHub Secrets"
echo "   3. Configure Finance Bee with executor key"
echo ""

