# Ti-Guy Agent Architecture 🏗️

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Zyeuté Application                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │  User Interface (React Components)             │         │
│  │                                                 │         │
│  │  ┌──────────────┐     ┌──────────────────┐    │         │
│  │  │   TiGuy      │     │ TiGuyEnhanced    │    │         │
│  │  │   (Static)   │     │ (AI-Powered)     │    │         │
│  │  └──────┬───────┘     └─────────┬────────┘    │         │
│  │         │                       │              │         │
│  │         └───────────┬───────────┘              │         │
│  │                     │                          │         │
│  └─────────────────────┼──────────────────────────┘         │
│                        │                                     │
│  ┌─────────────────────▼──────────────────────────┐         │
│  │  Service Layer                                 │         │
│  │                                                 │         │
│  │  ┌──────────────────────────────────────┐      │         │
│  │  │  tiGuyAgent.ts                       │      │         │
│  │  │                                      │      │         │
│  │  │  • TiGuyAgent(input) → response     │      │         │
│  │  │  • Intent detection                 │      │         │
│  │  │  • Demo mode fallback               │      │         │
│  │  │  • Response validation              │      │         │
│  │  └──────────┬───────────────────────────┘      │         │
│  │             │                                   │         │
│  └─────────────┼───────────────────────────────────┘         │
│                │                                             │
│  ┌─────────────▼───────────────────────────────────┐        │
│  │  External APIs                                  │        │
│  │                                                  │        │
│  │  ┌────────────────────────────────┐             │        │
│  │  │  OpenAI API (GPT-4 Omni)      │             │        │
│  │  │                                │             │        │
│  │  │  • Chat completions            │             │        │
│  │  │  • JSON response format        │             │        │
│  │  │  • Temperature: 0.8            │             │        │
│  │  └────────────────────────────────┘             │        │
│  │                                                  │        │
│  └──────────────────────────────────────────────────┘        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Input Flow

```
User Types Message
       ↓
[TiGuy Component]
       ↓
Detect Intent (joke/rant/event/ad/poem)
       ↓
[TiGuyAgent Service]
       ↓
Check API Key Available?
       ↓
  ┌────┴────┐
  │         │
 Yes       No
  │         │
  ↓         ↓
[OpenAI]  [Demo]
  │         │
  └────┬────┘
       ↓
Parse Response
       ↓
Validate Structure
       ↓
Return to Component
       ↓
Display to User
```

### 2. Request/Response Structure

```typescript
// Request
TiGuyInput {
  text: string          // User's message
  intent: IntentType    // joke | rant | event | ad | poem
}
       ↓
[TiGuyAgent Processing]
       ↓
// Response
TiGuyResponse {
  caption: string       // AI-generated caption in Joual
  emojis: string[]      // 3-5 relevant emojis
  tags: string[]        // 1-3 Quebec-themed tags
  flagged: boolean      // Content moderation flag
  reply: string         // Ti-Guy's personalized reply
}
```

## Component Relationships

```
┌──────────────────────────────────────────────────────┐
│                  React App                           │
│                                                      │
│  ┌────────────────────────────────────────────┐     │
│  │  Existing Components                       │     │
│  │                                            │     │
│  │  • TiGuy.tsx (Chat Widget)                │     │
│  │  • Upload.tsx                              │     │
│  │  • PostCreate.tsx                          │     │
│  │  • Artiste.tsx                             │     │
│  └──────────────────┬─────────────────────────┘     │
│                     │                               │
│                     │ Can integrate with            │
│                     ↓                               │
│  ┌────────────────────────────────────────────┐     │
│  │  New Ti-Guy Agent                          │     │
│  │                                            │     │
│  │  Services:                                 │     │
│  │  • tiGuyAgent.ts ← Core service           │     │
│  │                                            │     │
│  │  Components:                               │     │
│  │  • TiGuyEnhanced.example.tsx              │     │
│  │                                            │     │
│  │  Testing:                                  │     │
│  │  • tiGuyAgent.test.example.ts             │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Integration Options

### Option 1: Enhance Existing TiGuy Component

```
src/components/features/TiGuy.tsx
       ↓
Import TiGuyAgent
       ↓
Replace handleSendMessage logic
       ↓
Call TiGuyAgent instead of static responses
       ↓
Display AI-generated responses
```

**Changes required:**
```typescript
// Add import
import { TiGuyAgent } from '../../services/tiGuyAgent';

// Update handleSendMessage
const handleSendMessage = async (text: string) => {
  // ... add user message ...
  
  const response = await TiGuyAgent({
    text,
    intent: detectIntent(text)
  });
  
  if (response) {
    addTiGuyMessage(response.reply);
  }
};
```

### Option 2: Use TiGuyEnhanced Component

```
Replace src/components/features/TiGuy.tsx
       ↓
With TiGuyEnhanced.example.tsx
       ↓
Rename to TiGuy.tsx
       ↓
Update imports in App.tsx if needed
```

### Option 3: Create New Feature

```
Create new page/component
       ↓
Import TiGuyAgent service
       ↓
Build custom UI
       ↓
Use for specific feature (caption generator, etc.)
```

## Service Architecture

### TiGuyAgent Service Internals

```typescript
TiGuyAgent(input)
       ↓
┌──────┴──────┐
│ Check Mode  │
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
 API    Demo
 Mode   Mode
   │       │
   ↓       ↓
┌──────┐ ┌──────┐
│OpenAI│ │Static│
│ Call │ │ Data │
└───┬──┘ └───┬──┘
    │        │
    └────┬───┘
         ↓
  Parse & Validate
         ↓
  Return Response
