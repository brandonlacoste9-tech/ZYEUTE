# 🔥⚜️ Zyeuté - AI Assistant Guide ⚜️🔥

**Version**: 1.1.0
**Last Updated**: 2025-11-28
**Target**: AI assistants (Claude, GitHub Copilot, etc.)

---

## 📝 Changelog

### Version 1.1.0 (2025-11-28)

**New Sections Added**:
- ⚙️ Environment Setup - Comprehensive .env configuration guide
- 🧪 Testing - Unit, integration, and E2E testing examples
- 🎣 Custom Hooks Patterns - 5+ reusable hook examples
- 🔄 State Management Patterns - React Context best practices
- ⚡ Performance Optimization - Code splitting, memoization, caching
- 🚀 Deployment - Vercel and Netlify deployment guides
- 🔧 Troubleshooting & Debugging - Common issues and solutions

**Enhanced Sections**:
- 📚 Joual Dictionary - Expanded with 100+ terms and phrases
- ✅ Best Practices - More detailed checklists
- 🎯 Quick Reference - Updated commands

**Improvements**:
- Added more code examples throughout
- Improved TypeScript examples
- Enhanced error handling patterns
- Better Quebec culture integration

> **Fait au Québec, pour le Québec** 🇨🇦

This document provides comprehensive guidance for AI assistants working on the Zyeuté codebase. Zyeuté is Quebec's first social media platform built specifically for Quebecers, celebrating Quebec culture, language (Joual), and community.

---

## 📋 Quick Reference

```bash
# Development
npm run dev              # Start dev server (localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build
npm run type-check       # TypeScript type checking

# Git workflow (IMPORTANT)
git checkout claude/claude-md-mijhijw21bbh26vh-01P5geG8qzMw8HEKchAKckP9
git add .
git commit -m "descriptive message"
git push -u origin claude/claude-md-mijhijw21bbh26vh-01P5geG8qzMw8HEKchAKckP9
```

**Key Documentation**:
- `README.md` - Project overview and setup
- `DESIGN_SYSTEM.md` - Complete design system
- `.github/copilot-instructions.md` - Detailed coding standards
- `SETUP_GUIDE.md` - Setup instructions

---

## 🎯 Project Overview

### What is Zyeuté?

Zyeuté is a **Quebec-first social media platform** that celebrates Quebec culture. Think Instagram + TikTok + E-commerce, but specifically for Quebecers.

**Core Identity**:
- **Language**: Uses authentic **Joual** (Quebec French dialect) throughout
- **Design**: Fur trader luxury aesthetic (leather, gold, premium)
- **Culture**: Deep integration of Quebec locations, events, and references
- **Pride**: Celebrating Quebec identity and community

### Key Features

1. **Social Media**: Posts, stories, comments, "feu" reactions (🔥), live streaming
2. **AI Tools** (Ti-Guy):
   - **Ti-Guy Artiste**: AI image generation (DALL-E 3)
   - **Ti-Guy Studio**: AI video editor with Joual captions
   - **Ti-Guy Assistant**: Conversational AI in Joual
3. **E-Commerce**: Marketplace (tickets, crafts, services, merch)
4. **Premium**: VIP subscriptions (Bronze, Silver, Gold)
5. **Gamification**: Achievements, daily challenges, leaderboards
6. **Location**: Quebec regions + Montreal neighborhood tagging

---

## 🛠️ Tech Stack

```typescript
Frontend:  React 18 + TypeScript 5.5.4 + Vite 7.2.4
Styling:   Tailwind CSS v4 (custom design system)
Routing:   React Router DOM v6
State:     React Context API
Database:  Supabase (PostgreSQL)
Auth:      Supabase Auth
Storage:   Supabase Storage
Payments:  Stripe
AI:        OpenAI (GPT-4, DALL-E 3)
Deploy:    Vercel / Netlify
```

---

## ⚙️ Environment Setup

### Required Environment Variables

Create a `.env` file in the project root:

```bash
# Supabase (Required for all features)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI (Required for Ti-Guy AI features)
VITE_OPENAI_API_KEY=sk-your-openai-api-key

# Stripe (Required for payments and subscriptions)
VITE_STRIPE_PUBLIC_KEY=pk_test_your-stripe-publishable-key

# Optional: Sentry for error tracking
VITE_SENTRY_DSN=https://your-sentry-dsn

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Environment Variable Details

#### Supabase Setup

1. **Create Supabase project** at [supabase.com](https://supabase.com)
2. Navigate to **Project Settings > API**
3. Copy **Project URL** → `VITE_SUPABASE_URL`
4. Copy **anon/public key** → `VITE_SUPABASE_ANON_KEY`
5. **NEVER** use the service_role key on the client side!

#### OpenAI Setup

1. **Sign up** at [platform.openai.com](https://platform.openai.com)
2. Navigate to **API Keys**
3. Click **Create new secret key**
4. Copy key → `VITE_OPENAI_API_KEY`
5. **Important**: Add billing info to avoid rate limits
6. **Recommended**: Set usage limits to control costs

**Demo Mode**: If no API key is provided, Ti-Guy features will use placeholder responses.

#### Stripe Setup

1. **Sign up** at [stripe.com](https://stripe.com)
2. Navigate to **Developers > API Keys**
3. Use **Test mode** for development
4. Copy **Publishable key** → `VITE_STRIPE_PUBLIC_KEY`
5. **Never** expose secret keys in client code

**Demo Mode**: If no Stripe key is provided, payment flows will simulate success with toast notifications.

### Environment Files

```bash
# Development
.env.local          # Local development (git-ignored)
.env.development    # Development defaults

# Production
.env.production     # Production values (set in Vercel/Netlify)
```

### Security Best Practices

**DO**:
- ✅ Add `.env*` to `.gitignore`
- ✅ Use different keys for dev/staging/prod
- ✅ Rotate keys regularly
- ✅ Set usage limits on third-party services
- ✅ Use environment variables in CI/CD

**DON'T**:
- ❌ Commit `.env` files to git
- ❌ Share keys in Discord/Slack
- ❌ Use production keys in development
- ❌ Expose service_role or secret keys client-side
- ❌ Hard-code API keys in source files

### Verifying Setup

```bash
# Check environment variables are loaded
npm run dev

