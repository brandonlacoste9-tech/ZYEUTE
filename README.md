<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🔥⚜️ ZYEUTÉ - Le réseau social québécois ⚜️🔥

**Zyeuté** (zee-yoo-tay) is the first 100% Quebec-focused social media platform, combining TikTok + Instagram vibes with authentic Quebec culture, joual language, and AI-powered features.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Supabase account ([Sign up free](https://supabase.com))
- Google Gemini API key ([Get free](https://ai.google.dev))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/brandonlacoste9-tech/brandonlacoste9-tech-ZYEUTE.git
cd brandonlacoste9-tech-ZYEUTE

# 2. Install dependencies
npm install

# 3. Create .env.local file with your keys
# Copy .env.example to .env.local and fill in your values
cp .env.example .env.local
# Edit .env.local with your Supabase and Gemini API keys

# 4. Run the app
npm run dev
```

**📖 For complete setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

---

## ✨ Features

### 🎯 Core Features
- **Authentication** - Email, Google, Facebook, Apple OAuth via Supabase
- **Photo/Video Posts** - Upload and share content with the community
- **Fire Rating System** 🔥 - Rate posts 1-5 flames (not likes!)
- **Comments ("Jasette")** - Engage in conversations
- **Follow/Unfollow** - Build your Quebec network
- **Stories** - 24-hour ephemeral content
- **Explore** - Discover trending content by region/hashtag

### 🤖 AI-Powered Features (Ti-Guy)
- **Auto-Caption Generation** - Creates captions in authentic Quebec French (joual)
- **Smart Hashtags** - AI-generated Quebec-relevant hashtags
- **Image Analysis** - Understands and describes your content
- Powered by Google Gemini 2.0 Flash

### 🗺️ Quebec-First Features
- **Hyper-Local Feed** - Content filtered by region (Montréal, Québec, Gaspésie, etc.)
- **Joual Translations** - Authentic Quebec French throughout
- **Quebec Music Library** - Cowboys Fringants, Jean Leloup, Les Colocs, etc.
- **Virtual Gifts** - Poutine, Caribou, Fleur-de-lys, and more!
- **Regional Discovery** - Find content in your neighborhood

### 💎 Premium Features
- Virtual coins system ("Cennes")
- Gift sending to creators
- Premium subscriptions (planned)
- Business accounts (planned)

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling with custom gold theme
- **React Router** - Client-side routing

### Backend
- **Supabase** - Backend-as-a-Service (100% authentication solution)
  - Authentication (Email/Password + OAuth providers)
  - PostgreSQL database
  - Storage
  - Real-time subscriptions
  - **Note**: This project does NOT use Clerk or any third-party auth providers
- **Vercel Edge** - Hosting and CDN

### AI/ML
- **Google Gemini 2.0 Flash** - Advanced AI for content generation
- Custom Quebec French training

---

## 📁 Project Structure

```
zyeuté/
├── src/
│   ├── components/
│   │   ├── features/       # VideoCard, StoryCircle, FireRating, ProfileCard
│   │   ├── layout/         # Header, BottomNav, FeedGrid
│   │   ├── ui/             # Button, Avatar, Toast
│   │   └── ErrorBoundary.tsx
│   ├── pages/              # Feed, Upload, Profile, Explore, Settings
│   ├── lib/                # Supabase client, utilities
│   ├── types/              # TypeScript type definitions
│   └── App.tsx
├── services/
│   └── geminiService.ts    # AI integration
├── db/
│   └── schema.sql          # Database schema
├── SETUP_GUIDE.md          # Complete setup instructions
├── PROJECT_OVERVIEW.md     # Project documentation
└── EXECUTIVE_SUMMARY.md    # Business plan & vision
```

---

## 🎨 Key Improvements (Latest Version)

### 🆕 What's New
1. **Enhanced AI Integration** - Updated Gemini API with better error handling
2. **Toast Notification System** - Beautiful, animated user feedback
3. **Error Boundary** - Graceful error handling throughout the app
4. **Improved Upload** - Multiple AI actions (caption, hashtags, analysis)
5. **Enhanced Settings** - Avatar upload, profile stats, better UX
6. **Database Types** - Full TypeScript support for type-safe queries
7. **Code Cleanup** - Removed duplicates, consolidated structure

---

## 📊 Business Model

### Revenue Streams
1. **Virtual Gifts** (60/40 split with creators)
2. **Premium Subscriptions** ($4.99/month)
3. **Business Accounts** ($49/month)
4. **Native Ads** (CPM-based)

### Target Market
- **Primary**: 18-35 years old, Quebec-based, urban
- **Total Addressable Market**: 8.5M Quebecers + 300M francophones globally
- **Year 1 Goal**: 100K users → $300K revenue

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import to Vercel
# - Visit vercel.com
# - Click "New Project"
# - Import your repo

# 3. Add environment variables in Vercel
# See .env.example for all required variables:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_GEMINI_API_KEY
# - VITE_STRIPE_PUBLIC_KEY (optional)
# Note: NO Clerk keys required - we use Supabase Auth

# 4. Deploy!
```

Your app will be live in minutes! 🎉

---

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Test Features
1. Create an account
2. Upload a post
3. Use Ti-Guy AI to generate caption
4. Add hashtags and location
5. Explore feed and interactions

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📖 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions (START HERE!)
- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Project structure and features
- **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** - Vision and business model
- **[QUEBEC_FIRST_ROADMAP.md](./QUEBEC_FIRST_ROADMAP.md)** - Quebec-specific features
- **[LAUNCH_STRATEGY.md](./LAUNCH_STRATEGY.md)** - Go-to-market plan

---

## 🐛 Troubleshooting

### Common Issues

**Problem**: "Missing environment variables"  
**Solution**: Copy `.env.example` to `.env.local` and fill in your Supabase and Gemini keys. See `.env.example` for all required variables.

**Problem**: "Bucket not found"  
**Solution**: Create `posts` and `avatars` buckets in Supabase Storage (make them public)

**Problem**: "Gemini API error"  
**Solution**: Check API key is correct and you haven't exceeded rate limits (60/min free tier)

For more troubleshooting, see [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting)

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 🌟 Roadmap

### Q2 2025
- ✅ MVP Launch
- ✅ AI Integration (Ti-Guy)
- ✅ Quebec-first features
- 🔄 Beta testing (in progress)

### Q3 2025
- 📱 Mobile app (React Native)
- 🎵 Music integration
- 💬 Direct messaging
- 🎁 Enhanced virtual gifts

### Q4 2025
- 🔴 Live streaming
- 💰 Monetization features
- 🏪 Creator marketplace
- 🌍 Expand to other francophone regions

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/brandonlacoste9-tech/brandonlacoste9-tech-ZYEUTE/issues)
- **Questions**: Check documentation or open a discussion
- **Bugs**: Please report with reproduction steps

---

## 🎉 Credits

- **Created by**: Nano Banana 🍌
- **Powered by**: Google Gemini ✨
- **Made with**: Fierté québécoise ⚜️

---

## 🔥 Let's Build the Quebec Social Network! ⚜️

**Tagline**: *"Fait au Québec, pour le Québec. Tiguidou."*

---

*View on AI Studio: https://ai.studio/apps/drive/1nIjkc97ICB81n0og3LeciF3qz_er4o4T*
