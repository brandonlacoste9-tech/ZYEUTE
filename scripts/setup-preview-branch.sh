#!/bin/bash
# Supabase Preview Branch Setup Script
# This script helps developers set up the 'dev-preview-main' Supabase branch
# for isolated preview environments

set -e

echo "🌿 Zyeuté - Supabase Preview Branch Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI is not installed${NC}"
    echo ""
    echo "Please install it first:"
    echo "  npm install -g supabase"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Supabase CLI found${NC}"
echo ""

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠ You are not logged in to Supabase${NC}"
    echo ""
    echo "Attempting to login..."
    supabase login
    echo ""
fi

echo -e "${GREEN}✓ Logged in to Supabase${NC}"
echo ""

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo -e "${YELLOW}⚠ Project is not linked to Supabase${NC}"
    echo ""
    read -p "Enter your Supabase project reference ID: " PROJECT_REF
    echo ""
    echo "Linking project..."
    supabase link --project-ref "$PROJECT_REF"
    echo ""
fi

echo -e "${GREEN}✓ Project is linked${NC}"
echo ""

# Get project info
PROJECT_REF=$(grep 'project_id' supabase/config.toml | cut -d'"' -f2 || echo "")

if [ -z "$PROJECT_REF" ] || [ "$PROJECT_REF" = "your-project-id" ]; then
    echo -e "${YELLOW}⚠ Could not determine project reference ID${NC}"
    echo ""
    read -p "Enter your Supabase project reference ID: " PROJECT_REF
    
    # Update config.toml with actual project ID
    if [ -f "supabase/config.toml" ]; then
        # Use a portable sed approach that works on both Linux and macOS
        if sed --version &> /dev/null; then
            # GNU sed (Linux)
            sed -i "s/project_id = \"your-project-id\"/project_id = \"$PROJECT_REF\"/" supabase/config.toml
        else
            # BSD sed (macOS)
            sed -i '' "s/project_id = \"your-project-id\"/project_id = \"$PROJECT_REF\"/" supabase/config.toml
        fi
        echo -e "${GREEN}✓ Updated config.toml with project ID${NC}"
        echo ""
    fi
fi

echo "Project: $PROJECT_REF"
echo ""

# Check if preview branch already exists
BRANCH_NAME="dev-preview-main"
BRANCH_EXISTS=false

echo "Checking if preview branch '$BRANCH_NAME' exists..."
if supabase branches list | grep -q "$BRANCH_NAME"; then
    BRANCH_EXISTS=true
    echo -e "${GREEN}✓ Preview branch '$BRANCH_NAME' already exists${NC}"
    echo ""
    read -p "Do you want to recreate it? (y/N): " RECREATE
    
    if [ "$RECREATE" = "y" ] || [ "$RECREATE" = "Y" ]; then
        echo ""
        echo "Deleting existing branch..."
        supabase branches delete "$BRANCH_NAME" --force
        BRANCH_EXISTS=false
        echo -e "${GREEN}✓ Branch deleted${NC}"
        echo ""
    fi
fi

# Create preview branch if it doesn't exist
if [ "$BRANCH_EXISTS" = false ]; then
    echo "Creating preview branch '$BRANCH_NAME'..."
    supabase branches create "$BRANCH_NAME"
    echo ""
    echo -e "${GREEN}✓ Preview branch created successfully!${NC}"
    echo ""
fi

# Get branch details
echo "Fetching preview branch connection details..."
echo ""
supabase branches get "$BRANCH_NAME"
echo ""

# Generate .env.local template
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo ""
echo "1. Copy the connection details above"
echo "2. Add them to your .env.local file:"
echo ""
echo "   # Preview Branch Credentials"
echo "   VITE_SUPABASE_URL_PREVIEW=<API URL from above>"
echo "   VITE_SUPABASE_ANON_KEY_PREVIEW=<Anon Key from above>"
echo ""
echo "3. Configure your deployment platform (Vercel/Netlify):"
echo "   - Add VITE_SUPABASE_URL_PREVIEW as a preview environment variable"
echo "   - Add VITE_SUPABASE_ANON_KEY_PREVIEW as a preview environment variable"
echo ""
echo "4. For detailed instructions, see: SUPABASE_PREVIEW_SETUP.md"
echo ""

# Guidance for updating .env.local
echo -e "${YELLOW}💡 To use the preview branch locally:${NC}"
echo ""
echo "1. If you don't have .env.local, create it:"
echo "   cp .env.example .env.local"
echo ""
echo "2. Manually copy the API URL and Anon Key from above to .env.local:"
echo "   VITE_SUPABASE_URL_PREVIEW=<API URL>"
echo "   VITE_SUPABASE_ANON_KEY_PREVIEW=<Anon Key>"
echo ""
echo "Note: Automatic credential parsing is not implemented yet."
echo "Please copy the credentials manually from the output above."
echo ""

echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "You can now test against the preview branch by setting:"
echo "  export VITE_SUPABASE_URL=\$VITE_SUPABASE_URL_PREVIEW"
echo "  export VITE_SUPABASE_ANON_KEY=\$VITE_SUPABASE_ANON_KEY_PREVIEW"
echo ""
echo "Or your preview deployments will automatically use the preview branch"
echo "if configured correctly in your CI/CD pipeline."
echo ""
echo -e "${GREEN}For more information: SUPABASE_PREVIEW_SETUP.md${NC}"
echo ""
