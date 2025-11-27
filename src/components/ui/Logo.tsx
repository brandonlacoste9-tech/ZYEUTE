/**
 * Zyeuté Logo Component
 * Premium leather & gold aesthetic - Fur trader meets Louis Vuitton
 */

import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  linkTo?: string | null;
  className?: string;
  glowing?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  linkTo = '/',
  className = '',
  glowing = true,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  };

  const logoContent = (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Fleur-de-lys Icon with Stitched Border */}
      <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
        {/* Outer Glow */}
        {glowing && (
          <div className="absolute inset-0 animate-pulse-gold">
            <div className="w-full h-full rounded-lg border-2 border-gold-500/30 blur-sm" />
          </div>
        )}
        
        {/* Stitched Border */}
        <div className="absolute inset-0 rounded-lg border-2 border-dashed border-gold-500/40" />
        <div className="absolute inset-[-4px] rounded-lg border border-gold-500/20" />
        
        {/* Fleur-de-lys SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`relative z-10 ${glowing ? 'drop-shadow-[0_0_8px_rgba(245,200,66,0.8)]' : ''}`}
        >
          {/* Main Fleur-de-lys Shape */}
          <path
            d="M12 2C12 2 10 4 10 6C10 7 10.5 8 11.5 8.5C11 9 10.5 10 10.5 11.5C10.5 13 11 14 12 14C13 14 13.5 13 13.5 11.5C13.5 10 13 9 12.5 8.5C13.5 8 14 7 14 6C14 4 12 2 12 2Z"
            fill="url(#goldGradient)"
            stroke="url(#goldStroke)"
            strokeWidth="0.5"
          />
          
          {/* Left Petal */}
          <path
            d="M8 8C8 8 6 9 6 10.5C6 11.5 6.5 12 7.5 12C8.5 12 9 11.5 9.5 10.5C9.5 10.5 9 9.5 8 8Z"
            fill="url(#goldGradient)"
            stroke="url(#goldStroke)"
            strokeWidth="0.5"
          />
          
          {/* Right Petal */}
          <path
            d="M16 8C16 8 18 9 18 10.5C18 11.5 17.5 12 16.5 12C15.5 12 15 11.5 14.5 10.5C14.5 10.5 15 9.5 16 8Z"
            fill="url(#goldGradient)"
            stroke="url(#goldStroke)"
            strokeWidth="0.5"
          />
          
          {/* Bottom Band */}
          <path
            d="M9 11.5C9 11.5 9.5 12 10 13L10 16C10 17 10.5 18 12 18C13.5 18 14 17 14 16L14 13C14.5 12 15 11.5 15 11.5"
            fill="url(#goldGradient)"
            stroke="url(#goldStroke)"
            strokeWidth="0.5"
          />
          
          {/* Bottom Curls */}
          <path
            d="M10 16C10 16 9 17 8 18C7 19 6 20 6 21C6 22 7 22 8 22"
            fill="url(#goldGradient)"
            stroke="url(#goldStroke)"
            strokeWidth="0.5"
          />
          <path
            d="M14 16C14 16 15 17 16 18C17 19 18 20 18 21C18 22 17 22 16 22"
            fill="url(#goldGradient)"
            stroke="url(#goldStroke)"
            strokeWidth="0.5"
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="goldGradient" x1="12" y1="2" x2="12" y2="22">
              <stop offset="0%" stopColor="#FFD966" />
              <stop offset="50%" stopColor="#F5C842" />
              <stop offset="100%" stopColor="#CC9900" />
            </linearGradient>
            <linearGradient id="goldStroke" x1="12" y1="2" x2="12" y2="22">
              <stop offset="0%" stopColor="#FFED4E" />
              <stop offset="100%" stopColor="#E0B32A" />
            </linearGradient>
          </defs>
          
          {/* Sparkle Effects */}
          {glowing && (
            <>
              <circle cx="12" cy="4" r="0.5" fill="#FFF" opacity="0.8" className="animate-pulse" />
              <circle cx="8" cy="10" r="0.3" fill="#FFF" opacity="0.6" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
              <circle cx="16" cy="10" r="0.3" fill="#FFF" opacity="0.6" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
            </>
          )}
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-black tracking-tight logo-embossed text-gold-500`}>
            Zyeuté
          </span>
          {size !== 'sm' && (
            <span className="text-[0.6em] text-leather-400 font-semibold tracking-wider uppercase">
              Québec
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linkTo === null) {
    return logoContent;
  }

  return (
    <Link to={linkTo} className="transition-transform hover:scale-105">
      {logoContent}
    </Link>
  );
};

export default Logo;

