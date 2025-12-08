# Colony OS Troubleshooting Guide

> **⚠️ DEPLOYMENT NOTE**: Zyeuté now deploys with Vercel; Netlify artifacts and CLI are unsupported.  
> This document is retained for historical reference only.


## Common Issues

### 1. Colonies Server Won't Start

**Symptoms:**
- Docker container exits immediately
- Health endpoint not accessible
- Connection refused errors

**Solutions:**

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs colonies-server

# Check PostgreSQL is healthy
docker-compose logs postgres

# Verify environment variables
cat .env

# Restart services
docker-compose down
docker-compose up -d
```

**Common Causes:**
- PostgreSQL password not set in `.env`
- Port 8080 already in use
- Database connection failed
- Missing environment variables

---

### 2. Finance Bee Service Won't Start

**Symptoms:**
- `systemctl status` shows failed
- Service exits immediately
- No logs in journalctl

**Solutions:**

```bash
# Check service status
systemctl status zyeute-finance-bee

# View detailed logs
journalctl -u zyeute-finance-bee -n 100

# Check environment variables
systemctl show zyeute-finance-bee --property=Environment

# Verify Python dependencies
pip3 list | grep -E "pycolonies|supabase|stripe"

# Test Finance Bee manually
cd /opt/zyeute/infrastructure/colony/bees
sudo -u colony_user python3 finance_bee.py
```

**Common Causes:**
- Missing environment variables
- Python dependencies not installed
- Invalid cryptographic keys
- Cannot connect to Colony Server
- Supabase connection failed

---

### 3. Tasks Not Being Picked Up

**Symptoms:**
- Tasks submitted but not executing
- Finance Bee running but idle
- Queue depth increasing

**Solutions:**

```bash
# Check Finance Bee is polling
journalctl -u zyeute-finance-bee -f

# Verify executor is registered
# (Use Colony OS CLI to list executors)

# Check Colony Server has tasks
# (Use Colony OS CLI or API)

# Verify executor type matches
# Finance Bee executortype: "finance-worker"
```

**Common Causes:**
- Executor not registered with Colony Server
- Executor type mismatch
- Colony Server not receiving tasks
- Network connectivity issues

---

### 4. Tasks Failing to Execute

**Symptoms:**
- Tasks marked as failed
- Error messages in logs
- Guardian blocking tasks

**Solutions:**

```bash
# Check Finance Bee logs
journalctl -u zyeute-finance-bee -n 100

# Check Guardian statistics
# (Look for "Guardian blocked" messages)

# Verify Supabase connection
# Test with: psql or Supabase dashboard

# Verify Stripe API key
# Test with: stripe customers list
```

**Common Causes:**
- Guardian blocking invalid payloads
- Supabase RLS policies blocking updates
- Stripe API key invalid
- Missing required metadata in Stripe events

---

### 5. Webhook Submission Failing

**Symptoms:**
- Stripe webhooks timing out
- Colony OS submission errors
- Webhooks falling back to direct processing

**Solutions:**

```bash
# Check Netlify function logs
netlify functions:log stripe-webhook

# Verify Colony Server is accessible from Netlify
# (Check firewall rules, network connectivity)

# Test Colony OS submission manually
curl -X POST http://your-server:8080/api/v1/functions/submit \
  -H "Content-Type: application/json" \
  -d '{"funcname": "test", "args": [], "colonyname": "zyeute-colony"}'

# Check environment variables in Netlify
# COLONIES_SERVER_HOST, COLONIES_USER_PRVKEY, USE_COLONY_OS
```

**Common Causes:**
- Colony Server not accessible from Netlify
- Invalid user private key
- USE_COLONY_OS not set to 'true'
- Network/firewall blocking connections

---

### 6. Resource Contention with CI/CD

**Symptoms:**
- CI/CD jobs slow or failing
- Runner out of resources
- Finance Bee consuming too much CPU/memory

**Solutions:**

```bash
# Check resource usage
systemctl status zyeute-finance-bee
systemd-cgtop

# Adjust resource limits
sudo systemctl edit zyeute-finance-bee
# Add:
# [Service]
# CPUShares=256
# MemoryLimit=256M

# Restart service
sudo systemctl restart zyeute-finance-bee
```

**Common Causes:**
- Finance Bee not respecting resource limits
- Too many concurrent tasks
- Memory leak in Python script

---

### 7. Cryptographic Key Issues

**Symptoms:**
- "Invalid signature" errors
- Executor registration failed
- Authentication errors

**Solutions:**

```bash
# Verify keys are set
echo $COLONIES_EXECUTOR_PRVKEY | wc -c  # Should be ~64 characters

# Regenerate keys if needed
./scripts/generate-keys.sh

# Update GitHub Secrets
./scripts/store-keys.sh

# Redeploy Finance Bee
sudo systemctl restart zyeute-finance-bee
```

**Common Causes:**
- Keys not generated correctly
- Keys not stored in GitHub Secrets
- Keys not injected into systemd service
- Key mismatch between components

---

## Diagnostic Commands

### Check All Systems
```bash
# Run health check
python3 infrastructure/colony/monitoring/check-health.py
```

### Check Colony Server
```bash
# Health endpoint
curl http://localhost:8080/api/v1/health

# List executors (requires CLI)
colonies executor list

# List tasks (requires CLI)
colonies process list
```

### Check Finance Bee
```bash
# Service status
systemctl status zyeute-finance-bee

# Recent logs
journalctl -u zyeute-finance-bee -n 50

# Follow logs
journalctl -u zyeute-finance-bee -f

# Check process
ps aux | grep finance_bee
```

### Check Redis Heartbeat
```bash
# Get heartbeat
redis-cli GET executor:zyeute-finance-bee-01:heartbeat

# Get stats
redis-cli HGETALL executor:zyeute-finance-bee-01:stats
```

---

## Emergency Procedures

### Rollback to Direct Processing

If Colony OS is causing issues:

1. **Disable Colony OS in webhook:**
```bash
# In Netlify dashboard, set:
USE_COLONY_OS=false
```

2. **Stop Finance Bee:**
```bash
sudo systemctl stop zyeute-finance-bee
```

3. **Verify webhooks work:**
- Trigger test webhook
- Verify Supabase updates directly

### Restart Everything

```bash
# Stop Finance Bee
sudo systemctl stop zyeute-finance-bee

# Restart Colony Server
cd infrastructure/colony
docker-compose restart

# Start Finance Bee
sudo systemctl start zyeute-finance-bee

# Verify health
python3 monitoring/check-health.py
```

---

## Getting Help

1. Check logs first (systemd, Docker, Netlify)
2. Run health check script
3. Review this troubleshooting guide
4. Check Colony OS documentation
5. Contact team for support

