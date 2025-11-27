/**
 * Feed Page - Premium Quebec Heritage Design
 * Leather post cards with gold accents and stitching
 */

import React from 'react';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { StoryCarousel } from '../components/features/StoryCircle';
import { VideoCard } from '../components/features/VideoCard';
import { supabase } from '../lib/supabase';
import type { Post, User, Story } from '../types';
import { Link } from 'react-router-dom';

export const Feed: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [stories, setStories] = React.useState<Array<{ user: User; story?: Story; isViewed?: boolean }>>([]);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(0);

  // Fetch current user
  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) setCurrentUser(data);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch posts
  const fetchPosts = React.useCallback(async (pageNum: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:users(*)
        `)
        .order('created_at', { ascending: false })
        .range(pageNum * 20, (pageNum + 1) * 20 - 1);

      if (error) throw error;

      if (data) {
        if (pageNum === 0) {
          setPosts(data);
        } else {
          setPosts(prev => [...prev, ...data]);
        }
        setHasMore(data.length === 20);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch stories
  React.useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('stories')
          .select('*, user:users(*)')
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching stories:', error);
          return;
        }

        if (data) {
          const storyMap = new Map<string, { user: User; story: Story; isViewed: boolean }>();
          
          data.forEach((story) => {
            if (story.user && !storyMap.has(story.user.id)) {
              storyMap.set(story.user.id, {
                user: story.user,
                story: story,
                isViewed: false,
              });
            }
          });

          const storyList = Array.from(storyMap.values());
          
          if (currentUser) {
            const userStory = storyList.find(s => s.user.id === currentUser.id);
            if (userStory) {
              setStories([userStory, ...storyList.filter(s => s.user.id !== currentUser.id)]);
            } else {
              setStories([{ user: currentUser }, ...storyList]);
            }
          } else {
            setStories(storyList);
          }
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    if (currentUser) {
      fetchStories();
    }
  }, [currentUser]);

  // Initial fetch
  React.useEffect(() => {
    fetchPosts(0);
  }, [fetchPosts]);

  // Load more on scroll
  const handleScroll = React.useCallback(() => {
    if (isLoading || !hasMore) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 1000) {
      setPage(prev => prev + 1);
      fetchPosts(page + 1);
    }
  }, [isLoading, hasMore, page, fetchPosts]);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="min-h-screen bg-black leather-overlay pb-20">
      {/* Premium Header with leather texture */}
      <div className="sticky top-0 z-30 bg-neutral-900/95 backdrop-blur-md border-b border-gold-500/30 shadow-lg shadow-black/50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-gold-400 embossed tracking-tight drop-shadow-sm">
              Zyeuté
            </h1>
            <div className="flex items-center gap-3">
              <Link
                to="/notifications"
                className="relative text-stone-400 hover:text-gold-400 transition-colors group"
              >
                <svg className="w-6 h-6 group-hover:drop-shadow-[0_0_5px_rgba(255,191,0,0.5)] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border border-gold-500 text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                  3
                </span>
              </Link>
              <Link
                to="/premium"
                className="bg-gradient-to-r from-gold-400 to-gold-600 text-black text-[10px] font-black px-2 py-1 rounded-md shadow-[0_0_10px_rgba(255,191,0,0.3)] hover:shadow-[0_0_15px_rgba(255,191,0,0.5)] transition-all"
              >
                VIP
              </Link>
            </div>
          </div>
        </div>
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold-500/20" />
        <div className="absolute bottom-[2px] left-0 right-0 border-b border-dashed border-gold-500/30 opacity-50" />
      </div>

      {/* Stories Carousel */}
      {stories.length > 0 && (
        <div className="border-b border-neutral-800 py-4 bg-black/20 backdrop-blur-sm">
          <StoryCarousel stories={stories} />
        </div>
      )}

      {/* Feed Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {isLoading && posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(255,191,0,0.2)]" />
            <p className="text-stone-400 font-medium">Chargement du feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="leather-card rounded-2xl p-12 text-center stitched">
            <div className="text-6xl mb-4 animate-bounce">🦫</div>
            <h3 className="text-xl font-bold text-gold-400 mb-2 embossed">Bienvenue sur Zyeuté!</h3>
            <p className="text-stone-400 mb-6">
              Commence à suivre des créateurs québécois pour voir leur contenu ici!
            </p>
            <Link
              to="/explore"
              className="btn-gold inline-block px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Découvrir des créateurs
            </Link>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <VideoCard
                key={post.id}
                post={post}
                user={post.user}
                autoPlay={false}
                muted={true}
              />
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center py-8">
                <button
                  onClick={() => {
                    setPage(prev => prev + 1);
                    fetchPosts(page + 1);
                  }}
                  disabled={isLoading}
                  className="btn-leather px-8 py-3 rounded-xl disabled:opacity-50 font-medium text-gold-400 border-gold-500/30"
                >
                  {isLoading ? 'Chargement...' : 'Charger plus'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quebec Pride Footer */}
      <div className="text-center py-8 text-stone-500 text-sm">
        <p className="flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-gold-500 drop-shadow-[0_0_5px_rgba(255,191,0,0.5)]">⚜️</span>
          <span>Fait au Québec, pour le Québec</span>
          <span className="text-red-500 drop-shadow-[0_0_5px_rgba(255,0,0,0.3)]">🇨🇦</span>
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Feed;
