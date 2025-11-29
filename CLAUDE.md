# 🔥⚜️ Zyeuté - AI Assistant Guide ⚜️🔥

**Version**: 1.1.0

**Last Updated**: 2025-11-28

**Target**: AI assistants (Claude, GitHub Copilot, etc.)

> **Fait au Québec, pour le Québec** 🇨🇦

This document provides comprehensive guidance for AI assistants working on the Zyeuté codebase. Zyeuté is Quebec's first social media platform built specifically for Quebecers, celebrating Quebec culture, language (Joual), and community.

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

Create a `.env.local` file in the project root:

```bash
# Supabase (Required for all features)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI (Required for Ti-Guy AI features)
VITE_OPENAI_API_KEY=sk-your-openai-api-key

# Stripe (Required for payments and subscriptions)
VITE_STRIPE_PUBLIC_KEY=pk_test_your-stripe-publishable-key

# Optional: Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Setting Up Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your credentials**:
   - Go to Project Settings → API
   - Copy `Project URL` → `VITE_SUPABASE_URL`
   - Copy `anon public` key → `VITE_SUPABASE_ANON_KEY`
3. **Run migrations**:
   ```bash
   # Migrations are in supabase/migrations/
   # Apply them via Supabase dashboard or CLI
   ```

### Setting Up OpenAI

1. **Get API key** from [platform.openai.com](https://platform.openai.com/api-keys)
2. **Add to `.env.local`**: `VITE_OPENAI_API_KEY=sk-...`
3. **Verify it works**:
   ```typescript
   const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
   if (!apiKey) {
     console.warn('OpenAI API key missing');
   }
   ```

### Setting Up Stripe

1. **Create account** at [stripe.com](https://stripe.com)
2. **Get publishable key** from Dashboard → Developers → API keys
3. **Add to `.env.local`**: `VITE_STRIPE_PUBLIC_KEY=pk_test_...`
4. **Note**: Use test keys for development, production keys for production

### Environment Verification

Create a simple check in your app:

```typescript
// src/lib/envCheck.ts
export function checkEnvironment() {
  const required = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  const optional = {
    openaiKey: import.meta.env.VITE_OPENAI_API_KEY,
    stripeKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error('Missing required env vars:', missing);
    return false;
  }

  console.log('✅ Required env vars present');
  console.log('Optional:', {
    openai: !!optional.openaiKey,
    stripe: !!optional.stripeKey,
  });

  return true;
}
```

### Security Best Practices

1. **Never commit `.env.local`** - it's in `.gitignore`
2. **Use different keys** for development and production
3. **Rotate keys** if exposed
4. **Use RLS policies** in Supabase for data protection
5. **Validate env vars** at app startup

---

## 📁 Project Structure

```
zyeute-clean/
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

**Comprehensive Joual vocabulary for UI text and interactions:**

