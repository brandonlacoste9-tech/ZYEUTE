# Zyeuté Architecture Analysis & Blueprint
## Colony OS - Phase 1 Complete → Phase 2 Planning

**Document Version:** 1.0  
**Date:** December 2025  
**Project:** Zyeuté (Quebec's Social Platform)  
**Status:** Active Development (Phase 1 ✅ | Phase 2 🚀)

---

## Executive Summary

**Zyeuté** is Quebec's first AI-powered social media platform, built with a modern microservices-influenced monorepo architecture. The system integrates multiple AI services (OpenAI, DeepSeek, FAL), payment processing (Stripe), real-time data (Supabase), and a sophisticated agent-based operating system (Colony OS).

### Key Statistics
- **Framework:** Next.js 16 (React 18)
- **Backend:** Node.js (monorepo with workspaces)
- **Database:** PostgreSQL (Supabase) with pgvector for AI embeddings
- **Real-time:** Supabase RealtimeDB
- **AI Services:** OpenAI, DeepSeek, FAL AI
- **Payment:** Stripe (subscription + marketplace)
- **Deployment:** Vercel (primary) + self-hosted options
- **Code Coverage:** Vitest + Playwright E2E
- **Target Users:** 10,000+ concurrent users by EOY 2025
- **Supported Languages:** French (Joual), English

---

## Part 1: System Architecture Overview

### 1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (React 18)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pages: Feed, Profile, Messages, Marketplace, Studio │   │
│  │  Components: Avatar, Image, GoldButton, Theme Prov.   │   │
│  │  UI Framework: Tailwind CSS 4 + Leather Design Token │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  NEXT.JS MIDDLEWARE LAYER                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes: /api/auth, /api/stripe, /api/ai        │   │
│  │  Server Actions: Form submissions, Data mutations    │   │
│  │  Middleware: Auth validation, CORS, Rate limiting    │   │
│  │  Edge Functions: Image optimization, redirects       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 BUSINESS LOGIC LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication (Supabase Auth + Google OAuth)       │   │
│  │  Social Logic (Posts, Stories, Comments, Reactions)  │   │
│  │  Marketplace Logic (Listings, Orders, Payments)      │   │
│  │  AI Integration (Ti-Guy Artiste, Studio, Chat)       │   │
│  │  Notifications & Events (Real-time subscriptions)    │   │
│  │  User Analytics & Gamification (Points, Badges)      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│            EXTERNAL SERVICES INTEGRATION LAYER               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │   │
│  │  │  OpenAI API  │  │  DeepSeek    │  │  FAL AI    │ │   │
│  │  │ (GPT-4, etc) │  │ (Lower cost) │  │(Images)    │ │   │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │   │
│  │  ┌──────────────┐  ┌──────────────────────────────┐ │   │
│  │  │   Stripe     │  │    Google Auth / Analytics   │ │   │
│  │  │ (Payments)   │  │                              │ │   │
│  │  └──────────────┘  └──────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 DATA PERSISTENCE LAYER                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         PostgreSQL (Supabase + pgvector)             │   │
│  │                                                      │   │
│  │  Tables: Users, Posts, Comments, Stories,          │   │
│  │  Marketplace Items, Orders, Notifications,          │   │
│  │  AI Embeddings, Agent State (Colony OS)             │   │
│  │                                                      │   │
│  │  Real-time: Supabase Realtime for live updates     │   │
│  │  Vector: pgvector for semantic search & AI          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Monorepo Structure

```
Zyeute/
├── src/                              # Main Next.js app
│   ├── app/
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles + Leather tokens
│   │   ├── providers.tsx             # Context providers
│   │   ├── (authenticated)/          # Protected routes
│   │   │   ├── feed/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── messages/page.tsx
│   │   │   ├── marketplace/page.tsx
│   │   │   └── studio/page.tsx
│   │   └── api/                      # API routes
│   │       ├── auth/                 # Authentication endpoints
│   │       ├── stripe/               # Payment webhooks
│   │       ├── ai/                   # AI service proxies
│   │       └── social/               # Social features
│   │
│   ├── components/                   # React components
│   │   ├── Avatar.tsx
│   │   ├── Image.tsx
│   │   ├── GoldButton.tsx
│   │   ├── Logo.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── [feature]/                # Feature-specific components
│   │
│   ├── lib/
│   │   ├── auth.ts                   # Supabase auth logic
│   │   ├── stripe.ts                 # Stripe integration
│   │   ├── utils.ts                  # Utility functions
│   │   ├── logger.ts                 # Logging & error tracking
│   │   ├── ai/
│   │   │   ├── openai.ts             # OpenAI client
│   │   │   ├── deepseek.ts           # DeepSeek client
│   │   │   └── fal.ts                # FAL AI client
│   │   └── db/
│   │       ├── client.ts             # Supabase client
│   │       └── queries.ts            # Common DB queries
│   │
│   ├── types/
│   │   ├── index.ts                  # Exported types
│   │   ├── database.ts               # Auto-gen from Supabase
│   │   ├── chat.ts                   # Chat/AI types
│   │   └── SecurityAuditSchema.ts    # Audit types
│   │
│   ├── schemas/
│   │   ├── SecurityAuditSchema.ts
│   │   └── [feature].schema.ts
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   └── useSubscription.ts
│   │
│   └── styles/
│       ├── leather-ui.css            # Leather design tokens
│       └── [component].css
│
├── packages/                         # Monorepo workspaces
│   ├── kernel-node/                  # AI agent engine (Colony OS)
│   │   ├── src/
│   │   │   ├── agents/               # Agent definitions
│   │   │   ├── tasks/                # Task processing
│   │   │   ├── memory/               # Agent memory system
│   │   │   └── orchestration/        # Workflow management
│   │   ├── prisma/
│   │   │   └── schema.prisma         # Agent data models
│   │   └── package.json
│   │
│   └── bee-node/                     # Secondary agent framework
│       ├── src/
│       └── package.json
│
├── scripts/
│   ├── setup-database.js             # Supabase initialization
│   ├── setup-preview-branch.sh       # Dev environment setup
│   └── generate-docs.ts              # Documentation generation
│
├── public/                           # Static assets
│   ├── images/
│   ├── icons/
│   └── sounds/
│
├── tests/
│   ├── unit/                         # Vitest unit tests
│   ├── integration/                  # Integration tests
│   └── e2e/                          # Playwright E2E tests
│
├── .github/workflows/                # CI/CD pipelines
│   ├── test.yml
│   ├── build.yml
│   └── deploy.yml
│
├── docs/
│   ├── ARCHITECTURE.md               # This file
│   ├── API.md                        # API documentation
│   ├── DATABASE.md                   # Database schema
│   └── CONTRIBUTING.md               # Contribution guidelines
│
├── vitest.config.ts                  # Test configuration
├── playwright.config.ts              # E2E test configuration
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Root dependencies
```

### 1.3 Database Schema (PostgreSQL + Supabase)

#### Core Tables

**users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  location VARCHAR(255),           -- e.g., "Quebec City, QC"
  website_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_tier VARCHAR(50),         -- 'vip', 'supporter', etc.
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Gamification
  reputation_score DECIMAL(10,2) DEFAULT 0,
  total_fires INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  metadata JSONB,
  auth_provider VARCHAR(50),        -- 'google', 'supabase', etc.
  last_seen_at TIMESTAMP
);
```

**posts / publications**
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[],                -- Array of image/video URLs
  mentions VARCHAR(100)[],          -- Mentioned users
  hashtags VARCHAR(100)[],          -- Hashtags
  location_id VARCHAR(50),
  visibility VARCHAR(20) DEFAULT 'public',
  comment_count INTEGER DEFAULT 0,
  reaction_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Search & AI
  embedding vector(1536),           -- OpenAI embeddings (pgvector)
  search_vector tsvector            -- Full-text search
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_embedding ON posts USING ivfflat (embedding vector_cosine_ops);
```

