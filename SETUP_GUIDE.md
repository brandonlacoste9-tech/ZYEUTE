# 🔥⚜️ ZYEUTÉ - Complete Setup Guide ⚜️🔥

## Welcome to Zyeuté - LE réseau social québécois!

This guide will walk you through setting up and running Zyeuté locally in **under 30 minutes**.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Setup](#environment-setup)
4. [Supabase Configuration](#supabase-configuration)
5. [Google Gemini AI Setup](#google-gemini-ai-setup)
6. [Running the App](#running-the-app)
7. [Testing Features](#testing-features)
8. [Troubleshooting](#troubleshooting)
9. [Deployment](#deployment)

---

## Prerequisites

Before starting, ensure you have:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm 9+** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **A Supabase account** - [Sign up free](https://supabase.com)
- **A Google AI account** - [Sign up free](https://ai.google.dev)

Check your versions:
```bash
node -v    # Should be v18 or higher
npm -v     # Should be v9 or higher
git --version
```

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/brandonlacoste9-tech/brandonlacoste9-tech-ZYEUTE.git
cd brandonlacoste9-tech-ZYEUTE
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 19 + TypeScript
- Supabase client
- Google Generative AI (Gemini)
- Tailwind CSS
- Vite
- React Router

---

## Environment Setup

### Create Environment File

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:

```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your-supabase-url-here
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Google Gemini API (Required)
VITE_GEMINI_API_KEY=your-gemini-api-key-here

# Stripe (Optional - for payments)
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key-here

# App Configuration (Optional)
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=Zyeuté
```

⚠️ **Important**: 
- Never commit `.env.local` to Git. It's already in `.gitignore`.
- This project uses **Supabase** for authentication. **Clerk is NOT used.**
- See `.env.example` for a complete list of environment variables.

---

## Supabase Configuration

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: Zyeuté (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: **Canada (Central)** ← Important for Quebec users!
4. Click "Create new project"
5. Wait 2-3 minutes for provisioning

### Step 2: Get Your API Keys

1. In your Supabase project, go to **Settings** → **API**
2. Copy:
   - **Project URL** → This is your `VITE_SUPABASE_URL`
   - **anon public key** → This is your `VITE_SUPABASE_ANON_KEY`
3. Paste these into your `.env.local` file

### Step 3: Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the following schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  city TEXT,
  region TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  coins INTEGER DEFAULT 100,
  fire_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video')),
  media_url TEXT NOT NULL,
  caption TEXT,
  hashtags TEXT[],
  region TEXT,
  city TEXT,
  fire_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Follows table
CREATE TABLE public.follows (
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Fires table (like system with 1-5 rating)
CREATE TABLE public.fires (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  fire_level INTEGER CHECK (fire_level BETWEEN 1 AND 5) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- Gifts table
CREATE TABLE public.gifts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  to_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  gift_type TEXT NOT NULL,
  coin_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stories table
CREATE TABLE public.stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  media_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video')),
  duration INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('fire', 'comment', 'follow', 'gift', 'mention')),
  actor_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Public profiles viewable, users can update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Posts: Public viewing, authenticated users can create
CREATE POLICY "Posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Comments: Public viewing, authenticated users can create
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- Follows: Users can manage their own follows
CREATE POLICY "Follows are viewable by everyone"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Fires: Users can manage their own fires
CREATE POLICY "Fires are viewable by everyone"
  ON public.fires FOR SELECT
  USING (true);

CREATE POLICY "Users can fire posts"
  ON public.fires FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their fires"
  ON public.fires FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their fires"
  ON public.fires FOR DELETE
  USING (auth.uid() = user_id);

-- Notifications: Users can only see their own
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to increment fire_count
CREATE OR REPLACE FUNCTION increment_fire_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts
  SET fire_count = fire_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_fire_insert
  AFTER INSERT ON public.fires
  FOR EACH ROW
  EXECUTE FUNCTION increment_fire_count();

-- Function to decrement fire_count
CREATE OR REPLACE FUNCTION decrement_fire_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts
  SET fire_count = fire_count - 1
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_fire_delete
  AFTER DELETE ON public.fires
  FOR EACH ROW
  EXECUTE FUNCTION decrement_fire_count();
```

4. Click **Run** to execute the query
5. ✅ Your database is now set up!

### Step 4: Create Storage Buckets

1. Go to **Storage** in Supabase
2. Create the following buckets:

#### Posts Bucket
- Click "New bucket"
- Name: `posts`
- **Public bucket**: ✅ YES
- Click "Create bucket"

#### Avatars Bucket
- Click "New bucket"
- Name: `avatars`
- **Public bucket**: ✅ YES
- Click "Create bucket"

### Step 5: Enable Authentication Providers

**Important**: This project uses **Supabase Authentication** - NOT Clerk or any other third-party auth provider.

1. Go to **Authentication** → **Providers**
2. Enable:
   - ✅ **Email** (already enabled)
   - ✅ **Google OAuth** (optional - requires Google Cloud setup)
   - ✅ **Facebook OAuth** (optional - requires Facebook App setup)
   - ✅ **Apple Sign In** (optional - requires Apple Developer account)

For now, **Email authentication** is enough to get started!

**Note**: No Clerk configuration needed - all authentication is handled by Supabase.

---

## Google Gemini AI Setup

### Step 1: Get Your API Key

1. Go to [ai.google.dev](https://ai.google.dev)
2. Click "Get API Key"
3. Sign in with your Google account
4. Click "Create API Key"
5. Copy the API key

### Step 2: Add to Environment

In your `.env.local` file:
```
VITE_GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

### Free Tier Limits
- 60 requests per minute
- Perfect for development and testing
- Plenty for a small app!

---

## Running the App

### Start the Development Server

```bash
npm run dev
```

The app will start at: **http://localhost:5173**

You should see:
```
  VITE v6.2.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Open in Browser

Navigate to http://localhost:5173 in your browser. You should see the Zyeuté login page! 🎉

---

## Testing Features

### 1. Create an Account

1. Click "Sign up"
2. Enter:
   - Email
   - Password
   - Username
3. Click "Sign up"
4. You'll be logged in automatically!

### 2. Upload a Post

1. Click the **+** button in the bottom navigation
2. Select a photo or video
3. Click "**Demande à Ti-Guy**" to generate an AI caption in Quebec French!
4. Edit the caption if you want
5. Select your region and city
6. Click "**Publier 🔥**"

### 3. Test the Feed

- Scroll through the feed
- Click on a post to view details
- Give posts a fire rating 🔥
- Add comments ("Jasette")

### 4. Explore Features

- **Explore**: Search for posts by hashtag or region
- **Profile**: View and edit your profile
- **Settings**: Update your avatar, bio, and preferences
- **Notifications**: See who interacted with your posts

---

## Troubleshooting

### Problem: "Missing Supabase environment variables"

**Solution**: Make sure your `.env.local` file exists and has the correct keys:
```bash
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

Restart the dev server after adding env variables:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Problem: "Error uploading file - bucket not found"

**Solution**: Create the storage buckets in Supabase:
1. Go to Storage → New bucket
2. Create `posts` bucket (public)
3. Create `avatars` bucket (public)

### Problem: "Gemini API error"

**Solution**:
1. Check your API key is correct in `.env.local`
2. Make sure you haven't exceeded the free tier limit (60 requests/minute)
3. Wait 1 minute and try again

### Problem: "Cannot read properties of null"

**Solution**: This usually means:
1. You're not logged in - go to `/login`
2. Your user profile wasn't created - check Supabase → Authentication → Users
3. Database policies might be blocking access - review the RLS policies

### Problem: Port 5173 already in use

**Solution**:
```bash
# Kill the process using port 5173
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# On Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Vercel will auto-detect Vite

3. **Add Environment Variables**
In Vercel project settings:
- Go to Settings → Environment Variables
- Add all your `VITE_*` variables from `.env.local`

4. **Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- Your app is live! 🚀

### Other Deployment Options

- **Netlify**: Similar to Vercel, great for static sites
- **Cloudflare Pages**: Fast edge network
- **Railway**: If you need a backend
- **AWS Amplify**: If you're using other AWS services

---

## What's New in This Version

### ✨ Improvements Made

1. **🤖 Enhanced AI Integration**
   - Updated Gemini API to use latest model (gemini-2.0-flash-exp)
   - Better error handling and user feedback
   - Multiple AI features: caption generation, hashtag generation, image analysis

2. **📱 Toast Notification System**
   - Beautiful animated notifications
   - Success, error, info, and warning types
   - Auto-dismiss with customizable duration

3. **🛡️ Error Boundary**
   - Catches React errors gracefully
   - User-friendly error pages
   - Automatic error logging

4. **⚙️ Enhanced Settings Page**
   - Avatar upload functionality
   - Profile editing with validation
   - Account stats display
   - Better UX with toast notifications

5. **📤 Improved Upload Page**
   - Multiple AI actions (caption, hashtags, analysis)
   - Better file validation
   - Progress feedback
   - Enhanced error messages

6. **🗂️ Database Types**
   - Complete TypeScript types for all database tables
   - Better IDE autocomplete
   - Type-safe queries

7. **🧹 Code Cleanup**
   - Removed duplicate files
   - Consolidated project structure
   - Updated dependencies
   - Better code organization

---

## Project Structure

```
zyeuté/
├── src/
│   ├── components/
│   │   ├── features/      # Feature components (VideoCard, StoryCircle, etc.)
│   │   ├── layout/        # Layout components (Header, BottomNav, FeedGrid)
│   │   ├── ui/            # UI primitives (Button, Avatar, Toast)
│   │   └── ErrorBoundary.tsx
│   ├── pages/             # Page components (Feed, Upload, Profile, etc.)
│   ├── lib/               # Utilities (supabase client, utils)
│   ├── types/             # TypeScript types
│   ├── App.tsx            # Main app with routing
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── services/
│   └── geminiService.ts   # AI integration
├── db/
│   └── schema.sql         # Database schema
├── public/                # Static assets
├── .env.local            # Environment variables (create this!)
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS config
└── tsconfig.json         # TypeScript config
```

---

## Need Help?

- **Issues**: Open an issue on GitHub
- **Questions**: Check existing documentation
- **Bugs**: Please report with error messages and steps to reproduce

---

## Next Steps

Once you have the app running:

1. **Customize the branding** - Update colors, logo, etc.
2. **Add more features** - Stories, live streaming, etc.
3. **Invite beta testers** - Get feedback from real users
4. **Deploy to production** - Make it publicly accessible
5. **Marketing** - Launch on Saint-Jean-Baptiste! 🎉

---

## 🔥 Enjoy building Zyeuté - Le réseau social qu'on mérite! ⚜️

Made with love in Quebec 🇨🇦

*Propulsé par Nano Banana 🍌 | Optimisé par Gemini ✨ | Fait avec fierté québécoise ⚜️*

