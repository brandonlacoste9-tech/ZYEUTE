# 🔥⚜️ Zyeuté - GitHub Copilot Instructions ⚜️🔥

**Fait au Québec, pour le Québec** 🇨🇦

This document provides comprehensive guidance for GitHub Copilot when assisting with the Zyeuté codebase. Zyeuté is Quebec's first social media platform built specifically for Quebecers, by Quebecers.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Coding Standards](#coding-standards)
5. [Quebec/Joual Language Context](#quebecjoual-language-context)
6. [AI Features](#ai-features)
7. [Payment Integration](#payment-integration)
8. [Database Schema](#database-schema)
9. [Component Structure](#component-structure)
10. [Design System](#design-system)
11. [Testing Approach](#testing-approach)
12. [Best Practices](#best-practices)

---

## 🎯 Project Overview

Zyeuté is a social media platform that celebrates Quebec culture, language (Joual), and community. Key features include:

- **Social Features**: Posts, stories, comments, likes ("feu" 🔥), live streaming
- **AI-Powered Tools**: 
  - Ti-Guy Artiste (AI image generation with DALL-E 3)
  - Ti-Guy Studio (AI video editor with auto-captions in Joual)
  - Ti-Guy Assistant (Conversational AI that speaks authentic Joual)
- **E-Commerce**: Marketplace for tickets, crafts, services, and merch
- **Premium Subscriptions**: Zyeuté VIP (Bronze, Silver, Gold tiers)
- **Gamification**: Achievements, daily challenges, leaderboards
- **Location Features**: Quebec regions and Montreal neighborhood tagging
- **Virtual Gifts**: Send poutine, caribou, fleur-de-lys, and more!

### Cultural Context

Zyeuté is **Quebec-first** in everything:
- UI text uses authentic **Joual** (Quebec French dialect)
- References Quebec culture, locations, events, and slang
- Design aesthetic inspired by Quebec's fur trading heritage
- All features celebrate Quebec identity and pride

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (v7.2.4)
- **Styling**: Tailwind CSS v4 with custom design system
- **Routing**: React Router DOM v6
- **State Management**: React Context API

### Backend & Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (posts, avatars, stories buckets)
- **Payments**: Stripe (subscriptions & marketplace)
- **AI**: OpenAI (GPT-4 for text, DALL-E 3 for images)

### Development
- **TypeScript**: v5.5.4 with strict mode enabled
- **Package Manager**: npm
- **Node Version**: 18+

---

## 🏗️ Architecture

### Directory Structure

```
zyeute/
├── src/
│   ├── components/       # All UI components (base components + subdirectories)
│   │   ├── auth/        # Authentication components
│   │   ├── features/    # Feature-specific components (TiGuy, StoryViewer, etc.)
│   │   ├── gamification/# Achievement and challenge components
│   │   ├── moderation/  # Content moderation components
│   │   ├── settings/    # Settings page components
│   │   ├── Avatar.tsx   # User avatar component
│   │   ├── BottomNav.tsx # Bottom navigation bar
│   │   ├── Button.tsx   # Reusable button component
│   │   ├── ErrorBoundary.tsx # Error handling wrapper
│   │   ├── FeedGrid.tsx # Post grid layout
│   │   ├── Header.tsx   # Top header/navigation
│   │   ├── LoadingScreen.tsx # Loading state component
│   │   ├── Logo.tsx     # App logo component
│   │   └── Toast.tsx    # Toast notification component
│   ├── pages/           # Page components (one per route)
│   │   ├── admin/       # Admin dashboard pages
│   │   ├── legal/       # Legal pages (terms, privacy, guidelines)
│   │   └── moderation/  # Moderation pages
│   ├── services/        # Business logic and API interactions
│   │   ├── achievementService.ts
│   │   ├── emailService.ts
│   │   ├── imageService.ts
│   │   ├── moderationService.ts
│   │   ├── openaiService.ts
│   │   ├── stripeService.ts
│   │   ├── subscriptionService.ts
│   │   ├── tiGuyAgent.ts
│   │   └── videoService.ts
│   ├── hooks/           # Custom React hooks
│   │   ├── usePremium.ts
│   │   └── useVideoAutoPlay.ts
│   ├── contexts/        # React contexts for global state
│   │   ├── NotificationContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/             # Utilities and configurations
│   │   ├── supabase.ts      # Supabase client initialization
│   │   ├── quebecFeatures.ts # Quebec-specific data and helpers
│   │   └── utils.ts         # General utilities
│   ├── types/           # TypeScript type definitions
│   │   ├── database.ts  # Database types (auto-generated from Supabase)
│   │   └── index.ts     # General types
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles and design system
├── public/              # Static assets (images, icons, etc.)
├── supabase/            # Database migrations and config
│   └── migrations/      # SQL migration files
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json          # Deployment configuration
```

### Component Categories

1. **Pages**: Route-level components (one per URL path) in `src/pages/`
2. **Features**: Complex, feature-specific components with their own state in `src/components/features/`
3. **Base UI Components**: Reusable components like Button, Avatar, Logo, Toast in `src/components/`
4. **Layout Components**: App-wide layout like Header, BottomNav in `src/components/`
5. **Services**: Business logic abstracted from components in `src/services/`

---

## 📝 Coding Standards

### TypeScript

- **Always use TypeScript** with proper type annotations
- Avoid `any` - use specific types or `unknown` when truly necessary
- Use interfaces for object shapes, types for unions/primitives
- Enable strict mode (`strict: true` in tsconfig.json)
- Export types/interfaces for reusability

### React

- Use **functional components** with hooks (no class components)
- Define component props with TypeScript: `(props: Props) => JSX.Element` or `function Component(props: Props) { ... }`
- Avoid `React.FC` (deprecated pattern) - use regular function declarations with typed props
- Destructure props in function parameters
- Use proper dependency arrays in `useEffect`, `useMemo`, `useCallback`
- Memoize expensive computations and callbacks when appropriate

### File Naming

- Components: `PascalCase.tsx` (e.g., `TiGuyAssistant.tsx`)
- Services: `camelCase.ts` (e.g., `openaiService.ts`)
- Utilities: `camelCase.ts` (e.g., `quebecFeatures.ts`)
- Pages: `PascalCase.tsx` (e.g., `Profile.tsx`)

### Import Order

1. React and third-party libraries
2. Services and utilities
3. Components
4. Types
5. Styles (if separate CSS files)

```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { openaiService } from '../services/openaiService';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { User } from '../types';
```

### Comments

- Use JSDoc comments for functions, especially in services
- Include parameter descriptions and return types
- Add inline comments for complex logic
- Use TODO comments for future improvements: `// TODO: Add error handling`

```tsx
/**
 * Generate AI image using DALL-E 3
 * @param prompt - Image generation prompt in English or Joual
 * @param style - Art style preset (realistic, cartoon, etc.)
 * @returns URL of generated image
 */
export async function generateImage(prompt: string, style: string): Promise<string> {
  // Implementation
}
```

### Error Handling

- Always wrap async operations in try-catch blocks
- Use toast notifications for user-facing errors
- Log errors to console for debugging
- Provide fallbacks/demo modes when external services are unavailable

```tsx
try {
  const result = await openai.generateImage(prompt);
  return result;
} catch (error) {
  console.error('Image generation failed:', error);
  toast.error('Impossible de générer l\'image. Réessaie!');
  return null;
}
```

---

## 🇨🇦 Quebec/Joual Language Context

### Language Guidelines

Zyeuté uses **Joual** (Quebec French dialect) throughout the UI. This is critical to the app's identity.

#### Joual vs. Standard French

- **Standard French**: "C'est très bon"
- **Joual**: "C'est tiguidou" or "C'est malade!"

#### Common Joual Expressions

See `src/lib/quebecFeatures.ts` for the complete Joual dictionary. Key examples:

```typescript
// Social Actions
like: 'Donner du feu 🔥'
comment: 'Jasette 💬'
share: 'Partager ça'

// Reactions
cool: 'Tiguidou'
nice: 'Nice en criss'
awesome: 'Malade!'
lol: 'Haha tabarnak'

// Weather (very important in Quebec!)
cold: 'Frette en esti'
hot: 'Chaud en tabarnak'
```

#### Quebec Cultural References

- **Regions**: Montreal, Quebec City, Gaspésie, Laurentides, etc. (see `QUEBEC_REGIONS`)
- **Montreal Neighborhoods**: Plateau, Mile End, Hochelaga, etc. (see `MONTREAL_QUARTIERS`)
- **Events**: Saint-Jean-Baptiste, Osheaga, Carnaval de Québec
- **Virtual Gifts**: Poutine, caribou, fleur-de-lys, cône orange, sirop d'érable
- **Hashtags**: #MTL, #QC, #Poutine, #FretteEnEstie, #CôneOrange

### When Writing UI Text

1. **Always use Joual**, not standard French
2. Reference Quebec culture when appropriate
3. Use Quebec-specific emojis: ⚜️🇨🇦🍁🦫🍟
4. Be authentic - avoid forced or fake slang
5. Consult `src/lib/quebecFeatures.ts` for approved phrases

### Ti-Guy AI Personality

Ti-Guy is the AI assistant mascot. His personality:
- Speaks authentic Joual
- Uses expressions like "tiguidou", "en esti", "criss" (sparingly)
- Understands Quebec cultural references
- Friendly, helpful, and proud of Quebec
- Never speaks formal/standard French

---

## 🤖 AI Features

### OpenAI Integration

Zyeuté uses OpenAI for three main features:

#### 1. Ti-Guy Artiste (Image Generation)

- **Model**: DALL-E 3
- **Service**: `src/services/openaiService.ts` → `generateImage()`
- **Use Cases**: Generate images from text prompts with Quebec-themed presets
- **Demo Mode**: Returns placeholder images if API key is missing

```tsx
import { generateImage } from '../services/openaiService';

const imageUrl = await generateImage(
  'Une poutine géante dans le Vieux-Montréal',
  'realistic'
);
```

#### 2. Ti-Guy Studio (Video Captions)

- **Model**: GPT-4 for caption generation
- **Service**: `src/services/videoService.ts`
- **Use Cases**: Auto-generate captions in Joual for video content
- **Demo Mode**: Returns mock captions if API key is missing

#### 3. Ti-Guy Assistant (Conversational AI)

- **Model**: GPT-4
- **Service**: `src/services/openaiService.ts` → `generateCaption()`, `generateHashtags()`
- **Use Cases**: 
  - Generate post captions in Joual
  - Suggest Quebec-relevant hashtags
  - Chat with users
- **System Prompt**: See `TI_GUY_PROMPTS` in `src/lib/quebecFeatures.ts`

### OpenAI Best Practices

1. **Always check if API key exists** before making calls
2. **Provide demo/fallback modes** when API is unavailable
3. **Use appropriate models**: GPT-4 for text, DALL-E 3 for images
4. **Include Joual context** in system prompts
5. **Handle rate limits and errors gracefully**
6. **Log API usage** for monitoring (console.log in dev)

### Environment Variable

```bash
VITE_OPENAI_API_KEY=sk-proj-your-key-here
```

---

## 💳 Payment Integration

### Stripe Integration

Zyeuté uses Stripe for:
1. **Premium Subscriptions** (Zyeuté VIP: Bronze, Silver, Gold)
2. **Marketplace Purchases** (tickets, crafts, services, merch)
3. **Creator Payouts** (revenue distribution to content creators)

### Service: `src/services/stripeService.ts`

#### Key Functions

```tsx
// Initialize Stripe
const stripe = await getStripe();

// Subscribe to premium tier
await subscribeToPremium('gold');

// Purchase marketplace item
await purchaseMarketplaceItem(productId, price);

// Process creator payout
await processCreatorPayout(creatorId, amount);
```

#### Demo Mode

When `VITE_STRIPE_PUBLIC_KEY` is not set, Stripe functions run in **demo mode**:
- Shows toast notifications simulating success
- Updates database locally without actual payment processing
- Useful for development/testing

### Subscription Tiers

Defined in `src/services/subscriptionService.ts`:

```typescript
{
  bronze: { price: 4.99, name: 'Bronze', features: [...] },
  silver: { price: 9.99, name: 'Silver', features: [...] },
  gold: { price: 19.99, name: 'Gold', features: [...] }
}
```

### Environment Variable

```bash
VITE_STRIPE_PUBLIC_KEY=pk_test_your-key-here
```

### Best Practices

1. **Always check if Stripe is initialized** before operations
2. **Provide clear demo mode indicators** to users
3. **Handle payment errors gracefully** with user-friendly messages
4. **Never expose secret keys** (only use publishable keys client-side)
5. **Validate amounts** before processing payments

---

## 🗄️ Database Schema

### Supabase PostgreSQL

Zyeuté uses Supabase for:
- User authentication (Supabase Auth)
- Database (PostgreSQL)
- Storage (images, videos, avatars)

### Core Tables

#### 1. `users` (Profiles)
```sql
- id (uuid, FK to auth.users)
- username (text, unique)
- display_name (text)
- avatar_url (text)
- bio (text)
- region (text) -- Quebec region
- neighborhood (text) -- Montreal quartier
- created_at (timestamp)
```

#### 2. `posts`
```sql
- id (uuid)
- user_id (uuid, FK to users)
- caption (text)
- media_url (text)
- media_type (text) -- 'image' or 'video'
- location (text) -- Quebec region
- fire_count (integer) -- likes count
- created_at (timestamp)
```

#### 3. `comments`
```sql
- id (uuid)
- post_id (uuid, FK to posts)
- user_id (uuid, FK to users)
- content (text)
- created_at (timestamp)
```

#### 4. `stories`
```sql
- id (uuid)
- user_id (uuid, FK to users)
- media_url (text)
- media_type (text)
- expires_at (timestamp) -- 24h from creation
- created_at (timestamp)
```

### Feature-Specific Tables

#### Moderation System (`001_moderation_system.sql`)
- `content_reports` - User-reported content
- `content_reviews` - Moderation review queue
- `moderation_actions` - Actions taken by moderators

#### Achievements & Gamification (`002_achievements.sql`)
- `achievements` - Available achievements
- `user_achievements` - Unlocked achievements per user

#### Creator Subscriptions (`003_creator_subscriptions.sql`)
- `creator_subscriptions` - User subscriptions to creators
- `subscription_tiers` - Tier definitions
- `creator_payouts` - Payout history
- `exclusive_content` - Subscriber-only posts

#### Live Streaming (`004_live_streaming.sql`)
- `live_streams` - Active and past streams
- `stream_viewers` - Viewer count tracking

#### Daily Challenges (`005_daily_challenges.sql`)
- `daily_challenges` - Available challenges
- `user_challenges` - User progress on challenges

#### Marketplace (`006_marketplace.sql`)
- `marketplace_products` - Products for sale
- `marketplace_orders` - Purchase history
- `marketplace_reviews` - Product reviews

#### Email System (`007_email_system.sql`)
- `email_campaigns` - Marketing email campaigns
- `email_preferences` - User email settings

### Database Migrations

Located in `supabase/migrations/`. Run in order:
1. `001_moderation_system.sql`
2. `002_achievements.sql`
3. `003_creator_subscriptions.sql`
4. `004_live_streaming.sql`
5. `005_daily_challenges.sql`
6. `006_marketplace.sql`
7. `007_email_system.sql`

### Supabase Client

```tsx
import { supabase } from '../lib/supabase';

// Query data
const { data, error } = await supabase
  .from('posts')
  .select('*, users(*)')
  .order('created_at', { ascending: false })
  .limit(20);

// Insert data
const { error } = await supabase
  .from('posts')
  .insert({ user_id, caption, media_url });

// Update data
const { error } = await supabase
  .from('posts')
  .update({ fire_count: newCount })
  .eq('id', postId);

// Delete data
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId);
```

### Environment Variables

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Best Practices

1. **Use TypeScript types** from `src/types/database.ts` (auto-generated)
2. **Always handle errors** from Supabase operations
3. **Use RLS (Row Level Security)** for data protection
4. **Optimize queries** with proper indexes and select statements
5. **Use batch operations** when inserting/updating multiple rows

---

## 🧩 Component Structure

### Component Patterns

#### 1. Page Components

Page components are top-level route handlers. They:
- Fetch data needed for the page
- Handle layout and orchestration
- Delegate rendering to feature/UI components
- Located in `src/pages/`

```tsx
// src/pages/Profile.tsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Header } from '../components/Header';
import { FeedGrid } from '../components/FeedGrid';

function Profile() {
  const { slug } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [slug]);

  // ... fetch functions

  return (
    <div>
      <Header />
      <ProfileHeader user={user} />
      <FeedGrid posts={posts} />
    </div>
  );
}

export default Profile;
```

#### 2. Feature Components

Feature components are self-contained, reusable features with their own state and logic:
- `TiGuy` - AI assistant chatbot
- `StoryViewer` - View 24h stories
- `StoryCreator` - Create stories
- `VideoCard` - Video player with controls
- `CommentThread` - Comment section
- Located in `src/components/features/`

#### 3. Base UI & Layout Components

Base UI and layout components in `src/components/`:
- `Button` - Primary/secondary buttons
- `Avatar` - User avatar display
- `Logo` - App logo with variations
- `Toast` - Notification toasts
- `Header` - Top navigation bar
- `BottomNav` - Bottom navigation
- `FeedGrid` - Post grid layout
- `LoadingScreen` - Loading states
- `ErrorBoundary` - Error handling wrapper

### Component Props Pattern

Always define prop types:

```tsx
interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onFollow: () => void;
}

const ProfileHeader = ({ 
  user, 
  isOwnProfile, 
  onFollow 
}: ProfileHeaderProps) => {
  // Component implementation
};

// Or as a function declaration:
function ProfileHeader({ user, isOwnProfile, onFollow }: ProfileHeaderProps) {
  // Component implementation
}
```

### State Management

- **Local State**: `useState` for component-specific state
- **Global State**: Context API (`NotificationContext`, `ThemeContext`)
- **Server State**: Fetch from Supabase, store in local state
- **Forms**: Controlled components with `useState`

### Hooks

Custom hooks in `src/hooks/`:

```tsx
// usePremium.ts - Check if user has premium subscription
const { isPremium, tier } = usePremium();

// useVideoAutoPlay.ts - Handle video autoplay
const { shouldAutoplay } = useVideoAutoPlay();
```

Create custom hooks for:
- Reusable stateful logic
- Data fetching patterns
- Side effects that appear in multiple components

---

## 🎨 Design System

### Theme: Fur Trader × Louis Vuitton × Roots Canada

Zyeuté's design embodies Quebec's fur trading heritage combined with modern luxury:
- **Premium materials**: Leather textures, gold accents
- **Warm colors**: Browns, golds, rich blacks
- **Craftsmanship**: Embossed text, stitched borders, textured overlays

Full design system documentation: `DESIGN_SYSTEM.md`

### Color Palette

#### Primary Colors

```css
/* Gold (Accent & Premium) */
--gold-400: #FFCC33  /* Bright highlights */
--gold-500: #F5C842  /* Primary gold */
--gold-600: #E0B32A  /* Darker accents */
--gold-700: #CC9900  /* Deep gold */

/* Leather Brown (Base) */
--leather-700: #4A3728  /* Primary leather */
--leather-600: #6B5742  /* Light leather */
--leather-800: #3A2B1F  /* Dark leather */
--leather-900: #2B1F15  /* Deep shadow */

/* Rich Black */
--black-rich: #0A0806  /* Deep black with warmth */
```

#### Usage

- **Gold**: Buttons, icons, borders, highlights, premium badges
- **Leather**: Cards, backgrounds, navigation, containers
- **Black**: Main background, text shadows, depth

### CSS Classes

Located in `src/index.css`:

```css
/* Backgrounds */
.leather-card          /* Premium leather card */
.glass-premium         /* Frosted glass effect */
.nav-leather          /* Navigation bar */
.leather-overlay      /* Texture overlay for backgrounds */

/* Buttons */
.btn-gold             /* Primary action button */
.btn-leather          /* Secondary action button */

/* Inputs */
.input-premium        /* Form input fields */

/* Effects */
.glow-gold            /* Strong gold glow */
.glow-gold-subtle     /* Soft gold glow */
.stitched             /* Stitched border effect */
.embossed             /* Embossed text effect */

/* Animations */
.animate-pulse-gold   /* Pulsing gold glow */
.animate-shimmer      /* Shimmer effect */
.animate-fade-in      /* Fade in animation */

/* Utilities */
.badge-premium        /* Premium tier badge */
.divider-gold         /* Gold divider line */
```

### Component Styling Examples

#### Button

```tsx
<button className="btn-gold px-6 py-3 rounded-xl">
  S'abonner
</button>
```

#### Card

```tsx
<div className="leather-card rounded-2xl p-6">
  <h2 className="text-gold-500 embossed">Titre</h2>
  <p className="text-white">Contenu...</p>
</div>
```

#### Input

```tsx
<input 
  type="text"
  className="input-premium w-full"
  placeholder="Ton username..."
/>
```

### Typography

- **Headings**: Gold color (#F5C842), bold weights (700-900)
- **Body Text**: White (#FFFFFF) or warm off-white (#E8DDD3)
- **Muted Text**: Leather-400/500 (#8B7355)

### Icons & Emojis

- **Quebec Icons**: ⚜️ (fleur-de-lys), 🇨🇦 (Canadian flag), 🍁 (maple leaf), 🦫 (beaver)
- **App Icons**: 🔥 (fire/like), 💬 (comment), 🎁 (gift), 🏆 (achievement)
- **Size**: 20px (sm), 24px (md), 32px (lg), 48px (xl)

### Responsive Design

```css
/* Breakpoints */
sm: 640px   /* Mobile */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
```

Use Tailwind's responsive prefixes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

---

## 🧪 Testing Approach

### Current State

Zyeuté does not currently have a formal test suite. Testing is done manually through:
1. Running the dev server (`npm run dev`)
2. Type checking (`npm run type-check`)
3. Building for production (`npm run build`)
4. Manual QA in browser

### Future Testing Strategy

If tests are added in the future, follow these guidelines:

#### Unit Tests
- Test utility functions in `src/lib/`
- Test service functions that don't require external APIs
- Use **Vitest** (Vite's test runner)

#### Integration Tests
- Test component interactions
- Test forms and user flows
- Use **React Testing Library**

#### E2E Tests
- Test critical user journeys (signup, post creation, etc.)
- Use **Playwright** or **Cypress**

#### API Mocking
- Mock Supabase responses
- Mock OpenAI responses
- Mock Stripe responses

### Manual Testing Checklist

When making changes, manually verify:

- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] App builds successfully (`npm run build`)
- [ ] No console errors in browser
- [ ] UI looks correct on desktop and mobile
- [ ] Feature works as expected
- [ ] Error states are handled gracefully
- [ ] Quebec/Joual text is authentic and correct

---

## ✅ Best Practices

### General

1. **Read existing code** before adding new features to understand patterns
2. **Keep changes minimal** - don't refactor unrelated code
3. **Test locally** before committing
4. **Use TypeScript** - avoid `any`, use proper types
5. **Handle errors** - always wrap async operations in try-catch
6. **Provide fallbacks** - demo modes for external services

### Quebec Cultural Sensitivity

1. **Use authentic Joual** - consult `quebecFeatures.ts`
2. **Respect Quebec culture** - avoid stereotypes or mockery
3. **Reference real places/events** - use actual Quebec locations
4. **Be inclusive** - Quebec is diverse, reflect that
5. **Emojis matter** - use Quebec-relevant emojis (⚜️🇨🇦🍁🦫)

### Performance

1. **Optimize images** - compress before uploading to Supabase Storage
2. **Lazy load components** - use React.lazy() for routes
3. **Memoize expensive operations** - use useMemo/useCallback
4. **Limit database queries** - fetch only needed data
5. **Use pagination** - don't load all posts at once

### Security

1. **Never expose secrets** - keep API keys in environment variables
2. **Validate user input** - sanitize data before database operations
3. **Use Supabase RLS** - protect data with Row Level Security policies
4. **Check authentication** - verify user is logged in before operations
5. **Rate limit API calls** - prevent abuse of OpenAI/Stripe APIs

### Accessibility

1. **Use semantic HTML** - proper heading hierarchy, landmarks
2. **Alt text for images** - describe visual content
3. **Keyboard navigation** - ensure all interactive elements are accessible
4. **Color contrast** - maintain WCAG AA standards (4.5:1 for text)
5. **ARIA labels** - use for screen readers when needed

### Code Organization

1. **One component per file** - keep files focused
2. **Extract reusable logic** - into hooks or utility functions
3. **Keep components small** - break down complex components
4. **Services for business logic** - don't put API calls directly in components
5. **Types in separate files** - for complex type definitions

### Git Practices

1. **Commit frequently** - small, logical commits
2. **Write clear commit messages** - describe what and why
3. **Branch naming**: `feature/`, `fix/`, `refactor/` prefixes
4. **Pull before push** - avoid merge conflicts
5. **Review changes** - use `git diff` before committing

---

## 🔧 Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (Optional - runs in demo mode without)
VITE_OPENAI_API_KEY=sk-proj-your-key-here

# Stripe (Optional - runs in demo mode without)
VITE_STRIPE_PUBLIC_KEY=pk_test_your-key-here

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Service Availability

- **Supabase**: Required for app to function (auth, database, storage)
- **OpenAI**: Optional - AI features run in demo mode without API key
- **Stripe**: Optional - payments run in demo mode without API key

---

## 📚 Additional Resources

### Project Documentation

- `README.md` - Project overview and quick start
- `SETUP_GUIDE.md` - Detailed setup instructions
- `DESIGN_SYSTEM.md` - Complete design system documentation

### External Documentation

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **OpenAI**: https://platform.openai.com/docs

### Quebec Resources

- **Joual Dictionary**: See `src/lib/quebecFeatures.ts`
- **Quebec Regions**: `QUEBEC_REGIONS` constant
- **Montreal Neighborhoods**: `MONTREAL_QUARTIERS` constant
- **Quebec Events**: `QUEBEC_EVENTS` constant

---

## 🎯 Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server (localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build
npm run type-check       # Run TypeScript type checking

# Git
git status               # Check current changes
git add .                # Stage all changes
git commit -m "message"  # Commit with message
git push                 # Push to remote

# Deployment (Vercel)
vercel                   # Deploy to Vercel
vercel --prod            # Deploy to production
```

---

## 🚀 Getting Started

When contributing to Zyeuté:

1. **Read this document thoroughly** - understand the project context
2. **Review existing code** - see how patterns are used
3. **Check DESIGN_SYSTEM.md** - follow the design language
4. **Use authentic Joual** - consult `quebecFeatures.ts`
5. **Test your changes** - run type-check and manual testing
6. **Ask questions** - if unsure about Quebec culture or technical approach

---

**Bienvenue à l'équipe Zyeuté!** 🔥⚜️

*Made with ❤️ in Quebec* 🇨🇦  
*Propulsé par Nano Banana* 🍌
