#!/bin/bash
# Deploy Finance Bee to Self-Hosted Runner
#
# This script:
# 1. Creates dedicated user
# 2. Copies files to /opt/zyeute/
# 3. Installs Python dependencies
# 4. Configures systemd service
# 5. Starts the service
#
# Usage: sudo ./deploy-bee.sh

set -e

echo "🐝 Deploying Finance Bee to Self-Hosted Runner"
echo "=============================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Configuration
SERVICE_NAME="zyeute-finance-bee"
INSTALL_DIR="/opt/zyeute/infrastructure/colony/bees"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo "📁 Project root: $PROJECT_ROOT"
echo "📁 Install directory: $INSTALL_DIR"
echo ""

# Step 1: Create dedicated user
echo "1. Creating dedicated user (colony_user)..."
if id "colony_user" &>/dev/null; then
    echo "   ℹ️  User colony_user already exists"
else
    useradd -r -s /bin/false colony_user
    echo "   ✅ User colony_user created"
fi
echo ""

# Step 2: Create directories
echo "2. Creating directories..."
mkdir -p "$INSTALL_DIR/logs"
mkdir -p /opt/zyeute/infrastructure/colony/keys
echo "   ✅ Directories created"
echo ""

# Step 3: Copy files
echo "3. Copying Finance Bee files..."
cp "$PROJECT_ROOT/infrastructure/colony/bees/finance_bee.py" "$INSTALL_DIR/"
cp "$PROJECT_ROOT/infrastructure/colony/bees/config.py" "$INSTALL_DIR/"
cp "$PROJECT_ROOT/infrastructure/colony/bees/guardian.py" "$INSTALL_DIR/"
cp "$PROJECT_ROOT/infrastructure/colony/bees/requirements.txt" "$INSTALL_DIR/"
echo "   ✅ Files copied"
echo ""

# Step 4: Install Python dependencies
echo "4. Installing Python dependencies..."
pip3 install -r "$INSTALL_DIR/requirements.txt"
echo "   ✅ Dependencies installed"
echo ""

# Step 5: Set permissions
echo "5. Setting permissions..."
chown -R colony_user:colony_user /opt/zyeute/
chmod 755 "$INSTALL_DIR"
chmod 644 "$INSTALL_DIR"/*.py
chmod 755 "$INSTALL_DIR/logs"
echo "   ✅ Permissions set"
echo ""

# Step 6: Stop existing service (if running)
echo "6. Stopping existing service (if running)..."
systemctl stop $SERVICE_NAME 2>/dev/null || true
echo "   ✅ Service stopped"
echo ""

# Step 7: Install systemd service
echo "7. Installing systemd service..."

# Check if environment variables are set
if [ -z "$COLONIES_SERVER_HOST" ]; then
    echo "   ⚠️  Warning: COLONIES_SERVER_HOST not set"
    echo "      Set environment variables before starting service"
fi

# Generate systemd unit file with environment variables
cat > /etc/systemd/system/$SERVICE_NAME.service <<EOF
[Unit]
Description=Zyeute Colony Finance Bee
Documentation=https://github.com/brandonlacoste9-tech/Zyeute
After=network.target

[Service]
Type=simple
User=colony_user
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/python3 finance_bee.py
Restart=always
RestartSec=5

# Environment variables
Environment="COLONIES_SERVER_HOST=${COLONIES_SERVER_HOST:-http://localhost:8080}"
Environment="COLONIES_EXECUTOR_PRVKEY=${COLONIES_EXECUTOR_PRVKEY}"
Environment="COLONIES_COLONY_NAME=${COLONIES_COLONY_NAME:-zyeute-colony}"
Environment="SUPABASE_URL=${SUPABASE_URL}"
Environment="SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}"
Environment="STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}"
Environment="EXECUTOR_NAME=zyeute-finance-bee-01"
Environment="EXECUTOR_TYPE=finance-worker"
Environment="POLL_TIMEOUT=10"

# Resource limits
CPUShares=512
MemoryLimit=512M
IOWeight=100

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$INSTALL_DIR/logs

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=zyeute-finance-bee

[Install]
WantedBy=multi-user.target
EOF

echo "   ✅ Systemd service file created"
echo ""

# Step 8: Reload systemd daemon
echo "8. Reloading systemd daemon..."
systemctl daemon-reload
echo "   ✅ Daemon reloaded"
echo ""

# Step 9: Enable service
echo "9. Enabling service..."
systemctl enable $SERVICE_NAME
echo "   ✅ Service enabled"
echo ""

# Step 10: Start service
echo "10. Starting service..."
systemctl start $SERVICE_NAME
echo "    ✅ Service started"
echo ""

# Step 11: Check status
echo "11. Checking service status..."
systemctl status $SERVICE_NAME --no-pager || true
echo ""

echo "✅ Finance Bee deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Check logs: journalctl -u $SERVICE_NAME -f"
echo "   2. Verify status: systemctl status $SERVICE_NAME"
echo "   3. Test with Stripe webhook"
echo ""
echo "🛠️  Useful commands:"
echo "   - View logs: journalctl -u $SERVICE_NAME -f"
echo "   - Restart: systemctl restart $SERVICE_NAME"
echo "   - Stop: systemctl stop $SERVICE_NAME"
echo "   - Status: systemctl status $SERVICE_NAME"
echo ""