**comments**
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[],
  reactions JSONB DEFAULT '{"fires": 0, "hearts": 0}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**stories**
```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,           -- Image/video URL
  caption TEXT,
  duration INTEGER DEFAULT 5000,     -- Display duration in ms
  views JSONB DEFAULT '{}'::jsonb,   -- {user_id: timestamp}
  expires_at TIMESTAMP,              -- Auto-delete after 24h
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**marketplace_items**
```sql
CREATE TABLE marketplace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'CAD',
  images TEXT[],
  is_available BOOLEAN DEFAULT TRUE,
  sold_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**orders**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  item_id UUID NOT NULL REFERENCES marketplace_items(id),
  quantity INTEGER DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  payment_intent_id VARCHAR(255),   -- Stripe PaymentIntent ID
  status VARCHAR(50) DEFAULT 'pending',  -- 'pending', 'paid', 'shipped', 'delivered'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**subscriptions**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  tier VARCHAR(50) NOT NULL,         -- 'free', 'supporter', 'vip'
  status VARCHAR(50) DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  canceled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**notifications**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL,         -- 'fire', 'comment', 'follow', 'mention'
  target_id UUID,                    -- Post/comment ID
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**ai_conversations**
```sql
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]'::jsonb, -- [{role, content, timestamp}]
  model VARCHAR(100),                -- 'gpt-4', 'deepseek', etc.
  context JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**agent_state** (Colony OS)
```sql
CREATE TABLE agent_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL UNIQUE,
  agent_role VARCHAR(100),           -- 'scheduler', 'analyzer', 'content_moderator'
  status VARCHAR(50) DEFAULT 'idle',
  memory JSONB DEFAULT '{}'::jsonb,
  last_execution TIMESTAMP,
  next_execution TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Part 2: Technology Stack Deep Dive

