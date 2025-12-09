'use client';

/**
 * Home Page (Feed)
 * This is the main feed page for authenticated users
 */

import React from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gold-400 mb-4">Zyeuté</h1>
        <p className="text-white/80">L'app sociale du Québec 🔥⚜️</p>
        <p className="text-white/60 mt-4">Feed page - Coming soon</p>
      </div>
    </div>
  );
}
