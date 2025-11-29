# Ti-Guy Agent Usage Guide

## Overview

The Ti-Guy Agent is an AI-powered service that generates Quebec-style content using OpenAI's GPT-4. It creates captions, emojis, tags, and replies in authentic Joual (Quebec French dialect).

## Service Location

File: `src/services/tiGuyAgent.ts`

## API Reference

### Types

```typescript
export type TiGuyInput = {
  text: string;
  intent: 'joke' | 'rant' | 'event' | 'ad' | 'poem';
};

export type TiGuyResponse = {
  caption: string;      // AI-generated caption in Joual
  emojis: string[];     // 3-5 relevant emojis
  tags: string[];       // 1-3 Quebec-themed tags
  flagged: boolean;     // Content moderation flag
  reply: string;        // Ti-Guy's personalized reply
};
```

### Function

```typescript
export const TiGuyAgent = async (input: TiGuyInput): Promise<TiGuyResponse | null>
```

Returns `null` if an error occurs, or a demo response if no OpenAI API key is configured.

## Usage Examples

### Example 1: Generate Content for a Joke

```typescript
import { TiGuyAgent } from '../services/tiGuyAgent';

const response = await TiGuyAgent({
  text: "J'ai vu 3 cônes orange sur le chemin ce matin!",
  intent: 'joke'
});

if (response) {
  console.log(response.caption);   // "Haha! C'est ben drôle ça, mon loup! 😂🔥"
  console.log(response.emojis);    // ['😂', '🔥', '🦫']
  console.log(response.tags);      // ['Humour', 'Quebec', 'Construction']
  console.log(response.reply);     // "C'est tiguidou! Continue comme ça, mon ami! 🇨🇦"
  console.log(response.flagged);   // false
}
```

### Example 2: Event Announcement

```typescript
const response = await TiGuyAgent({
  text: "Party sur la terrasse du Plateau ce soir! DJ live + poutine gratuite!",
  intent: 'event'
});

if (response) {
  // Use the caption for social media post
  // Use the tags for hashtags
  // Display Ti-Guy's reply to the user
}
```

### Example 3: Advertisement

```typescript
const response = await TiGuyAgent({
  text: "Nouveau café québécois sur Mont-Royal! 50% de rabais cette semaine!",
  intent: 'ad'
});
```

### Example 4: Rant/Opinion

```typescript
const response = await TiGuyAgent({
  text: "La construction sur le pont Jacques-Cartier ENCORE! Ça fait 3 mois!",
  intent: 'rant'
});
```

### Example 5: Poem/Creative Writing

```typescript
const response = await TiGuyAgent({
  text: "L'hiver québécois, frette mais magnifique...",
  intent: 'poem'
});
```

## Integration in React Components

### Basic Integration

```tsx
import React, { useState } from 'react';
import { TiGuyAgent, type TiGuyInput, type TiGuyResponse } from '../services/tiGuyAgent';
import { toast } from '../components/Toast';

export function MyComponent() {
  const [response, setResponse] = useState<TiGuyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await TiGuyAgent({
        text: "Check out ce nouveau spot!",
        intent: 'event'
      });
      
      if (result) {
        setResponse(result);
        toast.success('Contenu généré! 🔥');
      } else {
        toast.error('Ti-Guy a gelé. Réessaie dans 2 minutes!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la génération.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Génération...' : 'Générer avec Ti-Guy'}
      </button>
      
      {response && (
        <div>
          <p>{response.caption}</p>
          <div>{response.emojis.join(' ')}</div>
          <div>{response.tags.map(tag => `#${tag}`).join(' ')}</div>
          <p className="text-sm text-gray-500">{response.reply}</p>
        </div>
      )}
    </div>
  );
}
```

### Integration with Form

```tsx
import React, { useState } from 'react';
import { TiGuyAgent, type TiGuyInput } from '../services/tiGuyAgent';

