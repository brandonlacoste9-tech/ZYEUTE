# 🔥⚜️ Zyeuté Repository Information ⚜️🔥

**Generated: 2025-11-29**

This document provides comprehensive information about the Zyeuté codebase for developing a landing/marketing page.

---

## 1. ✅ **List of Pages & Routes**

### Main Pages (`src/pages/`)

**Authentication Pages:**
- `Login.tsx` - User login page with email/password and Google OAuth
- `Signup.tsx` - User signup/registration page

**Core Social Features:**
- `Feed.tsx` - Main feed/home page (route: `/`)
- `Explore.tsx` - Discover content (route: `/explore`)
- `Profile.tsx` - User profile page (route: `/profile/:slug`)
- `PostDetail.tsx` - Individual post view (route: `/p/:id`)
- `Upload.tsx` - Upload new content (route: `/upload`)
- `Notifications.tsx` - User notifications (route: `/notifications`)
- `Settings.tsx` - User settings (route: `/settings`)
- `Analytics.tsx` - Content analytics (route: `/analytics`)

**AI Features (Phase 2):**
- `Artiste.tsx` - Ti-Guy Artiste AI image generation (route: `/artiste`)
- `Studio.tsx` - Ti-Guy Studio AI video editor (route: `/studio`)
- `VoiceSettingsPage.tsx` - Voice settings for AI (route: `/settings/voice`)

**E-Commerce & Premium:**
- `Marketplace.tsx` - Marketplace for buying/selling (route: `/marketplace`)
- `Premium.tsx` - Premium subscription plans (route: `/premium`)
- `CreatorRevenue.tsx` - Creator earnings dashboard (route: `/revenue`)

**Live Streaming:**
- `LiveDiscover.tsx` - Discover live streams (route: `/live`)
- `GoLive.tsx` - Start a live stream (route: `/live/go`)
- `WatchLive.tsx` - Watch a live stream (route: `/live/watch/:id`)

**Gamification:**
- `Achievements.tsx` - User achievements (route: `/achievements`)
- `Challenges.tsx` - Daily challenges (route: `/challenges`)

**Email & Preferences:**
- `EmailPreferences.tsx` - Email notification settings

### Admin Pages (`src/pages/admin/`)
- `Dashboard.tsx` - Admin dashboard (route: `/admin`)
- `EmailCampaigns.tsx` - Email campaign management (route: `/admin/emails`)

### Moderation (`src/pages/moderation/`)
- `Moderation.tsx` - Content moderation interface (route: `/moderation`)

### Legal Pages (`src/pages/legal/`)
- `CommunityGuidelines.tsx` - Community guidelines (route: `/legal/community-guidelines`)
- `TermsOfService.tsx` - Terms of service (route: `/legal/terms`)
- `PrivacyPolicy.tsx` - Privacy policy (route: `/legal/privacy`)

### 🚨 **MISSING: Landing/Launch Page**
**No existing landing page found!** No routes like `/launch`, `/landing`, or `Landing.tsx` exist.

---

## 2. 🔐 **Authentication Setup**

### File: `src/lib/supabase.ts`

**Technology:** Supabase Auth (PostgreSQL-based authentication)

**Authentication Methods:**
- ✅ Email & Password signup/login
- ✅ Google OAuth (configured via `signInWithGoogle()`)
- ✅ Session persistence enabled
- ✅ Auto token refresh enabled
- ✅ Session detection in URL

**Key Functions Available:**
```typescript
// Get current user
await getCurrentUser()

// Sign in with email/password
await signIn(email, password)

// Sign up with email/password
await signUp(email, password, username)

// Sign out
await signOut()

// Sign in with Google
await signInWithGoogle()
```

**User Profile Creation:**
When a user signs up, a profile is automatically created in the `users` table with:
- `id` (linked to auth.users)
- `username`
- `display_name`

**Protected Routes:**
All app routes (except `/login`, `/signup`, and `/legal/*`) are protected by a `<ProtectedRoute>` component that:
- Checks if user is authenticated
- Redirects to `/login` if not authenticated
- Shows loading screen while checking auth state
- Listens for auth state changes in real-time

**Login/Signup Status:**
✅ **Authentication is fully implemented and working**
- Login page at `/login`
- Signup page at `/signup`
- Both use Supabase Auth
- Google OAuth configured
- Session management working