# In browser console:
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has OpenAI key:', !!import.meta.env.VITE_OPENAI_API_KEY);
console.log('Has Stripe key:', !!import.meta.env.VITE_STRIPE_PUBLIC_KEY);
```

**Expected Output**:
- Supabase URL should be your project URL
- OpenAI and Stripe should show `true` if keys are set
- **Never** log the actual keys!

---

## 📁 Project Structure

```
zyeute/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Auth components (ProtectedAdminRoute)
│   │   ├── features/       # Feature components (TiGuy, StoryViewer, etc.)
│   │   ├── gamification/   # Achievement components
│   │   ├── moderation/     # Moderation components
│   │   ├── settings/       # Settings components
│   │   ├── BottomNav.tsx   # Bottom navigation bar
│   │   ├── Button.tsx      # Button component
│   │   ├── Avatar.tsx      # Avatar component
│   │   ├── Header.tsx      # Top header
│   │   └── ...
│   ├── pages/              # Page components (one per route)
│   │   ├── admin/          # Admin pages
│   │   ├── legal/          # Legal pages (Terms, Privacy, etc.)
│   │   ├── moderation/     # Moderation pages
│   │   ├── Feed.tsx        # Main feed
│   │   ├── Profile.tsx     # User profile
│   │   ├── Upload.tsx      # Upload content
│   │   └── ...
│   ├── services/           # Business logic & API
│   │   ├── openaiService.ts       # OpenAI integration
│   │   ├── stripeService.ts       # Stripe payments
│   │   ├── achievementService.ts  # Achievements
│   │   ├── moderationService.ts   # Content moderation
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── usePremium.ts          # Premium subscription check
│   │   └── useVideoAutoPlay.ts    # Video autoplay logic
│   ├── contexts/           # React contexts
│   │   ├── NotificationContext.tsx # Notifications
│   │   └── ThemeContext.tsx        # Theme state
│   ├── lib/                # Utilities & configs
│   │   ├── supabase.ts            # Supabase client
│   │   ├── quebecFeatures.ts      # Quebec-specific data/helpers
│   │   └── utils.ts               # General utilities
│   ├── types/              # TypeScript types
│   │   ├── database.ts     # Database types (auto-generated)
│   │   └── index.ts        # General types
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles + design system
├── public/                 # Static assets
├── supabase/               # Database
│   └── migrations/         # SQL migrations (001-007)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json
```

---

## 🇨🇦 Quebec Culture & Joual

### Critical: ALWAYS Use Joual, Not Standard French

Zyeuté's identity is **Joual** (Quebec French dialect). This is non-negotiable.

**Example**:
- ❌ Standard French: "C'est très bon"
- ✅ Joual: "C'est tiguidou" or "C'est malade!"

### Joual Dictionary

Reference: `src/lib/quebecFeatures.ts`

#### Social Actions & UI Elements

```typescript
// Core Actions
like: 'Donner du feu 🔥'
unlike: 'Retirer le feu'
comment: 'Jasette 💬'
share: 'Partager ça'
follow: 'Suivre'
unfollow: 'Unfollow'
post: 'Publier'
edit: 'Modifier'
delete: 'Supprimer'

// Buttons & CTAs
save: 'Sauvegarder'
cancel: 'Annuler'
confirm: 'Confirmer'
send: 'Envoyer'
upload: 'Uploader'
download: 'Télécharger'
search: 'Chercher'
filter: 'Filtrer'

// Navigation
home: 'Accueil'
profile: 'Profil'
messages: 'Messages'
notifications: 'Notifications'
settings: 'Paramètres'
explore: 'Explorer'
```

#### Reactions & Emotions

```typescript
// Positive
cool: 'Tiguidou'
awesome: 'Malade!'
nice: 'Nice en criss'
perfect: 'Parfait'
excellent: 'Excellent'
love: 'J\'adore ça'
beautiful: 'C\'est beau en tabarnak'

// Funny
funny: 'Drôle en esti'
lol: 'Haha tabarnak'
hilarious: 'Trop drôle'

// Negative (use sparingly)
bad: 'Pas terrible'
ugly: 'Laid'
boring: 'Plate'

// Neutral
ok: 'Correct'
maybe: 'Peut-être'
sure: 'C\'est sûr'
```

#### Weather & Seasons (Very Quebec!)

```typescript
// Temperature
cold: 'Frette en esti'
freezing: 'Y fait frette en tabarnak'
hot: 'Chaud en criss'
warm: 'Doux'
humid: 'Humide en esti'

// Conditions
snow: 'Y neige!'
snowing_hard: 'Ça tombe en tabarnak'
rain: 'Y pleut'
sunny: 'Y fait beau'
cloudy: 'C\'est nuageux'
ice: 'C\'est glacé'
slush: 'Y a de la slush partout'

// Seasons
winter: 'Hiver'
spring: 'Printemps (saison de construction 🚧)'
summer: 'Été'
fall: 'Automne'
construction_season: 'Saison de construction 🚧'
```

#### Quebec-Specific Terms

```typescript
// Food & Drinks
poutine: 'Poutine 🍟'
maple_syrup: 'Sirop d\'érable 🍁'
tourtière: 'Tourtière'
caribou: 'Caribou (drink) 🦌'
beaver_tail: 'Queue de castor'
smoked_meat: 'Smoked meat'

// Cultural
fleurdelise: 'Fleur-de-lys ⚜️'
saint_jean: 'Saint-Jean-Baptiste'
hockey: 'Hockey 🏒'
maple_leaf: 'Feuille d\'érable 🍁'
beaver: 'Castor 🦫'
winter_carnival: 'Carnaval d\'hiver'

// Locations
montreal: 'Montréal'
quebec_city: 'Ville de Québec'
old_montreal: 'Vieux-Montréal'
plateau: 'Le Plateau'
mile_end: 'Mile End'
mount_royal: 'Mont-Royal'
```

#### Common Phrases in Context

```typescript
// Greetings
hello: 'Salut!'
hi: 'Allô!'
goodbye: 'Bye!'
see_you: 'À plus!'
thanks: 'Merci!'
welcome: 'Bienvenue!'

// Status Messages
loading: 'Chargement...'
error: 'Oops, une erreur est survenue'
success: 'C\'est fait!'
no_results: 'Rien trouvé'
try_again: 'Réessaie'
coming_soon: 'Bientôt disponible'

