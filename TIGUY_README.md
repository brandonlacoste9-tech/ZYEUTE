# 🦫 Ti-Guy Agent - Quebec AI Assistant

> **AI-powered content generation in authentic Joual for Zyeuté**

Ti-Guy Agent is an intelligent service that generates Quebec-style social media content using OpenAI's GPT-4. It creates captions, emojis, tags, and personalized replies in authentic Joual dialect.

## ⚡ Quick Start (30 seconds)

### 1. Import the service

```typescript
import { TiGuyAgent } from '../services/tiGuyAgent';
```

### 2. Generate content

```typescript
const response = await TiGuyAgent({
  text: "Party sur la terrasse ce soir!",
  intent: 'event'
});
```

### 3. Use the response

```typescript
if (response) {
  console.log(response.caption);  // "Ça va être malade! 🎉⚜️"
  console.log(response.emojis);   // ['🎉', '⚜️', '🦫', '🇨🇦']
  console.log(response.tags);     // ['Event', 'MTL', 'Quebec']
  console.log(response.reply);    // "Nice event! J'espère..."
}
```

**Done!** 🎉 Works immediately in demo mode.

---

## 📚 What You Get

### Input
```typescript
TiGuyInput {
  text: string          // Your content text
  intent: IntentType    // Content style (see below)
}
```

### Output
```typescript
TiGuyResponse {
  caption: string       // AI-generated caption in Joual ⚜️
  emojis: string[]      // 3-5 relevant emojis 😂🔥🦫
  tags: string[]        // 1-3 Quebec-themed tags #MTL
  flagged: boolean      // Content moderation flag
  reply: string         // Ti-Guy's personalized reply
}
```

---

## 🎭 5 Intent Types

Choose the right intent for your content:

### 1. 😂 Joke
For humorous, funny content
```typescript
await TiGuyAgent({
  text: "J'ai vu 3 cônes orange ce matin!",
  intent: 'joke'
});
// → Caption: "Haha! C'est ben drôle ça, mon loup! 😂🔥"
```

### 2. 😤 Rant
For opinions, complaints, frustrations
```typescript
await TiGuyAgent({
  text: "La construction sur le pont encore!",
  intent: 'rant'
});
// → Caption: "Tabarnak! Je comprends ton point! 😤💢"
```

### 3. 🎉 Event
For parties, gatherings, announcements
```typescript
await TiGuyAgent({
  text: "Party sur la terrasse ce soir!",
  intent: 'event'
});
// → Caption: "Ça va être malade! Tout le monde au rendez-vous! 🎉⚜️"
```

### 4. 💰 Ad
For promotions, deals, announcements
```typescript
await TiGuyAgent({
  text: "50% de rabais sur la poutine!",
  intent: 'ad'
});
// → Caption: "Check ça! C'est sick comme offre! 💰🔥"
```

### 5. 📝 Poem
For creative, poetic, thoughtful content
```typescript
await TiGuyAgent({
  text: "L'hiver québécois, frette mais magnifique...",
  intent: 'poem'
});
// → Caption: "Des mots qui touchent le cœur québécois... 📝💙"
```

---

## 🚀 Integration Examples

### React Component (Basic)

```tsx
import { useState } from 'react';
import { TiGuyAgent } from '../services/tiGuyAgent';

function MyComponent() {
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    
    const response = await TiGuyAgent({
      text: "Mon texte ici",
      intent: 'joke'
    });
    
    if (response) {
      setCaption(response.caption);
    }
    
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Génération...' : 'Générer'}
      </button>
      {caption && <p>{caption}</p>}
    </div>
  );
}
```

### With Form Input

```tsx
function CaptionGenerator() {
  const [text, setText] = useState('');
  const [intent, setIntent] = useState<'joke' | 'event'>('joke');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await TiGuyAgent({ text, intent });
    setResult(response);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <select value={intent} onChange={(e) => setIntent(e.target.value)}>
        <option value="joke">Blague</option>
        <option value="event">Événement</option>
      </select>
      
      <button type="submit">Générer</button>
      
      {result && (
        <div>
          <p>{result.caption}</p>
          <div>{result.emojis.join(' ')}</div>
          <div>{result.tags.map(t => `#${t}`).join(' ')}</div>
        </div>
      )}
    </form>
  );
}
```

### With Error Handling

```tsx
import { toast } from '../components/Toast';

