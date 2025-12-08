'use client';

/**
 * Global Providers Component
 * Wraps all context providers for the Next.js App Router
 */

import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { BorderColorProvider } from '@/contexts/BorderColorContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <BorderColorProvider>{children}</BorderColorProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