**Environment Variables Needed:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id (optional)
```

---

## 3. 🎨 **Tailwind Theme Setup**

### **Important Note: Using Tailwind CSS v4**

This project uses **Tailwind CSS v4** (`@tailwindcss/postcss: ^4.0.0`), which has a **different configuration approach** than v3.

### Configuration Location: `src/index.css`

**NO `tailwind.config.js`** file exists! Tailwind v4 uses `@theme` directive in CSS instead.

### Theme Configuration (`src/index.css`)

#### **Custom Colors:**

```css
@theme {
  /* Gold Colors (Primary Accent) */
  --color-gold-50: #FFF9E5;
  --color-gold-100: #FFF2CC;
  --color-gold-200: #FFE699;
  --color-gold-300: #FFD966;
  --color-gold-400: #FFCC33;
  --color-gold-500: #FFBF00;  /* Primary gold */
  --color-gold-600: #E6AC00;
  --color-gold-700: #CC9900;
  --color-gold-800: #B38600;
  --color-gold-900: #997300;
  --color-gold-950: #664D00;
  
  /* Leather Colors (Secondary, Base) */
  --color-leather-50: #fdf8f6;
  --color-leather-100: #f2e8e5;
  --color-leather-200: #eaddd7;
  --color-leather-300: #e0cec7;
  --color-leather-400: #d2bab0;
  --color-leather-500: #a18e87;
  --color-leather-600: #84746f;
  --color-leather-700: #655955;
  --color-leather-800: #463e3b;
  --color-leather-900: #2a2523;
  --color-leather-950: #0d0c0b;
}

:root {
  --edge-color: #FFBF00;
  --glow-intensity: 50%;
}
```

#### **Base Styles:**

```css
body {
  @apply bg-black text-white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', ...;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(255, 191, 0, 0.03) 0%, transparent 50%),
    url("data:image/svg+xml,..."); /* Subtle texture pattern */
}
```

#### **Custom Utility Classes:**

**Textures & Materials:**
- `.leather-overlay` - Dark background with noise texture
- `.leather-card` - Card with leather texture and shadow
- `.stitched` - Gold stitching border effect
- `.stitched-subtle` - Subtle stitched border

**Text & Gradients:**
- `.text-gold-gradient` - Gold gradient text
- `.bg-gold-gradient` - Gold gradient background
- `.border-gold-gradient` - Gold gradient border
- `.embossed` - Embossed text shadow effect
- `.debossed` - Debossed inset shadow effect

**Buttons (Pre-styled):**
- `.btn-leather` - Secondary button with leather style
- `.btn-gold` - Primary gold gradient button

**Inputs:**
- `.input-premium` - Premium styled input field with focus states

**Effects:**
- `.glass-card` - Glass morphism card
- `.glass-nav` - Glass navigation bar
- `.story-ring` - Gold gradient ring for stories
- `.edge-glow` - Gold edge glow effect
- `.edge-glow-strong` - Strong gold edge glow
- `.glow-gold` - Gold box shadow glow

**Utilities:**
- `.safe-top` / `.safe-bottom` - Safe area insets for mobile
- `.scrollbar-hide` - Hide scrollbar

#### **Design Theme:**
- **Aesthetic:** Fur Trader × Louis Vuitton × Roots Canada
- **Materials:** Luxury leather textures, gold accents, rich blacks
- **Colors:** Gold (#FFBF00) + Black + Leather browns
- **Feel:** Premium, craftsmanship, Quebec heritage

#### **Animations:**

```css
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in { animation: fade-in 0.5s ease-out; }
```

#### **Usage Examples:**

```tsx
// Primary button
<button className="btn-gold px-6 py-3 rounded-xl">
  S'abonner
</button>

// Card with leather texture
<div className="leather-card rounded-2xl p-6">
  <h2 className="text-gold-500 embossed">Titre</h2>
</div>

// Premium input
<input 
  type="text"
  className="input-premium w-full"
  placeholder="Ton username..."
/>

// Gold gradient text
<h1 className="text-gold-gradient text-4xl font-bold">
  Zyeuté
</h1>
```

---

## 4. 💻 **Component System / UI Kit**

### Reusable UI Components (`src/components/`)

**Core UI Components:**
- ✅ `Button.tsx` - Primary/outline/ghost/icon button variants with loading states
- ✅ `Avatar.tsx` - User avatar display component
- ✅ `Logo.tsx` - App logo with variations
- ✅ `Toast.tsx` - Notification toast system
- ✅ `LoadingScreen.tsx` - Full-screen loading indicator
- ✅ `ErrorBoundary.tsx` - Error boundary for error handling

**Layout Components:**
- ✅ `Header.tsx` - Top navigation header
- ✅ `BottomNav.tsx` - Bottom navigation bar (mobile)
- ✅ `FeedGrid.tsx` - Grid layout for posts

**Feature Components (`src/components/features/`):**
- `TiGuy` - AI assistant chatbot (always visible)
- `StoryCreator` - Create 24h stories
- `StoryViewer` - View stories
- `VideoCard` - Video player component
- And more...

**Component Subfolders:**
- `auth/` - Authentication-related components
  - `ProtectedAdminRoute.tsx` - Admin-only route protection
- `features/` - Feature-specific components (TiGuy, Stories, etc.)
- `gamification/` - Achievement and challenge components
- `moderation/` - Content moderation components
- `settings/` - Settings page components

**External UI Kit:**
❌ **No external UI kit** (no ShadCN, Chakra, MUI, etc.)
✅ **Custom-built component system** with pre-styled classes

**Button Component API:**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Usage:
<Button variant="primary" size="lg" leftIcon={<Icon />}>
  Click me
</Button>
```

