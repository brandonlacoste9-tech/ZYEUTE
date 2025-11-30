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
    // Listen for auth state changes to know when session is ready
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Successful login - redirect to home
        navigate('/', { replace: true });
      } else if (event === 'SIGNED_OUT' || !session) {
        // No session or signed out - redirect to login
        navigate('/login', { replace: true });
      }
    });

    // Also check current session immediately in case auth already completed
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login', { replace: true });
      }
    };

    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return <LoadingScreen message="Connexion en cours..." />;
};

export default AuthCallback;
