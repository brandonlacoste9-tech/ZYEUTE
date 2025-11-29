# Zyeuté - AI Assistant Quick Guide

**Version**: 1.1.0 | **Quebec-First Social Platform** 🔥⚜️

## Core Identity

- **Language**: Joual (Quebec French) - NEVER standard French
- **Design**: Fur trader luxury (leather, gold, premium)
- **Tech**: React 18 + TypeScript + Vite + Supabase + Stripe + OpenAI

## Essential Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run type-check       # TypeScript check

# Git workflow
git push -u origin claude/create-assistant-guide-01HraobtCzJPHfGYbih8FtcE
```

## Environment Variables

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=sk-your-key
VITE_STRIPE_PUBLIC_KEY=pk_test_your-key
```

## Joual Dictionary (Most Used)

```typescript
// Actions
like: 'Donner du feu 🔥'
comment: 'Jasette 💬'
share: 'Partager ça'

// Reactions
cool: 'Tiguidou'
awesome: 'Malade!'
nice: 'Nice en criss'

// Status
loading: 'Chargement...'
error: 'Oops, une erreur est survenue'
success: 'C\'est fait!'

// Weather (Quebec!)
cold: 'Frette en esti'
hot: 'Chaud en tabarnak'
snow: 'Y neige!'
```

## Code Patterns

### Component Structure
```typescript
// ✅ DO
function Profile({ user }: ProfileProps) {
  const [data, setData] = useState<User>();

  useEffect(() => {
    // fetch data
  }, []);

  return <div>{/* JSX */}</div>;
}

// ❌ DON'T
const Profile: React.FC<any> = (props) => { /* ... */ }
```

### Error Handling
```typescript
try {
  const result = await operation();
} catch (error) {
  console.error('Error:', error);
  toast.error('Oops, une erreur est survenue');
}
```

### Custom Hooks
```typescript
// Data fetching
function usePosts({ limit = 20 }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts().then(setPosts).finally(() => setLoading(false));
  }, [limit]);

  return { posts, loading };
}

// Debounce
function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
```

### Supabase Queries
```typescript
// ✅ Select specific columns
const { data } = await supabase
  .from('posts')
  .select('id, caption, users(username, avatar)')
  .order('created_at', { ascending: false })
  .limit(20);

// ❌ Don't select *
const { data } = await supabase.from('posts').select('*');
```

### Performance
```typescript
// Lazy loading
const Profile = lazy(() => import('./pages/Profile'));

// Memoization
const PostCard = memo(({ post }) => <div>{post.caption}</div>);

const sorted = useMemo(() => posts.sort((a, b) => b.fire_count - a.fire_count), [posts]);

const handleLike = useCallback((id) => likePost(id), []);
```

## Common Pitfalls

1. **Using standard French** → Use Joual
2. **Using React.FC** → Use function components
3. **No error handling** → Always try-catch async
4. **Forgetting API key checks** → Check before calls
5. **Mutating state** → Use spread operators

## Quick Fixes

### Module not found
```bash
rm -rf node_modules/.vite && npm run dev
```

### Supabase connection
```typescript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

### TypeScript errors
```typescript
// Use optional chaining
const name = user?.username ?? 'Anonymous';
```

### State not updating
```typescript
// ❌ posts.push(newPost)
// ✅ setPosts([...posts, newPost])
```

## Design System

```css
/* Colors */
--gold-500: #F5C842
--leather-700: #4A3728

/* Classes */
.leather-card          /* Premium card */
.btn-gold             /* Primary button */
.btn-leather          /* Secondary button */
.input-premium        /* Form input */
```

## Testing

```typescript
// Component test
import { render, screen } from '@testing-library/react';

test('renders button', () => {
  render(<Button>Click</Button>);
  expect(screen.getByText('Click')).toBeInTheDocument();
});

// Service test (mock dependencies)
jest.mock('openai');
```

## Deployment

### Vercel (Recommended)
```bash
vercel login
vercel --prod
```

### Environment in Vercel
Project Settings > Environment Variables > Add all VITE_* vars

## Best Practices Checklist

- [ ] Use Joual for all UI text
- [ ] TypeScript with proper types (no `any`)
- [ ] Error handling with try-catch
- [ ] Check API keys before calls
- [ ] Optimize images before upload
- [ ] Lazy load routes
- [ ] Test locally before commit

## File Structure

```
src/
├── components/     # Reusable UI (PascalCase.tsx)
├── pages/         # Route pages (PascalCase.tsx)
├── services/      # Business logic (camelCase.ts)
├── hooks/         # Custom hooks (useName.ts)
├── contexts/      # React contexts
├── lib/           # Utils & configs
└── types/         # TypeScript types
```

## Key Files

- `src/lib/quebecFeatures.ts` - Joual dictionary & Quebec data
- `src/types/database.ts` - Database types
- `DESIGN_SYSTEM.md` - Complete design guide
- `README.md` - Project overview

## Resources

- React: https://react.dev
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs
- OpenAI: https://platform.openai.com/docs

---

**Remember**: Quebec-first in everything. Joual, not standard French. Keep it simple, authentic, and tiguidou! 🔥⚜️