---

## 5. 📱 **Landing Page Status**

### ❌ **NO LANDING PAGE EXISTS**

**Checked locations:**
- ❌ No `/launch` route
- ❌ No `/landing` route  
- ❌ No `src/pages/Launch.tsx`
- ❌ No `src/pages/Landing.tsx`
- ❌ No marketing entry page

**Current Entry Points:**
- `/login` - Login page (public)
- `/signup` - Signup page (public)
- `/` - Feed (protected, redirects to login if not authenticated)

**What exists for public pages:**
- ✅ Legal pages (`/legal/*`) - Community guidelines, terms, privacy
- ✅ Login/Signup pages

---

## 📦 **Additional Context**

### Tech Stack:
- **Framework:** React 18 + TypeScript + Vite v7
- **Styling:** Tailwind CSS v4 (using `@theme` in CSS)
- **Routing:** React Router DOM v6
- **Backend:** Supabase (Auth, Database, Storage)
- **Payments:** Stripe (`@stripe/react-stripe-js`)
- **AI:** OpenAI (`openai` package for DALL-E & GPT-4)
- **State:** React Context API (no Redux/Zustand)

### Services (`src/services/`):
- `achievementService.ts` - Achievement/badge logic
- `emailService.ts` - Email sending
- `imageService.ts` - Image processing
- `moderationService.ts` - Content moderation
- `openaiService.ts` - OpenAI API integration
- `stripeService.ts` - Stripe payments
- `subscriptionService.ts` - Premium subscriptions
- `videoService.ts` - Video processing

### Contexts (`src/contexts/`):
- `NotificationContext.tsx` - Global notification state
- `ThemeContext.tsx` - Theme management

### Hooks (`src/hooks/`):
- `usePremium.ts` - Check if user has premium subscription
- `useVideoAutoPlay.ts` - Handle video autoplay

### Quebec-Specific Features (`src/lib/quebecFeatures.ts`):
- Joual dictionary (Quebec French slang)
- Quebec regions list
- Montreal neighborhoods list
- Virtual gifts (poutine, caribou, fleur-de-lys, etc.)
- Ti-Guy AI personality prompts

### Project Identity:
- **Language:** Joual (Quebec French dialect) throughout UI
- **Culture:** Quebec-first, celebrates Quebec identity
- **Design:** Premium leather/gold aesthetic inspired by Quebec's fur trading heritage
- **Mascot:** Ti-Guy (AI assistant that speaks authentic Joual)

---

## 🎯 **What's Needed for Landing Page**

Based on this exploration, here's what you'll need to build:

1. **New Route:** Add `/launch` or `/landing` route in `App.tsx`
2. **New Page:** Create `src/pages/Landing.tsx` (or `Launch.tsx`)
3. **Public Access:** Make it public (not wrapped in `<ProtectedRoute>`)
4. **Design System:** Use existing `.btn-gold`, `.leather-card`, `.text-gold-gradient` classes
5. **Components:** Reuse `Button`, `Logo`, and other existing components
6. **Content:** Showcase features, Quebec culture, AI tools, premium plans
7. **CTAs:** "S'inscrire" (Sign up) and "Se connecter" (Login) buttons
8. **Language:** Use authentic Joual (check `quebecFeatures.ts` for approved phrases)
9. **Visual Style:** Luxury leather + gold aesthetic, Quebec icons (⚜️🇨🇦🍁)

---

## 📝 **Next Steps**

1. ✅ Review this document
2. ⏭️ Design landing page layout/wireframe
3. ⏭️ Create `Landing.tsx` component
4. ⏭️ Add route to `App.tsx`
5. ⏭️ Add navigation link (if needed)
6. ⏭️ Test on mobile and desktop
7. ⏭️ Deploy

---

**Questions? Let me know what you want to build!** 🔥⚜️

*Propulsé par Nano Banana* 🍌