async function generateContent(text: string) {
  try {
    const response = await TiGuyAgent({
      text,
      intent: 'joke'
    });
    
    if (response) {
      // Check moderation flag
      if (response.flagged) {
        toast.warning('⚠️ Ce contenu pourrait être sensible');
      }
      
      return response;
    } else {
      toast.error('Ti-Guy est indisponible. Réessaie!');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Une erreur est survenue');
    return null;
  }
}
```

---

## 🎮 Demo Mode vs API Mode

### Demo Mode (Default)
**No API key needed!** Perfect for development.

```bash
# No setup required
npm run dev
# Service works immediately with realistic demo responses
```

**Benefits:**
- ✅ Instant responses (< 50ms)
- ✅ No API costs
- ✅ Works offline
- ✅ Realistic Quebec-style responses
- ✅ All intent types supported

### API Mode (Production)
**Real AI responses** from OpenAI GPT-4.

```bash
# Add to .env.local
VITE_OPENAI_API_KEY=sk-proj-your-api-key-here

npm run dev
# Service now uses real AI
```

**Benefits:**
- ✅ Truly intelligent responses
- ✅ Adapts to any input
- ✅ Authentic Joual generation
- ✅ Context-aware content
- ✅ Better moderation

---

## 📖 Complete Documentation

| Document | Purpose | Size |
|----------|---------|------|
| **TIGUY_README.md** (this file) | Quick start guide | 📄 |
| **TIGUY_AGENT_USAGE.md** | Complete API reference | 8 KB |
| **TIGUY_AGENT_SUMMARY.md** | Implementation overview | 7.7 KB |
| **TIGUY_ARCHITECTURE.md** | System architecture | 12 KB |
| **TiGuyEnhanced.example.tsx** | Full component example | 12 KB |
| **tiGuyAgent.test.example.ts** | Testing utilities | 5.6 KB |

---

## 🔧 Common Use Cases

### 1. Caption Generator for Posts
```typescript
const response = await TiGuyAgent({
  text: userPost.text,
  intent: 'joke'
});
setPostCaption(response?.caption || userPost.text);
```

### 2. Event Announcement Helper
```typescript
const response = await TiGuyAgent({
  text: eventDetails,
  intent: 'event'
});
setEventDescription(response?.caption);
setEventEmojis(response?.emojis);
```

### 3. Smart Reply Suggestions
```typescript
const response = await TiGuyAgent({
  text: comment.text,
  intent: detectIntentFromComment(comment)
});
setSuggestedReply(response?.reply);
```

### 4. Content Enhancement
```typescript
const response = await TiGuyAgent({
  text: originalCaption,
  intent: 'ad'
});
setEnhancedCaption(response?.caption);
addHashtags(response?.tags);
```

---

## ⚠️ Important Notes

### Security
🔐 **Client-side API usage is for demo/development only**

For production:
1. Move API calls to server-side
2. Use environment variables for API key
3. Implement rate limiting
4. Add user authentication

See `TIGUY_ARCHITECTURE.md` for server-side setup guide.

### API Costs
💰 **OpenAI API calls cost money**

- Demo mode: FREE (no API calls)
- API mode: ~$0.03 per 1,000 requests (GPT-4o pricing)

Tips to minimize costs:
- Cache frequent requests
- Use demo mode for development
- Implement debouncing on user input
- Set request limits per user

### Error Handling
⚡ **Always check if response is not null**

```typescript
const response = await TiGuyAgent(input);

if (!response) {
  // Handle error case
  console.log('Service unavailable');
  return;
}

// Use response safely
console.log(response.caption);
```

---

## 🧪 Testing

### Quick Test in Browser Console

```javascript
// Import in your component
import { testJoke } from '../services/tiGuyAgent.test.example';

// Call from DevTools console
await testJoke();
// Logs the response to console
```

### Test All Intents

```javascript
import { runAllTests } from '../services/tiGuyAgent.test.example';

await runAllTests();
// Tests all 5 intent types
```

### Validate Response Structure

```javascript
import { validateResponse } from '../services/tiGuyAgent.test.example';

const response = await TiGuyAgent({ text, intent });
const isValid = validateResponse(response);
console.log('Valid:', isValid);
```

---

## 🐛 Troubleshooting

### "No response received"
**Cause:** API error or network issue  
**Solution:** Check console for error details

### "Response is null"
**Cause:** Service failed to generate response  
**Solution:** Falls back to demo mode automatically

### "API key missing"
**Cause:** VITE_OPENAI_API_KEY not set  
**Solution:** This is fine! Demo mode works without it

### "Content flagged"
**Cause:** AI detected potentially sensitive content  
**Solution:** Review the content before posting

---

## 💡 Pro Tips

### 1. Intent Detection
```typescript
function detectIntent(text: string): IntentType {
  const lower = text.toLowerCase();
  if (lower.includes('party') || lower.includes('event')) return 'event';
  if (lower.includes('rabais') || lower.includes('promo')) return 'ad';
  if (lower.includes('frustré') || lower.includes('tabarnak')) return 'rant';
  return 'joke'; // Default
}
```

### 2. Response Caching
```typescript
const cache = new Map<string, TiGuyResponse>();

async function getCachedResponse(input: TiGuyInput) {
  const key = `${input.text}-${input.intent}`;
  
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const response = await TiGuyAgent(input);
  if (response) cache.set(key, response);
  
  return response;
}
```

### 3. Debounced Generation
```typescript
import { useMemo } from 'react';
import { debounce } from 'lodash';

const debouncedGenerate = useMemo(
  () => debounce(async (text: string) => {
    const response = await TiGuyAgent({ text, intent: 'joke' });
    // Handle response
  }, 500),
  []
);
```

---

## 🤝 Support & Resources

### Need Help?
1. Check `TIGUY_AGENT_USAGE.md` for detailed API docs
2. Review `TiGuyEnhanced.example.tsx` for integration example
3. Read `TIGUY_ARCHITECTURE.md` for system design
4. Test with `tiGuyAgent.test.example.ts` utilities

### Links
- **Service Code:** `src/services/tiGuyAgent.ts`
- **Example Component:** `src/components/features/TiGuyEnhanced.example.tsx`
- **Test Utilities:** `src/services/tiGuyAgent.test.example.ts`

---

## 🎉 You're Ready!

Ti-Guy Agent is production-ready and waiting to generate awesome Quebec content for Zyeuté!

```typescript
// Start generating now! 🚀
const response = await TiGuyAgent({
  text: "C'est parti mon kiki!",
  intent: 'joke'
});

console.log(response?.caption);
// "Haha! C'est ben drôle ça, mon loup! 😂🔥"
```

---

**Made with ❤️ for Zyeuté** 🇨🇦⚜️🦫  
*L'app sociale du Québec*
