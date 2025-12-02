/**
 * Supabase client configuration
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Enhanced debug logging for Supabase configuration
console.log('[Supabase] Configuration Details:');
console.log('  - Full URL:', supabaseUrl);
console.log('  - URL is set:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('  - Anon key is set:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('  - Expected project ref: vuanulvyqkfefmjcikfk');

// Extract and validate project reference (inline to avoid import dependencies at startup)
const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || 'unknown';
console.log('  - Detected project ref:', projectRef);

// Check for wrong project
if (supabaseUrl.includes('kihxqurnmyxnsyqgpdaw')) {
  console.error('❌ WRONG SUPABASE PROJECT DETECTED!');
  console.error('   Current: kihxqurnmyxnsyqgpdaw');
  console.error('   Expected: vuanulvyqkfefmjcikfk');
  console.error('   Action: Update VITE_SUPABASE_URL to: https://vuanulvyqkfefmjcikfk.supabase.co');
  console.error('   Platforms: Check Netlify and Vercel environment variables');
} else if (projectRef === 'vuanulvyqkfefmjcikfk') {
  console.log('✅ Using correct Supabase project: vuanulvyqkfefmjcikfk');
} else if (supabaseUrl.includes('demo.supabase.co')) {
  console.warn('⚠️ Using demo Supabase URL - features will be limited');
} else {
  console.warn('⚠️ Using unexpected Supabase project:', projectRef);
  console.warn('   Expected: vuanulvyqkfefmjcikfk');
}

// Warn about missing credentials but don't crash
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Missing Supabase credentials! Using demo mode.');
  console.warn('   Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper functions

/**
 * Get current user session
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) return { data: null, error };

  // Create user profile
  if (data.user) {
    const { error: profileError } = await supabase.from('user_profiles').insert({
      id: data.user.id,
      username,
      display_name: username,
      email: email,
    });

    if (profileError) return { data: null, error: profileError };
  }

  return { data, error: null };
}

/**
 * Sign out
 */
export async function signOut() {
  return await supabase.auth.signOut();
}

/**
 * Sign in with Google OAuth
 * Explicitly redirects to /auth/callback after OAuth completes
 */
export async function signInWithGoogle() {
  const redirectTo = `${window.location.origin}/auth/callback`;
  console.log('[Supabase OAuth] Redirect URL:', redirectTo);
  console.log('[Supabase OAuth] Supabase URL:', supabaseUrl);
  
  try {
    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    console.log('[Supabase OAuth] Result:', result);
    return result;
  } catch (error) {
    console.error('[Supabase OAuth] Exception:', error);
    throw error;
  }
}

/**
 * Upload file to storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) return { url: null, error };

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return { url: publicUrl, error: null };
}

/**
 * Delete file from storage
 */
export async function deleteFile(bucket: string, path: string) {
  return await supabase.storage.from(bucket).remove([path]);
}

/**
 * Subscribe to realtime changes
 */
export function subscribeToTable<T>(
  table: string,
  callback: (payload: T) => void,
  filter?: string
) {
  const channel = supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        filter,
      },
      (payload) => callback(payload.new as T)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
