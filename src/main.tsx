import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Add error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('❌ Uncaught error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
});

// Log that we're starting
console.log('🚀 Starting Zyeuté app...');
console.log('📍 Environment check:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '❌ Missing',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set (hidden)' : '❌ Missing',
  NODE_ENV: import.meta.env.MODE,
});

// Additional debug logging for Supabase URL
if (import.meta.env.VITE_SUPABASE_URL) {
  const url = import.meta.env.VITE_SUPABASE_URL;
  
  // Import utilities dynamically to avoid circular dependency
  const extractSupabaseProjectRef = (url: string) => url.split('//')[1]?.split('.')[0] || 'unknown';
  
  console.log('🔍 Supabase URL Details:', {
    full_url: url,
    project_ref: extractSupabaseProjectRef(url),
    expected_ref: 'vuanulvyqkfefmjcikfk',
  });
  
  // Validate URL (inline to avoid import issues at startup)
  const projectRef = extractSupabaseProjectRef(url);
  if (url.includes('kihxqurnmyxnsyqgpdaw')) {
    console.error('❌ WRONG PROJECT! Using kihxqurnmyxnsyqgpdaw instead of vuanulvyqkfefmjcikfk');
  } else if (projectRef === 'vuanulvyqkfefmjcikfk') {
    console.log('✅ Using correct Supabase project: vuanulvyqkfefmjcikfk');
  } else if (url.includes('demo.supabase.co')) {
    console.warn('⚠️ Using demo Supabase URL');
  } else {
    console.warn('⚠️ Unknown Supabase project. Expected: vuanulvyqkfefmjcikfk');
  }
} else {
  console.error('❌ VITE_SUPABASE_URL not set! App may not function correctly.');
}

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found!');
  }

  console.log('✅ Root element found, rendering App...');
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('❌ Failed to render app:', error);
  console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
  
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
            <p style="color: ${import.meta.env.VITE_SUPABASE_URL ? '#4ade80' : '#ff6b6b'};">VITE_SUPABASE_URL: ${import.meta.env.VITE_SUPABASE_URL || '❌ Missing'}</p>
            <p style="color: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? '#4ade80' : '#ff6b6b'};">VITE_SUPABASE_ANON_KEY: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set (hidden)' : '❌ Missing'}</p>
          </div>
          <p style="color: #888; margin-top: 20px;">Check browser console (F12) for more details.</p>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #F5C842; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Reload Page</button>
        </div>
      </div>
    `;
  }
}
