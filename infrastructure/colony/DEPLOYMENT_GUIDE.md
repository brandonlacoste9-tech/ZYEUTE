# Colony OS Deployment Guide

> **⚠️ DEPLOYMENT NOTE**: Zyeuté now deploys with Vercel; Netlify artifacts and CLI are unsupported.  
> This document is retained for historical reference only.


Complete guide for deploying Colony OS Finance Bee system.

## Prerequisites

- Self-hosted runner with SSH/sudo access
- Docker and Docker Compose installed
- Python 3.10+ installed
- GitHub CLI installed (for key storage)
- Access to Supabase and Stripe accounts

---

## Step 1: Deploy Colonies Server

### 1.1 Prepare Environment

```bash
cd infrastructure/colony

# Copy environment template
cp colonies-server.env.example .env

# Edit .env and set secure password
nano .env
```

### 1.2 Start Services

```bash
# Start Colonies Server and PostgreSQL
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs -f
```

### 1.3 Verify Health

```bash
# Test health endpoint
curl http://localhost:8080/api/v1/health

# Expected response: {"status": "healthy"}
```

---

## Step 2: Generate Cryptographic Keys

### 2.1 Install Colony OS CLI

Follow Colony OS documentation to install CLI:
- Visit: https://github.com/colonyos/colonies
- Or: `go install github.com/colonyos/colonies/cmd/colonies@latest`

### 2.2 Generate Keys

```bash
# Run key generation script
./scripts/generate-keys.sh

# Keys will be saved in keys/ directory
# Review keys/KEY_SUMMARY.md
```

### 2.3 Store Keys Securely

```bash
# Authenticate with GitHub
gh auth login

# Store keys in GitHub Secrets
./scripts/store-keys.sh

# Verify secrets are set
gh secret list
```

---

## Step 3: Deploy Finance Bee

### 3.1 Set Environment Variables

On self-hosted runner, set these environment variables:

```bash
export COLONIES_SERVER_HOST="http://localhost:8080"
export COLONIES_EXECUTOR_PRVKEY="<from GitHub Secrets>"
export COLONIES_COLONY_NAME="zyeute-colony"
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="<from Supabase dashboard>"
export STRIPE_SECRET_KEY="<from Stripe dashboard>"
```

### 3.2 Run Deployment Script

```bash
# Make script executable
chmod +x infrastructure/colony/scripts/deploy-bee.sh

# Run deployment (requires sudo)
sudo -E ./infrastructure/colony/scripts/deploy-bee.sh
```

### 3.3 Verify Service

```bash
# Check service status
systemctl status zyeute-finance-bee

# View logs
journalctl -u zyeute-finance-bee -f

# Expected: "Finance Bee is buzzing. Waiting for jobs..."
```

---

## Step 4: Configure Netlify Webhook

### 4.1 Add Environment Variables

In Netlify dashboard, add:

```
USE_COLONY_OS=true
COLONIES_SERVER_HOST=http://your-server-ip:8080
COLONIES_USER_PRVKEY=<from GitHub Secrets>
COLONIES_COLONY_NAME=zyeute-colony
```

### 4.2 Deploy Updated Webhook

```bash
# Commit changes
git add netlify/functions/

# Push to trigger deployment
git push origin main

# Verify deployment in Netlify dashboard
```

---

## Step 5: Test End-to-End

### 5.1 Trigger Test Webhook

Use Stripe CLI or dashboard to trigger test webhook:

```bash
# Using Stripe CLI
stripe trigger checkout.session.completed

# Or use Stripe dashboard: Developers → Webhooks → Send test webhook
```

### 5.2 Verify Processing

```bash
# Check Finance Bee logs
journalctl -u zyeute-finance-bee -f

# Expected: "Process <id> assigned" → "Process <id> completed successfully"

# Verify Supabase updated
# Check user_profiles and subscriptions tables
```

### 5.3 Verify No CI/CD Interference

```bash
# Trigger a CI/CD job
git commit --allow-empty -m "test: CI/CD check"
git push

# Verify CI/CD completes successfully
# Check GitHub Actions logs
```

---

## Step 6: Set Up Monitoring

### 6.1 Configure Redis Heartbeat (Optional)

If using Redis/Upstash:

```bash
# Set environment variable
export REDIS_URL="your_redis_url"

# Run heartbeat monitor
python3 infrastructure/colony/monitoring/heartbeat.py &
```

### 6.2 Set Up Health Checks

```bash
# Add to cron for automated health checks
crontab -e

# Add line:
# */5 * * * * /usr/bin/python3 /opt/zyeute/infrastructure/colony/monitoring/check-health.py
```

---

## Production Checklist

- [ ] Colonies Server deployed and healthy
- [ ] PostgreSQL database backed up
- [ ] Cryptographic keys generated and stored
- [ ] Finance Bee service running
- [ ] Systemd service enabled (survives reboot)
- [ ] Webhook handler updated and deployed
- [ ] End-to-end test passed
- [ ] Monitoring configured
- [ ] Logs being collected
- [ ] Alerting configured
- [ ] Runbook reviewed by team
- [ ] Rollback procedure tested

---

## Post-Deployment

### Monitor for 24 Hours

- Check logs every 2 hours
- Verify task execution success rate
- Monitor resource usage
- Check for errors or warnings

### After 24 Hours

- Review metrics
- Adjust resource limits if needed
- Document any issues encountered
- Update runbook with learnings

---

## Scaling

### Add More Worker Bees

```bash
# On additional runners:
# 1. Set EXECUTOR_NAME to unique value
export EXECUTOR_NAME="zyeute-finance-bee-02"

# 2. Run deployment script
sudo -E ./infrastructure/colony/scripts/deploy-bee.sh

# 3. Verify both bees are registered
# (Use Colony OS CLI to list executors)
```

### Scale Colony Server

For high availability:
- Deploy to Kubernetes cluster
- Use managed PostgreSQL
- Set up load balancer
- Configure auto-scaling

---

## Support

- **Documentation:** `infrastructure/colony/README.md`
- **Troubleshooting:** `infrastructure/colony/TROUBLESHOOTING.md`
- **Runbook:** This file
- **Colony OS Docs:** https://github.com/colonyos/colonies

