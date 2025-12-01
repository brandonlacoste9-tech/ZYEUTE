/**
 * OAuth Callback Handler
 * Handles the OAuth redirect from providers like Google
 * 
 * Supports both:
 * 1. Hash-based OAuth (automatic with detectSessionInUrl)
 * 2. Code-based OAuth (explicit exchangeCodeForSession)
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

    const exchangeCode = async () => {
      // Check for OAuth error in URL parameters
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (error) {
        console.error('OAuth error:', error, errorDescription);
        hasNavigated = true;
        navigate(`/login?error=${encodeURIComponent(error || 'oauth_failed')}`, { replace: true });
        return;
      }

      // Check for code-based OAuth (query params)
      const code = searchParams.get('code');
      const provider = searchParams.get('provider') || 'google'; // Default to google if not specified

      if (code) {
        // Explicit code exchange flow
        console.log('Exchanging OAuth code for session...', { code, provider });
        
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('OAuth exchange error:', exchangeError);
            hasNavigated = true;
            navigate(`/login?error=${encodeURIComponent(exchangeError.message || 'exchange_failed')}`, { replace: true });
            return;
          }

          if (data?.session) {
            console.log('✅ Session established:', {
              user: data.session.user?.email,
              expiresAt: data.session.expires_at,
            });
            hasNavigated = true;
            navigate('/', { replace: true });
            return;
          } else {
            console.warn('No session in exchange response');
            hasNavigated = true;
            navigate('/login?error=no_session', { replace: true });
            return;
          }
        } catch (error: any) {
          console.error('OAuth exchange exception:', error);
          hasNavigated = true;
          navigate(`/login?error=${encodeURIComponent(error?.message || 'exchange_exception')}`, { replace: true });
          return;
        }
      }

      // Hash-based OAuth flow (detectSessionInUrl handles this automatically)
      // Listen for auth state changes to know when session is ready
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state change:', event, session ? 'has session' : 'no session');
        
        if (event === 'SIGNED_IN' && session) {
          console.log('✅ Signed in:', {
            user: session.user?.email,
            expiresAt: session.expires_at,
          });
          hasNavigated = true;
          if (timeoutId) clearTimeout(timeoutId);
          navigate('/', { replace: true });
        } else if (event === 'SIGNED_OUT') {
          console.log('Signed out');
          hasNavigated = true;
          if (timeoutId) clearTimeout(timeoutId);
          navigate('/login', { replace: true });
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('Token refreshed');
          hasNavigated = true;
          if (timeoutId) clearTimeout(timeoutId);
          navigate('/', { replace: true });
        }
      });

      // Also check current session immediately in case auth already completed
      const checkSession = async () => {
        try {
          // Supabase's detectSessionInUrl should have processed hash-based OAuth already
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Session error:', sessionError);
          }
          
          if (session) {
            console.log('✅ Session found:', {
              user: session.user?.email,
              expiresAt: session.expires_at,
            });
            hasNavigated = true;
            if (timeoutId) clearTimeout(timeoutId);
            navigate('/', { replace: true });
            return;
          }
          
          // If no session yet, wait a bit for OAuth token exchange to complete
          timeoutId = setTimeout(async () => {
            if (hasNavigated) return;
            
            try {
              const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession();
              
              if (retryError) {
                console.error('Retry session error:', retryError);
              }
              
              if (retrySession) {
                console.log('✅ Session found on retry');
                hasNavigated = true;
                navigate('/', { replace: true });
              } else {
                // Still no session after delay - likely a failed OAuth flow
                console.warn('❌ No session established after OAuth callback');
                console.warn('Current URL:', window.location.href);
                console.warn('Hash:', window.location.hash);
                console.warn('Search:', window.location.search);
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
    };

    exchangeCode();
  }, [navigate, searchParams]);

  return <LoadingScreen message="Connexion en cours..." />;
};

export default AuthCallback;
