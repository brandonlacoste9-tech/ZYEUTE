import './globals.css';
import { Providers } from './providers';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "Zyeuté - L'app sociale du Québec 🇨🇦⚜️",
  description:
    'Partage tes photos et vidéos avec le Québec entier! La seule app sociale 100% québécoise.',
  themeColor: '#F5C842',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CA">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="theme-color" content="#F5C842" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      </head>
      <body className="bg-black min-h-screen text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