// User Actions
you_liked: 'Tu as aimé ça'
you_commented: 'Tu as commenté'
you_shared: 'Tu as partagé'
posted_ago: 'Publié il y a'
new_post: 'Nouveau post'
delete_confirm: 'Veux-tu vraiment supprimer ça?'

// Counts
likes: '{count} feu(x) 🔥'
comments: '{count} commentaire(s)'
shares: '{count} partage(s)'
followers: '{count} follower(s)'
following: '{count} abonnement(s)'
```

#### Error Messages & Feedback

```typescript
// Errors (in Joual, but clear)
network_error: 'Problème de connexion. Vérifie ton Internet!'
auth_required: 'Tu dois te connecter pour faire ça'
permission_denied: 'T\'as pas la permission'
not_found: 'Page introuvable'
server_error: 'Erreur du serveur. On s\'en occupe!'

// Success Messages
post_created: 'Post publié!'
profile_updated: 'Profil mis à jour!'
message_sent: 'Message envoyé!'
upload_success: 'Upload réussi!'
payment_success: 'Paiement complété!'

// Validation
required_field: 'Ce champ est obligatoire'
invalid_email: 'Email invalide'
password_short: 'Mot de passe trop court'
username_taken: 'Ce nom est déjà pris'
```

#### Ti-Guy Specific

```typescript
// Ti-Guy Responses
thinking: 'Ti-Guy réfléchit...'
generating: 'Ti-Guy crée ton image...'
ready: 'C\'est prêt!'
error: 'Ti-Guy a un problème. Réessaie!'

// Ti-Guy Personality
greeting: 'Salut! Qu\'est-ce que Ti-Guy peut faire pour toi?'
help: 'Ti-Guy est là pour t\'aider!'
tip: 'Tip de Ti-Guy:'
suggestion: 'Ti-Guy te suggère:'
```

#### Premium/VIP Tiers

```typescript
// Tiers
bronze: 'Bronze'
silver: 'Argent'
gold: 'Or'

// Features
vip_access: 'Accès VIP'
exclusive: 'Exclusif'
premium_only: 'Réservé aux VIP'
upgrade: 'Upgrade ton compte'
subscribe: 'S\'abonner'
```

### Quebec Cultural Elements

**Regions**: Montreal, Quebec City, Gaspésie, Laurentides, Charlevoix, etc.
**Montreal Neighborhoods**: Plateau, Mile End, Hochelaga, Verdun, etc.
**Virtual Gifts**: Poutine 🍟, Caribou 🦌, Fleur-de-lys ⚜️, Sirop d'érable 🍁
**Emojis**: ⚜️ 🇨🇦 🍁 🦫 🍟 🔥

**When Writing UI Text**:
1. Always use Joual, never standard French
2. Consult `quebecFeatures.ts` for approved phrases
3. Reference real Quebec places/events
4. Use Quebec-relevant emojis
5. Be authentic - avoid forced slang

### Ti-Guy AI Personality

Ti-Guy is the AI mascot. Personality:
- Speaks authentic Joual
- Uses expressions like "tiguidou", "en esti", "criss" (sparingly)
- Understands Quebec cultural references
- Friendly, helpful, proud of Quebec
- **Never** speaks formal/standard French

---

## 📝 Coding Standards

### TypeScript

```typescript
// ✅ DO: Use proper types
interface ProfileProps {
  user: User;
  isOwnProfile: boolean;
  onFollow: () => void;
}

function Profile({ user, isOwnProfile, onFollow }: ProfileProps) {
  // Implementation
}

// ❌ DON'T: Use 'any' or React.FC
const Profile: React.FC<any> = (props) => { /* ... */ }
```

**Rules**:
- Always use TypeScript with proper type annotations
- Avoid `any` - use specific types or `unknown`
- Use interfaces for objects, types for unions/primitives
- Strict mode enabled
- Export types for reusability

### React Best Practices

```typescript
// ✅ DO: Functional components with hooks
function VideoCard({ video, autoplay }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (autoplay) {
      playVideo();
    }
  }, [autoplay]);

  return (/* JSX */);
}

// ❌ DON'T: Class components or React.FC
class VideoCard extends React.Component { /* ... */ }
const VideoCard: React.FC<Props> = (props) => { /* ... */ }
```

**Rules**:
- Use functional components with hooks (no class components)
- Define props: `(props: Props) => JSX.Element` or `function Component(props: Props)`
- **Avoid `React.FC`** (deprecated pattern)
- Destructure props in parameters
- Proper dependency arrays in `useEffect`, `useMemo`, `useCallback`

### File Naming

```
Components:  PascalCase.tsx  (TiGuyAssistant.tsx)
Services:    camelCase.ts    (openaiService.ts)
Utilities:   camelCase.ts    (quebecFeatures.ts)
Pages:       PascalCase.tsx  (Profile.tsx)
```

### Import Order

```typescript
// 1. React & third-party
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Services & utilities
import { supabase } from '../lib/supabase';
import { openaiService } from '../services/openaiService';

// 3. Components
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';

// 4. Types
import { User, Post } from '../types';
```

### Error Handling

Always wrap async operations:

```typescript
try {
  const result = await openai.generateImage(prompt);
  return result;
} catch (error) {
  console.error('Image generation failed:', error);
  toast.error('Impossible de générer l\'image. Réessaie!');
  return null;
}
```

**Rules**:
- Try-catch for all async operations
- Toast notifications for user-facing errors
- Console logs for debugging
- Provide fallbacks/demo modes when services unavailable

### Custom Hooks Patterns

Custom hooks encapsulate reusable logic. Follow these patterns:

#### Data Fetching Hook

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UsePostsOptions {
  limit?: number;
  userId?: string;
}

export function usePosts({ limit = 20, userId }: UsePostsOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        let query = supabase
          .from('posts')
          .select('*, users(*)')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;
        if (error) throw error;

        setPosts(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [limit, userId]);

  return { posts, loading, error };
}

// Usage:
function Feed() {
  const { posts, loading, error } = usePosts({ limit: 20 });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return <div>{posts.map(post => <PostCard key={post.id} post={post} />)}</div>;
}
```

