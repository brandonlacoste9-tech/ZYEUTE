'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function ProfilePage() {
  const params = useParams();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gold-400 mb-4">Profil</h1>
        <p className="text-white/60 mt-4">Profile @{params.slug} - Coming soon</p>
      </div>
    </div>
  );
}
