/**
 * Centralized API Service for Zyeuté
 * All data fetching functions are centralized here for maintainability and consistency
 */

import { supabase } from '@/lib/supabase';
import type { Post, User, Story } from '@/types';

/**
 * Gets the currently authenticated user's profile data
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error('Error fetching current user:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Fetches feed posts with user details and handles pagination
 */
export async function getFeedPosts(page: number = 0, limit: number = 20): Promise<Post[]> {
  try {
    const start = page * limit;
    const end = start + limit - 1;

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:users(*)
      `)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      console.error('Error fetching feed posts:', error);
      return [];
    }

    return (data || []) as Post[];
  } catch (error) {
    console.error('Error in getFeedPosts:', error);
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
    let query;

    if (usernameOrId === 'me' && currentUserId) {
      query = supabase
        .from('users')
        .select('*')
        .eq('id', currentUserId)
        .single();
    } else {
      query = supabase
        .from('users')
        .select('*')
        .eq('username', usernameOrId)
        .single();
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}

/**
 * Gets all posts for a specific user
 */
export async function getUserPosts(userId: string): Promise<Post[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user:users(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user posts:', error);
      return [];
    }

    return (data || []) as Post[];
  } catch (error) {
    console.error('Error in getUserPosts:', error);
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
    const { data, error } = await supabase
      .from('stories')
      .select('*, user:users(*)')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stories:', error);
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
        .from('users')
        .select('*')
        .eq('id', currentUserId)
        .single();

      if (currentUserData) {
        return [{ user: currentUserData as User }, ...storyList];
      }
    }

    return storyList;
  } catch (error) {
    console.error('Error in getStories:', error);
    return [];
  }
}

/**
 * Checks if a user is following another user
 */
export async function checkFollowing(followerId: string, followingId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" which is expected
      console.error('Error checking follow status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in checkFollowing:', error);
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
    if (isFollowing) {
      // Unfollow: delete the follow record
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      if (error) {
        console.error('Error unfollowing user:', error);
        return false;
      }
    } else {
      // Follow: insert a new follow record
      const { error } = await supabase.from('follows').insert({
        follower_id: followerId,
        following_id: followingId,
      });

      if (error) {
        console.error('Error following user:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in toggleFollow:', error);
    return false;
  }
}

/**
 * Toggles fire (like) status for a post
 */
export async function togglePostFire(postId: string, userId: string): Promise<boolean> {
  try {
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
        console.error('Error removing fire:', error);
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
        console.error('Error adding fire:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in togglePostFire:', error);
    return false;
  }
}