#### Authentication Hook

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, signOut };
}
```

#### Local Storage Hook

```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Usage:
function Settings() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  return (
    <button onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
```

#### Debounce Hook

```typescript
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage: Search with debounce
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
      searchUsers(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Chercher..."
    />
  );
}
```

#### Media Query Hook

```typescript
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Usage:
function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div>
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </div>
  );
}
```

#### Hook Best Practices

**DO**:
- ✅ Start hook names with `use`
- ✅ Return objects for multiple values (unless 2 values like useState)
- ✅ Handle cleanup in useEffect
- ✅ Memoize expensive computations
- ✅ Document parameters and return values

**DON'T**:
- ❌ Call hooks conditionally or in loops
- ❌ Call hooks from regular functions
- ❌ Forget dependency arrays in useEffect
- ❌ Create hooks for one-time logic
- ❌ Over-abstract simple logic

### State Management Patterns

Zyeuté uses **React Context API** for global state. Avoid over-complicating with Redux unless absolutely necessary.

#### Creating a Context

```typescript
// contexts/NotificationContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: Notification['type'], message: string) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: Notification['type'], message: string) => {
    const id = Math.random().toString(36);
    setNotifications((prev) => [...prev, { id, type, message }]);

    // Auto-remove after 5 seconds
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
```

#### Using Context

```typescript
// App.tsx
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <YourApp />
    </NotificationProvider>
  );
}

// Any component
import { useNotifications } from '../contexts/NotificationContext';

function SomeComponent() {
  const { addNotification } = useNotifications();

  const handleAction = async () => {
    try {
      await doSomething();
      addNotification('success', 'Action réussie!');
    } catch (error) {
      addNotification('error', 'Oops, une erreur est survenue');
    }
  };

  return <button onClick={handleAction}>Do Something</button>;
}
```

#### Context Performance Optimization

```typescript
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

// Split context into data and actions for better performance
const UserDataContext = createContext<User | null>(null);
const UserActionsContext = createContext<UserActions | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Memoize actions so they don't cause re-renders
  const actions = useMemo(() => ({
    updateUser: (updates: Partial<User>) => {
      setUser((prev) => prev ? { ...prev, ...updates } : null);
    },
    logout: () => setUser(null),
  }), []);

  return (
    <UserDataContext.Provider value={user}>
      <UserActionsContext.Provider value={actions}>
        {children}
      </UserActionsContext.Provider>
    </UserDataContext.Provider>
  );
}

// Separate hooks for data and actions
export function useUser() {
  return useContext(UserDataContext);
}

export function useUserActions() {
  const context = useContext(UserActionsContext);
  if (!context) throw new Error('useUserActions must be used within UserProvider');
  return context;
}
```

### Testing

#### Component Testing

Use React Testing Library for component tests:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/Button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Donner du feu</Button>);
    expect(screen.getByText('Donner du feu')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### Service Testing

Test services with mocked dependencies:

```typescript
import { generateImage } from '../services/openaiService';

// Mock the OpenAI client
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    images: {
      generate: jest.fn().mockResolvedValue({
        data: [{ url: 'https://example.com/image.png' }]
      })
    }
  }))
}));

describe('openaiService', () => {
  it('should generate image with correct prompt', async () => {
    const imageUrl = await generateImage('Une poutine', 'realistic');
    expect(imageUrl).toBe('https://example.com/image.png');
  });

  it('should handle errors gracefully', async () => {
    // Mock error scenario
    const result = await generateImage('', 'realistic');
    expect(result).toBeNull();
  });
});
```

#### Integration Testing

Test complete user flows:

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { supabase } from '../lib/supabase';
import { Feed } from '../pages/Feed';

jest.mock('../lib/supabase');

describe('Feed Integration', () => {
  it('should load and display posts', async () => {
    // Mock Supabase response
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            data: [
              { id: 1, caption: 'Test post', fire_count: 10 }
            ],
            error: null
          })
        })
      })
    });

    render(<Feed />);

    await waitFor(() => {
      expect(screen.getByText('Test post')).toBeInTheDocument();
    });
  });
});
```

#### Testing Best Practices

**DO**:
- Test user behavior, not implementation details
- Use data-testid sparingly (prefer semantic queries)
- Mock external dependencies (Supabase, OpenAI, Stripe)
- Test error states and loading states
- Test accessibility (keyboard navigation, screen readers)

**DON'T**:
- Test internal component state
- Rely on CSS classes or internal structure
- Skip error handling tests
- Test third-party library functionality
- Write tests that depend on timing

#### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test Button.test.tsx
```

---

## 🎨 Design System

### Theme: Fur Trader × Louis Vuitton × Roots

**Aesthetic**: Premium Canadian heritage meets luxury fashion

**Elements**:
- Leather textures
- Gold accents
- Warm colors (browns, golds)
- Embossed text
- Stitched borders

Full documentation: `DESIGN_SYSTEM.md`

### Color Palette

```css
/* Gold (Accent & Premium) */
--gold-500: #F5C842    /* Primary gold */
--gold-600: #E0B32A    /* Darker accent */

/* Leather Brown (Base) */
--leather-700: #4A3728  /* Primary leather */
--leather-800: #3A2B1F  /* Dark leather */

/* Rich Black */
--black-rich: #0A0806
```

### CSS Classes (Quick Reference)

```css
/* Backgrounds */
.leather-card          /* Premium leather card */
.glass-premium         /* Frosted glass effect */
.nav-leather          /* Navigation bar */

/* Buttons */
.btn-gold             /* Primary action */
.btn-leather          /* Secondary action */

/* Inputs */
.input-premium        /* Form fields */

/* Effects */
.glow-gold            /* Gold glow */
.embossed             /* Embossed text */
.stitched             /* Stitched border */

/* Animations */
.animate-pulse-gold   /* Pulsing glow */
.animate-shimmer      /* Shimmer effect */
```

### Usage Example

```tsx
<div className="leather-card rounded-2xl p-6">
  <h2 className="text-gold-500 embossed">Zyeuté VIP</h2>
  <p className="text-white">Accès illimité à tout le contenu!</p>
  <button className="btn-gold w-full mt-4">
    S'abonner
  </button>
