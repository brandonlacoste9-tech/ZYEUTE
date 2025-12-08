/**
 * Centralized API Service for Zyeuté
 * All data fetching functions are centralized here for maintainability and consistency
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import type { Post, User, Story } from '@/types';

const apiLogger = logger.withContext('API');

/**
 * Gets the currently authenticated user's profile data
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return null;

    // Try to fetch existing profile
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    // If profile exists, return it
    if (data && !error) {
      return data as User;
    }

    // If profile doesn't exist (error code PGRST116 = not found), create it
    if (error && error.code === 'PGRST116') {
      apiLogger.info('Profile not found, creating new profile for user:', authUser.id);

      // Extract username from email or use a default
      const email = authUser.email || '';
      const username = email.split('@')[0] || `user_${authUser.id.slice(0, 8)}`;
      const displayName =
        authUser.user_metadata?.full_name || authUser.user_metadata?.name || username;

      // Create the profile
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          id: authUser.id,
          username: username,
          display_name: displayName,
          email: email,
          avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
        })
        .select()
        .single();

      if (createError) {
        apiLogger.error('Error creating profile:', createError);
        return null;
      }

      apiLogger.info('Profile created successfully');
      return newProfile as User;
    }

    // Other errors
    apiLogger.error('Error fetching current user:', error);
    return null;
  } catch (error) {
    apiLogger.error('Error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Fetches feed posts with user details and handles pagination
 */
export async function getFeedPosts(page: number = 0, limit: number = 20): Promise<Post[]> {
  try {
    const supabase = createClient();
    const start = page * limit;
    const end = start + limit - 1;

    apiLogger.debug('Starting query:', { page, limit, start, end });

    // Query publications directly instead of posts view to avoid RLS/view issues
    const { data, error } = await supabase
      .from('publications')
      .select(
        `
        *,
        user:user_profiles!user_id(*)
      `
      )
      .eq('visibilite', 'public') // Only show public posts
      .is('est_masque', null) // Not hidden
      .is('deleted_at', null) // Not deleted
      .order('created_at', { ascending: false })
      .range(start, end);

    apiLogger.debug('Query result:', {
      dataCount: data?.length || 0,
      error: error?.message || null,
      firstItem: data?.[0],
    });

    if (error) {
      apiLogger.error('Supabase error:', error);
      apiLogger.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return [];
    }

    if (!data || data.length === 0) {
      apiLogger.warn('No data returned from query');
      return [];
    }

    // Map publications columns to Post type (handle column name differences)
    const posts = (data || []).map((pub: any) => {
      const mapped = {
        id: pub.id,
        user_id: pub.user_id,
        type: pub.media_url?.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'photo', // Infer type from media_url
        media_url: pub.media_url || '',
        caption: pub.content || null, // Map content to caption
        hashtags: null, // TODO: Extract from content or join hashtags table
        region: null, // TODO: Map from region field if exists
        city: null, // TODO: Map from city field if exists
        fire_count: pub.reactions_count || 0,
        comment_count: pub.comments_count || 0,
        created_at: pub.created_at,
        user: pub.user, // Already joined
        // Keep original fields for compatibility
        ...pub,
        visibility: pub.visibilite,
        is_hidden: pub.est_masque,
      };
      apiLogger.debug('Mapped post:', {
        id: mapped.id,
        caption: mapped.caption,
        user: mapped.user?.username,
      });
      return mapped;
    }) as Post[];

    apiLogger.debug('Returning posts:', posts.length);
    return posts;
  } catch (error) {
    apiLogger.error('Exception:', error);
    apiLogger.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return [];
  }
}

/**
 * Gets a user profile by username or ID
 * Handles both 'me' (current user) and username lookups
 */
