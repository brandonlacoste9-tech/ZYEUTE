/**
 * Bottom Navigation - Premium Leather Design
 * Stitched leather bar with gold accents
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  activeIcon?: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Feed',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    activeIcon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: '/explore',
    label: 'Découvrir',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    activeIcon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 4a8 8 0 100 16 8 8 0 000-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z" />
        <path d="M10 10a2 2 0 114 0 2 2 0 01-4 0z" />
      </svg>
    ),
  },
  {
    path: '/upload',
    label: 'Upload',
    icon: (
      <div className="w-14 h-14 -mt-8 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/40 border-4 border-neutral-900 transform hover:scale-110 transition-transform duration-200 relative group">
        {/* Fur/Texture ring effect inside border */}
        <div className="absolute inset-1 rounded-full border border-gold-300/50" />
        <svg className="w-8 h-8 text-black drop-shadow-sm group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
    ),
  },
  {
    path: '/notifications',
    label: 'Notifs',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    activeIcon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 2a2 2 0 00-2 2v.341C5.67 5.165 4 7.388 4 10v3.159c0 .538-.214 1.055-.595 1.436L2 16h20l-1.405-1.405A2.032 2.032 0 0120 13.159V10c0-2.612-1.67-4.835-4-5.659V4a2 2 0 10-4 0v.341zM12 22a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    path: '/profile/me',
    label: 'Profil',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    activeIcon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2a5 5 0 100 10 5 5 0 000-10zm-7 13a7 7 0 0114 0v3H5v-3z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      {/* Background Blur & Texture */}
      <div className="absolute inset-0 bg-neutral-900/95 backdrop-blur-xl" />
      
      {/* Top Border / Stitching */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gold-500/20" />
      <div className="absolute top-[3px] left-0 right-0 border-t border-dashed border-gold-500/30 opacity-50" />

      <div className="relative max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isUpload = item.path === '/upload';

            if (isUpload) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative flex flex-col items-center justify-center px-2"
                  aria-label={item.label}
                >
                  {item.icon}
                  <span className="text-[10px] font-bold text-gold-400 mt-6 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center w-16 py-1 transition-all duration-300',
                  isActive ? 'transform -translate-y-1' : 'opacity-70 hover:opacity-100'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'transition-colors duration-300',
                    isActive ? 'text-gold-400 drop-shadow-[0_0_8px_rgba(255,191,0,0.5)]' : 'text-stone-400 hover:text-gold-200'
                  )}
                >
                  {isActive && item.activeIcon ? item.activeIcon : item.icon}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'text-[10px] font-medium mt-1 transition-colors duration-300',
                    isActive ? 'text-gold-400 font-bold embossed' : 'text-stone-500'
                  )}
                >
                  {item.label}
                </span>
                
                {/* Active Dot Indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-gold-500 shadow-[0_0_5px_#FFBF00]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