</div>
```

---

## ⚡ Performance Optimization

### Code Splitting & Lazy Loading

Split code by route for faster initial load:

```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load route components
const Feed = lazy(() => import('./pages/Feed'));
const Profile = lazy(() => import('./pages/Profile'));
const TiGuyArtiste = lazy(() => import('./pages/TiGuyArtiste'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loading">Chargement...</div>}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/ti-guy-artiste" element={<TiGuyArtiste />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Image Optimization

```typescript
// Use responsive images
<img
  src="/images/post-800.jpg"
  srcSet="
    /images/post-400.jpg 400w,
    /images/post-800.jpg 800w,
    /images/post-1200.jpg 1200w
  "
  sizes="(max-width: 768px) 100vw, 800px"
  alt="Post image"
  loading="lazy"
/>

// Or use Vite's built-in image optimization
import profileImageSmall from './profile.jpg?w=200';
import profileImageLarge from './profile.jpg?w=800';

<img src={profileImageSmall} alt="Profile" />
```

### Memoization

Prevent unnecessary re-renders:

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive components
const PostCard = memo(function PostCard({ post }: PostCardProps) {
  return (
    <div className="post-card">
      {/* ... */}
    </div>
  );
});

// Memoize expensive calculations
function Feed({ posts }: FeedProps) {
  const sortedPosts = useMemo(() => {
    return posts.sort((a, b) => b.fire_count - a.fire_count);
  }, [posts]);

  // Memoize callbacks
  const handleLike = useCallback((postId: string) => {
    likePost(postId);
  }, []);

  return <div>{sortedPosts.map(post => <PostCard key={post.id} post={post} onLike={handleLike} />)}</div>;
}
```

### Database Query Optimization

```typescript
// ❌ BAD: Fetching unnecessary data
const { data } = await supabase
  .from('posts')
  .select('*');  // Fetches all columns

// ✅ GOOD: Select only needed columns
const { data } = await supabase
  .from('posts')
  .select('id, caption, media_url, fire_count, users(username, avatar)');

// ✅ GOOD: Use pagination
const { data } = await supabase
  .from('posts')
  .select('id, caption, media_url')
  .range(0, 19)  // First 20 posts
  .limit(20);

// ✅ GOOD: Use indexes for filtering
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('user_id', userId)  // Assumes index on user_id
  .order('created_at', { ascending: false });
```

### Infinite Scroll Pattern

```typescript
import { useState, useEffect, useRef } from 'react';

function InfiniteFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const { data } = await supabase
        .from('posts')
        .select('*')
        .range(page * 20, (page + 1) * 20 - 1);

      if (data) {
        setPosts((prev) => [...prev, ...data]);
        setHasMore(data.length === 20);
      }
      setLoading(false);
    }

    loadPosts();
  }, [page]);

  return (
    <div>
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
      <div ref={observerTarget} className="h-10" />
      {loading && <div>Chargement...</div>}
    </div>
  );
}
```

### Bundle Size Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer

# Tips:
# 1. Use tree-shaking friendly imports
import { Button } from './components/Button';  # ✅ Good
import * as Components from './components';    # ❌ Bad

# 2. Avoid large dependencies
# Instead of moment.js (71KB), use date-fns (13KB)
import { format } from 'date-fns';

# 3. Use dynamic imports for heavy features
const TiGuyArtiste = lazy(() => import('./features/TiGuyArtiste'));
```

### Debounce & Throttle

```typescript
// Debounce: Wait for user to stop typing
function SearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

// Throttle: Limit execution rate (for scroll events)
function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}
```

### Caching Strategies

```typescript
// Cache API responses in memory
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache(key: string, fetcher: () => Promise<any>) {
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}

// Usage
const posts = await fetchWithCache('recent-posts', async () => {
  const { data } = await supabase.from('posts').select('*').limit(20);
  return data;
});
```

### Performance Monitoring

```typescript
// Monitor component render time
import { useEffect, useRef } from 'react';

function useRenderTime(componentName: string) {
  const renderStart = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    if (renderTime > 16) {  // 16ms = 60fps threshold
      console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
    }
  });
}

// Usage in component
function Feed() {
  useRenderTime('Feed');
  // ...
}
```

---

## 🤖 AI Features (Ti-Guy)

### OpenAI Integration

**Environment Variable**: `VITE_OPENAI_API_KEY`

#### 1. Ti-Guy Artiste (Image Generation)

```typescript
import { generateImage } from '../services/openaiService';

const imageUrl = await generateImage(
  'Une poutine géante dans le Vieux-Montréal',
  'realistic'
);
```

- **Model**: DALL-E 3
- **Demo Mode**: Returns placeholder if no API key

#### 2. Ti-Guy Studio (Video Captions)

```typescript
import { generateCaptions } from '../services/videoService';

const captions = await generateCaptions(videoUrl);
```

- **Model**: GPT-4
- **Output**: Captions in Joual

#### 3. Ti-Guy Assistant (Chat)

```typescript
import { generateCaption, generateHashtags } from '../services/openaiService';

const caption = await generateCaption(imageDescription);
const hashtags = await generateHashtags(caption);
```

- **Model**: GPT-4
- **System Prompt**: See `TI_GUY_PROMPTS` in `quebecFeatures.ts`

### Best Practices

1. **Always check API key exists** before calls
2. **Provide demo/fallback modes** when unavailable
3. **Include Joual context** in system prompts
4. **Handle rate limits gracefully**
5. **Log API usage** (console.log in dev)

---

## 💳 Payments (Stripe)

**Environment Variable**: `VITE_STRIPE_PUBLIC_KEY`

### Service: `src/services/stripeService.ts`

```typescript
import { subscribeToPremium, purchaseMarketplaceItem } from '../services/stripeService';

// Subscribe to VIP tier
await subscribeToPremium('gold');

// Purchase item
await purchaseMarketplaceItem(productId, 49.99);
```

### Subscription Tiers

```typescript
bronze: { price: 4.99, features: [...] }
silver: { price: 9.99, features: [...] }
gold:   { price: 19.99, features: [...] }
```

### Demo Mode

When no Stripe key:
- Shows toast notifications simulating success
- Updates database locally (no real payment)
- Useful for development

**Best Practices**:
1. Check if Stripe initialized before operations
2. Clear demo mode indicators to users
3. Handle payment errors gracefully
4. Never expose secret keys (client-side only uses publishable keys)

---

## 🗄️ Database (Supabase)

**Environment Variables**:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Core Tables

