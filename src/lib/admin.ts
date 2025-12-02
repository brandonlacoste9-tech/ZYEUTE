/**
 * Admin role checking utilities
 * Checks both user_profiles.is_admin and auth.users metadata for admin role
 */

import { supabase } from './supabase';
import { logger } from './logger';

const adminLogger = logger.withContext('Admin');

/**
 * Check if current user is an admin
 * Checks both user_profiles.is_admin and auth.users metadata
 */
export async function checkIsAdmin(): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      adminLogger.debug('No authenticated user');
      return false;
    }

    // Method 1: Check user_profiles.is_admin field
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profileError && profile?.is_admin === true) {
      adminLogger.debug('Admin status confirmed via user_profiles.is_admin');
      return true;
    }

    // Method 2: Check auth.users metadata for role='admin'
    const userRole = user.user_metadata?.role || user.app_metadata?.role;
    if (userRole === 'admin') {
      adminLogger.debug('Admin status confirmed via auth metadata');
      return true;
    }

    // Method 3: Check raw_user_meta_data (for RLS policies compatibility)
    const rawRole = (user.user_metadata as any)?.role;
    if (rawRole === 'admin') {
      adminLogger.debug('Admin status confirmed via raw_user_meta_data');
      return true;
    }

    adminLogger.debug('User is not an admin');
    return false;
  } catch (error) {
    adminLogger.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get admin status with user details
 * Returns both admin status and user object
 */
export async function getAdminStatus(): Promise<{
  isAdmin: boolean;
  user: any | null;
}> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { isAdmin: false, user: null };
    }

    const isAdmin = await checkIsAdmin();
    return { isAdmin, user };
  } catch (error) {
    adminLogger.error('Error getting admin status:', error);
    return { isAdmin: false, user: null };
  }
}

/**
 * Hook-friendly admin check that returns loading state
 */
export async function useAdminCheck(): Promise<{
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
}> {
  try {
    const isAdmin = await checkIsAdmin();
    return { isAdmin, isLoading: false, error: null };
  } catch (error) {
    return {
      isAdmin: false,
      isLoading: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