```typescript
// ==================== SOCIAL ACTIONS & UI ELEMENTS ====================
like: 'Donner du feu 🔥'
comment: 'Jasette 💬'
share: 'Partager ça'
follow: 'Suivre'
unfollow: 'Unfollow'
post: 'Poster'
upload: 'Uploader'
save: 'Sauvegarder'
delete: 'Effacer'
edit: 'Modifier'
cancel: 'Annuler'
confirm: 'Confirmer'
search: 'Chercher'
filter: 'Filtrer'
sort: 'Trier'
loadMore: 'Voir plus'
refresh: 'Rafraîchir'

// Feed & Navigation
feed: 'Mon feed'
explore: 'Découvrir'
profile: 'Mon profil'
notifications: 'Mes notifs'
messages: 'Mes messages'
settings: 'Paramètres'
logout: 'Déconnecter'
login: 'Se connecter'
signup: "S'inscrire"

// ==================== REACTIONS & EMOTIONS ====================
cool: 'Tiguidou'
nice: 'Nice en criss'
awesome: 'Malade!'
amazing: 'Malade en esti!'
lol: 'Haha tabarnak'
funny: 'Drôle en criss'
beautiful: 'Beau en tabarnak'
impressive: 'Impressionnant!'
love: "J'adore ça!"
hate: "J'aime pas ça"
confused: 'Je comprends rien'
excited: 'Je suis hype!'
proud: 'Fier en esti'

// ==================== WEATHER & SEASONS (VERY QUEBEC!) ====================
cold: 'Frette en esti'
hot: 'Chaud en tabarnak'
snow: 'Y neige!'
rain: 'Y mouille!'
sunny: 'Y fait beau!'
windy: 'Y vente!'
construction: 'Saison de construction 🚧'
winter: "L'hiver québécois"
summer: "L'été"
spring: "Le printemps"
fall: "L'automne"

// ==================== QUEBEC-SPECIFIC TERMS ====================
// Food & Drinks
poutine: 'Une pout'
poutine: 'Une poutine'
tourtiere: 'Une tourtière'
caribou: "Un p'tit caribou"
beer: 'Une frette'
mapleSyrup: 'Du sirop'
bagel: 'Un bagel'
smokedMeat: 'Du smoked meat'

// Places & Locations
montreal: 'MTL'
quebec: 'QC'
plateau: 'Le Plateau'
mileEnd: 'Mile End'
vieuxMontreal: 'Vieux-MTL'
hochelaga: 'Hochelaga'
verdun: 'Verdun'

// Events & Culture
saintJean: 'La Saint-Jean'
carnaval: 'Le Carnaval'
osheaga: 'Osheaga'
justePourRire: 'JPR'
francoFolies: 'Les Francos'

// ==================== COMMON PHRASES ====================
greeting: 'Salut!'
hello: 'Allo!'
hey: 'Heille!'
whatsUp: 'Ça va?'
howAreYou: 'Comment ça va?'
good: 'Ça va bien'
bad: 'Ça va mal'
yes: 'Ouin'
no: 'Non'
maybe: 'Peut-être'
sure: 'Sûr!'
ofCourse: 'Ben oui!'
really: 'Vraiment?'
seriously: 'Sérieux?'
noWay: 'Pas moyen!'
forReal: 'Pour vrai?'
awesome: 'Tiguidou!'
thanks: 'Merci!'
welcome: 'Bienvenue!'
sorry: 'Désolé'
excuseMe: 'Excuse-moi'
please: 'S\'il te plaît'

// ==================== ERROR MESSAGES & FEEDBACK ====================
error: 'Erreur'
somethingWentWrong: 'Quelque chose a mal tourné'
tryAgain: 'Réessaie!'
loading: 'En chargement...'
saving: 'En sauvegarde...'
uploading: 'En upload...'
success: 'Succès!'
saved: 'Sauvegardé!'
deleted: 'Effacé!'
updated: 'Mis à jour!'
created: 'Créé!'
failed: 'Échoué'
networkError: 'Erreur de réseau'
notFound: 'Pas trouvé'
unauthorized: 'Pas autorisé'
forbidden: 'Interdit'
serverError: 'Erreur du serveur'
validationError: 'Erreur de validation'
required: 'Requis'
invalid: 'Invalide'
tooShort: 'Trop court'
tooLong: 'Trop long'
invalidEmail: 'Email invalide'
passwordTooWeak: 'Mot de passe trop faible'
passwordsDontMatch: 'Les mots de passe ne correspondent pas'

// ==================== TI-GUY SPECIFIC ====================
tiGuyGreeting: 'Salut! C\'est Ti-Guy!'
tiGuyReady: 'Je suis prêt à t\'aider!'
tiGuyThinking: 'Laisse-moi réfléchir...'
tiGuyGenerating: 'Je génère ça pour toi...'
tiGuyDone: 'Voilà! C\'est fait!'
tiGuyError: 'Oups! Y\'a eu un problème...'
tiGuyHelp: 'Comment je peux t\'aider?'
tiGuyCaption: 'Je peux créer une caption pour toi!'
tiGuyHashtags: 'Je peux suggérer des hashtags!'
tiGuyImage: 'Je peux générer une image!'

// ==================== PREMIUM/VIP TIERS ====================
bronze: 'Bronze'
silver: 'Argent'
gold: 'Or'
premium: 'Premium'
vip: 'VIP'
subscribe: "S'abonner"
subscription: 'Abonnement'
unsubscribe: "Se désabonner"
trial: 'Essai gratuit'
features: 'Fonctionnalités'
exclusive: 'Exclusif'
adFree: 'Sans pub'
earlyAccess: 'Accès anticipé'
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

### Custom Hooks Patterns

Custom hooks encapsulate reusable logic. Follow these patterns:

#### Data Fetching Hook

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../types';

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

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setPosts(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [limit, userId]);

  return { posts, loading, error };
}
```

#### Authentication Hook

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
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
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

#### Debounce Hook

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
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

// Usage: Search input
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      // Perform search
      console.log('Searching for:', debouncedSearch);
    }
  }, [debouncedSearch]);
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

// Usage
function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}
```

**Hook Best Practices**:
- Start hook names with `use`
- Return consistent data structures
- Handle loading and error states
- Clean up subscriptions/effects
- Document hook dependencies

### State Management Patterns

Zyeuté uses React Context API for global state. Follow these patterns:

#### Creating a Context

```typescript
// src/contexts/NotificationContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { ...notification, id }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
```

#### Using Context

```typescript
// In your component
import { useNotifications } from '../contexts/NotificationContext';