```sql
users           # User profiles (username, avatar, bio, region)
posts           # User posts (caption, media_url, fire_count)
comments        # Post comments
stories         # 24h ephemeral content
```

### Feature Tables

See migrations in `supabase/migrations/`:
- `001_moderation_system.sql` - Content reports/reviews
- `002_achievements.sql` - Gamification
- `003_creator_subscriptions.sql` - Creator revenue
- `004_live_streaming.sql` - Live streams
- `005_daily_challenges.sql` - Daily quests
- `006_marketplace.sql` - E-commerce
- `007_email_system.sql` - Email campaigns

### Supabase Client Usage

```typescript
import { supabase } from '../lib/supabase';

// Query with join
const { data, error } = await supabase
  .from('posts')
  .select('*, users(*)')
  .order('created_at', { ascending: false })
  .limit(20);

// Insert
const { error } = await supabase
  .from('posts')
  .insert({ user_id, caption, media_url });

// Update
const { error } = await supabase
  .from('posts')
  .update({ fire_count: newCount })
  .eq('id', postId);

// Delete
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId);
```

**Best Practices**:
1. Use TypeScript types from `src/types/database.ts`
2. Always handle errors from operations
3. Use RLS (Row Level Security) for data protection
4. Optimize queries with indexes and selective `select()`
5. Batch operations when possible

---

## 🔄 Development Workflow

### Before Starting

1. **Read existing code** - understand patterns before adding features
2. **Check documentation** - README, DESIGN_SYSTEM, this file
3. **Review Quebec features** - consult `quebecFeatures.ts` for Joual

### Making Changes

```bash
# 1. Start dev server
npm run dev

# 2. Make changes (TypeScript, React, etc.)

# 3. Type check (should pass)
npm run type-check

# 4. Test in browser
# - No console errors
# - UI looks correct (desktop + mobile)
# - Feature works as expected
# - Error states handled

# 5. Build (should succeed)
npm run build
```

### Git Workflow

**IMPORTANT**: Always work on the designated branch:

```bash
# Current branch
claude/claude-md-mijhijw21bbh26vh-01P5geG8qzMw8HEKchAKckP9

# Before committing
git status                    # Check changes
git add .                     # Stage changes

# Commit with descriptive message
git commit -m "feat: add Ti-Guy voice settings"
git commit -m "fix: resolve video autoplay issue"
git commit -m "refactor: centralize BottomNav component"

# Push to designated branch
git push -u origin claude/claude-md-mijhijw21bbh26vh-01P5geG8qzMw8HEKchAKckP9
```

**Commit Message Format**:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation
- `style:` - Design/CSS changes
- `chore:` - Maintenance

**Retry Logic for Network Issues**:
If push/fetch fails due to network errors, retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s).

### Creating Pull Requests

When ready for PR:

```bash
# Ensure all changes committed and pushed
git status

# Create PR to main branch
# Include:
# - Clear title describing changes
# - Summary of what changed and why
# - Test plan (how to verify changes)
# - Screenshots if UI changes
```

---

## 🚀 Deployment

### Deploying to Vercel

**Recommended** for Zyeuté - zero config, automatic deployments.

#### 1. Install Vercel CLI

```bash
npm i -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Deploy

```bash
# First deployment (interactive setup)
vercel

# Production deployment
vercel --prod
```

#### 4. Configure Environment Variables

In Vercel dashboard:
1. Go to **Project Settings > Environment Variables**
2. Add all required variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENAI_API_KEY`
   - `VITE_STRIPE_PUBLIC_KEY`
3. Set environment: **Production** / **Preview** / **Development**

#### 5. Configure Build Settings

`vercel.json` (already in project):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 6. Auto-Deploy from Git

1. Connect GitHub repo to Vercel
2. **Production branch**: `main`
3. **Preview branches**: All other branches (auto-preview on PR)
4. Push to `main` → auto-deploy to production

**Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)

---

### Deploying to Netlify

Alternative to Vercel.

#### 1. Install Netlify CLI

```bash
npm i -g netlify-cli
```

#### 2. Login to Netlify

```bash
netlify login
```

#### 3. Initialize Site

```bash
netlify init
```

#### 4. Configure Build

`netlify.toml` (create in project root):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

#### 5. Deploy

```bash
# Deploy preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

#### 6. Environment Variables

```bash
# Set via CLI
netlify env:set VITE_SUPABASE_URL "your-url"
netlify env:set VITE_SUPABASE_ANON_KEY "your-key"

# Or in Netlify dashboard:
# Site Settings > Environment Variables
```

**Netlify Dashboard**: [app.netlify.com](https://app.netlify.com)

---

### Pre-Deployment Checklist

Before deploying to production:

**Code Quality**:
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in production build
- [ ] All tests passing (if applicable)

**Environment**:
- [ ] All environment variables set in deployment platform
- [ ] Production API keys configured (not dev/test keys)
- [ ] `.env` files NOT committed to git

**Supabase**:
- [ ] Database migrations run in production
- [ ] RLS policies enabled on all tables
- [ ] Storage buckets configured
- [ ] Auth providers enabled

**Performance**:
- [ ] Images optimized
- [ ] Routes lazy-loaded
- [ ] Bundle size acceptable (`npm run build` - check dist/ size)
- [ ] No unused dependencies in `package.json`

**Security**:
- [ ] API keys are env variables (not hardcoded)
- [ ] CORS configured in Supabase
- [ ] Rate limiting configured
- [ ] Error messages don't expose sensitive info

**SEO & Meta**:
- [ ] Update `index.html` title and meta tags
- [ ] Add Open Graph tags
- [ ] Add favicon
- [ ] Configure robots.txt (if needed)

---

### Post-Deployment Monitoring

#### Check Deployment Status

```bash
# Vercel
vercel logs

# Netlify
netlify logs
```

#### Monitor Performance

1. **Vercel Analytics**: Automatic (upgrade for detailed metrics)
2. **Lighthouse Score**: Run in Chrome DevTools
3. **Sentry**: Add for error tracking (optional)

```typescript
// Optional: Sentry integration
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

#### Rollback if Needed

```bash
# Vercel: Rollback to previous deployment
# Go to dashboard > Deployments > Click previous > "Promote to Production"

# Netlify: Rollback
netlify rollback
```

---

### Custom Domain Setup

#### Vercel