export async function getUserProfile(
  usernameOrId: string,
  currentUserId?: string
): Promise<User | null> {
  try {
    const supabase = createClient();
    let query;

    if (usernameOrId === 'me' && currentUserId) {
      query = supabase.from('user_profiles').select('*').eq('id', currentUserId).single();
    } else {
      query = supabase.from('user_profiles').select('*').eq('username', usernameOrId).single();
    }

    const { data, error } = await query;

    if (error) {
      apiLogger.error('Error fetching user profile:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    apiLogger.error('Error in getUserProfile:', error);
    return null;
  }
}

/**
 * Gets a single post by ID
 */
export async function getPostById(postId: string): Promise<Post | null> {
  try {
    const supabase = createClient();
    // Query publications directly instead of posts view
    const { data, error } = await supabase
      .from('publications')
      .select('*, user:user_profiles!user_id(*)')
      .eq('id', postId)
      .is('deleted_at', null)
      .single();

    if (error || !data) {
      apiLogger.error('Error:', error);
      return null;
    }

    // Map publications columns to Post type
    return {
      id: data.id,
      user_id: data.user_id,
      type: data.media_url?.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'photo',
      media_url: data.media_url || '',
      caption: data.content || null,
      hashtags: null,
      region: null,
      city: null,
      fire_count: data.reactions_count || 0,
      comment_count: data.comments_count || 0,
      created_at: data.created_at,
      user: data.user,
      ...data,
      visibility: data.visibilite,
      is_hidden: data.est_masque,
    } as Post;
  } catch (error) {
    apiLogger.error('Exception:', error);
    return null;
  }
}

/**
 * Gets all posts for a specific user
 */
export async function getUserPosts(userId: string): Promise<Post[]> {
  try {
    const supabase = createClient();
    // Query publications directly instead of posts view to avoid RLS/view issues
    const { data, error } = await supabase
      .from('publications')
      .select('*, user:user_profiles!user_id(*)')
      .eq('user_id', userId)
      .is('deleted_at', null) // Not deleted
      .order('created_at', { ascending: false });

    if (error) {
      apiLogger.error('Supabase error:', error);
      return [];
    }

    // Map publications columns to Post type
    const posts = (data || []).map((pub: any) => ({
      id: pub.id,
      user_id: pub.user_id,
      type: pub.media_url?.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'photo',
      media_url: pub.media_url || '',
      caption: pub.content || null,
      hashtags: null,
      region: null,
      city: null,
      fire_count: pub.reactions_count || 0,
      comment_count: pub.comments_count || 0,
      created_at: pub.created_at,
      user: pub.user,
      ...pub,
      visibility: pub.visibilite,
      is_hidden: pub.est_masque,
    })) as Post[];

    return posts;
  } catch (error) {
    apiLogger.error('[getUserPosts] Exception:', error);
    return [];
  }
}

/**
 * Fetches active stories with user details
 */
export async function getStories(
  currentUserId?: string
): Promise<Array<{ user: User; story?: Story; isViewed?: boolean }>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('stories')
      .select('*, user:user_profiles!user_id(*)')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      apiLogger.error('Error fetching stories:', error);
      return [];
    }

    if (!data) return [];

    // Group stories by user and create story map
    const storyMap = new Map<string, { user: User; story: Story; isViewed: boolean }>();

    data.forEach((story) => {
      if (story.user && !storyMap.has(story.user.id)) {
        storyMap.set(story.user.id, {
          user: story.user as User,
          story: story as Story,
          isViewed: false,
        });
      }
    });

    const storyList = Array.from(storyMap.values());

    // If current user exists, prioritize their story first
    if (currentUserId) {
      const userStory = storyList.find((s) => s.user.id === currentUserId);
      if (userStory) {
        return [userStory, ...storyList.filter((s) => s.user.id !== currentUserId)];
      }
      // If current user has no story, add them to the beginning
      const { data: currentUserData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', currentUserId)
        .single();

      if (currentUserData) {
        return [{ user: currentUserData as User }, ...storyList];
      }
    }

    return storyList;
  } catch (error) {
    apiLogger.error('Error in getStories:', error);
    return [];
  }
}

/**
 * Checks if a user is following another user
 */
export async function checkFollowing(followerId: string, followingId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" which is expected
      apiLogger.error('Error checking follow status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    apiLogger.error('Error in checkFollowing:', error);
    return false;
  }
}

/**
 * Toggles follow status between two users
 */
export async function toggleFollow(
  followerId: string,
  followingId: string,
  isFollowing: boolean
): Promise<boolean> {
  try {
    const supabase = createClient();
    if (isFollowing) {
      // Unfollow: delete the follow record
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      if (error) {
        apiLogger.error('Error unfollowing user:', error);
        return false;
      }
    } else {
      // Follow: insert a new follow record
      const { error } = await supabase.from('follows').insert({
        follower_id: followerId,
        following_id: followingId,
      });

      if (error) {
        apiLogger.error('Error following user:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    apiLogger.error('Error in toggleFollow:', error);
    return false;
  }
}

/**
 * Toggles fire (like) status for a post
 */
export async function togglePostFire(postId: string, userId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    // Check if user already fired this post
    const { data: existingFire } = await supabase
      .from('fires')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingFire) {
      // Remove fire
      const { error } = await supabase
        .from('fires')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (error) {
        apiLogger.error('Error removing fire:', error);
        return false;
      }
    } else {
      // Add fire
      const { error } = await supabase.from('fires').insert({
        post_id: postId,
        user_id: userId,
        fire_level: 1,
      });

      if (error) {
        apiLogger.error('Error adding fire:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    apiLogger.error('Error in togglePostFire:', error);
    return false;
  }
}
