'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function PostDetailPage() {
  const params = useParams();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gold-400 mb-4">Post</h1>
        <p className="text-white/60 mt-4">Post {params.id} - Coming soon</p>
      </div>
    </div>
  );
}
