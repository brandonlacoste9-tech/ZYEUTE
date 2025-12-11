'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();

  // This is a placeholder page that should be implemented
  // For now, redirect to home
  React.useEffect(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-gold-400 animate-pulse">Chargement...</div>
    </div>
  );
}
