'use client';

/**
 * Providers Component for Next.js App Router
 *
 * This component wraps all global context providers needed for the app.
 * It's designed to be used in the root layout.tsx file.
 *
 * Extracted from the old _app.tsx structure:
 * - ErrorBoundary (outermost)
 * - ThemeProvider
 * - NotificationProvider
 * - BorderColorProvider
 */

import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { BorderColorProvider } from '@/contexts/BorderColorContext';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers Component
 *
 * Wraps the application with all necessary context providers.
 * Maintains the same nesting order as the original App.tsx structure.
 */
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
