# 🎨 Zyeuté Design System

**Theme**: Fur Trader × Louis Vuitton × Roots Canada  
**Aesthetic**: Premium Canadian Heritage meets Luxury Fashion

---

## 🎯 Design Philosophy

Zyeuté embodies the spirit of Quebec's fur trading heritage combined with modern luxury. Think **beaver leather**, **gold stitching**, and **premium craftsmanship** - rustic elegance that feels both authentic and aspirational.

### Core Values
- **Heritage**: Rooted in Quebec's fur trading history
- **Luxury**: Premium materials and refined details
- **Authenticity**: Real textures, genuine craftsmanship
- **Pride**: Celebrating Quebec culture with sophistication

---

## 🎨 Color Palette

### Primary Colors

#### Gold (Accent & Premium)
```css
--gold-400: #FFCC33  /* Bright highlights */
--gold-500: #F5C842  /* Primary gold */
--gold-600: #E0B32A  /* Darker accents */
--gold-700: #CC9900  /* Deep gold */
```

**Usage**: Buttons, icons, borders, highlights, premium badges

#### Leather Brown (Base)
```css
--leather-700: #4A3728  /* Primary leather */
--leather-600: #6B5742  /* Light leather */
--leather-800: #3A2B1F  /* Dark leather */
--leather-900: #2B1F15  /* Deep shadow */
```

**Usage**: Cards, backgrounds, navigation, containers

#### Rich Black
```css
--black-rich: #0A0806  /* Deep black with warmth */
```

**Usage**: Main background, text shadows, depth

### Secondary Colors

#### Warm Whites (Text & Highlights)
```css
--leather-50: #F5F0EB   /* Cream white */
--leather-100: #E8DDD3  /* Warm off-white */
```

**Usage**: Primary text, highlights on dark backgrounds

---

## 🧱 Components

### Cards

#### Premium Leather Card
```tsx
<div className="leather-card rounded-2xl p-6">
  {/* Content */}
</div>
```

**Features**:
- Leather texture overlay
- Subtle gold border
- Embossed shadows
- Warm depth

#### Glass Premium Card
```tsx
<div className="glass-premium rounded-2xl p-6">
  {/* Content */}
</div>
```

**Features**:
- Frosted glass effect
- Gold accent borders
- Backdrop blur
- Floating appearance

---

### Buttons

#### Gold Primary Button
```tsx
<button className="btn-gold px-6 py-3 rounded-xl">
  S'abonner
</button>
```

**States**:
- Default: Gold gradient with glow
- Hover: Brighter, lifted shadow
- Active: Pressed, darker
- Disabled: Desaturated, no glow

#### Leather Secondary Button
```tsx
<button className="btn-leather px-6 py-3 rounded-xl">
  Découvrir
</button>
```

**Features**:
- Leather texture background
- Gold text
- Subtle embossing
- Warm hover state

---

### Inputs

#### Premium Input Field
```tsx
<input 
  type="text"
  className="input-premium w-full"
  placeholder="Ton username..."
/>
```

**Features**:
- Leather texture background
- Gold focus border with glow
- Warm placeholder text
- Smooth transitions

---

### Typography

#### Headings
```css
/* Logo / Brand */
.logo-embossed {
  font-weight: 900;
  color: var(--gold-500);
  text-shadow: 
    0 1px 0 rgba(255,255,255,0.1),
    0 -1px 0 rgba(0,0,0,0.5);
}

/* Page Titles */
h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--gold-500);
}

/* Section Headers */
h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--leather-100);
}
```

#### Body Text
```css
/* Primary Text */
color: #FFFFFF;
font-weight: 400;

/* Secondary Text */
color: var(--leather-400);
font-weight: 400;

/* Muted Text */
color: var(--leather-500);
font-weight: 300;
```

---

## ✨ Effects & Animations

### Gold Glow
```tsx
<div className="glow-gold">
  {/* Glowing element */}
</div>
```

