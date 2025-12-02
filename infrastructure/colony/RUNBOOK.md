# Colony OS Operational Runbook

## Daily Operations

### Morning Health Check
```bash
# Run automated health check
python3 infrastructure/colony/monitoring/check-health.py

# Check service status
systemctl status zyeute-finance-bee

# Review overnight logs
journalctl -u zyeute-finance-bee --since "24 hours ago" | grep ERROR
```

### Monitor Task Queue
```bash
# Check queue depth (via Colony OS CLI or API)
# Target: < 10 tasks

# Check completion rate
# Target: > 99%

# Check error rate
# Target: < 1%
```

---

## Weekly Operations

### Review Metrics
- Task execution success rate
- Average execution time
- Error patterns
- Resource usage trends

### Check Logs
```bash
# Review error logs
journalctl -u zyeute-finance-bee --since "7 days ago" | grep ERROR

# Check Guardian blocks
journalctl -u zyeute-finance-bee --since "7 days ago" | grep "Guardian blocked"
```

### Verify Backups
- Colony Server database backup
- Configuration backups
- Key backups (encrypted)

---

## Monthly Operations

### Rotate Cryptographic Keys
```bash
# Generate new keys
./infrastructure/colony/scripts/generate-keys.sh

# Update GitHub Secrets
./infrastructure/colony/scripts/store-keys.sh

# Redeploy Finance Bee
# (GitHub Actions workflow will pick up new keys)
```

### Performance Review
- Review task execution metrics
- Identify optimization opportunities
- Plan capacity increases if needed

### Security Audit
- Review access logs
- Check for suspicious activity
- Verify RLS policies
- Review Guardian statistics

---

## Incident Response

### Finance Bee Down

**Severity:** High

**Steps:**
1. Check systemd status: `systemctl status zyeute-finance-bee`
2. Review logs: `journalctl -u zyeute-finance-bee -n 100`
3. Attempt restart: `sudo systemctl restart zyeute-finance-bee`
4. If restart fails, check environment variables and dependencies
5. If still failing, enable direct processing fallback
6. Investigate root cause

**Escalation:** If down > 15 minutes, page on-call engineer

---

### Colony Server Down

**Severity:** Critical

**Steps:**
1. Check Docker containers: `docker-compose ps`
2. Review logs: `docker-compose logs colonies-server`
3. Attempt restart: `docker-compose restart colonies-server`
4. If restart fails, check PostgreSQL health
5. Enable direct processing fallback immediately
6. Investigate root cause

**Escalation:** Immediate - page on-call engineer

---

### High Error Rate

**Severity:** Medium

**Steps:**
1. Check Finance Bee logs for error patterns
2. Review Guardian statistics
3. Check Supabase connection
4. Check Stripe API status
5. Identify root cause
6. Apply fix or rollback if needed

**Escalation:** If error rate > 10%, page on-call engineer

---

### Resource Exhaustion

**Severity:** Medium

**Steps:**
1. Check resource usage: `systemd-cgtop`
2. Identify resource hog
3. Adjust systemd resource limits if needed
4. Consider scaling horizontally (add more runners)
5. Monitor after adjustment

**Escalation:** If affecting CI/CD, immediate escalation

---

## Deployment Procedures

### Deploy Finance Bee Update

```bash
# 1. Merge PR to main branch
# 2. GitHub Actions workflow triggers automatically
# 3. Monitor deployment logs
# 4. Verify service restarted successfully
# 5. Check health after deployment
```

### Deploy Colony Server Update

```bash
# 1. Update docker-compose.yml with new image version
# 2. Pull new image
docker-compose pull

# 3. Restart with new image
docker-compose up -d

# 4. Verify health
curl http://localhost:8080/api/v1/health

# 5. Monitor logs
docker-compose logs -f colonies-server
```

---

## Rollback Procedures

### Rollback Finance Bee

```bash
# 1. Stop current service
sudo systemctl stop zyeute-finance-bee

# 2. Checkout previous version
git checkout <previous-commit> infrastructure/colony/bees/

# 3. Redeploy
sudo ./infrastructure/colony/scripts/deploy-bee.sh

# 4. Verify
systemctl status zyeute-finance-bee
```

### Rollback Colony Server

```bash
# 1. Update docker-compose.yml to previous image version
# 2. Restart
docker-compose up -d

# 3. Verify
curl http://localhost:8080/api/v1/health
```

### Disable Colony OS (Emergency)

```bash
# In Netlify dashboard, set:
USE_COLONY_OS=false

# This reverts to direct Supabase processing
```

---

## Maintenance Windows

### Planned Maintenance

**Before:**
1. Announce maintenance window
2. Enable direct processing fallback
3. Stop Finance Bee
4. Perform maintenance
5. Verify health
6. Re-enable Colony OS processing

**During:**
- Monitor error rates
- Check task queue depth
- Verify no data loss

**After:**
- Run health check
- Monitor for 1 hour
- Verify metrics return to normal

---

## Contacts

- **On-Call Engineer:** [Contact info]
- **Infrastructure Team:** [Contact info]
- **Supabase Support:** [Support link]
- **Colony OS Support:** [Support link]

---

## Useful Commands Reference

### Systemd
```bash
systemctl status zyeute-finance-bee
systemctl start zyeute-finance-bee
systemctl stop zyeute-finance-bee
systemctl restart zyeute-finance-bee
journalctl -u zyeute-finance-bee -f
```

### Docker
```bash
docker-compose ps
docker-compose logs -f
docker-compose restart
docker-compose down
docker-compose up -d
```

### Health Checks
```bash
python3 infrastructure/colony/monitoring/check-health.py
curl http://localhost:8080/api/v1/health
systemctl is-active zyeute-finance-bee
```

