# 🔥⚜️ Zyeuté - L'app sociale du Québec ⚜️🔥
**Fait au Québec, pour le Québec 🇨🇦**

Zyeuté is Quebec's first social media platform built specifically for Quebecers, by Quebecers. Share photos, videos, stories, and connect with your community in authentic Joual.

**✨ Now featuring:**
- **Leather UI** - Premium, modern user interface with rich textures and smooth animations
- **Working Stripe Subscriptions** - Fully integrated payment system for VIP memberships and premium features

## ✨ Features

### 🎨 Creative Tools
- **Ti-Guy Artiste** - AI-powered image generation with Quebec-themed presets
- **Ti-Guy Studio** - AI video editor with auto-captions in Joual
- **Filters & Effects** - Quebec-themed filters (Poutine, Hiver, Construction, etc.)

### 🛍️ E-Commerce
- **Zyeuté Commerce** - Buy/sell tickets, crafts, services, and merch
- **Secure Payments** - Stripe integration for safe transactions
- **Seller Dashboards** - Track sales and manage inventory

### 📍 Location Features
- **Quebec Regions** - Tag posts by region (Montréal, Québec City, Gaspésie, etc.)
- **Montreal Neighborhoods** - Specific quartier tagging (Plateau, Mile End, etc.)
- **Local Discovery** - Find content from your area

### 🎭 Social Features
- **Stories** - 24-hour ephemeral content
- **Live Streaming** - Go live and connect with your audience
- **Comments & Reactions** - Engage with "feu" (fire) reactions
- **Virtual Gifts** - Send poutine, caribou, fleur-de-lys, and more!

### 🤖 AI-Powered
- **Ti-Guy Assistant** - Your friendly AI helper that speaks Joual (powered by Colony OS swarm intelligence)
- **Smart Captions** - AI-generated captions in authentic Quebec French
- **Content Moderation** - AI-powered moderation respecting Quebec culture
- **Image Generation** - DALL-E 3 powered by OpenAI
- **Swarm Intelligence** - Multi-agent AI system for enhanced responses

### 💎 Premium Features
- **Zyeuté VIP** - Bronze, Silver, and Gold tiers
- **Exclusive Content** - Access premium creator content
- **Creator Subscriptions** - Support your favorite creators
- **Ad-Free Experience** - Enjoy Zyeuté without interruptions

