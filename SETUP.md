# 🚀 Colony OS Setup Guide

## Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- OpenAI API key

## Quick Start

### 1. Install Dependencies

```bash
# Root dependencies
npm install

# Package dependencies
npm run install:packages
```

### 2. Generate Protobuf Code

```bash
# Install buf CLI (if not already installed)
npm install -g @bufbuild/buf

# Generate TypeScript and Python code from proto files
npx buf generate
```

**Note:** If `buf` is not found, install it globally:
```bash
# Windows (PowerShell)
choco install buf

# macOS
brew install bufbuild/buf/buf

# Linux
curl -sSL "https://github.com/bufbuild/buf/releases/latest/download/buf-$(uname -s)-$(uname -m)" -o "/usr/local/bin/buf"
chmod +x "/usr/local/bin/buf"
```

### 3. Set Up Database

```bash
# Start Postgres with pgvector
docker-compose -f colony-os-hybrid-stack.yml up -d postgres

# Run migrations
cd packages/kernel-node
npx prisma migrate dev
npx prisma generate
```

### 4. Configure Environment

Create `.env` file in root:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Database
POSTGRES_PASSWORD=your_secure_password
DATABASE_URL=postgresql://colony:your_secure_password@localhost:5432/colony

# Redis
REDIS_URL=redis://localhost:6379

# Services
NEUROSPHERE_URL=http://localhost:8000
NEURASPHERE_URL=http://localhost:8001
KERNEL_URL=http://localhost:3000
```

### 5. Start Development Servers

**Terminal 1 - Python Mind (Neurosphere):**
```bash
cd packages/neurosphere-python
pip install -r requirements.txt
python grpc_server.py
```

**Terminal 2 - Node.js Kernel:**
```bash
npm run dev:kernel
```

**Terminal 3 - Bee Worker:**
```bash
cd packages/bee-node
BEE_ROLE=DocBee npm run dev
```

### 6. Test the System

```bash
# Health check
curl http://localhost:3000/health

# Create a task
curl -X POST http://localhost:3000/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Summarize this document: Colony OS is amazing!",
    "priority": "high"
  }'
```

## Troubleshooting

### buf: command not found

Install buf CLI globally or use npx:
```bash
npx @bufbuild/buf generate
```

### Protobuf generation fails

Make sure proto files are in `proto/` directory and `buf.yaml` exists in root.

### Database connection errors

Ensure Postgres is running:
```bash
docker-compose -f colony-os-hybrid-stack.yml ps
```

### Python dependencies missing

```bash
cd packages/neurosphere-python
pip install -r requirements.txt
```

## Next Steps

- [ ] Generate protobuf code
- [ ] Run database migrations
- [ ] Start all services
- [ ] Test task submission
- [ ] Monitor logs

