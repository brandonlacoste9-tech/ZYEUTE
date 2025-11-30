# 🌃 Nightlife Integration - TRUE QUEBEC

## Nightlife is Really Good Here!

Quebec has an amazing nightlife scene, and the Discovery API now includes authentic nightlife venues that locals actually go to.

## Nightlife Venues Added

### Montreal
- **Stereo** - Legendary techno club with the best sound system in the city
- **New City Gas** - Major electronic events and international shows
- **Le Belmont** - Alternative rock bar with live shows - authentic local scene
- **Café Campus** - Classic student bar - relaxed vibe and affordable prices
- **Le Divan Orange** - Intimate bar with acoustic shows and Quebec folk scene

### Quebec City
- **L'Astral** - Trendy bar with live music and electric atmosphere
- **Le Fou-Bar** - Underground bar with DJ sets and alternative scene

## Categories

All nightlife venues are categorized as `"bar"` for easy filtering:

```bash
# Get all nightlife venues
curl http://localhost:8000/api/v1/discovery/items?category=bar

# Get Montreal nightlife
curl http://localhost:8000/api/v1/discovery/items?category=bar&region=Montreal
```

## Integration with TI-Guy

TI-Guy can now recommend:
- Best techno clubs (Stereo)
- Major electronic events (New City Gas)
- Local rock/alternative scenes (Le Belmont, Le Divan Orange)
- Underground spots (Le Fou-Bar)
- Student-friendly venues (Café Campus)

## Cultural Authenticity

These venues represent:
- ✅ **Local favorites** - Where Quebecers actually go
- ✅ **Authentic scenes** - Not tourist traps
- ✅ **Regional variety** - Montreal vs Quebec City vibes
- ✅ **Music diversity** - Techno, rock, folk, electronic

---

**Updated:** Discovery API now includes Quebec's amazing nightlife scene! 🌃⚜️

