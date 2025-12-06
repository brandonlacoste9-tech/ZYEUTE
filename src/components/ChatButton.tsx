/**
 * ChatButton - Premium Gold Embossed Medallion Style
 * Inspired by the TI-Guy Quebec CA medallion design
 * Circular button with embossed gold rings and black leather center
 */

import React, { useState } from 'react';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { useHaptics } from '@/hooks/useHaptics';
import { ChatModal } from './ChatModal';
import { cn } from '@/lib/utils';

interface ChatButtonProps {
  onClick?: () => void;
  isFixed?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-14 h-14',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
};

const iconSizes = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
};

export const ChatButton: React.FC<ChatButtonProps> = ({
  onClick,
  isFixed = true,
  className,
  size = 'md',
}) => {
  const { tap, impact } = useHaptics();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleClick = () => {
    impact(); // Strong haptic feedback for premium feel
    setIsChatOpen(true);
    if (onClick) {
      onClick();
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  // Base positioning classes - positioned above bottom nav (h-16 = 64px + safe area + padding)
  // Using bottom-32 (8rem = 128px) to ensure clearance above the bottom navigation bar
  const positionClasses = isFixed
    ? 'fixed bottom-32 right-4 z-40'
    : 'relative';

  // Custom shadow effect simulating the gold ring and depth
  // Multiple layers to create the embossed medallion effect
  const goldEmbossedStyle: React.CSSProperties = {
    // Complex box-shadow to simulate:
    // 1. Outer gold glow (ambient light)
    // 2. Outer gold ring shadow (depth)
    // 3. Inner black leather depth
    // 4. Inner gold ring highlight
    boxShadow: `
      0 0 20px rgba(255, 191, 0, 0.5),
      0 4px 12px rgba(0, 0, 0, 0.6),
      inset 0 0 12px rgba(0, 0, 0, 0.9),
      inset 0 0 0 3px #FFBF00,
      inset 0 2px 4px rgba(255, 191, 0, 0.3)
    `,
    backgroundColor: '#000000',
    border: '4px solid #FFBF00',
    backgroundImage: `
      radial-gradient(circle at 30% 30%, rgba(255, 191, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(0, 0, 0, 0.5) 0%, transparent 50%)
    `,
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          positionClasses,
          sizeClasses[size],
          'rounded-full',
          'flex items-center justify-center',
          'transition-all duration-300 ease-in-out',
          'transform hover:scale-110 active:scale-95',
          'hover:shadow-[0_0_30px_rgba(255,191,0,0.7)]',
          'group',
          className
        )}
        style={goldEmbossedStyle}
        aria-label="Ouvrir le chat"
      >
        {/* Beaver Gold Coin Image */}
        <img
          src="/ti-guy-logo.jpg?v=2"
          alt="Ti-Guy"
          className="w-full h-full object-cover rounded-full"
        />
        
        {/* Subtle inner ring highlight */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: '2px solid rgba(255, 191, 0, 0.2)',
            boxShadow: 'inset 0 0 8px rgba(255, 191, 0, 0.1)',
          }}
        />
      </button>

      {/* Chat Modal */}
      {isChatOpen && <ChatModal onClose={handleCloseChat} />}
    </>
  );
};

