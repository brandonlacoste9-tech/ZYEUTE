/**
 * Video Card Component - Premium Leather Design
 * Stitched leather frame with gold accents
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../Avatar';
import { VideoPlayer } from './VideoPlayer';
import type { Post, User } from '../../types';

interface VideoCardProps {
  post: Post;
  user: User;
  autoPlay?: boolean;
  muted?: boolean;
  onFireToggle?: (postId: string, currentFire: number) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  post,
  user,
  autoPlay = false,
  muted = true,
  onFireToggle,
  onComment,
  onShare,
}) => {
  const [isLiked, setIsLiked] = React.useState(false);

  const handleFire = () => {
    setIsLiked(!isLiked);
    onFireToggle?.(post.id, post.fire_count);
  };

  return (
    <div className="leather-card rounded-2xl overflow-hidden stitched hover:scale-[1.01] transition-all duration-300 group shadow-xl">
      {/* User Header */}
      <div className="p-3 flex items-center gap-3 border-b border-neutral-800 bg-black/20">
        <Link to={`/profile/${user.username}`} className="relative">
          <div className="absolute inset-0 rounded-full border border-gold-500/30 blur-[1px]"></div>
          <Avatar
            src={user.avatar_url}
            size="md"
            isVerified={user.verified}
            className="ring-2 ring-gold-500/20"
          />
        </Link>
        <div className="flex-1">
          <Link
            to={`/profile/${user.username}`}
            className="font-bold text-stone-200 hover:text-gold-400 transition-colors flex items-center gap-1"
          >
            {user.display_name || user.username}
            {user.verified && <span className="text-gold-500 drop-shadow-[0_0_2px_rgba(255,191,0,0.5)]">✓</span>}
          </Link>
          {post.region && (
            <p className="text-stone-500 text-xs flex items-center gap-1">
              <span>📍</span>
              <span>{post.city || post.region}</span>
            </p>
          )}
        </div>
        <button className="text-stone-500 hover:text-gold-500 transition-colors p-2 rounded-full hover:bg-gold-500/5">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Video Player */}
      <div className="relative bg-black aspect-[4/5] md:aspect-video">
        <VideoPlayer
          src={post.media_url}
          thumbnail={post.thumbnail_url}
          autoPlay={autoPlay}
          muted={muted}
          loop
        />
        
        {/* Gold accent lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      </div>

      {/* Actions Bar */}
      <div className="p-4 space-y-3 bg-neutral-900/50">
        {/* Fire, Comment, Share */}
        <div className="flex items-center gap-5">
          <button
            onClick={handleFire}
            className={`flex items-center gap-2 transition-all ${
              isLiked ? 'text-orange-500 scale-110 drop-shadow-[0_0_8px_rgba(255,100,0,0.5)]' : 'text-stone-400 hover:text-gold-500'
            }`}
          >
            <svg className="w-7 h-7" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
            <span className="font-bold text-lg font-mono">{post.fire_count}</span>
          </button>

          <button
            onClick={() => onComment?.(post.id)}
            className="flex items-center gap-2 text-stone-400 hover:text-gold-500 transition-colors"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-bold text-lg font-mono">{post.comment_count}</span>
          </button>

          <button
            onClick={() => onShare?.(post.id)}
            className="flex items-center gap-2 text-stone-400 hover:text-gold-500 transition-colors"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>

          <div className="flex-1" />

          <button className="text-stone-400 hover:text-gold-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="text-stone-300 text-sm leading-relaxed">
            <Link to={`/profile/${user.username}`} className="font-bold text-gold-400 hover:text-gold-300 mr-2">
              {user.username}
            </Link>
            <span className="text-stone-300">{post.caption}</span>
          </div>
        )}

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.hashtags.map((tag, i) => (
              <Link
                key={i}
                to={`/explore?tag=${tag}`}
                className="text-gold-500/80 hover:text-gold-400 text-xs font-medium transition-colors bg-gold-500/5 px-2 py-1 rounded-md border border-gold-500/10 hover:border-gold-500/30"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-stone-600 text-[10px] uppercase tracking-wider font-medium pt-2">
          {new Date(post.created_at).toLocaleDateString('fr-CA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