### 🎮 Gamification
- **Daily Challenges** - Complete quests for rewards
- **Achievements** - Unlock badges and milestones
- **Leaderboards** - Compete with other Quebecers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- React Native development environment (Expo CLI)
- Supabase account
- Stripe account (for payments)
- OpenAI API key (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/zyeute.git
cd zyeute

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your keys

# Run development server
npm start
# or
expo start
```

Visit the Expo Go app on your device to see the app!

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (for AI features)
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-...

# Stripe (for payments - public key only)
EXPO_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...

# Netlify Functions (for Stripe checkout)
EXPO_PUBLIC_NETLIFY_URL=https://your-site.netlify.app

# Optional: Google OAuth
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

**Note:** For Stripe webhook and server-side operations, configure environment variables in your Netlify dashboard (see `STRIPE_SECRET_KEY` in Netlify Functions).

See `STRIPE_INTEGRATION_SETUP.md` for detailed Stripe setup instructions.

## 📦 Tech Stack

- **Frontend:** React Native + Expo
- **Styling:** React Native StyleSheet + Custom theme
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Payments:** Stripe (via Netlify Functions)
- **AI:** 
  - OpenAI (GPT-4, DALL-E 3)
  - Colony OS (Swarm Intelligence)
- **Backend Services:**
  - Netlify Functions (Stripe checkout & webhooks)
  - Colony OS Python Backend (AI swarm)
- **Deployment:** 
  - Mobile: Expo App Store / Google Play
  - Backend: Netlify (Functions), Supabase (Database)

## 📁 Project Structure

```
zyeute/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Screen components (FeedScreen, ProfileScreen, etc.)
│   ├── lib/             # Utilities and configs
│   │   ├── services/    # API services (stripeService, ti-guy-client, etc.)
│   │   └── supabase.js  # Supabase client
│   ├── hooks/           # Custom React hooks
│   ├── navigation/      # Navigation setup
│   └── theme/           # Theme configuration
├── zyeute-colony-bridge/  # Colony OS integration layer
│   ├── adapters/        # TI-Guy swarm adapter
│   ├── workflows/       # Multi-agent workflows
│   └── shared-types/    # Type definitions
├── colony-os/           # Python backend for AI swarm
│   ├── app/
│   │   ├── kernel/      # Colony OS kernel (Foreman, Worker Bees)
│   │   └── services/    # Database service
│   └── requirements.txt
├── netlify/
│   └── functions/       # Serverless functions
│       ├── stripe-checkout.js
│       └── stripe-webhook.js
├── supabase/
│   └── migrations/     # Database migrations
└── app.json             # Expo configuration
```

## 🗄️ Database Setup

### Supabase Migrations

Run migrations in order in the Supabase SQL Editor:

1. Core schema (users, publications, comments, reactions)
2. Notifications system
3. Colony OS Kernel schema (agents, tasks, memories)
4. Subscription fields (subscription_tier, is_premium)

See `SUPABASE_FINAL_STATUS.md` for detailed database setup.

### Key Tables

- `user_profiles` - User data with subscription tiers
- `publications` - Posts and content
- `notifications` - User notifications
- `agents` - Colony OS worker bees
- `tasks` - AI task tracking
- `memories` - Knowledge graph (Honeycomb)

## 🚢 Deployment

### Mobile App (Expo)

```bash
# Build for production
eas build --platform ios
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### Backend Functions (Netlify)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy functions
netlify deploy --prod
```

**Important:** Set all environment variables in your deployment platform!

### Stripe Integration

See `STRIPE_QUICK_START.md` for 5-minute setup guide.

## 🧪 Development

```bash
# Run dev server
npm start
# or
expo start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Type check (if using TypeScript)
npm run type-check
```

## 🤖 Colony OS Integration

Zyeuté uses **Colony OS** - a distributed AI operating system with swarm intelligence. TI-Guy (the AI assistant) leverages multiple specialized agents:

- **DocBee** - Document processing and summarization
- **CodeBee** - Code generation and analysis
- **VisionBee** - Image analysis
- **DataBee** - Analytics and insights

See `COLONY_OS_COMPLETE_ARCHITECTURE.md` for full details.

## 💰 Revenue Integration

Zyeuté VIP subscriptions are powered by Stripe:

- **Bronze Tier** - Basic premium features
- **Silver Tier** - Enhanced features
- **Gold Tier** - Full access

See `REVENUE_INTEGRATION_COMPLETE.md` for implementation details.

## 🤝 Contributing

Zyeuté is built for the Quebec community. Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary. All rights reserved.

## 💬 Support

- **Email:** support@zyeute.com
- **Discord:** Join our community
- **Docs:** See documentation files in project root

## 🎯 Roadmap

- [x] Core social features (feed, posts, comments, reactions)
- [x] AI assistant (TI-Guy) with swarm intelligence
- [x] Stripe payment integration
- [x] Premium subscription tiers
- [ ] Mobile apps (iOS & Android) - In Progress
- [ ] Advanced analytics dashboard
- [ ] Creator monetization tools
- [ ] Integration with Quebec events
- [ ] Multi-language support (French/English toggle)
- [ ] Live streaming features
- [ ] E-commerce marketplace

## 📚 Documentation

- **Stripe Integration:** `STRIPE_INTEGRATION_SETUP.md`
- **Colony OS:** `COLONY_OS_COMPLETE_ARCHITECTURE.md`
- **Supabase Setup:** `SUPABASE_FINAL_STATUS.md`
- **Revenue System:** `REVENUE_INTEGRATION_COMPLETE.md`

---

**Made with ❤️ in Quebec 🇨🇦⚜️**

**Propulsé par Nano Banana 🍌**

