/**
 * Zyeuté Logo Component
 * Glowing Gold Fleur-de-lys on Dark Leather
 * Quebec Heritage Luxury Design
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
  const sizeConfig = {
    sm: { container: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-lg', blur: '8px' },
    md: { container: 'w-14 h-14', icon: 'w-8 h-8', text: 'text-2xl', blur: '12px' },
    lg: { container: 'w-20 h-20', icon: 'w-12 h-12', text: 'text-3xl', blur: '16px' },
    xl: { container: 'w-28 h-28', icon: 'w-16 h-16', text: 'text-5xl', blur: '24px' },
  };

  const config = sizeConfig[size];

  const logoContent = (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Logo Container with Glow */}
      <div className="relative">
        {/* Outer Glow Effect */}
        {glowing && (
          <div 
            className="absolute inset-0 rounded-2xl animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255,191,0,0.4) 0%, transparent 70%)',
              filter: `blur(${config.blur})`,
              transform: 'scale(1.5)',
            }}
          />
        )}
        
        {/* Main Logo Box */}
        <div 
          className={`${config.container} relative rounded-2xl flex items-center justify-center overflow-hidden`}
          style={{
            background: 'linear-gradient(145deg, #2a2520 0%, #1a1815 50%, #0f0e0c 100%)',
            boxShadow: glowing 
              ? `0 0 30px rgba(255,191,0,0.3), 0 0 60px rgba(255,191,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)`
              : 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)',
          }}
        >
          {/* Gold Border */}
          <div 
            className="absolute inset-0 rounded-2xl"
            style={{
              border: '2px solid rgba(255,191,0,0.5)',
              boxShadow: glowing ? '0 0 15px rgba(255,191,0,0.3), inset 0 0 15px rgba(255,191,0,0.1)' : 'none',
            }}
          />
          
          {/* Corner Accents */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 rounded-tl" style={{ borderColor: 'rgba(255,191,0,0.6)' }} />
          <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 rounded-tr" style={{ borderColor: 'rgba(255,191,0,0.6)' }} />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 rounded-bl" style={{ borderColor: 'rgba(255,191,0,0.6)' }} />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 rounded-br" style={{ borderColor: 'rgba(255,191,0,0.6)' }} />

          {/* Fleur-de-lys SVG */}
          <svg 
            viewBox="0 0 100 120" 
            className={`${config.icon} relative z-10`}
            style={{
              filter: glowing 
                ? 'drop-shadow(0 0 8px rgba(255,191,0,0.8)) drop-shadow(0 0 16px rgba(255,191,0,0.4))'
                : 'none',
            }}
          >
            <defs>
              <linearGradient id="fleurGold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFE55C" />
                <stop offset="30%" stopColor="#FFD700" />
                <stop offset="70%" stopColor="#DAA520" />
                <stop offset="100%" stopColor="#B8860B" />
              </linearGradient>
              <linearGradient id="fleurGoldStroke" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF8DC" />
                <stop offset="100%" stopColor="#DAA520" />
              </linearGradient>
            </defs>
            
            {/* Main Fleur-de-lys */}
            <g fill="url(#fleurGold)" stroke="url(#fleurGoldStroke)" strokeWidth="1.5">
              {/* Center Petal */}
              <path d="M50 8 C50 8 42 25 42 35 C42 42 45 48 50 52 C55 48 58 42 58 35 C58 25 50 8 50 8 Z" />
              
              {/* Left Petal */}
              <path d="M38 38 C28 32 18 35 18 48 C18 58 28 62 38 58 C45 55 48 50 50 45 C48 42 44 40 38 38 Z" />
              
              {/* Right Petal */}
              <path d="M62 38 C72 32 82 35 82 48 C82 58 72 62 62 58 C55 55 52 50 50 45 C52 42 56 40 62 38 Z" />
              
              {/* Center Stem */}
              <path d="M46 52 L46 75 L54 75 L54 52 C52 54 48 54 46 52 Z" />
              
              {/* Left Curl */}
              <path d="M46 65 C40 70 32 75 28 82 C24 90 28 98 38 96 C44 94 46 88 46 82 L46 65 Z" />
              
              {/* Right Curl */}
              <path d="M54 65 C60 70 68 75 72 82 C76 90 72 98 62 96 C56 94 54 88 54 82 L54 65 Z" />
              
              {/* Base Band */}
              <rect x="38" y="72" width="24" height="6" rx="2" />
            </g>
          </svg>
        </div>
        
        {/* "Québec" Text Under Logo */}
        {size === 'xl' && (
          <p 
            className="text-center text-xs font-bold tracking-[0.2em] mt-1"
            style={{ 
              color: '#DAA520',
              textShadow: glowing ? '0 0 10px rgba(255,191,0,0.5)' : 'none',
            }}
          >
            QUÉBEC
          </p>
        )}
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col items-center">
          <span 
            className={`${config.text} font-black tracking-tight`}
            style={{
              fontFamily: "'Times New Roman', Georgia, serif",
              background: 'linear-gradient(180deg, #FFE55C 0%, #FFD700 30%, #DAA520 70%, #B8860B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: glowing ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' : 'none',
              textShadow: glowing ? '0 0 30px rgba(255,191,0,0.3)' : 'none',
            }}
          >
            Zyeuté
          </span>
          {size !== 'sm' && (
            <span 
              className="text-[0.6em] font-bold tracking-[0.25em] uppercase"
              style={{ color: '#B8860B' }}
            >
              L'app sociale du Québec
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
    <Link to={linkTo} className="transition-transform hover:scale-105 duration-300">
      {logoContent}
    </Link>
  );
};

// Compact logo for headers
export const LogoCompact: React.FC<{ className?: string }> = ({ className }) => (
  <Logo size="sm" showText={false} className={className} />
);

// Full logo for splash screens
export const LogoFull: React.FC<{ className?: string }> = ({ className }) => (
  <Logo size="xl" showText={true} linkTo={null} className={className} />
);

export default Logo;
