# 🔥⚜️ Zyeuté - L'app sociale du Québec ⚜️🔥

**Fait au Québec, pour le Québec** 🇨🇦

Zyeuté is Quebec's first social media platform built specifically for Quebecers, by Quebecers. Share photos, videos, stories, and connect with your community in authentic Joual.

---

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
- **Ti-Guy Assistant** - Your friendly AI helper that speaks Joual
- **Smart Captions** - AI-generated captions in authentic Quebec French
- **Content Moderation** - AI-powered moderation respecting Quebec culture
- **Image Generation** - DALL-E 3 powered by OpenAI

### 💎 Premium Features
- **Zyeuté VIP** - Bronze, Silver, and Gold tiers
- **Exclusive Content** - Access premium creator content
- **Creator Subscriptions** - Support your favorite creators
- **Ad-Free Experience** - Enjoy Zyeuté without interruptions

### 🎮 Gamification
- **Daily Challenges** - Complete quests for rewards
- **Achievements** - Unlock badges and milestones
- **Leaderboards** - Compete with other Quebecers

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
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
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev
```

Visit `http://localhost:5173` to see the app!

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (for AI features)
VITE_OPENAI_API_KEY=sk-proj-...

# Stripe (for payments)
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Optional: Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

See `SETUP_GUIDE.md` for detailed setup instructions.

---

## 📦 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Stripe
- **AI**: OpenAI (GPT-4, DALL-E 3)
- **Deployment**: Vercel / Netlify

---

## 📁 Project Structure

```
zyeute/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and configs
│   ├── contexts/       # React contexts
│   └── types/          # TypeScript types
├── public/             # Static assets
├── supabase/           # Database migrations
└── vercel.json         # Deployment config
```

---

## 🗄️ Database Setup

Run migrations in order:

```bash
# In Supabase SQL Editor, run each migration:
001_moderation_system.sql
002_achievements.sql
003_creator_subscriptions.sql
004_live_streaming.sql
005_daily_challenges.sql
006_marketplace.sql
007_email_system.sql
```

See `SETUP_GUIDE.md` for detailed instructions.

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Important**: Set all environment variables in your deployment platform!

---

## 🧪 Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

---

## 🤝 Contributing

Zyeuté is built for the Quebec community. Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 💬 Support

- **Email**: support@zyeute.com
- **Discord**: [Join our community](#)
- **Docs**: See `SETUP_GUIDE.md`

---

## 🎯 Roadmap

- [ ] Mobile apps (iOS & Android)
- [ ] Advanced analytics dashboard
- [ ] Creator monetization tools
- [ ] Integration with Quebec events
- [ ] Multi-language support (French/English toggle)

---

**Made with ❤️ in Quebec** 🇨🇦⚜️

*Propulsé par Nano Banana* 🍌

