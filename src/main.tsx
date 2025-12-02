import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { logger } from './lib/logger';

const errorLogger = logger.withContext('GlobalError');

// Add error handler for uncaught errors
window.addEventListener('error', (event) => {
  errorLogger.error('Uncaught error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  errorLogger.error('Unhandled promise rejection:', event.reason);
});

import { extractSupabaseProjectRef } from './lib/utils';
import { logger } from './lib/logger';

const appLogger = logger.withContext('App');

// Log that we're starting
appLogger.info('🚀 Starting Zyeuté app...');
appLogger.info('📍 Environment check:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL 
    ? `✅ Set (${extractSupabaseProjectRef(import.meta.env.VITE_SUPABASE_URL) || 'unknown'})` 
    : '❌ Missing',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY 
    ? `✅ Set (${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 10)}...)` 
    : '❌ Missing',
  NODE_ENV: import.meta.env.MODE,
});

// Show actual Supabase URL if set
if (import.meta.env.VITE_SUPABASE_URL) {
  appLogger.debug('📍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
}

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found!');
  }

  appLogger.debug('✅ Root element found, rendering App...');
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  
  appLogger.debug('✅ App rendered successfully');
} catch (error) {
  errorLogger.error('❌ Failed to render app:', error);
  errorLogger.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
  
  // Show error on page with more details
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 40px; color: #F5C842; background: #0a0a0a; font-family: monospace; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
        <div style="max-width: 600px;">
          <h1 style="color: #F5C842; font-size: 24px; margin-bottom: 20px;">❌ App Failed to Load</h1>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #F5C842; margin-bottom: 20px;">
            <p style="color: #fff; margin-bottom: 10px;"><strong>Error:</strong></p>
            <p style="color: #ff6b6b; word-break: break-word;">${error instanceof Error ? error.message : String(error)}</p>
            ${error instanceof Error && error.stack ? `<pre style="color: #888; font-size: 12px; margin-top: 10px; overflow-x: auto;">${error.stack}</pre>` : ''}
          </div>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #fff; margin-bottom: 10px;"><strong>Environment Variables:</strong></p>
            <p style="color: ${import.meta.env.VITE_SUPABASE_URL ? '#4ade80' : '#ff6b6b'};">VITE_SUPABASE_URL: ${import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
            <p style="color: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? '#4ade80' : '#ff6b6b'};">VITE_SUPABASE_ANON_KEY: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          </div>
          <p style="color: #888; margin-top: 20px;">Check browser console (F12) for more details.</p>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #F5C842; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Reload Page</button>
        </div>
      </div>
    `;
  }
}