### 2.1 Frontend Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 | SSR, SSG, API routes, middleware |
| **UI Library** | React 18 | Component-based UI |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Design System** | Leather UI + Gold tokens | Custom design system |
| **Icons** | react-icons | Icon library |
| **Animation** | Framer Motion 12 | Advanced animations |
| **QR Codes** | qrcode.react | QR generation |
| **State** | React hooks + Context API | Local state management |
| **Form Handling** | React Hook Form (implied) | Form validation |

### 2.2 Backend Stack (Next.js)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Server Framework** | Next.js 16 | Full-stack framework |
| **API Routes** | Node.js handlers | REST endpoints |
| **Server Actions** | React 18 | Form mutations |
| **Middleware** | Next.js middleware | Auth, CORS, logging |
| **Edge Functions** | Vercel Edge Functions | Image optimization, redirects |
| **Database Client** | Supabase JS SDK | PostgreSQL access |
| **ORM** | Prisma | Schema definition, migrations |

### 2.3 AI & ML Services

- **OpenAI**: GPT-4 for chat, embeddings, moderation
- **DeepSeek**: Cost-optimized chat completions
- **FAL AI**: Image generation (Flux Pro)
- **pgvector**: Semantic search with embeddings

### 2.4 Payment Processing (Stripe)

- Subscription management
- Marketplace payment processing
- Webhook handling for payment events
- PCI Level 1 compliance

### 2.5 Authentication & Authorization

- Supabase Auth with JWT tokens
- Google OAuth integration
- Row-Level Security (RLS) policies
- Session management

### 2.6 Real-time Features

- Supabase Realtime subscriptions for posts, stories, notifications
- WebSocket-based real-time updates
- Live feed generation

---

## Part 3: Key Features & Modules

### 3.1 Social Features
- **Posts**: Text + media with AI embeddings
- **Stories**: 24-hour ephemeral content
- **Comments**: Threaded discussions
- **Reactions**: Fire 🔥 and heart ❤️ reactions
- **Follow System**: User relationships and follower counts

