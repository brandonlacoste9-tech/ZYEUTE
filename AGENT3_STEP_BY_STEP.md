# Agent 3 - Step-by-Step Instructions (START NOW)

Hey Agent 3! Here are your exact instructions. Follow these step-by-step.

---

## STEP 1: Open NotificationSettings.tsx (2 min)

**File:** `src/pages/settings/NotificationSettings.tsx`

Open this file and read the current code.

---

## STEP 2: Add Imports (1 min)

At the top of the file, add these imports:

```typescript
import { useSettingsPreferences } from '@/hooks/useSettingsPreferences';
import { useHaptics } from '@/hooks/useHaptics';
import { toast } from 'react-hot-toast';
```

---

## STEP 3: Add State Management (2 min)

Inside the component function, add:

```typescript
export function NotificationSettings() {
  const { preferences, updatePreference } = useSettingsPreferences();
  const { triggerHaptic } = useHaptics();
  
  const handleToggle = (key: string, value: boolean) => {
    triggerHaptic('medium');
    updatePreference(key, value);
    toast.success('Notification setting updated');
  };
  
  // ... rest of component
}
```

---

## STEP 4: Add Toggle Switches (10 min)

Replace the existing UI with functional toggles:

```typescript
return (
  <div className="settings-page p-6">
    <h2 className="text-2xl font-bold mb-6">Notifications</h2>
    
    {/* Push Notifications */}
    <div className="setting-item mb-4">
      <label className="flex items-center justify-between">
        <span>Push Notifications</span>
        <input
          type="checkbox"
          checked={preferences.pushNotifications ?? true}
          onChange={(e) => handleToggle('pushNotifications', e.target.checked)}
          className="toggle"
        />
      </label>
    </div>
    
    {/* Email Notifications */}
    <div className="setting-item mb-4">
      <label className="flex items-center justify-between">
        <span>Email Notifications</span>
        <input
          type="checkbox"
          checked={preferences.emailNotifications ?? true}
          onChange={(e) => handleToggle('emailNotifications', e.target.checked)}
          className="toggle"
        />
      </label>
    </div>
    
    {/* Comments */}
    <div className="setting-item mb-4">
      <label className="flex items-center justify-between">
        <span>Comments on my posts</span>
        <input
          type="checkbox"
          checked={preferences.notifyComments ?? true}
          onChange={(e) => handleToggle('notifyComments', e.target.checked)}
          className="toggle"
        />
      </label>
    </div>
    
    {/* Fires */}
    <div className="setting-item mb-4">
      <label className="flex items-center justify-between">
        <span>Fires on my posts</span>
        <input
          type="checkbox"
          checked={preferences.notifyFires ?? true}
          onChange={(e) => handleToggle('notifyFires', e.target.checked)}
          className="toggle"
        />
      </label>
    </div>
    
    {/* Follows */}
    <div className="setting-item mb-4">
      <label className="flex items-center justify-between">
        <span>New followers</span>
        <input
          type="checkbox"
          checked={preferences.notifyFollows ?? true}
          onChange={(e) => handleToggle('notifyFollows', e.target.checked)}
          className="toggle"
        />
      </label>
    </div>
  </div>
);
```

---

## STEP 5: Test It (5 min)

1. Save the file
2. Open browser to `https://zyeute.netlify.app/settings/notifications`
3. Toggle each setting
4. Verify toast appears
5. Refresh page
6. Verify settings persisted

**If it works:** Move to Step 6  
**If it doesn't:** Report the error to me

---

## STEP 6: Repeat for PrivacySettings (20 min)

**File:** `src/pages/settings/PrivacySettings.tsx`

**Add same pattern:**
- Import hooks
- Add handleToggle
- Add functional toggles for:
  - Private account
  - Hide activity status
  - Block anonymous viewers
  - Allow message requests

**Test it the same way.**

---

## STEP 7: Repeat for ProfileEditSettings (20 min)

**File:** `src/pages/settings/ProfileEditSettings.tsx`

**Add:**
- Username edit with validation
- Display name edit
- Bio edit with character counter
- Save button that actually works

**Pattern:**
```typescript
const [username, setUsername] = useState(user?.username || '');
const [saving, setSaving] = useState(false);

const handleSave = async () => {
  setSaving(true);
  triggerHaptic('medium');
  
  try {
    await supabase
      .from('user_profiles')
      .update({ username, display_name, bio })
      .eq('id', user.id);
    
    toast.success('Profile updated!');
  } catch (error) {
    logger.error('Profile update failed', { error });
    toast.error('Update failed. Try again.');
  } finally {
    setSaving(false);
  }
};
```

