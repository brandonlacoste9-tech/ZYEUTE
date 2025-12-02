# Colony OS Infrastructure

Deployment and configuration for Colony OS Server and Worker Bees.

## Quick Start

### 1. Deploy Colonies Server

```bash
cd infrastructure/colony

# Copy environment template
cp colonies-server.env.example .env

# Edit .env and set COLONIES_DB_PASSWORD
nano .env

# Start services
docker-compose up -d

# Verify health
curl http://localhost:8080/api/v1/health
```

### 2. Generate Cryptographic Keys

```bash
# Install Colony OS CLI
# (Follow Colony OS documentation for installation)

# Generate Colony key
colonies key generate --type colony > keys/colony.key

# Generate User key (for Zyeute API)
colonies key generate --type user > keys/user.key

# Generate Executor key (for Finance Bee)
colonies key generate --type executor > keys/executor.key

# Store keys in GitHub Secrets
# COLONIES_COLONY_PRVKEY
# COLONIES_USER_PRVKEY
# COLONIES_EXECUTOR_PRVKEY
```

### 3. Deploy Finance Bee

See `bees/README.md` for Finance Bee deployment instructions.

## Architecture

```
Zyeute Frontend (Vercel)
    ↓ submits func_spec
Colonies Server (Docker)
    ↓ assigns (long-poll)
Finance Bee (Systemd)
    ↓ executes
Supabase (Database)
```

## Components

- **Colonies Server**: Task broker and coordinator
- **PostgreSQL**: Task queue database
- **Finance Bee**: Stripe webhook processor
- **Security Bee**: Anomaly detection (future)
- **Archive Bee**: Data governance (future)

## Monitoring

```bash
# Check server status
docker-compose ps

# View logs
docker-compose logs -f colonies-server

# Check database
docker-compose exec postgres psql -U colonies -d colonies
```

## Troubleshooting

### Server won't start
- Check `.env` file exists and has correct values
- Verify PostgreSQL password is set
- Check port 8080 is not in use

### Can't connect to server
- Verify server is running: `docker-compose ps`
- Check firewall rules
- Verify health endpoint: `curl http://localhost:8080/api/v1/health`

### Database connection issues
- Check PostgreSQL is healthy: `docker-compose ps`
- Verify database credentials in `.env`
- Check PostgreSQL logs: `docker-compose logs postgres`

## Security

- Store all keys in GitHub Secrets (never commit to repo)
- Use TLS in production (`COLONIES_SERVER_TLS=true`)
- Rotate keys quarterly
- Monitor access logs

## Deployment Options

### Option A: VPS Deployment
- Deploy docker-compose on VPS
- Configure firewall (allow port 8080)
- Set up domain/DNS
- Configure TLS certificates

### Option B: Cloud Deployment
- Deploy to AWS/GCP/Azure
- Use managed PostgreSQL
- Configure load balancer
- Set up auto-scaling

## Next Steps

1. Deploy Colonies Server
2. Generate cryptographic keys
3. Deploy Finance Bee
4. Test end-to-end flow
5. Monitor and iterate

