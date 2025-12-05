/**
 * Feed Page - Premium Quebec Heritage Design
 * Leather post cards with gold accents and stitching
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ChatButton } from '@/components/ChatButton';
import { GoldButton } from '@/components/GoldButton';
import { SectionHeader } from '@/components/SectionHeader';
import { StoryCarousel } from '@/components/features/StoryCircle';
import { VideoCard } from '@/components/features/VideoCard';
import { getCurrentUser, getFeedPosts, getStories } from '@/services/api';
import type { Post, User, Story } from '@/types';

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
      const user = await getCurrentUser();
      if (user) setCurrentUser(user);
    };

    fetchCurrentUser();
  }, []);

  // Fetch posts
  const fetchPosts = React.useCallback(async (pageNum: number) => {
    setIsLoading(true);
    try {
      const data = await getFeedPosts(pageNum, 20);

      if (pageNum === 0) {
        setPosts(data);
      } else {
        setPosts(prev => [...prev, ...data]);
      }
      setHasMore(data.length === 20);
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
        const storyList = await getStories(currentUser?.id);
        setStories(storyList);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
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

  // Handle fire toggle
  const handleFireToggle = React.useCallback(async (postId: string, currentFire: number) => {
    try {
      // TODO: Implement API call to toggle fire
      console.log('Fire toggled for post:', postId, 'Current fire count:', currentFire);
      // For now, just log - will be implemented with API
    } catch (error) {
      console.error('Error toggling fire:', error);
    }
  }, []);

  // Handle comment
  const handleComment = React.useCallback((postId: string) => {
    // Navigate to post detail page for comments
    window.location.href = `/p/${postId}`;
  }, []);

  // Handle share
  const handleShare = React.useCallback(async (postId: string) => {
    try {
      const url = `${window.location.origin}/p/${postId}`;
      if (navigator.share) {
        await navigator.share({
          title: 'Regarde ça sur Zyeuté!',
          url: url,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url);
        alert('Lien copié dans le presse-papiers! 📋');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, []);

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

      {/* Recent Stories Section */}
      {stories.length > 0 && (
        <>
          <SectionHeader title="Recent Stories" />
          <div className="border-b border-neutral-800 py-4 bg-black/20 backdrop-blur-sm">
            <StoryCarousel stories={stories} />
          </div>
        </>
      )}

      {/* Videos Section - Horizontal Scroll */}
      {posts.length > 0 && (
        <>
          <SectionHeader title="Videos" showArrow linkTo="/explore" />
          <div className="flex overflow-x-auto gap-4 px-4 pb-6 scrollbar-hide">
            {posts.slice(0, 10).map((post, index) => (
              <div
                key={`h-${post.id}`}
                className="animate-fade-in-up flex-shrink-0"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'both',
                }}
              >
                <VideoCard
                  post={post}
                  user={post.user}
                  variant="horizontal"
                  autoPlay={false}
                  muted={true}
                  onFireToggle={handleFireToggle}
                  onComment={handleComment}
                  onShare={handleShare}
                />
              </div>
            ))}
            {/* Padding at end for better scroll UX */}
            <div className="flex-shrink-0 w-2" />
          </div>
        </>
      )}

      {/* Latest Hitants Section - Vertical Feed */}
      <SectionHeader title="Latest Hitants" />
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
                  <Link to="/explore">
                    <GoldButton className="px-8 py-3 rounded-xl" size="lg">
                      Découvrir des créateurs
                    </GoldButton>
                  </Link>
          </div>
        ) : (
          <>
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both',
                }}
              >
                <VideoCard
                  post={post}
                  user={post.user}
                  autoPlay={false}
                  muted={true}
                  onFireToggle={handleFireToggle}
                  onComment={handleComment}
                  onShare={handleShare}
                />
              </div>
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

      {/* Premium Chat Button */}
      <ChatButton isFixed={true} />

      <BottomNav />
    </div>
  );
};

export default Feed;
