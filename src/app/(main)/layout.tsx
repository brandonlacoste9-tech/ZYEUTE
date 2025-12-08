import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { TiGuy } from '@/components/features/TiGuy';
import { AchievementListener } from '@/components/gamification/AchievementModal';

export default function MainAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <AchievementListener />
      {children}
      <TiGuy />
    </MainLayout>
  );
}