1. Go to **Project Settings > Domains**
2. Add your domain (e.g., `zyeute.ca`)
3. Update DNS records with your registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (up to 48h)
5. SSL automatically configured

#### Netlify

1. Go to **Site Settings > Domain Management**
2. Add custom domain
3. Update DNS records:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: <your-site>.netlify.app
   ```
4. Enable HTTPS (automatic)

---

## ✅ Best Practices Checklist

### General

- [ ] Read existing code before adding features
- [ ] Keep changes minimal - don't refactor unrelated code
- [ ] Test locally before committing
- [ ] Use TypeScript - avoid `any`
- [ ] Handle errors with try-catch
- [ ] Provide fallbacks for external services

### Quebec Culture

- [ ] Use authentic Joual (check `quebecFeatures.ts`)
- [ ] Respect Quebec culture - no stereotypes
- [ ] Reference real Quebec places/events
- [ ] Use Quebec-relevant emojis (⚜️🇨🇦🍁🦫)
- [ ] Consult Joual dictionary for UI text

### Performance

- [ ] Optimize images before upload
- [ ] Lazy load routes with `React.lazy()`
- [ ] Memoize expensive operations (`useMemo`, `useCallback`)
- [ ] Limit database queries - fetch only needed data
- [ ] Use pagination for lists

### Security

- [ ] Never expose secrets (use env variables)
- [ ] Validate user input
- [ ] Use Supabase RLS policies
- [ ] Check authentication before operations
- [ ] Rate limit API calls

### Accessibility

- [ ] Use semantic HTML
- [ ] Alt text for images
- [ ] Keyboard navigation support
- [ ] Color contrast WCAG AA (4.5:1)
- [ ] ARIA labels for screen readers

---

## 🚨 Common Pitfalls

### 1. Using Standard French Instead of Joual

❌ **Wrong**:
```typescript
<button>Suivre cet utilisateur</button>
```

✅ **Correct**:
```typescript
<button>Suivre</button>
```

### 2. Using React.FC (Deprecated)

❌ **Wrong**:
```typescript
const Profile: React.FC<ProfileProps> = ({ user }) => {
  // ...
}
```

✅ **Correct**:
```typescript
function Profile({ user }: ProfileProps) {
  // ...
}
```

### 3. Forgetting Error Handling

❌ **Wrong**:
```typescript
const data = await supabase.from('posts').select();
```

✅ **Correct**:
```typescript
try {
  const { data, error } = await supabase.from('posts').select();
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Failed to fetch posts:', error);
  toast.error('Erreur en chargeant les posts');
  return [];
}
```

### 4. Not Checking API Keys

❌ **Wrong**:
```typescript
const result = await openai.generateImage(prompt);
```

✅ **Correct**:
```typescript
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
if (!apiKey) {
  console.warn('OpenAI API key missing, using demo mode');
  return getDemoImage();
}
const result = await openai.generateImage(prompt);
```

### 5. Over-Engineering

❌ **Wrong**: Creating abstractions for one-time use
```typescript
// Don't create helpers for one-time operations
const createUserHelper = (data) => { /* complex abstraction */ }
```

✅ **Correct**: Keep it simple
```typescript
// Just do it directly if it's one-time
const { data, error } = await supabase.from('users').insert(userData);
```

---

## 🔧 Troubleshooting & Debugging

### Common Issues

#### 1. "Cannot find module" errors

**Problem**: Import errors after adding new files

```bash
Error: Cannot find module '../components/NewComponent'
```

**Solutions**:
```bash
# Restart dev server
Ctrl+C
npm run dev

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev

# Verify file path and extension (.tsx vs .ts)
```

#### 2. Supabase Connection Issues

**Problem**: "Failed to fetch" or CORS errors

**Solutions**:
```typescript
// Check environment variables
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Verify Supabase project is running (check dashboard)
// Check CORS settings in Supabase dashboard
// Ensure RLS policies don't block the query
```

**Disable RLS temporarily for testing**:
```sql
-- In Supabase SQL Editor (BE CAREFUL - only for debugging!)
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
-- Remember to re-enable after:
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

#### 3. OpenAI API Errors

**Problem**: Rate limits or authentication errors

```typescript
// Error: 429 Too Many Requests
// Solution: Implement rate limiting

const OPENAI_CALL_DELAY = 1000; // 1 second between calls
let lastCallTime = 0;

async function rateLimitedOpenAI(prompt: string) {
  const now = Date.now();
  const timeToWait = Math.max(0, OPENAI_CALL_DELAY - (now - lastCallTime));

  await new Promise(resolve => setTimeout(resolve, timeToWait));
  lastCallTime = Date.now();

  return await openai.generateImage(prompt);
}
```

**Problem**: Invalid API key

```typescript
// Check key format
const key = import.meta.env.VITE_OPENAI_API_KEY;
if (!key || !key.startsWith('sk-')) {
  console.error('Invalid OpenAI API key format');
}

// Verify key works with a simple test
async function testOpenAIKey() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Test' }],
      max_tokens: 5
    });
    console.log('OpenAI key valid:', !!response);
  } catch (error) {
    console.error('OpenAI key invalid:', error);
  }
}
```

#### 4. Stripe Payment Issues

**Problem**: Payments not processing

**Debug checklist**:
```typescript
// 1. Verify Stripe is initialized
console.log('Stripe loaded:', !!window.Stripe);

// 2. Check publishable key format
const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
console.log('Has Stripe key:', !!key);
console.log('Key starts with pk_:', key?.startsWith('pk_'));

// 3. Test mode vs Production mode
// Test keys start with: pk_test_
// Live keys start with: pk_live_

// 4. Check Stripe dashboard for failed payments
// https://dashboard.stripe.com/payments
```

#### 5. TypeScript Errors

**Problem**: "Type 'X' is not assignable to type 'Y'"

**Solutions**:
```typescript
// ❌ Type mismatch
const user: User = await supabase.auth.getUser(); // Error!

// ✅ Proper typing
const { data: { user } } = await supabase.auth.getUser();
// user is User | null

// ✅ Type assertion (use sparingly)
const user = (await supabase.auth.getUser()) as User;

// ✅ Type guard
if (user) {
  // user is User here
  console.log(user.email);
}
```

**Problem**: "Property does not exist on type"