```

### Error Handling Flow

```
Try to call OpenAI
       ↓
  Success? ──No──> Log error
       │              ↓
      Yes        Return null
       ↓              ↑
Parse JSON           │
       ↓              │
   Valid? ──No───────┘
       │
      Yes
       ↓
Return Response
```

## File Dependencies

```
tiGuyAgent.ts
├── Dependencies:
│   ├── openai (npm package)
│   └── import.meta.env.VITE_OPENAI_API_KEY
│
├── Exports:
│   ├── TiGuyInput (type)
│   ├── TiGuyResponse (type)
│   └── TiGuyAgent (function)
│
└── Used by:
    ├── TiGuyEnhanced.example.tsx
    ├── tiGuyAgent.test.example.ts
    └── Any component that needs AI content

TiGuyEnhanced.example.tsx
├── Dependencies:
│   ├── tiGuyAgent.ts
│   ├── React hooks
│   ├── Button component
│   ├── Toast component
│   └── utils (cn function)
│
└── Provides:
    └── Complete AI-powered chat interface

tiGuyAgent.test.example.ts
├── Dependencies:
│   └── tiGuyAgent.ts
│
└── Provides:
    ├── Test functions
    └── Validation utilities
```

## Environment Configuration

```
Development Environment
├── .env.local (optional)
│   └── VITE_OPENAI_API_KEY=sk-...
│
├── No API Key?
│   └── Demo mode activated automatically
│
└── With API Key?
    └── Real AI responses

Production Environment
├── Server-side proxy recommended
│   ├── Protects API key
│   ├── Adds rate limiting
│   └── Enables monitoring
│
└── Example setup:
    ├── Backend API endpoint
    ├── Supabase Edge Function
    └── Vercel/Netlify Serverless Function
```

## Security Architecture

### Current Implementation (Development)

```
Client Browser
       ↓
React Component
       ↓
TiGuyAgent Service
       ↓
OpenAI API
(API key exposed in browser)
```

⚠️ **Security Risk**: API key visible in client code

### Recommended Production Implementation

```
Client Browser
       ↓
React Component
       ↓
Backend API Endpoint
       ↓
TiGuyAgent Service (Server-side)
       ↓
OpenAI API
(API key protected on server)
```

✅ **Secure**: API key never exposed to client

### Server-Side Implementation Example

```
┌────────────────────────────────────────────┐
│  Client (Browser)                          │
│                                            │
│  POST /api/tiguy                           │
│  Body: { text, intent }                    │
└──────────────────┬─────────────────────────┘
                   ↓
┌────────────────────────────────────────────┐
│  Server (Vercel/Netlify/Supabase)         │
│                                            │
│  1. Authenticate user                      │
│  2. Rate limit check                       │
│  3. Call TiGuyAgent                        │
│  4. Return response                        │
└──────────────────┬─────────────────────────┘
                   ↓
┌────────────────────────────────────────────┐
│  OpenAI API                                │
│  (Protected by server-side API key)        │
└────────────────────────────────────────────┘
```

## Performance Considerations

### Response Times

```
Demo Mode:
  - Instant response (< 50ms)
  - No network calls
  - No API costs

API Mode:
  - ~2-5 seconds (network + AI processing)
  - Network latency
  - OpenAI processing time
  - API costs per request
```

### Optimization Strategies

1. **Cache Responses**
   ```typescript
   // Cache similar requests
   const cache = new Map<string, TiGuyResponse>();
   
   // Check cache before API call
   const cacheKey = `${text}-${intent}`;
   if (cache.has(cacheKey)) {
     return cache.get(cacheKey);
   }
   ```

2. **Debounce User Input**
   ```typescript
   // Wait for user to finish typing
   const debouncedGenerate = useMemo(
     () => debounce(handleGenerate, 500),
     []
   );
   ```

3. **Show Loading States**
   ```typescript
   // Keep user informed
   setIsTyping(true);
   const response = await TiGuyAgent(input);
   setIsTyping(false);
   ```

## Monitoring & Debugging

### Console Logging

```
Service logs:
✓ "⚠️ No OpenAI API Key found. Using demo response."
✓ "Ti-Guy Error: [error details]"
✓ "Invalid Ti-Guy response structure: [data]"

Component logs:
✓ "🧪 Testing Ti-Guy Agent - [Intent]"
✓ "✅ [Intent] Response: [data]"
✓ "❌ No response received"
```

### Error States

```
null Response:
  ↓
Check Console:
  ├── API key missing? → Demo mode active
  ├── Network error? → Check connection
  ├── OpenAI error? → Check API quota
  └── Invalid response? → Response validation failed
```

## Testing Architecture

```
Manual Testing:
├── Demo Mode (no API key)
│   └── Test all intents work
│
└── API Mode (with API key)
    └── Test real AI responses

Automated Testing:
├── tiGuyAgent.test.example.ts
│   ├── testJoke()
│   ├── testEvent()
│   ├── testRant()
│   ├── testAd()
│   ├── testPoem()
│   └── validateResponse()
│
└── Integration Testing:
    └── Test within React components
```

## Deployment Checklist

- [ ] Test in demo mode
- [ ] Test with API key locally
- [ ] Implement server-side proxy
- [ ] Add rate limiting
- [ ] Add error monitoring
- [ ] Set up API key in production env
- [ ] Test all intent types
- [ ] Monitor API costs
- [ ] Update documentation
- [ ] Train support team

---

**Architecture designed for Zyeuté** 🇨🇦⚜️🦫  
*Scalable, secure, and Quebec-proud*
