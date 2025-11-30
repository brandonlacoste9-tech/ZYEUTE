/**
 * OAuth Callback Handler
 * Handles the OAuth redirect from providers like Google
 * 
 * Note: Supabase client is configured with detectSessionInUrl: true in src/lib/supabase.ts,
 * which automatically processes the OAuth callback URL and establishes the session.
 * This component provides a loading state and redirects after session establishment.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { LoadingScreen } from '@/components/LoadingScreen';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let hasNavigated = false;

    // Listen for auth state changes to know when session is ready
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Successful login - redirect to home
        hasNavigated = true;
        if (timeoutId) clearTimeout(timeoutId);
        navigate('/', { replace: true });
      } else if (event === 'SIGNED_OUT') {
        // Explicitly signed out - redirect to login
        hasNavigated = true;
        if (timeoutId) clearTimeout(timeoutId);
        navigate('/login', { replace: true });
      }
      // Ignore INITIAL_SESSION with null session - OAuth token exchange may still be in progress
      // We'll wait for SIGNED_IN event or check session after a delay
    });

    // Also check current session immediately in case auth already completed
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          hasNavigated = true;
          if (timeoutId) clearTimeout(timeoutId);
          navigate('/', { replace: true });
          return;
        }
        
        // If no session yet, wait a bit for OAuth token exchange to complete
        // This handles cases where the callback hasn't processed yet
        timeoutId = setTimeout(async () => {
          if (hasNavigated) return; // Already navigated via onAuthStateChange
          
          try {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
              hasNavigated = true;
              navigate('/', { replace: true });
            } else {
              // Still no session after delay - likely a failed OAuth flow
              console.warn('No session established after OAuth callback');
              hasNavigated = true;
              navigate('/login', { replace: true });
            }
          } catch (error) {
            console.error('Auth callback retry error:', error);
            hasNavigated = true;
            navigate('/login', { replace: true });
          }
        }, 2000); // Wait 2 seconds for OAuth token exchange
      } catch (error) {
        console.error('Auth callback error:', error);
        hasNavigated = true;
        if (timeoutId) clearTimeout(timeoutId);
        navigate('/login', { replace: true });
      }
    };

    checkSession();

    // Cleanup subscription and timeout on unmount
    return () => {
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate]);

  return <LoadingScreen message="Connexion en cours..." />;
};

export default AuthCallback;