**Usage**: Premium badges, active states, highlights

### Stitched Border
```tsx
<div className="stitched p-6">
  {/* Content with stitched border */}
</div>
```

**Usage**: Cards, containers, featured content

### Embossed Text
```tsx
<h1 className="embossed">
  Zyeuté
</h1>
```

**Usage**: Logos, headings, premium labels

### Shimmer Effect
```tsx
<div className="animate-shimmer">
  {/* Loading or premium content */}
</div>
```

**Usage**: Loading states, premium features

---

## 🖼️ Textures

### Leather Texture
Applied via CSS variable:
```css
background-image: var(--leather-texture);
```

**Usage**: Cards, backgrounds, navigation bars

### Overlay Pattern
```tsx
<div className="leather-overlay">
  {/* Content with subtle leather pattern */}
</div>
```

---

## 🎭 Iconography

### Style Guidelines
- **Stroke**: 2px for icons
- **Color**: Gold (#F5C842) for primary, Leather (#8B7355) for secondary
- **Glow**: Add drop-shadow for premium feel
- **Size**: 20px (sm), 24px (md), 32px (lg), 48px (xl)

### Fleur-de-lys
The signature Quebec symbol, used as:
- App logo
- Premium badge
- Divider accent
- Loading indicator

---

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   /* Mobile */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
```

### Mobile Considerations
- Larger touch targets (min 44px)
- Simplified leather textures for performance
- Reduced glow effects
- Safe area padding for notches

---

## 🎨 Usage Examples

### Login Page
```tsx
<div className="min-h-screen bg-black leather-overlay">
  <div className="leather-card max-w-md mx-auto p-8">
    <Logo size="xl" glowing />
    <h1 className="embossed text-gold-500">Connexion</h1>
    <input className="input-premium" />
    <button className="btn-gold w-full">
      Se connecter
    </button>
  </div>
</div>
```

### Premium Card
```tsx
<div className="card-premium">
  <div className="badge-premium">VIP Gold</div>
  <h2 className="text-gold-500">Abonnement Premium</h2>
  <p className="text-leather-300">Accès illimité</p>
  <button className="btn-gold">S'abonner</button>
</div>
```

### Navigation
```tsx
<nav className="nav-leather">
  <Logo size="sm" />
  <div className="flex gap-4">
    <button className="text-gold-500 glow-gold-subtle">
      Feed
    </button>
  </div>
</nav>
```

---

## 🎯 Do's and Don'ts

### ✅ Do
- Use leather textures for depth
- Apply gold sparingly for impact
- Maintain warm color temperature
- Add subtle glows to premium elements
- Use embossing for hierarchy
- Keep animations smooth and luxurious

### ❌ Don't
- Overuse gold (loses premium feel)
- Use cool colors (breaks warmth)
- Apply harsh shadows
- Use flat, lifeless backgrounds
- Forget mobile performance
- Ignore Quebec cultural elements

---

## 🔧 Implementation

### CSS Classes Quick Reference
```css
/* Backgrounds */
.leather-card          /* Primary card style */
.glass-premium         /* Frosted glass */
.nav-leather          /* Navigation bar */

/* Buttons */
.btn-gold             /* Primary action */
.btn-leather          /* Secondary action */

/* Inputs */
.input-premium        /* Form fields */

/* Effects */
.glow-gold            /* Strong glow */
.glow-gold-subtle     /* Soft glow */
.stitched             /* Stitched border */
.embossed             /* Embossed text */
.leather-overlay      /* Texture overlay */

/* Animations */
.animate-pulse-gold   /* Pulsing glow */
.animate-shimmer      /* Shimmer effect */
.animate-fade-in      /* Fade in */

/* Utilities */
.badge-premium        /* Premium badge */
.divider-gold         /* Gold divider */
.scrollbar-gold       /* Custom scrollbar */
```

---

**Made with ❤️ in Quebec**  
*Propulsé par Nano Banana* 🍌🇨🇦⚜️

