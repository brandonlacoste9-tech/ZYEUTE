# ⚡ Colony OS Quick Start

## ✅ Setup Complete!

**What's been done:**
1. ✅ Root dependencies installed
2. ✅ Package dependencies installed  
3. ✅ Protobuf code generated
4. ✅ Configuration files created

## 🚀 Next Steps

### 1. Start the Database

```bash
# Start Postgres with pgvector
docker-compose -f colony-os-hybrid-stack.yml up -d postgres redis

# Wait for services to be healthy
docker-compose -f colony-os-hybrid-stack.yml ps
```

### 2. Run Database Migrations

```bash
cd packages/kernel-node

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 3. Configure Environment

Create `.env` file in root directory:

```env
# OpenAI (required for Bee workers)
OPENAI_API_KEY=sk-your-key-here

# Database
POSTGRES_PASSWORD=colony_pass
DATABASE_URL=postgresql://colony:colony_pass@localhost:5432/colony

# Redis
REDIS_URL=redis://localhost:6379

# Service URLs
NEUROSPHERE_URL=http://localhost:8000
NEURASPHERE_URL=http://localhost:8001
KERNEL_URL=http://localhost:3000
```

### 4. Start Python Services

**Terminal 1 - Neurosphere (Mind):**
```bash
cd packages/neurosphere-python
pip install -r requirements.txt
python grpc_server.py
```

**Terminal 2 - Neurasphere (Guardian):**
```bash
# (If you have the neurasphere package)
cd packages/neurasphere-python
pip install -r requirements.txt
python grpc_server.py
```

### 5. Start Node.js Services

**Terminal 3 - Kernel:**
```bash
npm run dev:kernel
```

**Terminal 4 - Bee Worker:**
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
    "description": "Summarize this: Colony OS is the first AI civilization operating system",
    "priority": "high"
  }'

# Get task status (replace {task_id} with ID from above)
curl http://localhost:3000/v1/tasks/{task_id}
```

## 📋 Available Commands

```bash
# Generate protobuf code
npm run generate
# or
npx @bufbuild/buf generate

# Install all dependencies
npm run install:all

# Start Kernel in dev mode
npm run dev:kernel

# Start Bee worker in dev mode
npm run dev:bee

# Build all packages
npm run build:all
```

## 🐛 Troubleshooting

### "buf: command not found"
```bash
# Use npx instead
npx @bufbuild/buf generate
```

### "Cannot connect to database"
- Make sure Postgres is running: `docker-compose ps`
- Check DATABASE_URL in .env file
- Verify password matches POSTGRES_PASSWORD

### "Protobuf generation fails"
- Check that `proto/` directory exists
- Verify `buf.yaml` and `buf.gen.yaml` are in root
- Try: `npx @bufbuild/buf generate --debug`

### "Python dependencies missing"
```bash
cd packages/neurosphere-python
pip install -r requirements.txt
```

## 🎯 What's Running

Once everything is started, you'll have:

- **Kernel** (Node.js) → `http://localhost:3000`
- **Neurosphere** (Python) → `http://localhost:8000`
- **Neurasphere** (Python) → `http://localhost:8001`
- **Postgres** → `localhost:5432`
- **Redis** → `localhost:6379`
- **Bee Workers** → Various roles (DocBee, CodeBee, etc.)

## 📚 Documentation

- **Full Setup Guide:** `SETUP.md`
- **Architecture:** `COLONY_OS_README.md`
- **CMAR-1 Rulings:** `GEMINI_CMAR1_SYNTHESIS.md`
- **God Mode Summary:** `GOD_MODE_COMPLETE.md`

## 🚀 Ready to Deploy?

```bash
# Start the complete stack
docker-compose -f colony-os-hybrid-stack.yml up -d

# View logs
docker-compose -f colony-os-hybrid-stack.yml logs -f
```

---

**The Colony is ready to wake up!** 🐝⚡

