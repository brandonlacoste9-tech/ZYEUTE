/**
 * Profile Page - Premium Quebec Heritage Design
 * Luxury leather profile with gold stats and stitched sections
 */

import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { formatNumber } from '@/lib/utils';
import type { User, Post } from '@/types';

export const Profile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [user, setUser] = React.useState<User | null>(null);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'posts' | 'fires' | 'saved'>('posts');

  const isOwnProfile = slug === 'me' || user?.id === currentUser?.id;

  // Fetch current user
  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (data) setCurrentUser(data);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch profile user
  React.useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        let query;

        if (slug === 'me' && currentUser) {
          query = supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();
        } else {
          query = supabase
            .from('users')
            .select('*')
            .eq('username', slug)
            .single();
        }

        const { data, error } = await query;

        if (error) throw error;
        if (data) setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchUser();
    }
  }, [slug, currentUser, navigate]);

  // Fetch user posts
  React.useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('posts')
        .select('*, user:users(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setPosts(data);
    };

    fetchPosts();
  }, [user]);

  // Check if following
  React.useEffect(() => {
    const checkFollowing = async () => {
      if (!user || !currentUser || isOwnProfile) return;

      const { data } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', currentUser.id)
        .eq('following_id', user.id)
        .single();

      setIsFollowing(!!data);
    };

    checkFollowing();
  }, [user, currentUser, isOwnProfile]);

  const handleFollow = async () => {
    if (!user || !currentUser) return;

    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUser.id)
        .eq('following_id', user.id);
      setIsFollowing(false);
    } else {
      await supabase
        .from('follows')
        .insert({
          follower_id: currentUser.id,
          following_id: user.id,
        });
      setIsFollowing(true);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-black leather-overlay flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black leather-overlay pb-20">
      <Header title={user.username} showBack={true} showSearch={false} />

      {/* Profile Header - Premium Leather Design */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Avatar & Stats Section */}
        <div className="leather-card rounded-2xl p-6 mb-4 stitched">
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                src={user.avatar_url}
                size="2xl"
                isVerified={user.verified}
                className="ring-4 ring-gold-500/50 glow-gold"
              />
              {user.verified && (
                <div className="absolute -bottom-2 -right-2 bg-gold-500 rounded-full p-2 glow-gold">
                  <svg className="w-4 h-4 text-leather-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-gold-400 embossed">
                    {formatNumber(user.posts_count || 0)}
                  </div>
                  <div className="text-leather-300 text-xs font-medium">Posts</div>
                </div>
                <button className="text-center hover:scale-105 transition-transform">
                  <div className="text-2xl font-black text-gold-400 embossed">
                    {formatNumber(user.followers_count || 0)}
                  </div>
                  <div className="text-leather-300 text-xs font-medium">Abonnés</div>
                </button>
                <button className="text-center hover:scale-105 transition-transform">
                  <div className="text-2xl font-black text-gold-400 embossed">
                    {formatNumber(user.following_count || 0)}
                  </div>
                  <div className="text-leather-300 text-xs font-medium">Abonnements</div>
                </button>
              </div>

              {/* Action Buttons */}
              {isOwnProfile ? (
                <div className="flex gap-2">
                  <Link to="/settings" className="flex-1">
                    <button className="w-full btn-leather py-2 rounded-xl font-semibold">
                      Modifier le profil
                    </button>
                  </Link>
                  <Link to="/premium" className="flex-1">
                    <button className="w-full btn-gold py-2 rounded-xl font-semibold">
                      ⚜️ VIP
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleFollow}
                    className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
                      isFollowing
                        ? 'btn-leather'
                        : 'btn-gold glow-gold'
                    }`}
                  >
                    {isFollowing ? 'Abonné' : 'S\'abonner'}
                  </button>
                  <button className="btn-leather px-4 py-2 rounded-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white embossed">
                {user.display_name || user.username}
              </h2>
              {user.verified && (
                <span className="text-gold-500 text-lg">✓</span>
              )}
            </div>

            {user.bio && (
              <p className="text-leather-100 text-sm leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Location & Region */}
            {(user.city || user.region) && (
              <div className="flex items-center gap-2 text-leather-300 text-sm">
                <span className="text-gold-500">📍</span>
                <span>
                  {user.city && user.region ? `${user.city}, ${user.region}` : user.city || user.region}
                </span>
              </div>
            )}

            {/* Fire Score */}
            {user.fire_score > 0 && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-3 py-1.5 rounded-full border border-orange-500/30">
                <span className="text-orange-400 text-lg">🔥</span>
                <span className="text-orange-300 font-bold text-sm">
                  {formatNumber(user.fire_score)} Fire Score
                </span>
              </div>
            )}

            {/* Coins */}
            {isOwnProfile && user.coins > 0 && (
              <div className="inline-flex items-center gap-2 bg-gold-500/10 px-3 py-1.5 rounded-full border border-gold-500/30 ml-2">
                <span className="text-gold-400">💰</span>
                <span className="text-gold-300 font-bold text-sm">
                  {formatNumber(user.coins)} Cennes
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="leather-card rounded-2xl mb-4 stitched overflow-hidden">
          <div className="grid grid-cols-3 bg-leather-900/50">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 font-semibold transition-all relative ${
                activeTab === 'posts'
                  ? 'text-gold-400'
                  : 'text-leather-300 hover:text-gold-200'
              }`}
            >
              <span className="relative z-10">Posts</span>
              {activeTab === 'posts' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-gradient glow-gold" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('fires')}
              className={`py-4 font-semibold transition-all relative ${
                activeTab === 'fires'
                  ? 'text-gold-400'
                  : 'text-leather-300 hover:text-gold-200'
              }`}
            >
              <span className="relative z-10">🔥 Fires</span>
              {activeTab === 'fires' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-gradient glow-gold" />
              )}
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('saved')}
                className={`py-4 font-semibold transition-all relative ${
                  activeTab === 'saved'
                    ? 'text-gold-400'
                    : 'text-leather-300 hover:text-gold-200'
                }`}
              >
                <span className="relative z-10">Sauvegardés</span>
                {activeTab === 'saved' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-gradient glow-gold" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="leather-card rounded-2xl p-12 text-center stitched">
            <div className="text-6xl mb-4">🦫</div>
            <h3 className="text-xl font-bold text-gold-500 mb-2">
              {isOwnProfile ? 'Aucun post encore' : 'Aucun post'}
            </h3>
            <p className="text-leather-300 mb-6">
              {isOwnProfile
                ? 'Commence à partager ton contenu québécois!'
                : `${user.display_name || user.username} n'a pas encore posté.`}
            </p>
            {isOwnProfile && (
              <Link to="/upload">
                <button className="btn-gold px-8 py-3 rounded-xl">
                  Créer un post
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="relative aspect-square leather-card rounded-xl overflow-hidden stitched-subtle hover:scale-105 transition-transform group"
              >
                <img
                  src={post.thumbnail_url || post.media_url}
                  alt={post.caption || 'Post'}
                  className="w-full h-full object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1 text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    <span className="font-bold">{formatNumber(post.fire_count)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-bold">{formatNumber(post.comment_count)}</span>
                  </div>
                </div>
                {/* Gold corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-gold-gradient opacity-20" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quebec Pride Footer */}
      <div className="text-center py-8 text-leather-400 text-sm">
        <p className="flex items-center justify-center gap-2">
          <span className="text-gold-500">⚜️</span>
          <span>Créateur québécois</span>
          <span className="text-gold-500">🇨🇦</span>
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
