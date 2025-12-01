/**
 * OAuth Callback Handler
 * Handles the OAuth redirect from providers like Google
 * 
 * Note: Supabase client is configured with detectSessionInUrl: true in src/lib/supabase.ts,
 * which automatically processes the OAuth callback URL and establishes the session.
 * This component provides a loading state and redirects after session establishment.
 */

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { LoadingScreen } from '@/components/LoadingScreen';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let hasNavigated = false;

    // Check for OAuth error in URL parameters
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      hasNavigated = true;
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    // Listen for auth state changes to know when session is ready
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session ? 'has session' : 'no session');
      
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
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Token refreshed - we have a valid session
        hasNavigated = true;
        if (timeoutId) clearTimeout(timeoutId);
        navigate('/', { replace: true });
      }
      // Ignore INITIAL_SESSION with null session - OAuth token exchange may still be in progress
    });

    // Also check current session immediately in case auth already completed
    const checkSession = async () => {
      try {
        // First, try to get the session from the URL hash/query params
        // Supabase's detectSessionInUrl should have processed this already
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
        }
        
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
            const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession();
            
            if (retryError) {
              console.error('Retry session error:', retryError);
            }
            
            if (retrySession) {
              hasNavigated = true;
              navigate('/', { replace: true });
            } else {
              // Still no session after delay - likely a failed OAuth flow
              console.warn('No session established after OAuth callback');
              console.warn('Current URL:', window.location.href);
              hasNavigated = true;
              navigate('/login?error=no_session', { replace: true });
            }
          } catch (error) {
            console.error('Auth callback retry error:', error);
            hasNavigated = true;
            navigate('/login?error=callback_failed', { replace: true });
          }
        }, 3000); // Wait 3 seconds for OAuth token exchange
      } catch (error) {
        console.error('Auth callback error:', error);
        hasNavigated = true;
        if (timeoutId) clearTimeout(timeoutId);
        navigate('/login?error=callback_error', { replace: true });
      }
    };

    checkSession();

    // Cleanup subscription and timeout on unmount
    return () => {
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate, searchParams]);

  return <LoadingScreen message="Connexion en cours..." />;
};

export default AuthCallback;