export function ContentCreator() {
  const [text, setText] = useState('');
  const [intent, setIntent] = useState<TiGuyInput['intent']>('joke');
  const [generatedCaption, setGeneratedCaption] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await TiGuyAgent({ text, intent });
    
    if (response) {
      setGeneratedCaption(response.caption);
      // Also use response.emojis, response.tags, etc.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écris ton texte..."
      />
      
      <select value={intent} onChange={(e) => setIntent(e.target.value as TiGuyInput['intent'])}>
        <option value="joke">Blague</option>
        <option value="rant">Rant</option>
        <option value="event">Événement</option>
        <option value="ad">Publicité</option>
        <option value="poem">Poème</option>
      </select>
      
      <button type="submit">Générer</button>
      
      {generatedCaption && <p>{generatedCaption}</p>}
    </form>
  );
}
```

## Demo Mode

When no OpenAI API key is configured (`VITE_OPENAI_API_KEY` not set), the service automatically runs in **demo mode** and returns predefined responses based on the intent:

- **joke**: Returns humorous Quebec-style content
- **rant**: Returns passionate opinion content
- **event**: Returns event announcement style content
- **ad**: Returns promotional content
- **poem**: Returns creative/poetic content

Demo mode is perfect for:
- Development without API costs
- Testing UI without API calls
- Demonstrating functionality to stakeholders

## Error Handling

The service includes comprehensive error handling:

1. **No API Key**: Returns demo response with console warning
2. **API Error**: Logs error to console and returns `null`
3. **Invalid Response**: Falls back to demo response
4. **Network Error**: Returns `null` (handle in your component)

Always check if the response is not `null` before using it:

```typescript
const response = await TiGuyAgent(input);

if (!response) {
  // Handle error case
  toast.error('Ti-Guy est temporairement indisponible.');
  return;
}

// Use response safely
console.log(response.caption);
```

## Content Moderation

The `flagged` field indicates if the content might be inappropriate or sensitive:

```typescript
const response = await TiGuyAgent(input);

if (response?.flagged) {
  // Handle flagged content
  console.warn('Content flagged for review');
  // Show warning to user or require moderation
}
```

## Best Practices

1. **Always handle null responses**: The service may return `null` on errors
2. **Show loading states**: AI generation takes a few seconds
3. **Provide user feedback**: Use toasts or messages during generation
4. **Cache responses**: Consider caching results to avoid redundant API calls
5. **Monitor API usage**: Track OpenAI API calls in production
6. **Respect rate limits**: Implement debouncing for user inputs
7. **Use appropriate intents**: Choose the right intent for better results

## Environment Setup

Add your OpenAI API key to `.env.local`:

```bash
VITE_OPENAI_API_KEY=sk-proj-your-api-key-here
```

Without this key, the service runs in demo mode automatically.

### ⚠️ Security Note

**Client-side API usage is for development/demo purposes only.**

The current implementation uses `dangerouslyAllowBrowser: true` which exposes the API key in client-side code. For production use, you should:

1. **Move API calls to server-side**: Create a backend endpoint that handles OpenAI requests
2. **Use a proxy service**: Set up a serverless function (Vercel, Netlify, etc.) to proxy requests
3. **Implement rate limiting**: Protect your API key from abuse
4. **Add authentication**: Ensure only authenticated users can access the service

Example server-side implementation:
```typescript
// pages/api/tiguy.ts (Next.js API route example)
import { OpenAI } from 'openai';

export default async function handler(req, res) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const { text, intent } = req.body;
  
  // Call OpenAI API server-side
  const response = await openai.chat.completions.create({...});
  
  res.json(response);
}
```

## Related Services

- **openaiService.ts**: General OpenAI utilities (caption generation, hashtags)
- **imageService.ts**: AI image generation (DALL-E)
- **videoService.ts**: Video caption generation
- **moderationService.ts**: Content moderation

## Support

For issues or questions about Ti-Guy Agent:
1. Check the console for error messages
2. Verify your OpenAI API key is valid
3. Test in demo mode first (no API key)
4. Review the JSDoc comments in `tiGuyAgent.ts`

---

**Made with ❤️ for Zyeuté** 🇨🇦⚜️🦫