```typescript
// ❌ Accessing property that might not exist
const username = user.username; // Error if username is optional

// ✅ Optional chaining
const username = user?.username;

// ✅ Nullish coalescing
const username = user?.username ?? 'Anonymous';
```

#### 6. Build Errors

**Problem**: Build succeeds locally but fails in production

```bash
# Check for case-sensitive imports
# ❌ import { button } from './Button';
# ✅ import { Button } from './Button';

# Check for missing environment variables
# Production env vars must be set in Vercel/Netlify

# Check Node version matches
# package.json engines:
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### 7. Images Not Loading

**Problem**: Images work locally but not in production

**Solutions**:
```typescript
// ❌ Absolute path (won't work in production)
<img src="/Users/me/project/public/logo.png" />

// ✅ Relative to public/
<img src="/logo.png" />

// ✅ Import for Vite processing
import logo from './assets/logo.png';
<img src={logo} />

// ✅ External URL
<img src="https://example.com/logo.png" />
```

#### 8. State Not Updating

**Problem**: Component doesn't re-render after state change

```typescript
// ❌ Mutating state directly
const [posts, setPosts] = useState<Post[]>([]);
posts.push(newPost); // WRONG - doesn't trigger re-render

// ✅ Create new array
setPosts([...posts, newPost]);

// ❌ Mutating object
const [user, setUser] = useState<User>(initialUser);
user.name = 'New Name'; // WRONG

// ✅ Create new object
setUser({ ...user, name: 'New Name' });
```

### Debugging Tools

#### Browser DevTools

```typescript
// Add breakpoints in code
function handleClick() {
  debugger; // Execution pauses here
  doSomething();
}

// Console logging with structure
console.table(posts); // Shows array as table
console.group('User Actions');
console.log('Liked post:', postId);
console.log('User:', user);
console.groupEnd();

// Network tab: Check API calls
// Sources tab: Set breakpoints
// React DevTools: Inspect component props/state
```

#### React DevTools

Install: [React DevTools](https://react.dev/learn/react-developer-tools)

Features:
- Inspect component hierarchy
- View props and state
- Highlight component re-renders
- Profile performance

#### Vite Debugging

```bash
# Verbose logging
DEBUG=vite:* npm run dev

# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

#### Supabase Debugging

```typescript
// Enable Supabase debug logging
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      debug: true // Logs auth events
    }
  }
);

// Test query in Supabase SQL Editor
-- Copy the query from your code
SELECT * FROM posts
WHERE user_id = 'xxx'
ORDER BY created_at DESC;
-- Run directly to verify results
```

### Performance Debugging

```typescript
// Measure component render time
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number
) {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
}

<Profiler id="Feed" onRender={onRenderCallback}>
  <Feed />
</Profiler>

// Measure function execution time
console.time('fetch-posts');
await fetchPosts();
console.timeEnd('fetch-posts'); // Logs elapsed time
```

### Getting Help

**When stuck**:

1. **Check documentation**
   - README.md
   - DESIGN_SYSTEM.md
   - .github/copilot-instructions.md

2. **Search codebase**
   ```bash
   # Find similar implementations
   grep -r "supabase.from" src/
   grep -r "useState" src/components/
   ```

3. **Check console**
   - Look for errors (red text)
   - Check warnings (yellow text)
   - Review network requests

4. **Verify environment**
   ```bash
   # Check env vars
   cat .env
   # Verify dependencies
   npm list
   ```

5. **Ask for clarification**
   - If unclear about Quebec culture/Joual
   - If requirements are ambiguous
   - Before making significant architectural changes

---

## 📚 Additional Resources

### Project Documentation

- `README.md` - Project overview, features, quick start
- `SETUP_GUIDE.md` - Detailed setup instructions
- `DESIGN_SYSTEM.md` - Complete design system guide
- `.github/copilot-instructions.md` - Comprehensive coding standards

### Key Files to Reference

- `src/lib/quebecFeatures.ts` - Joual dictionary, Quebec data
- `src/services/openaiService.ts` - AI integration examples
- `src/services/stripeService.ts` - Payment integration examples
- `src/types/database.ts` - Database type definitions
- `src/index.css` - Design system CSS classes

### External Documentation

- [React 18](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Vite](https://vitejs.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Supabase](https://supabase.com/docs)
- [Stripe](https://stripe.com/docs)
- [OpenAI](https://platform.openai.com/docs)

---

## 🎯 Quick Start for AI Assistants

### When You First Start

1. **Read this file** (CLAUDE.md) - understand project context
2. **Review `quebecFeatures.ts`** - learn Joual and Quebec data
3. **Scan `DESIGN_SYSTEM.md`** - understand design language
4. **Check recent commits** - see coding patterns
5. **Read relevant code** - before making changes

### When Making Changes

1. **Understand the feature** - what are you building/fixing?
2. **Find similar code** - how is it done elsewhere?
3. **Use Joual** - check dictionary for UI text
4. **Follow patterns** - match existing code style
5. **Test thoroughly** - type-check, build, manual testing
6. **Commit & push** - clear messages, designated branch

### When Stuck

1. **Check documentation** - README, DESIGN_SYSTEM, copilot-instructions
2. **Review similar features** - find patterns in codebase
3. **Verify environment** - are API keys set?
4. **Check console** - what errors appear?
5. **Ask user** - if unclear about Quebec culture or requirements

---

## 🔥 Final Notes

### Project Philosophy

Zyeuté is **Quebec-first** in everything:
- Language (Joual, not standard French)
- Culture (real Quebec references)
- Design (luxury meets heritage)
- Community (built for Quebecers)

### Development Principles

1. **Keep it simple** - avoid over-engineering
2. **Be authentic** - genuine Joual, real Quebec culture
3. **Focus on UX** - premium feel, smooth interactions
4. **Handle errors** - graceful fallbacks, clear messages
5. **Test thoroughly** - type-check, build, manual QA

### Success Criteria

✅ **Good Code**:
- Uses TypeScript properly (no `any`)
- Follows React best practices (functional components, hooks)
- Handles errors gracefully
- Uses authentic Joual
- Matches design system
- Tests pass (type-check, build)

---

**Bienvenue à Zyeuté! Let's build something tiguidou together!** 🔥⚜️

*Made with ❤️ in Quebec* 🇨🇦
*Propulsé par Nano Banana* 🍌
