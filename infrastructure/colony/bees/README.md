# Colony OS Worker Bees

Python-based Worker Bees for distributed task execution.

## Finance Bee

Handles Stripe webhook processing via Colony OS task queue.

### Setup

```bash
# Install dependencies
pip3 install -r requirements.txt

# Set environment variables
export COLONIES_SERVER_HOST="http://localhost:8080"
export COLONIES_EXECUTOR_PRVKEY="your_executor_private_key"
export COLONIES_COLONY_NAME="zyeute-colony"
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
export STRIPE_SECRET_KEY="your_stripe_secret_key"

# Run Finance Bee
python3 finance_bee.py
```

### Deployment

```bash
# Deploy as systemd service
sudo ./scripts/deploy-bee.sh

# Check status
systemctl status zyeute-finance-bee

# View logs
journalctl -u zyeute-finance-bee -f
```

## Components

- `finance_bee.py` - Main Finance Bee implementation
- `config.py` - Configuration management
- `guardian.py` - Safety layer for content validation
- `requirements.txt` - Python dependencies

## Testing

```bash
# Run unit tests
python3 -m pytest tests/test_finance_bee.py
python3 -m pytest tests/test_guardian.py

# Run integration tests (requires Colony Server running)
INTEGRATION_TEST=true python3 tests/integration/test_colony_flow.py
```

## Monitoring

```bash
# Check health
python3 ../monitoring/check-health.py

# View heartbeat
python3 ../monitoring/heartbeat.py
```

## Troubleshooting

### Service won't start
- Check environment variables are set
- Verify Colony Server is accessible
- Check logs: `journalctl -u zyeute-finance-bee -n 100`

### Tasks not executing
- Verify executor is registered with Colony Server
- Check Colony Server logs
- Verify cryptographic keys are correct

### Supabase errors
- Verify service role key is correct
- Check RLS policies allow service role to update
- Verify table schema matches expectations

## Future Bees

- **Security Bee**: Anomaly detection and security monitoring
- **Archive Bee**: Data governance and cold storage
- **Analytics Bee**: Data processing and reporting
- **Image Bee**: AI image generation (Ti-Guy Artiste)
- **Video Bee**: AI video processing (Ti-Guy Studio)