### 3.2 Marketplace Module
- Listing creation with images
- Purchase flow with Stripe integration
- Order tracking and status management
- Seller ratings and reviews

### 3.3 AI Features
- **Ti-Guy Artiste**: Quebec-themed AI assistant with Joual support
- **Ti-Guy Studio**: AI image generation for content creators
- **Content Moderation**: Automated flagging and review

### 3.4 Gamification & Reputation
- Reputation scoring system
- Badge/achievement system
- Leaderboards (regional, global)
- Point multipliers for premium users

---

## Part 4: Colony OS (Agent Framework)

**Colony OS** is Zyeuté's autonomous agent operating system built on:

1. **kernel-node** - Prisma-based task queue and agent orchestration
2. **bee-node** - Secondary agent framework

### Agent Types

- **Scheduler Agent**: Time-sensitive tasks, notifications, cleanup
- **Analyzer Agent**: Metrics aggregation, recommendations, trend analysis
- **Content Moderator Agent**: Content review, guideline enforcement

---

## Part 5: Testing & Quality Assurance

### Test Stack

- **Unit Tests**: Vitest for components, utilities, hooks
- **Integration Tests**: API routes, database operations
- **E2E Tests**: Playwright for user flows
- **Coverage**: Target 80% line coverage

### Development Commands

```bash
npm run test:run         # Run all tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Generate coverage report
npm run type-check       # TypeScript check
npm run lint             # ESLint
npm run format           # Prettier formatting
```

---

## Part 6: DevOps & Deployment

### CI/CD Pipeline

- **GitHub Actions**: Automated testing and builds
- **Vercel**: Production deployment
- **Docker**: Self-hosted option

### Environment Configuration

See `.env.example` for all required environment variables:
- Supabase credentials
- AI API keys (OpenAI, DeepSeek, FAL)
- Stripe keys
- Google OAuth credentials

---

## Part 7: Performance & Scalability

### Optimization Strategies

- **Image Optimization**: Next.js Image component with blur placeholders
- **Database Optimization**: Cursor-based pagination, batch operations, connection pooling
- **Caching**: ISR (Incremental Static Regeneration), fetch caching

### Load Testing Baseline

- Target: 10,000 concurrent users
- Response Time: <200ms p95
- Database Connections: Max 100
- API Throughput: 5,000 req/sec

---

## Part 8: Security & Compliance

### Authentication & Authorization

- JWT tokens (15 min access, 7 day refresh)
- Supabase Row-Level Security (RLS)
- Google OAuth with OpenID Connect
- Password hashing with bcrypt

### Data Protection

- Encryption at rest with AES-256
- Stripe PCI Level 1 compliance
- Input validation with Zod schemas
- Rate limiting (100 req/min per user)

### Audit Logging

Track all CREATE, READ, UPDATE, DELETE operations with:
- User ID and action type
- Resource type and ID
- IP address and user agent
- Timestamp and change details

---

## Part 9: Monitoring & Analytics

### Monitoring Stack

- **Vercel Analytics**: Deployment and edge function metrics
- **Error Tracking**: Sentry or custom logger
- **Database Monitoring**: Supabase dashboard
- **Performance**: Web Vitals and Core Web Vitals

### Key Metrics to Track

**Engagement**
- Daily/Monthly Active Users (DAU/MAU)
- Post creation rate
- Comment/reaction rate
- Marketplace transaction count

**Retention**
- Day 1 / 7 / 30 retention
- Churn rate
- Subscription renewal rate

**Performance**
- Page load time
- API response times
- Database query performance
- Error rate

**Business**
- Revenue (MRR, ARR)
- Cost per user acquisition
- Lifetime value (LTV)
- Marketplace GMV

---

## Part 10: Roadmap & Future Enhancements

