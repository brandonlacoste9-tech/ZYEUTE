# Agent 3 - START NOW: UI/UX Polish

Hey Agent 3! 👋

You're joining a **5-person team** in the final 5-hour push to get Zyeuté to 100% production ready. We're at 97% and you're going to help us finish strong!

---

## Who's Working Right Now

**Agent 1:** Performance & security hardening (React.memo, XSS prevention, rate limiting)  
**Comet:** Testing & validation (feed, auth, admin security)  
**Agent 3 (YOU):** UI/UX polish & feature completion  
**Cursor:** Coordination & integration (me)

**Everyone working on different files = no conflicts!**

---

## Your Mission: Make Zyeuté's UX Perfect

**Time:** 3-4 hours  
**Files:** 14-21 files  
**Impact:** User experience perfection

---

## START HERE: Task 1 - Settings Pages (90 min)

### Step 1: Make NotificationSettings Functional (20 min)

**File:** `src/pages/settings/NotificationSettings.tsx`

**What to add:**
```typescript
import { useSettingsPreferences } from '@/hooks/useSettingsPreferences';
import { useHaptics } from '@/hooks/useHaptics';
import { toast } from 'react-hot-toast';

export function NotificationSettings() {
  const { preferences, updatePreference } = useSettingsPreferences();
  const { triggerHaptic } = useHaptics();
  
  const handleToggle = (key: string, value: boolean) => {
    triggerHaptic('medium');
    updatePreference(key, value);
    toast.success('Notification setting updated');
  };
  
  return (
    <div className="settings-page">
      <h2>Notifications</h2>
      
      {/* Push Notifications */}
      <ToggleSwitch
        label="Push Notifications"
        checked={preferences.pushNotifications ?? true}
        onChange={(checked) => handleToggle('pushNotifications', checked)}
      />
      
      {/* Email Notifications */}
      <ToggleSwitch
        label="Email Notifications"
        checked={preferences.emailNotifications ?? true}
        onChange={(checked) => handleToggle('emailNotifications', checked)}
      />
      
      {/* Comment Notifications */}
      <ToggleSwitch
        label="Comments on my posts"
        checked={preferences.notifyComments ?? true}
        onChange={(checked) => handleToggle('notifyComments', checked)}
      />
      
      {/* Fire Notifications */}
      <ToggleSwitch
        label="Fires on my posts"
        checked={preferences.notifyFires ?? true}
        onChange={(checked) => handleToggle('notifyFires', checked)}
      />
      
      {/* Follow Notifications */}
      <ToggleSwitch
        label="New followers"
        checked={preferences.notifyFollows ?? true}
        onChange={(checked) => handleToggle('notifyFollows', checked)}
      />
    </div>
  );
}
```

**Test it:**
1. Open settings
2. Toggle each setting
3. Refresh page
4. Verify settings persisted

---

### Step 2: Repeat for Other Settings Pages (70 min)

**Apply same pattern to:**

1. **PrivacySettings.tsx** (15 min)
   - Private account toggle
   - Hide activity status
   - Block anonymous viewers
   - Download data button

2. **ProfileEditSettings.tsx** (15 min)
   - Username edit (with validation)
   - Display name edit
   - Bio edit (with character count)
   - Avatar upload

3. **MediaSettings.tsx** (15 min)
   - Auto-play videos toggle
   - HD quality toggle
   - Data saver mode
   - Download over WiFi only

4. **AudioSettings.tsx** (15 min)
   - Auto-play audio toggle
   - Volume control
   - Mute by default
   - Audio quality

5. **Quick polish** (10 min)
   - Add loading states
   - Add save confirmation
   - Add reset to defaults button

---

## Task 2: Search Enhancement (60 min)

### Step 1: Add Real-Time Search (30 min)

**File:** `src/components/features/SearchBar.tsx`

**Add debounced search:**
```typescript
import { useState, useEffect } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        performSearch(query);
      }
    }, 300); // Wait 300ms after user stops typing
    
    return () => clearTimeout(timer);
  }, [query]);
  
  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const results = await searchPosts(searchQuery);
      setResults(results);
    } catch (error) {
      logger.error('Search failed', { error });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts, users, hashtags..."
      />
      {loading && <Spinner />}
      {results.length > 0 && <SearchResults results={results} />}
    </div>
  );
}
```

### Step 2: Make Filters Work (30 min)

**File:** `src/pages/Explore.tsx`

**Ensure these work:**
- Hashtag buttons (already have onClick, verify they work)
- Region buttons (already have onClick, verify they work)
- Clear filters button
- Filter combinations (hashtag + region)

**Test:**
1. Click hashtag → verify posts filter
2. Click region → verify posts filter
3. Click both → verify AND logic
4. Click clear → verify filters reset

