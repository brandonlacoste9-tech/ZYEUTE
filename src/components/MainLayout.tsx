/**
 * MainLayout Component - Phone-Screen Centering with Dynamic Border Lighting
 * Provides a centered mobile app aesthetic on desktop with customizable border glow
 */

import React, { ReactNode } from 'react';
import { useBorderColor } from '@/contexts/BorderColorContext';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { borderColor } = useBorderColor();

  // Create a subtle gold glow/shadow effect using the current border color
  const dynamicBorderStyle: React.CSSProperties = {
    boxShadow: `0 0 20px 2px ${borderColor}40 inset, 0 0 40px 4px ${borderColor}20 inset`,
    transition: 'box-shadow 0.5s ease-in-out',
  };

  return (
    // Outer Wrapper: Centers the content on large screens and sets the background
    <div className="bg-gray-900 min-h-screen flex justify-center items-start pt-4 pb-4">
      {/* Inner Container: Mimics a phone screen with fixed width, black background, 
          leather overlay, and the dynamic gold border glow.
          The min-h-[calc(100vh-2rem)] ensures it takes up most of the viewport height.
      */}
      <div 
        className="w-full max-w-sm mx-auto min-h-[calc(100vh-2rem)] bg-black leather-overlay text-white overflow-hidden"
        style={dynamicBorderStyle}
      >
        {children}
      </div>
    </div>
  );
};

