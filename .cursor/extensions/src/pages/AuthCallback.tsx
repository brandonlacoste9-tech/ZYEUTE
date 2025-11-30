import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * AuthCallback component handles OAuth redirects from Supabase
 * 
 * Fix: Ignores INITIAL_SESSION events with null session during OAuth processing
 * to prevent premature redirect to /login before token exchange completes.
 * 
 * Issue: The onAuthStateChange callback fires immediately upon registration with
 * an INITIAL_SESSION event. When OAuth URL processing hasn't completed yet,
 * session will be null, causing the condition !session to match and redirect
 * to /login before the OAuth token exchange can finish.
 */
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Track if we're processing an OAuth callback
    const isProcessingOAuth = 
      window.location.hash.includes('access_token') || 
      window.location.hash.includes('type=recovery') ||
      window.location.search.includes('code') ||
      window.location.search.includes('token');

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Fix: Ignore INITIAL_SESSION events with null session during OAuth processing
      // The check conflates "no session yet during initialization" with "authentication failed"
      if (event === 'INITIAL_SESSION' && !session && isProcessingOAuth) {
        // OAuth processing is in progress, wait for token exchange to complete
        // Don't treat this as a failure - it's just initialization
        console.log('OAuth processing in progress, waiting for token exchange...');
        return;
      }

      // Original logic: redirect to /login if no session
      // But now we've filtered out the problematic INITIAL_SESSION case above
      if (!session) {
        navigate('/login');
        return;
      }

      // Successful authentication
      if (session) {
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div>
      <p>Processing authentication...</p>
    </div>
  );
}

