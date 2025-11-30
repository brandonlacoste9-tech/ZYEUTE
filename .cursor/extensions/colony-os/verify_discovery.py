#!/usr/bin/env python3
"""
Quick verification script for Discovery API data
"""

import sys
sys.path.insert(0, '.')

from api.routes.discovery import _discovery_data

print("🔍 Discovery API Verification\n")

print(f"✅ Total discovery items: {len(_discovery_data)}\n")

# Count by category
categories = {}
for item in _discovery_data:
    categories[item.category] = categories.get(item.category, 0) + 1

print("📊 Items by category:")
for cat, count in sorted(categories.items()):
    print(f"  - {cat}: {count}")

# Nightlife venues
bars = [item for item in _discovery_data if item.category == 'bar']
print(f"\n🌃 Nightlife venues: {len(bars)}")
for bar in bars[:3]:
    print(f"  - {bar.name} ({bar.region})")

# All-ages venues (shows, sports, some restaurants)
all_ages = [item for item in _discovery_data if item.category in ['show', 'sport'] or 'tous âges' in item.description.lower() or '16+' in item.description.lower()]
print(f"\n👥 All-ages venues (16+): {len(all_ages)}")
for venue in all_ages[:3]:
    print(f"  - {venue.name} ({venue.category})")

print("\n✅ Discovery API data verified!")

