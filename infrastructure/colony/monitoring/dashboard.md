# Colony OS Monitoring Dashboard Setup

## Monitoring Points

### 1. Colony Server Metrics
- Task queue depth
- Active executors
- Task completion rates
- Error rates
- Average execution time

### 2. Finance Bee Metrics
- Systemd service status
- Execution logs
- Task success/failure rates
- Guardian statistics (blocked/approved)
- Resource usage (CPU, memory)

### 3. Integration Metrics
- Webhook submission rate
- Task execution time
- Supabase update success rate
- End-to-end latency

## Monitoring Tools

### Systemd Status
```bash
# Check service status
systemctl status zyeute-finance-bee

# View logs
journalctl -u zyeute-finance-bee -f

# View recent logs
journalctl -u zyeute-finance-bee -n 100
```

### Colony Server Monitoring
```bash
# Check server health
curl http://localhost:8080/api/v1/health

# View active executors
# (Use Colony OS CLI or API)

# View task queue
# (Use Colony OS CLI or API)
```

### Redis Monitoring (Heartbeat)
```bash
# Check heartbeat
redis-cli GET executor:zyeute-finance-bee-01:heartbeat

# Check stats
redis-cli HGETALL executor:zyeute-finance-bee-01:stats

# List all executors
redis-cli KEYS executor:*:heartbeat
```

### Resource Monitoring
```bash
# CPU and memory usage
systemctl status zyeute-finance-bee

# Detailed resource usage
systemd-cgtop

# Process info
ps aux | grep finance_bee
```

## Alerting

### Critical Alerts
- Finance Bee service down
- Heartbeat missing > 2 minutes
- Error rate > 5%
- Task queue depth > 100

### Warning Alerts
- CPU usage > 80%
- Memory usage > 400MB
- Task execution time > 10 seconds
- Supabase update failures

## Dashboards

### Option 1: Grafana
- Set up Grafana dashboard
- Connect to PostgreSQL (Colony Server DB)
- Connect to Redis (heartbeat data)
- Create visualizations

### Option 2: Custom Dashboard
- Build React dashboard in Zyeute admin
- Query Colony Server API
- Query Redis for heartbeat
- Display real-time metrics

### Option 3: Simple Monitoring Script
```python
# monitoring/check_health.py
import redis
import requests
from datetime import datetime

def check_colony_health():
    # Check Colony Server
    response = requests.get('http://localhost:8080/api/v1/health')
    print(f"Colony Server: {'✅ Healthy' if response.ok else '❌ Down'}")
    
    # Check Finance Bee heartbeat
    r = redis.from_url(os.environ['REDIS_URL'])
    heartbeat = r.get('executor:zyeute-finance-bee-01:heartbeat')
    
    if heartbeat:
        last_beat = datetime.fromisoformat(heartbeat.decode('utf-8'))
        delta = (datetime.utcnow() - last_beat).total_seconds()
        status = '✅ Alive' if delta < 120 else '❌ Dead'
        print(f"Finance Bee: {status} (last beat {delta:.0f}s ago)")
    else:
        print("Finance Bee: ❌ No heartbeat")

if __name__ == '__main__':
    check_health()
```

## Logging

### Log Locations
- **Finance Bee**: `journalctl -u zyeute-finance-bee`
- **Colony Server**: `docker logs colonies-server`
- **PostgreSQL**: `docker logs colonies-postgres`

### Log Levels
- **INFO**: Normal operations
- **WARN**: Recoverable errors
- **ERROR**: Failed tasks, system issues

### Log Aggregation
Consider using:
- Loki + Grafana
- ELK Stack
- CloudWatch Logs
- Datadog

## Performance Metrics

### Key Metrics to Track
- Tasks per minute
- Average execution time
- Success rate
- Error rate
- Queue depth
- Executor count

### Targets
- Success rate: > 99%
- Average execution time: < 5 seconds
- Queue depth: < 10
- Error rate: < 1%

## Troubleshooting

### Finance Bee Not Processing Tasks
1. Check service status: `systemctl status zyeute-finance-bee`
2. Check logs: `journalctl -u zyeute-finance-bee -f`
3. Verify Colony Server connection
4. Check environment variables

### High Error Rate
1. Check Guardian statistics
2. Review error logs
3. Verify Supabase connection
4. Check Stripe API status

### Resource Issues
1. Check CPU/memory usage
2. Adjust systemd resource limits
3. Consider scaling horizontally

## Next Steps

- [ ] Set up Grafana dashboard
- [ ] Configure alerting (PagerDuty, Slack)
- [ ] Add log aggregation
- [ ] Create custom monitoring dashboard in Zyeute admin

