# 🚀 Zyeuté - Complete Setup Guide

This guide will walk you through setting up Zyeuté from scratch, including Supabase, Stripe, and OpenAI integration.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** and npm installed
- A **Supabase** account ([sign up here](https://supabase.com))
- A **Stripe** account ([sign up here](https://stripe.com))
- An **OpenAI** API key ([get one here](https://platform.openai.com/api-keys))
- A **Vercel** or **Netlify** account for deployment (optional)

---

## 🏗️ Part 1: Local Development Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/zyeute-clean.git
cd zyeute-clean

# Install dependencies
npm install
```

### Step 2: Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI Configuration (for AI features)
VITE_OPENAI_API_KEY=sk-proj-your-key-here

# Stripe Configuration (for payments)
VITE_STRIPE_PUBLIC_KEY=pk_test_your-key-here

# Optional: Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

**Note**: Don't have these keys yet? Follow Parts 2-4 below to get them!

### Step 3: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` - you should see the Zyeuté login page! 🎉

---

## 🗄️ Part 2: Supabase Setup

### Step 1: Create a New Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Fill in:
   - **Name**: Zyeuté
   - **Database Password**: (save this!)
   - **Region**: Choose closest to Quebec (e.g., US East)
4. Click **Create new project**
5. Wait ~2 minutes for setup to complete

### Step 2: Get Your API Keys

1. In your project dashboard, click **Settings** (gear icon)
2. Go to **API** section
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Add them to your `.env.local` file

### Step 3: Run Database Migrations

1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Run each migration file in order from the `supabase/migrations/` folder:

```sql
-- Run these in order:
-- 001_moderation_system.sql
-- 002_achievements.sql
-- 003_creator_subscriptions.sql
-- 004_live_streaming.sql
-- 005_daily_challenges.sql
-- 006_marketplace.sql
-- 007_email_system.sql
```

**Tip**: Copy the entire content of each file and click **Run** (or press Ctrl+Enter)

### Step 4: Set Up Storage Buckets

1. Go to **Storage** (left sidebar)
2. Click **New bucket**
3. Create these buckets:

| Bucket Name | Public? | Size Limit | MIME Types |
|-------------|---------|------------|------------|
| `posts` | ✅ Yes | 50 MB | `image/*`, `video/*` |
| `avatars` | ✅ Yes | 5 MB | `image/*` |
| `stories` | ✅ Yes | 50 MB | `image/*`, `video/*` |

### Step 5: Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Go to **URL Configuration**
4. Set **Site URL**: `http://localhost:5173` (for development)
5. Add **Redirect URLs**:
   - `http://localhost:5173/**`
   - `https://your-domain.com/**` (add your production URL later)

### Step 6: Create a Test User

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - **Email**: `test@zyeute.com`
   - **Password**: `Test123456!`
   - ✅ **Auto Confirm User**
4. Click **Create user**
5. Go to **SQL Editor** and run:

```sql
INSERT INTO public.users (id, username, display_name)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@zyeute.com'),
  'testuser',
  'Test User'
);
```

**✅ Supabase Setup Complete!** You can now log in with `test@zyeute.com` / `Test123456!`

---

## 🤖 Part 3: OpenAI Setup

### Step 1: Get Your API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click **Create new secret key**
3. Name it "Zyeuté"
4. Copy the key (starts with `sk-proj-...`)
5. Add to `.env.local`:

```bash
VITE_OPENAI_API_KEY=sk-proj-your-key-here
```

### Step 2: Add Credits (if needed)

1. Go to [Billing](https://platform.openai.com/account/billing)
2. Add payment method
3. Add $5-10 credits for testing

### What OpenAI Powers:
- **Ti-Guy Artiste**: DALL-E 3 image generation
- **Smart Captions**: GPT-4 powered captions in Joual
- **Content Moderation**: AI-powered content filtering
- **Ti-Guy Assistant**: Conversational AI helper

**Note**: The app works in "demo mode" without OpenAI keys, but AI features will be simulated.

---

## 💳 Part 4: Stripe Setup

### Step 1: Get Your Publishable Key

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_...`)
3. Add to `.env.local`:

```bash
VITE_STRIPE_PUBLIC_KEY=pk_test_your-key-here
```

### Step 2: Test Payments

Use these test card numbers:

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 9995` | Declined |
| Any future date | Expiry |
| Any 3 digits | CVC |

### What Stripe Powers:
- **Zyeuté VIP**: Premium subscriptions ($4.99-$19.99/month)
- **Marketplace**: Product purchases
- **Creator Payouts**: Revenue distribution

**Note**: The app works in "demo mode" without Stripe keys, but payments will be simulated.

---

## 🚀 Part 5: Deployment

### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, then add environment variables:
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_OPENAI_API_KEY
vercel env add VITE_STRIPE_PUBLIC_KEY

# Redeploy with new env vars
vercel --prod
```

### Option B: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Add environment variables in Netlify Dashboard:
# Site settings → Environment variables
```

### Important: Update Supabase URLs

After deployment, add your production URL to Supabase:

1. Go to Supabase → **Authentication** → **URL Configuration**
2. Add your deployed URL to **Redirect URLs**:
   - `https://your-app.vercel.app/**`

---

## ✅ Part 6: Verification Checklist

Test these features to ensure everything works:

### Authentication
- [ ] Sign up with new account
- [ ] Log in with existing account
- [ ] Log out
- [ ] Password reset (if email configured)

### Core Features
- [ ] Create a post (upload image/video)
- [ ] View feed
- [ ] Like (fire) a post
- [ ] Comment on a post
- [ ] View profile
- [ ] Edit profile

### AI Features (if OpenAI key added)
- [ ] Generate AI image in Ti-Guy Artiste
- [ ] Get AI caption suggestions
- [ ] Chat with Ti-Guy assistant

### Premium Features (if Stripe key added)
- [ ] View premium tiers
- [ ] Click subscribe (should redirect to Stripe)
- [ ] Complete test payment
- [ ] Access premium features

### Marketplace (if Stripe key added)
- [ ] Browse products
- [ ] Purchase a product
- [ ] View order history

---

## 🐛 Troubleshooting

### "Invalid API key" Error
**Fix**: Check that your `.env.local` file has the correct `VITE_SUPABASE_ANON_KEY`

### "Failed to fetch" Error
**Fix**: Verify `VITE_SUPABASE_URL` is correct and includes `https://`

### Can't log in
**Fix**: Make sure you created a user profile in the `users` table (Step 6 of Supabase setup)

### AI features not working
**Fix**: Check that `VITE_OPENAI_API_KEY` is set and you have credits in your OpenAI account

### Stripe checkout not opening
**Fix**: Verify `VITE_STRIPE_PUBLIC_KEY` starts with `pk_test_` or `pk_live_`

### Build errors
**Fix**: Run `npm install` again and check that all dependencies are installed

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **OpenAI Docs**: https://platform.openai.com/docs
- **Vite Docs**: https://vitejs.dev
- **React Router Docs**: https://reactrouter.com

---

## 🆘 Need Help?

- Check the browser console for error messages
- Review Supabase logs in the dashboard
- Check Stripe dashboard for payment issues
- Open an issue on GitHub

---

**Congratulations! Your Zyeuté platform is now ready!** 🎉🇨🇦⚜️

*Made with ❤️ in Quebec*

