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

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found!');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('❌ Failed to render app:', error);
  // Show error on page
  document.body.innerHTML = `
    <div style="padding: 20px; color: white; background: black; font-family: monospace;">
      <h1>❌ App Failed to Load</h1>
      <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
      <p>Check browser console for details.</p>
    </div>
  `;
}