---

## STEP 8: MediaSettings (15 min)

**File:** `src/pages/settings/MediaSettings.tsx`

**Add toggles for:**
- Auto-play videos
- HD quality
- Data saver mode
- Download over WiFi only

**Same pattern as NotificationSettings.**

---

## STEP 9: AudioSettings (15 min)

**File:** `src/pages/settings/AudioSettings.tsx`

**Add toggles for:**
- Auto-play audio
- Volume control (slider)
- Mute by default
- Audio quality

---

## STEP 10: Search Enhancement (30 min)

**File:** `src/components/features/SearchBar.tsx`

**Add debounced search:**

```typescript
import { useState, useEffect } from 'react';

export function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        onSearch(query);
      } else if (query.length === 0) {
        onSearch('');
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, onSearch]);
  
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search posts, users, hashtags..."
      className="search-input"
    />
  );
}
```

**Test:**
- Type in search
- Verify it waits 300ms before searching
- Check Network tab - should only call API after pause

---

## STEP 11: Ti-Guy Progress Indicator (30 min)

**File:** `src/components/TiGuyEnhanced.example.tsx`

**Add progress bar:**

```typescript
const [generating, setGenerating] = useState(false);
const [progress, setProgress] = useState(0);

const generateImage = async (prompt: string) => {
  setGenerating(true);
  setProgress(0);
  
  // Simulate progress
  const interval = setInterval(() => {
    setProgress(p => Math.min(p + 10, 90));
  }, 500);
  
  try {
    const result = await tiGuyAgent.generateImage(prompt);
    setProgress(100);
    toast.success('Image generated!');
    return result;
  } catch (error) {
    logger.error('Generation failed', { error });
    toast.error('Failed to generate image');
  } finally {
    clearInterval(interval);
    setGenerating(false);
  }
};

// In render
{generating && (
  <div className="progress-container">
    <div className="progress-bar" style={{ width: `${progress}%` }} />
    <span>{progress}% - Generating...</span>
  </div>
)}
```

---

## STEP 12: Mobile Testing (30 min)

**Open DevTools:**
1. Press F12
2. Click device icon (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"

**Test each page:**
- Feed
- Profile
- Settings
- Explore

**Look for:**
- Text getting cut off
- Buttons too small
- Horizontal scrolling
- Elements overlapping

**Fix common issues:**
```css
/* Add to component styles */
.text {
  overflow-wrap: break-word;
  word-break: break-word;
}

.button {
  min-height: 44px;
  min-width: 44px;
}

.container {
  max-width: 100vw;
  overflow-x: hidden;
}
```

---

## STEP 13: Test Everything (20 min)

**Go through each feature you worked on:**
1. Settings pages - toggle each setting
2. Search - type and verify debouncing
3. Ti-Guy - generate an image
4. Mobile - check all pages

**Create a checklist:**
- [ ] NotificationSettings works
- [ ] PrivacySettings works
- [ ] ProfileEditSettings works
- [ ] MediaSettings works
- [ ] AudioSettings works
- [ ] Search debouncing works
- [ ] Ti-Guy progress works
- [ ] Mobile responsive

---

## STEP 14: Report Back (10 min)

**Create a summary:**
- Files modified
- Features completed
- Any issues found
- Screenshots (optional)

**Post in chat:**
"Agent 3 complete! Modified X files, all settings functional, search working, Ti-Guy polished, mobile responsive. Ready for integration."

---

## Quick Reference

**Hooks you'll use:**
- `useSettingsPreferences()` - For settings state
- `useHaptics()` - For haptic feedback
- `toast` - For notifications
- `logger` - For logging errors

**Pattern for all settings:**
```typescript
const { preferences, updatePreference } = useSettingsPreferences();
const { triggerHaptic } = useHaptics();

const handleToggle = (key: string, value: boolean) => {
  triggerHaptic('medium');
  updatePreference(key, value);
  toast.success('Setting updated');
};
```

---

## Timeline

**Total time:** 3-4 hours

- Settings: 90 min
- Search: 30 min
- Ti-Guy: 30 min
- Mobile: 30 min
- Testing: 20 min
- Report: 10 min

---

## Need Help?

**Ask me immediately if:**
- You can't find a file
- Code doesn't work
- You're stuck on something
- You need clarification

**I'm here to help you succeed!**

---

## Let's Go! 🚀

**START NOW with STEP 1: Open NotificationSettings.tsx**

Work through steps 1-14 in order. You've got this! 🎨🔥

**Make Zyeuté's UX perfect for Quebec!** 🇨🇦⚜️