function MyComponent() {
  const { addNotification } = useNotifications();

  const handleSuccess = () => {
    addNotification({
      message: 'Post créé avec succès!',
      type: 'success',
    });
  };

  return <button onClick={handleSuccess}>Create Post</button>;
}
```

#### Performance Optimization for Context

Split contexts to avoid unnecessary re-renders:

```typescript
// ❌ Bad: Single large context
const AppContext = createContext({
  user: null,
  theme: 'dark',
  notifications: [],
  // ... many other values
});

// ✅ Good: Split into focused contexts
const UserContext = createContext({ user: null });
const ThemeContext = createContext({ theme: 'dark' });
const NotificationContext = createContext({ notifications: [] });
```

Use `useMemo` for context values:

```typescript
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('dark');

  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

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
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Service Testing

Test services with mocked dependencies:

```typescript
import { generateImage } from '../services/openaiService';
import { openai } from 'openai';

jest.mock('openai');

describe('openaiService', () => {
  it('should generate image with correct prompt', async () => {
    const mockImageUrl = 'https://example.com/image.png';
    (openai.images.generate as jest.Mock).mockResolvedValue({
      data: [{ url: mockImageUrl }],
    });

    const result = await generateImage('Une poutine', 'realistic');
    expect(result).toBe(mockImageUrl);
  });

  it('should return null on error', async () => {
    (openai.images.generate as jest.Mock).mockRejectedValue(
      new Error('API Error')
    );

    const result = await generateImage('test', 'realistic');
    expect(result).toBeNull();
  });
});
```

#### Integration Testing

Test complete user flows:

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { Feed } from '../pages/Feed';
import { supabase } from '../lib/supabase';

jest.mock('../lib/supabase');

describe('Feed Integration', () => {
  it('should load and display posts', async () => {
    const mockPosts = [
      { id: 1, caption: 'Test post', user: { username: 'testuser' } },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
    });

    render(<Feed />);

    await waitFor(() => {
      expect(screen.getByText('Test post')).toBeInTheDocument();
    });
  });
});
```

#### Running Tests

```bash
# Install testing dependencies (if not already installed)
npm install -D @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

**Testing Best Practices**:
- Test user behavior, not implementation details
- Use `screen.getByRole` for accessible queries
- Mock external dependencies (Supabase, OpenAI, Stripe)
- Test error states and edge cases
- Keep tests simple and focused

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

## ⚡ Performance Optimization

### Code Splitting & Lazy Loading

Split code by route for faster initial load:

```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load route components
const Feed = lazy(() => import('./pages/Feed'));
const Profile = lazy(() => import('./pages/Profile'));
const TiGuyArtiste = lazy(() => import('./pages/Artiste'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/artiste" element={<TiGuyArtiste />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Image Optimization

```typescript
// Optimize images before upload
function optimizeImage(file: File, maxWidth = 1920, quality = 0.8): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
```

### Memoization

Use `memo`, `useMemo`, and `useCallback` strategically:

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive components
const PostCard = memo(function PostCard({ post, onLike }: PostCardProps) {
  return (
    <div>
      <p>{post.caption}</p>
      <button onClick={() => onLike(post.id)}>Like</button>
    </div>
  );
});

// Memoize expensive calculations
function Feed({ posts }: { posts: Post[] }) {
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => 
      b.created_at.localeCompare(a.created_at)
    );
  }, [posts]);

  // Memoize callbacks passed to children
  const handleLike = useCallback((postId: string) => {
    // Like logic
  }, []);

  return (
    <div>
      {sortedPosts.map((post) => (
        <PostCard key={post.id} post={post} onLike={handleLike} />
      ))}
    </div>
  );
}
```

### Database Query Optimization

```typescript
// ❌ Bad: Fetching all columns
const { data } = await supabase.from('posts').select('*');

// ✅ Good: Select only needed columns
const { data } = await supabase
  .from('posts')
  .select('id, caption, media_url, created_at, users(username, avatar)');

// Use pagination
const { data } = await supabase
  .from('posts')
  .select('*')
  .range(0, 19) // First 20 posts
  .order('created_at', { ascending: false });
```

### Infinite Scroll Pattern

```typescript
import { useState, useEffect, useCallback } from 'react';

function useInfiniteScroll<T>(
  fetchFn: (page: number) => Promise<T[]>,
  pageSize = 20
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await fetchFn(page);
      if (newItems.length < pageSize) {
        setHasMore(false);
      }
      setItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchFn, pageSize]);

  return { items, loadMore, loading, hasMore };
}
```