---

## Task 3: Ti-Guy AI Polish (60 min)

### Step 1: Add Progress Indicators (30 min)

**File:** `src/components/TiGuyEnhanced.example.tsx`

**Add loading states:**
```typescript
const [generating, setGenerating] = useState(false);
const [progress, setProgress] = useState(0);

const generateImage = async (prompt: string) => {
  setGenerating(true);
  setProgress(0);
  
  try {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 90));
    }, 500);
    
    const result = await tiGuyAgent.generateImage(prompt);
    
    clearInterval(interval);
    setProgress(100);
    
    toast.success('Image generated!');
    return result;
  } catch (error) {
    logger.error('Generation failed', { error });
    toast.error('Generation failed. Try again?');
  } finally {
    setGenerating(false);
  }
};

// In render
{generating && (
  <div className="progress-bar">
    <div className="progress-fill" style={{ width: `${progress}%` }} />
    <span>{progress}% - Generating your image...</span>
  </div>
)}
```

### Step 2: Add Quebec-Themed Presets (30 min)

**Add style presets:**
```typescript
const QUEBEC_PRESETS = [
  { id: 'poutine', name: 'Poutine Style', prompt: 'Quebec poutine, cheese curds, gravy' },
  { id: 'winter', name: 'Quebec Winter', prompt: 'Quebec winter landscape, snow, ice' },
  { id: 'fleurdelys', name: 'Fleur-de-lys', prompt: 'Quebec flag, fleur-de-lys, blue and white' },
  { id: 'caribou', name: 'Caribou', prompt: 'Quebec caribou drink, festive' },
  { id: 'maple', name: 'Maple Syrup', prompt: 'Quebec maple syrup, sugar shack' },
  { id: 'montreal', name: 'Montreal', prompt: 'Montreal cityscape, Mount Royal' },
];

// Add preset buttons
{QUEBEC_PRESETS.map(preset => (
  <button
    key={preset.id}
    onClick={() => setPrompt(preset.prompt)}
    className="preset-button"
  >
    {preset.name}
  </button>
))}
```

---

## Task 4: Mobile Responsiveness (60 min)

### Step 1: Test on Mobile (30 min)

**Open DevTools:**
1. Press F12
2. Click device toolbar icon (or Ctrl+Shift+M)
3. Select iPhone 12 Pro
4. Test each page

**Pages to test:**
- Feed (`/`)
- Profile (`/profile/:username`)
- Post Detail (`/p/:id`)
- Settings (`/settings`)
- Explore (`/explore`)

**Look for:**
- Text getting cut off
- Buttons too small to tap
- Horizontal scrolling
- Overlapping elements
- Keyboard covering inputs

### Step 2: Fix Issues (30 min)

**Common fixes:**

**Text cutoff:**
```css
.text-container {
  overflow-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}
```

**Touch targets:**
```css
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

**Horizontal scroll:**
```css
.container {
  max-width: 100vw;
  overflow-x: hidden;
}

.image {
  max-width: 100%;
  height: auto;
}
```

---

## Quick Start Checklist

- [ ] Read this document (5 min)
- [ ] Check `THIRD_AGENT_TASKS.md` for full details (5 min)
- [ ] Start with NotificationSettings.tsx (20 min)
- [ ] Move through tasks systematically
- [ ] Test each change
- [ ] Report progress

---

## Success Criteria

By end of your work:
- [ ] All 5 settings pages functional
- [ ] Search works with real-time results
- [ ] Ti-Guy has progress indicators
- [ ] All pages work on mobile
- [ ] No UI bugs
- [ ] Smooth user experience

---

## Why You're Critical

**User experience is everything.** We have the tech working (97%), but if settings don't work or mobile is broken, users won't stay.

**You're polishing the experience for 9 million Quebecers.** Make it feel premium, smooth, and delightful.

---

## Communication

**Ping me when:**
- You finish each task
- You hit any blockers
- You have questions
- You're done

**I'll:**
- Review your work
- Answer questions immediately
- Integrate with other agents
- Deploy when ready

---

## The Situation

**Time:** 5 hours left  
**Current:** 97% ready  
**Goal:** 100% ready  
**Team:** 3 agents + Comet + me = 5 people  
**Strategy:** Parallel work, no conflicts

---

## Let's Go! 🚀

**START NOW with NotificationSettings.tsx**

Make it fully functional with:
- State persistence
- Haptic feedback
- Toast notifications
- All toggles working

**Then move to the next settings page.**

**You've got this! Let's make Zyeuté's UX perfect!** 🎨🔥🇨🇦⚜️

---

**Reference:** `THIRD_AGENT_TASKS.md` for complete details

**Ready? START NOW!** ⚡