### Phase 1 (Current) ✅
- [x] Core social features (posts, comments, stories)
- [x] Marketplace
- [x] Stripe subscription system
- [x] Ti-Guy AI assistant
- [x] Image generation (FAL AI)
- [x] User authentication (Google OAuth)
- [x] Real-time notifications

### Phase 2 🚀 (In Progress)
- [ ] Live streaming capabilities
- [ ] Advanced messaging (DMs, group chats)
- [ ] Payment method integration (PayPal, Apple Pay)
- [ ] Content moderation improvements
- [ ] Analytics dashboard for creators
- [ ] Creator monetization tools (tipping, donations)
- [ ] Extended AI features (voice chat, video)
- [ ] Regional discovery algorithm

### Phase 3 (Planned)
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Advanced marketplace features (auctions, bidding)
- [ ] Community moderation system
- [ ] Creator partnerships & sponsorships
- [ ] Web3 integration (optional)
- [ ] Multi-language support (FR/EN/JO)

### Phase 4+ (Vision)
- [ ] International expansion (Canada-wide)
- [ ] Enterprise B2B features
- [ ] API marketplace for third-party developers
- [ ] Advanced analytics & insights for creators
- [ ] NFT/blockchain features (careful consideration)

---

## Part 11: Running Locally

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/brandonlacoste9-tech/Zyeute.git
cd Zyeute

# 2. Install dependencies
npm install
npm run install:packages

# 3. Configure environment
cp .env.example .env.local
# Fill in: Supabase keys, API keys, Stripe keys

# 4. Setup database
npm run db:migrate

# 5. Start development server
npm run dev

# Server runs at http://localhost:3000
```

### Development Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # TypeScript check
npm run test:run         # Run tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Generate coverage report
npm run health-check     # Quick health check
npm run docs             # Generate documentation
```

---

## Part 12: Contributing & Code Standards

### Code Style

```typescript
// ✅ GOOD: Type-safe, well-structured
async function fetchUserPosts(userId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw new Error(`Failed to fetch posts: ${error.message}`);
  return data || [];
}

// ❌ BAD: No types, unclear error handling
async function getPosts(id) {
  const response = await fetch(`/api/posts?user=${id}`);
  const posts = await response.json();
  return posts;
}
```

### Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style
- refactor: Refactoring
- perf: Performance
- test: Tests
- chore: Maintenance

Example:
feat(marketplace): add product filtering by category

Implement category-based filtering on marketplace listings
with real-time updates using Supabase subscriptions.

Closes #123
```

---

## Conclusion

Zyeuté represents a comprehensive, production-ready social media platform specifically tailored for the Quebec market. With its modern tech stack, AI-powered features, and scalable architecture, it's positioned as a competitive alternative to international social platforms.

**Key Strengths:**
- ✅ Modern, type-safe tech stack
- ✅ Integrated AI capabilities (multiple providers)
- ✅ Real-time features with Supabase
- ✅ Subscription & marketplace revenue models
- ✅ Comprehensive testing & QA
- ✅ Agent-based automation (Colony OS)

**Ready for Phase 2:**
- Mobile app development
- Advanced creator tools
- Live streaming integration
- Expanded AI capabilities
- Community-driven moderation

---

## Quick Reference: Key Files

| File | Purpose |
|------|---------|
| `package.json` | Root dependencies & scripts |
| `next.config.js` | Next.js configuration |
| `src/app/layout.tsx` | Root layout & global providers |
| `src/lib/auth.ts` | Authentication logic |
| `src/lib/stripe.ts` | Payment integration |
| `src/lib/ai/openai.ts` | OpenAI integration |
| `packages/kernel-node/prisma/schema.prisma` | Agent state schema |
| `.env.example` | Environment variables template |
| `vitest.config.ts` | Test configuration |
| `docs/ARCHITECTURE.md` | This file |

---

**Document prepared for:** `brandonlacoste9-tech/Zyeute`  
**Last updated:** December 2025  
**Status:** Ready for Phase 2 Development  
**Questions?** Open an issue or check `docs/` directory for more info