### Bundle Size Optimization

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'openai': ['openai'],
        },
      },
    },
  },
});
```

### Caching Strategies

```typescript
// Cache API responses
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

### Performance Monitoring

```typescript
// Monitor component render times
import { useEffect, useRef } from 'react';

function useRenderTime(componentName: string) {
  const renderStart = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    if (renderTime > 16) { // > 1 frame at 60fps
      console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
    }
  });
}
```

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
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### 4. Configure Environment Variables

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENAI_API_KEY`
   - `VITE_STRIPE_PUBLIC_KEY`

#### 5. Automatic Deployments

Vercel automatically deploys on:
- Push to `main` branch → Production
- Push to other branches → Preview
- Pull requests → Preview

### Deploying to Netlify

#### 1. Install Netlify CLI

```bash
npm i -g netlify-cli
```

#### 2. Login

```bash
netlify login
```

#### 3. Deploy

```bash
# Build first
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### 4. Configure Environment Variables

In Netlify Dashboard:
1. Site Settings → Environment Variables
2. Add all required variables

### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Build succeeds locally (`npm run build`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] No console errors in production build
- [ ] API keys are production keys (not test keys)
- [ ] Supabase RLS policies are configured
- [ ] Stripe webhooks configured (if using)
- [ ] Custom domain configured (if applicable)
- [ ] Analytics/monitoring set up

### Post-Deployment

1. **Verify deployment**:
   - Check all pages load
   - Test authentication
   - Test key features (posts, payments, etc.)

2. **Monitor**:
   - Check Vercel/Netlify logs
   - Monitor error tracking (Sentry, etc.)
   - Check API usage (OpenAI, Stripe)

3. **Set up custom domain** (optional):
   ```bash
   # Vercel
   vercel domains add zyeute.com

   # Netlify
   netlify domains:add zyeute.com
   ```

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

# Check file path and extension (.tsx vs .ts)
```

#### 2. TypeScript errors in node_modules

**Problem**: Type errors from dependencies

**Solution**: Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

#### 3. Environment variables not working

**Problem**: `import.meta.env.VITE_*` returns `undefined`

**Solutions**:
- Ensure variables start with `VITE_`
- Restart dev server after adding variables
- Check `.env.local` is in project root
- Verify no typos in variable names

#### 4. Supabase connection errors

**Problem**: "Failed to fetch" or connection timeouts

**Solutions**:
```typescript
// Check Supabase URL and key
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20));

// Verify RLS policies allow access
// Check Supabase dashboard → Authentication → Policies
```

#### 5. CORS errors

**Problem**: CORS errors when calling APIs

**Solution**: Configure CORS in Supabase:
- Go to Supabase Dashboard → Settings → API
- Add your domain to allowed origins

#### 6. Build fails in production

**Problem**: Build works locally but fails on Vercel/Netlify

**Solutions**:
- Check Node.js version matches (use `.nvmrc`)
- Verify all environment variables are set
- Check build logs for specific errors
- Test production build locally: `npm run build`

#### 7. Images not loading

**Problem**: Images return 404 or don't display

**Solutions**:
```typescript
// Check image URLs are correct
console.log('Image URL:', imageUrl);

// Verify Supabase storage bucket permissions
// Check if image exists in storage bucket
// Ensure public URL is used for public images
```

#### 8. State not updating

**Problem**: Component doesn't re-render when state changes

**Solutions**:
- Check if state setter is being called
- Verify dependencies in `useEffect`/`useMemo`/`useCallback`
- Use React DevTools to inspect state
- Check for stale closures

### Debugging Tools

#### Browser DevTools

```typescript
// Console logging
console.log('Debug:', variable);
console.table(arrayOfObjects);
console.group('Group Name');
console.log('Item 1');
console.log('Item 2');
console.groupEnd();

// Breakpoints
debugger; // Pauses execution
```

#### React DevTools

1. Install [React DevTools](https://react.dev/learn/react-developer-tools)
2. Inspect component props and state
3. Profile component renders
4. Check component tree

#### Vite DevTools

```bash
# Enable detailed logging
npm run dev -- --debug

# Check build analysis
npm run build -- --mode analyze
```

### Performance Debugging

```typescript
// Measure function execution time
const start = performance.now();
// ... your code ...
const end = performance.now();
console.log(`Function took ${end - start}ms`);

// Monitor re-renders
useEffect(() => {
  console.log('Component rendered');
});
```

### Getting Help

1. **Check documentation**: README, DESIGN_SYSTEM, this file
2. **Search codebase**: Look for similar implementations
3. **Check console**: Browser console and terminal logs
4. **Verify environment**: Are API keys set? Is dev server running?
5. **Ask for help**: Provide error messages, steps to reproduce, and what you've tried

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

