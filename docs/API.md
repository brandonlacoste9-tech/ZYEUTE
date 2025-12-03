# Zyeuté API Documentation

Comprehensive documentation for Zyeuté components, services, hooks, and utilities.

> Generated on December 3, 2025 at 05:43 AM

## Table of Contents

- [Components](#components)
- [Services](#services)
- [Hooks](#hooks)
- [Types](#types)
- [Utilities](#utilities)

## Components

### `PageTransition`

PageTransition - Wraps individual page components with smooth transitions
Use this to wrap route elements for animated page transitions

**Source:** `src/components/AnimatedRoutes.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | No | - |

#### Exports

- **`PageTransition`**: `React.FC<PageTransitionProps>`

#### Dependencies

- `react`
- `react-router-dom`
- `framer-motion`


### `Avatar`

Avatar component with gold ring and verified badge

**Source:** `src/components/Avatar.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `src` | `string | null` | Yes | - |
| `alt` | `string` | Yes | - |
| `size` | `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'` | Yes | - |
| `isVerified` | `boolean` | Yes | - |
| `isOnline` | `boolean` | Yes | - |
| `hasStory` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |
| `onClick` | `() => void` | Yes | - |

#### Exports

- **`Avatar`**: `React.FC<AvatarProps>`

#### Dependencies

- `react`
- `../lib/utils`


### `AvatarGroup`

**Source:** `src/components/Avatar.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `src` | `string | null` | Yes | - |
| `alt` | `string` | Yes | - |
| `size` | `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'` | Yes | - |
| `isVerified` | `boolean` | Yes | - |
| `isOnline` | `boolean` | Yes | - |
| `hasStory` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |
| `onClick` | `() => void` | Yes | - |

#### Exports

- **`AvatarGroup`**: `React.FC<{
  avatars: Array<{ src?: string; alt?: string }>;
  max?: number;
  size?: AvatarProps['size'];
}>`

#### Dependencies

- `react`
- `../lib/utils`


### `BottomNav`

**Source:** `src/components/BottomNav.tsx`

#### Exports

- **`BottomNav`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `@/hooks/useHaptics`
- `../lib/utils`


### `Button`

Gold-themed Button component for Zyeuté

**Source:** `src/components/Button.tsx`

#### Exports

- **`Button`**: `any`

#### Dependencies

- `react`
- `../lib/utils`


### `PlayButton`

**Source:** `src/components/Button.tsx`

#### Exports

- **`PlayButton`**: `React.FC<{ onClick?: ()`

#### Dependencies

- `react`
- `../lib/utils`


### `FireButton`

Specialized Play Button for video thumbnails

**Source:** `src/components/Button.tsx`

#### Exports

- **`FireButton`**: `React.FC<{
  level: number;
  active?: boolean;
  onClick?: ()`

#### Dependencies

- `react`
- `../lib/utils`


### `ChatButton`

ChatButton - Premium Gold Embossed Medallion Style
Inspired by the TI-Guy Quebec CA medallion design
Circular button with embossed gold rings and black leather center

**Source:** `src/components/ChatButton.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `onClick` | `() => void` | Yes | - |
| `isFixed` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |
| `size` | `'sm' | 'md' | 'lg'` | Yes | - |

#### Exports

- **`ChatButton`**: `React.FC<ChatButtonProps>`

#### Dependencies

- `react`
- `react-icons/io5`
- `@/hooks/useHaptics`
- `./ChatModal`
- `@/lib/utils`


### `ChatModal`

ChatModal - Premium Full-Screen Chat Interface
Features TI-Guy's authentic Quebec French slang personality
Smooth slide animations and gold/leather theme

**Source:** `src/components/ChatModal.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `onClose` | `() => void` | No | - |

#### Exports

- **`ChatModal`**: `React.FC<ChatModalProps>`

#### Dependencies

- `react`
- `react-icons/io5`
- `@/hooks/useHaptics`
- `@/utils/tiGuyResponses`
- `@/types/chat`
- `@/lib/utils`


### `ColonyTriggerButton`

Colony OS Worker Bee Trigger Button
Admin-only component that allows triggering Colony OS tasks from Zyeuté UI

**Source:** `src/components/ColonyTriggerButton.tsx`

#### Exports

- **`ColonyTriggerButton`**: `React.FC`

#### Dependencies

- `react`
- `@/integrations/colony/zyeute-trigger`
- `@/lib/admin`
- `./Toast`


### `ErrorFallback`

**Source:** `src/components/ErrorBoundary.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | No | - |
| `fallback` | `React.ReactNode` | Yes | - |
| `onError` | `(error: Error` | Yes | - |
| `errorInfo` | `React.ErrorInfo) => void` | No | - |

#### Exports

- **`ErrorFallback`**: `React.FC<{ error?: Error; onRetry?: ()`

#### Dependencies

- `react`
- `../lib/logger`


### `FeedGrid`

**Source:** `src/components/FeedGrid.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `posts` | `Post[]` | No | - |
| `isLoading` | `boolean` | Yes | - |
| `hasMore` | `boolean` | Yes | - |
| `onLoadMore` | `() => void` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`FeedGrid`**: `any`

#### Dependencies

- `react`
- `./features/VideoCard`
- `../types`
- `../lib/utils`


### `GoldButton`

GoldButton - Premium Themed Button Component
Standardized gold/leather theme button with haptic feedback

**Source:** `src/components/GoldButton.tsx`

#### Exports

- **`GoldButton`**: `React.FC<GoldButtonProps>`

#### Dependencies

- `react`
- `@/hooks/useHaptics`
- `@/lib/utils`


### `GoldInput`

GoldInput - Premium Themed Input Component
Standardized input field with gold border accents and dark background

**Source:** `src/components/GoldInput.tsx`

#### Exports

- **`GoldInput`**: `any`

#### Dependencies

- `react`
- `@/lib/utils`


### `Header`

Header component with gold gradient and navigation
Updated for Leather & Gold Premium Theme

**Source:** `src/components/Header.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `showSearch` | `boolean` | Yes | - |
| `title` | `string` | Yes | - |
| `showBack` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`Header`**: `React.FC<HeaderProps>`

#### Dependencies

- `react`
- `react-router-dom`
- `../lib/utils`
- `../contexts/NotificationContext`
- `./Logo`


### `Image`

Image Component - Sharp image wrapper with responsive scaling
Enforces high-quality display and handles responsive images

**Source:** `src/components/Image.tsx`

#### Exports

- **`Image`**: `React.FC<ImageProps>`

#### Dependencies

- `react`
- `@/lib/utils`


### `LoadingScreen`

LoadingScreen - Beautiful splash/loading screen with ornate logo

**Source:** `src/components/LoadingScreen.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `message` | `string` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`LoadingScreen`**: `React.FC<LoadingScreenProps>`

#### Dependencies

- `react`
- `./Logo`
- `../lib/utils`


### `LoadingSpinner`

**Source:** `src/components/LoadingScreen.tsx`

#### Exports

- **`LoadingSpinner`**: `React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }>`

#### Dependencies

- `react`
- `./Logo`
- `../lib/utils`


### `Logo`

Zyeuté Logo Component
Glowing Gold Fleur-de-lys on Dark Leather
Quebec Heritage Luxury Design

**Source:** `src/components/Logo.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `size` | `'sm' | 'md' | 'lg' | 'xl'` | Yes | - |
| `showText` | `boolean` | Yes | - |
| `linkTo` | `string | null` | Yes | - |
| `className` | `string` | Yes | - |
| `glowing` | `boolean` | Yes | - |

#### Exports

- **`Logo`**: `React.FC<LogoProps>`

#### Dependencies

- `react`
- `react-router-dom`


### `LogoCompact`

**Source:** `src/components/Logo.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `size` | `'sm' | 'md' | 'lg' | 'xl'` | Yes | - |
| `showText` | `boolean` | Yes | - |
| `linkTo` | `string | null` | Yes | - |
| `className` | `string` | Yes | - |
| `glowing` | `boolean` | Yes | - |

#### Exports

- **`LogoCompact`**: `React.FC<{ className?: string }>`

#### Dependencies

- `react`
- `react-router-dom`


### `LogoFull`

**Source:** `src/components/Logo.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `size` | `'sm' | 'md' | 'lg' | 'xl'` | Yes | - |
| `showText` | `boolean` | Yes | - |
| `linkTo` | `string | null` | Yes | - |
| `className` | `string` | Yes | - |
| `glowing` | `boolean` | Yes | - |

#### Exports

- **`LogoFull`**: `React.FC<{ className?: string }>`

#### Dependencies

- `react`
- `react-router-dom`


### `MainLayout`

MainLayout Component - Phone-Screen Centering with Dynamic Border Lighting
Provides a centered mobile app aesthetic on desktop with customizable border glow

**Source:** `src/components/MainLayout.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | No | - |

#### Exports

- **`MainLayout`**: `React.FC<MainLayoutProps>`

#### Dependencies

- `react`
- `@/contexts/BorderColorContext`


### `SectionHeader`

SectionHeader Component - Premium Gold Themed Section Titles
Reusable header component for organizing content sections

**Source:** `src/components/SectionHeader.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `title` | `string` | No | - |
| `showArrow` | `boolean` | Yes | - |
| `onArrowClick` | `() => void` | Yes | - |
| `linkTo` | `string` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`SectionHeader`**: `React.FC<SectionHeaderProps>`

#### Dependencies

- `react`
- `react-router-dom`
- `@/lib/utils`


### `toast`

**Source:** `src/components/Toast.tsx`

#### Exports

- **`toast`**: `any`

#### Dependencies

- `./Toast`
- `react`
- `react-dom/client`


### `TransitionWrapper`

TransitionWrapper - Smooth Page Transitions
Provides fade and slide animations between routes using Framer Motion
Matches the premium gold/leather aesthetic

**Source:** `src/components/TransitionWrapper.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | No | - |

#### Exports

- **`TransitionWrapper`**: `React.FC<TransitionWrapperProps>`

#### Dependencies

- `react`
- `react-router-dom`
- `framer-motion`


### `ProtectedAdminRoute`

ProtectedAdminRoute - Route wrapper for admin-only pages
Checks admin status via user_profiles.is_admin and auth metadata
Protects dangerous areas:
- Moderation tools (content reports, user strikes, bans)
- Database cleanup scripts and maintenance operations
- Revenue/Stripe test utilities and payment debugging
- User management (role changes, account deletions)
- Analytics dashboards with sensitive data
- Email campaign management
- System configuration changes
Note: Also enforce admin checks in API routes via RLS policies

**Source:** `src/components/auth/ProtectedAdminRoute.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | No | - |

#### Exports

- **`ProtectedAdminRoute`**: `React.FC<ProtectedAdminRouteProps>`

#### Dependencies

- `react`
- `react-router-dom`
- `@/lib/admin`
- `@/lib/logger`


### `CommentThread`

**Source:** `src/components/features/CommentThread.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `comment` | `CommentType` | No | - |
| `postId` | `string` | No | - |
| `currentUser` | `User | null` | No | - |
| `onReply` | `(parentId: string` | Yes | - |
| `text` | `string) => Promise<void>` | No | - |
| `depth` | `number` | Yes | - |
| `maxDepth` | `number` | Yes | - |

#### Exports

- **`CommentThread`**: `any`

#### Dependencies

- `react`
- `dompurify`
- `../Avatar`
- `../Button`
- `../../lib/supabase`
- `../Toast`
- `../../services/moderationService`
- `../../lib/utils`
- `../../lib/validation`
- `../../lib/rateLimiter`
- *... and 1 more*


### `FireRating`

FireRating - 5-fire rating system for posts

**Source:** `src/components/features/FireRating.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `postId` | `string` | No | - |
| `currentRating` | `number` | Yes | - |
| `averageRating` | `number` | Yes | - |
| `totalRatings` | `number` | Yes | - |
| `onRate` | `(level: number) => Promise<void>` | Yes | - |
| `readonly` | `boolean` | Yes | - |
| `size` | `'sm' | 'md' | 'lg'` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`FireRating`**: `React.FC<FireRatingProps>`

#### Dependencies

- `react`
- `../../lib/utils`


### `FireCount`

**Source:** `src/components/features/FireRating.tsx`

#### Exports

- **`FireCount`**: `React.FC<{
  count: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}>`

#### Dependencies

- `react`
- `../../lib/utils`


### `GiftModal`

GiftModal - Virtual gift sending system
Users can send gifts to support their favorite creators

**Source:** `src/components/features/GiftModal.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `name` | `string` | No | - |
| `emoji` | `string` | No | - |
| `price` | `number` | No | - |
| `rarity` | `'common' | 'rare' | 'epic' | 'legendary'` | No | - |

#### Exports

- **`GiftModal`**: `React.FC<GiftModalProps>`

#### Dependencies

- `react`
- `../Button`
- `../Avatar`
- `../../lib/supabase`
- `../Toast`
- `../../lib/utils`
- `../../types`


### `ProfileCard`

ProfileCard - Display user profile information

**Source:** `src/components/features/ProfileCard.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `user` | `User` | No | - |
| `showFollowButton` | `boolean` | Yes | - |
| `onFollowClick` | `() => void` | Yes | - |
| `isFollowing` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`ProfileCard`**: `React.FC<ProfileCardProps>`

#### Dependencies

- `react`
- `react-router-dom`
- `../Avatar`
- `../Button`
- `../../lib/utils`
- `../../types`


### `ProfileCardCompact`

**Source:** `src/components/features/ProfileCard.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `user` | `User` | No | - |
| `showFollowButton` | `boolean` | Yes | - |
| `onFollowClick` | `() => void` | Yes | - |
| `isFollowing` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`ProfileCardCompact`**: `React.FC<{
  user: User;
  onFollowClick?: ()`

#### Dependencies

- `react`
- `react-router-dom`
- `../Avatar`
- `../Button`
- `../../lib/utils`
- `../../types`


### `SearchBar`

**Source:** `src/components/features/SearchBar.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `onSearchChange` | `(query: string) => void` | Yes | - |
| `placeholder` | `string` | Yes | - |
| `autoFocus` | `boolean` | Yes | - |

#### Exports

- **`SearchBar`**: `any`

#### Dependencies

- `react`
- `react-router-dom`
- `../../lib/supabase`
- `../Avatar`
- `../../lib/validation`
- `../Toast`
- `../../types`


### `SingleVideoView`

SingleVideoView - Individual video view in continuous feed
Full-screen video with overlay UI matching app aesthetic

**Source:** `src/components/features/SingleVideoView.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `post` | `Post` | No | - |
| `user` | `User` | No | - |
| `isActive` | `boolean` | No | - |
| `onFireToggle` | `(postId: string` | Yes | - |
| `currentFire` | `number) => void` | No | - |
| `onComment` | `(postId: string) => void` | Yes | - |
| `onShare` | `(postId: string) => void` | Yes | - |

#### Exports

- **`SingleVideoView`**: `React.FC<SingleVideoViewProps>`

#### Dependencies

- `react`
- `react-router-dom`
- `./VideoPlayer`
- `../Avatar`
- `@/hooks/useHaptics`
- `@/types`


### `StoryCircle`

StoryCircle - Story thumbnail for horizontal carousel

**Source:** `src/components/features/StoryCircle.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `user` | `User` | No | - |
| `story` | `Story` | Yes | - |
| `isViewed` | `boolean` | Yes | - |
| `isOwnStory` | `boolean` | Yes | - |
| `onClick` | `() => void` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`StoryCircle`**: `React.FC<StoryCircleProps>`

#### Dependencies

- `react`
- `react-router-dom`
- `../../lib/utils`
- `../../types`


### `StoryCarousel`

**Source:** `src/components/features/StoryCircle.tsx`

#### Exports

- **`StoryCarousel`**: `React.FC<{
  stories: Array<{ user: User; story?: Story; isViewed?: boolean }>;
  currentUser?: User;
  onStoryClick?: (userStories: Story[], startIndex: number)`

#### Dependencies

- `react`
- `react-router-dom`
- `../../lib/utils`
- `../../types`


### `StoryCreator`

StoryCreator - Create and upload 24-hour stories

**Source:** `src/components/features/StoryCreator.tsx`

#### Exports

- **`StoryCreator`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `../Button`
- `../../lib/supabase`
- `../Toast`
- `../../lib/utils`


### `StoryViewer`

**Source:** `src/components/features/StoryViewer.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `stories` | `Story[]` | No | - |
| `initialIndex` | `number` | Yes | - |
| `onClose` | `() => void` | No | - |

#### Exports

- **`StoryViewer`**: `any`

#### Dependencies

- `react`
- `react-router-dom`
- `../Avatar`
- `./VideoPlayer`
- `../../lib/supabase`
- `../../lib/utils`
- `../../types`


### `TiGuy`

**Source:** `src/components/features/TiGuy.tsx`

#### Exports

- **`TiGuy`**: `React.FC`

#### Dependencies

- `react`
- `../Button`
- `../../lib/utils`


### `TiGuyEnhanced`

Ti-Guy Enhanced Example - Integration with TiGuyAgent
This example shows how to integrate the AI-powered TiGuyAgent with the chat interface
NOTE: This is an EXAMPLE file showing how to enhance the existing TiGuy component
with AI capabilities. To use this, you would replace the static responses in
TiGuy.tsx with calls to the TiGuyAgent service.

**Source:** `src/components/features/TiGuyEnhanced.example.tsx`

#### Exports

- **`TiGuyEnhanced`**: `React.FC`

#### Dependencies

- `react`
- `../Button`
- `../../lib/utils`
- `../../services/tiGuyAgent`
- `../../components/Toast`


### `VideoCard`

**Source:** `src/components/features/VideoCard.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `post` | `Post` | No | - |
| `user` | `User` | No | - |
| `variant` | `'horizontal' | 'vertical'` | Yes | - |
| `autoPlay` | `boolean` | Yes | - |
| `muted` | `boolean` | Yes | - |
| `onFireToggle` | `(postId: string` | Yes | - |
| `currentFire` | `number) => void` | No | - |
| `onComment` | `(postId: string) => void` | Yes | - |
| `onShare` | `(postId: string) => void` | Yes | - |

#### Exports

- **`VideoCard`**: `any`

#### Dependencies

- `react`
- `dompurify`
- `react-router-dom`
- `../Avatar`
- `./VideoPlayer`
- `@/hooks/useHaptics`
- `../Toast`
- `../../lib/utils`
- `../../types`


### `VideoPlayer`

VideoPlayer - Advanced video player with TikTok-style controls

**Source:** `src/components/features/VideoPlayer.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `src` | `string` | No | - |
| `poster` | `string` | Yes | - |
| `autoPlay` | `boolean` | Yes | - |
| `muted` | `boolean` | Yes | - |
| `loop` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |
| `onEnded` | `() => void` | Yes | - |
| `onPlay` | `() => void` | Yes | - |
| `onPause` | `() => void` | Yes | - |

#### Exports

- **`VideoPlayer`**: `React.FC<VideoPlayerProps>`

#### Dependencies

- `react`
- `../../lib/utils`


### `AchievementModal`

AchievementModal - Popup when achievement is unlocked
Beautiful animation and celebration!

**Source:** `src/components/gamification/AchievementModal.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `achievement` | `Achievement | null` | No | - |
| `onClose` | `() => void` | No | - |
| `onShare` | `() => void` | Yes | - |

#### Exports

- **`AchievementModal`**: `React.FC<AchievementModalProps>`

#### Dependencies

- `react`
- `../Button`
- `../../lib/utils`
- `../../services/achievementService`


### `AchievementListener`

**Source:** `src/components/gamification/AchievementModal.tsx`

#### Exports

- **`AchievementListener`**: `React.FC`

#### Dependencies

- `react`
- `../Button`
- `../../lib/utils`
- `../../services/achievementService`


### `BottomNav`

**Source:** `src/components/layout/BottomNav.tsx`

#### Exports

- **`BottomNav`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `../../lib/utils`


### `FeedGrid`

FeedGrid - Masonry grid layout for posts

**Source:** `src/components/layout/FeedGrid.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `posts` | `Post[]` | No | - |
| `isLoading` | `boolean` | Yes | - |
| `hasMore` | `boolean` | Yes | - |
| `onLoadMore` | `() => void` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`FeedGrid`**: `React.FC<FeedGridProps>`

#### Dependencies

- `react`
- `../features/VideoCard`
- `../../types`
- `../../lib/utils`


### `Header`

Header component with gold gradient and navigation

**Source:** `src/components/layout/Header.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `showSearch` | `boolean` | Yes | - |
| `title` | `string` | Yes | - |
| `showBack` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`Header`**: `React.FC<HeaderProps>`

#### Dependencies

- `react`
- `react-router-dom`
- `../../lib/utils`
- `../../contexts/NotificationContext`
- `../ui/Logo`


### `ReportModal`

**Source:** `src/components/moderation/ReportModal.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | No | - |
| `onClose` | `() => void` | No | - |
| `contentType` | `'post' | 'comment' | 'user' | 'story' | 'message'` | No | - |
| `contentId` | `string` | No | - |
| `reportedUser` | `User` | Yes | - |

#### Exports

- **`ReportModal`**: `React.FC<ReportModalProps>`

#### Dependencies

- `react`
- `../Button`
- `../../lib/supabase`
- `../Toast`
- `../../lib/utils`
- `../../types`


### `SettingsItem`

SettingsItem - Reusable settings item component

**Source:** `src/components/settings/SettingsItem.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `type` | `SettingsItemType` | No | - |
| `label` | `string` | No | - |
| `description` | `string` | Yes | - |
| `icon` | `React.ReactNode` | Yes | - |
| `to` | `string` | Yes | - |
| `value` | `boolean | string` | Yes | - |
| `options` | `Array<{ label: string` | Yes | - |
| `value` | `string` | No | - |

#### Exports

- **`SettingsItem`**: `React.FC<SettingsItemProps>`

#### Dependencies

- `react`
- `react-router-dom`
- `../../lib/utils`


### `SettingsSection`

SettingsSection - Collapsible settings section container

**Source:** `src/components/settings/SettingsSection.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `title` | `string` | No | - |
| `icon` | `React.ReactNode` | No | - |
| `children` | `React.ReactNode` | No | - |
| `defaultOpen` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`SettingsSection`**: `React.FC<SettingsSectionProps>`

#### Dependencies

- `react`
- `../../lib/utils`


### `Avatar`

Avatar component with gold ring and verified badge

**Source:** `src/components/ui/Avatar.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `src` | `string | null` | Yes | - |
| `alt` | `string` | Yes | - |
| `size` | `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'` | Yes | - |
| `isVerified` | `boolean` | Yes | - |
| `isOnline` | `boolean` | Yes | - |
| `hasStory` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |
| `onClick` | `() => void` | Yes | - |

#### Exports

- **`Avatar`**: `React.FC<AvatarProps>`

#### Dependencies

- `react`
- `../../lib/utils`


### `AvatarGroup`

**Source:** `src/components/ui/Avatar.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `src` | `string | null` | Yes | - |
| `alt` | `string` | Yes | - |
| `size` | `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'` | Yes | - |
| `isVerified` | `boolean` | Yes | - |
| `isOnline` | `boolean` | Yes | - |
| `hasStory` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |
| `onClick` | `() => void` | Yes | - |

#### Exports

- **`AvatarGroup`**: `React.FC<{
  avatars: Array<{ src?: string; alt?: string }>;
  max?: number;
  size?: AvatarProps['size'];
}>`

#### Dependencies

- `react`
- `../../lib/utils`


### `Button`

Gold-themed Button component for Zyeuté

**Source:** `src/components/ui/Button.tsx`

#### Exports

- **`Button`**: `any`

#### Dependencies

- `react`
- `../../lib/utils`


### `PlayButton`

**Source:** `src/components/ui/Button.tsx`

#### Exports

- **`PlayButton`**: `React.FC<{ onClick?: ()`

#### Dependencies

- `react`
- `../../lib/utils`


### `FireButton`

Specialized Play Button for video thumbnails

**Source:** `src/components/ui/Button.tsx`

#### Exports

- **`FireButton`**: `React.FC<{
  level: number;
  active?: boolean;
  onClick?: ()`

#### Dependencies

- `react`
- `../../lib/utils`


### `LoadingScreen`

LoadingScreen - Beautiful splash/loading screen with ornate logo

**Source:** `src/components/ui/LoadingScreen.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `message` | `string` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`LoadingScreen`**: `React.FC<LoadingScreenProps>`

#### Dependencies

- `react`
- `./Logo`
- `../../lib/utils`


### `LoadingSpinner`

**Source:** `src/components/ui/LoadingScreen.tsx`

#### Exports

- **`LoadingSpinner`**: `React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }>`

#### Dependencies

- `react`
- `./Logo`
- `../../lib/utils`


### `Logo`

Logo Component - Zyeuté Fleur-de-lis logo

**Source:** `src/components/ui/Logo.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `size` | `'xs' | 'sm' | 'md' | 'lg' | 'xl'` | Yes | - |
| `showText` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |
| `linkTo` | `string` | Yes | - |

#### Exports

- **`Logo`**: `React.FC<LogoProps>`

#### Dependencies

- `react`
- `react-router-dom`
- `../../lib/utils`


### `LogoFull`

**Source:** `src/components/ui/Logo.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `size` | `'xs' | 'sm' | 'md' | 'lg' | 'xl'` | Yes | - |
| `showText` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |
| `linkTo` | `string` | Yes | - |

#### Exports

- **`LogoFull`**: `React.FC<{ className?: string }>`

#### Dependencies

- `react`
- `react-router-dom`
- `../../lib/utils`


### `toast`

**Source:** `src/components/ui/Toast.tsx`

#### Exports

- **`toast`**: `any`

#### Dependencies

- `./Toast`
- `react`
- `react-dom/client`


## Services

### `getAllAchievements`

Achievement Service - Quebec Gamification System
Tracks and awards achievements, manages tiers, rewards users

**Source:** `src/services/achievementService.ts`

#### Exports

- **`getAllAchievements`**: `() => Promise<Achievement[]>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `getUserAchievements`

Get all available achievements

**Source:** `src/services/achievementService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `userId` | `string` | No | - |

#### Exports

- **`getUserAchievements`**: `(userId: string) => Promise<UserAchievement[]>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `getUserTier`

Get all available achievements

**Source:** `src/services/achievementService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `userId` | `string` | No | - |

#### Exports

- **`getUserTier`**: `(userId: string) => Promise<TierInfo | null>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `awardAchievement`

Get user's achievement progress

**Source:** `src/services/achievementService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `userId` | `string` | No | - |
| `achievementId` | `string` | No | - |

#### Exports

- **`awardAchievement`**: `(userId: string,
  achievementId: string,
  showNotification = true) => Promise<boolean>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `checkAchievements`

Award achievement to user

**Source:** `src/services/achievementService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `userId` | `string` | No | - |
| `trigger` | `{
    type: string;
    data?: any;
  }` | No | - |

#### Exports

- **`checkAchievements`**: `(userId: string,
  trigger: {
    type: string;
    data?: any;
  }) => Promise<void>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `getAchievementStats`

**Source:** `src/services/achievementService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `userId` | `string` | No | - |

#### Exports

- **`getAchievementStats`**: `(userId: string) => Promise<`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `getLeaderboard`

Get achievement statistics for user

**Source:** `src/services/achievementService.ts`

#### Exports

- **`getLeaderboard`**: `(limit = 100) => Promise<any[]>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `getUserRank`

Get leaderboard (top users by points)

**Source:** `src/services/achievementService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `userId` | `string` | No | - |

#### Exports

- **`getUserRank`**: `(userId: string) => Promise<number>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `getCurrentUser`

Centralized API Service for Zyeuté
All data fetching functions are centralized here for maintainability and consistency

**Source:** `src/services/api.ts`

#### Exports

- **`getCurrentUser`**: `() => Promise<User | null>`

#### Dependencies

- `@/lib/supabase`
- `@/types`


### `getFeedPosts`

Gets the currently authenticated user's profile data

**Source:** `src/services/api.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `page` | `number = 0` | No | - |
| `limit` | `number = 20` | No | - |

#### Exports

- **`getFeedPosts`**: `(page: number = 0, limit: number = 20) => Promise<Post[]>`

#### Dependencies

- `@/lib/supabase`
- `@/types`


### `getUserProfile`

**Source:** `src/services/api.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `usernameOrId` | `string` | No | - |
| `currentUserId` | `string` | Yes | - |

#### Exports

- **`getUserProfile`**: `(usernameOrId: string,
  currentUserId?: string) => Promise<User | null>`

#### Dependencies

- `@/lib/supabase`
- `@/types`


### `getPostById`

Gets a user profile by username or ID
Handles both 'me' (current user) and username lookups

**Source:** `src/services/api.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `postId` | `string` | No | - |

#### Exports

- **`getPostById`**: `(postId: string) => Promise<Post | null>`

#### Dependencies

- `@/lib/supabase`
- `@/types`


### `getUserPosts`

Gets a single post by ID

**Source:** `src/services/api.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `userId` | `string` | No | - |

#### Exports

- **`getUserPosts`**: `(userId: string) => Promise<Post[]>`

#### Dependencies

- `@/lib/supabase`
- `@/types`


### `getStories`

Gets all posts for a specific user

**Source:** `src/services/api.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `currentUserId` | `string` | Yes | - |

#### Exports

- **`getStories`**: `(currentUserId?: string) => Promise<Array<`

#### Dependencies

- `@/lib/supabase`
- `@/types`


### `checkFollowing`

Fetches active stories with user details

**Source:** `src/services/api.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `followerId` | `string` | No | - |
| `followingId` | `string` | No | - |

#### Exports

- **`checkFollowing`**: `(followerId: string, followingId: string) => Promise<boolean>`

#### Dependencies

- `@/lib/supabase`
- `@/types`


### `toggleFollow`

Checks if a user is following another user

**Source:** `src/services/api.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `followerId` | `string` | No | - |
| `followingId` | `string` | No | - |
| `isFollowing` | `boolean` | No | - |

#### Exports

- **`toggleFollow`**: `(followerId: string,
  followingId: string,
  isFollowing: boolean) => Promise<boolean>`

#### Dependencies

- `@/lib/supabase`
- `@/types`


### `togglePostFire`

Checks if a user is following another user

**Source:** `src/services/api.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `postId` | `string` | No | - |
| `userId` | `string` | No | - |

#### Exports

- **`togglePostFire`**: `(postId: string, userId: string) => Promise<boolean>`

#### Dependencies

- `@/lib/supabase`
- `@/types`


### `generateMarketingEmail`

Email Service - Marketing and notification emails
Uses OpenAI for content generation

**Source:** `src/services/emailService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `prompt` | `string` | No | - |

#### Exports

- **`generateMarketingEmail`**: `(prompt: string) => Promise<{ subject: string; body: string }>`

#### Dependencies

- `openai`


### `sendMarketingEmail`

Email Service - Marketing and notification emails
Uses OpenAI for content generation

**Source:** `src/services/emailService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `recipients` | `string[]` | No | - |
| `subject` | `string` | No | - |
| `body` | `string` | No | - |

#### Exports

- **`sendMarketingEmail`**: `(recipients: string[],
  subject: string,
  body: string) => Promise<void>`

#### Dependencies

- `openai`


### `generateMarketingEmail`

Email Service - Marketing and notification emails
Uses OpenAI for content generation

**Source:** `src/services/emailService.ts`

#### Exports

- **`generateMarketingEmail`**: `any`

#### Dependencies

- `openai`


### `sendMarketingEmail`

Email Service - Marketing and notification emails
Uses OpenAI for content generation

**Source:** `src/services/emailService.ts`

#### Exports

- **`sendMarketingEmail`**: `any`

#### Dependencies

- `openai`


### `generateCaption`

Gemini AI Service
Handles text generation, captioning, and hashtags

**Source:** `src/services/geminiService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `topic` | `string` | No | - |
| `tone` | `string = 'fun'` | No | - |

#### Exports

- **`generateCaption`**: `(topic: string, tone: string = 'fun') => Promise<string>`

#### Dependencies

- `@google/generative-ai`


### `generateHashtags`

Gemini AI Service
Handles text generation, captioning, and hashtags

**Source:** `src/services/geminiService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `topic` | `string` | No | - |

#### Exports

- **`generateHashtags`**: `(topic: string) => Promise<string[]>`

#### Dependencies

- `@google/generative-ai`


### `analyzeImage`

Gemini AI Service
Handles text generation, captioning, and hashtags

**Source:** `src/services/geminiService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `file` | `File` | No | - |

#### Exports

- **`analyzeImage`**: `(file: File) => Promise<any>`

#### Dependencies

- `@google/generative-ai`


### `generateImage`

AI Image Generation Service (Ti-Guy Artiste)
Uses OpenAI DALL-E 3 with robust fallback and demo modes

**Source:** `src/services/imageService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `prompt` | `string` | No | - |
| `style` | `string = 'cinematic'` | No | - |

#### Exports

- **`generateImage`**: `(prompt: string,
  style: string = 'cinematic') => Promise<ImageGenerationResult | null>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `remixImage`

**Source:** `src/services/imageService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `imageUrl` | `string` | No | - |
| `mode` | `'quebec' | 'meme' | 'vintage'` | No | - |

#### Exports

- **`remixImage`**: `(imageUrl: string, mode: 'quebec' | 'meme' | 'vintage') => Promise<string | null>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `analyzeText`

**Source:** `src/services/moderationService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `text` | `string` | No | - |

#### Exports

- **`analyzeText`**: `(text: string) => Promise<ModerationResult>`

#### Dependencies

- `openai`
- `../lib/supabase`


### `analyzeImage`

Analyze text content for violations

**Source:** `src/services/moderationService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `imageUrl` | `string` | No | - |

#### Exports

- **`analyzeImage`**: `(imageUrl: string) => Promise<ModerationResult>`

#### Dependencies

- `openai`
- `../lib/supabase`


### `analyzeVideo`

Analyze image content using OpenAI Vision

**Source:** `src/services/moderationService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `videoUrl` | `string` | No | - |

#### Exports

- **`analyzeVideo`**: `(videoUrl: string) => Promise<ModerationResult>`

#### Dependencies

- `openai`
- `../lib/supabase`


### `moderateContent`

Analyze video content (analyze key frames)

**Source:** `src/services/moderationService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `content` | `{ text?: string; imageUrl?: string; videoUrl?: string }` | No | - |
| `contentType` | `'post' | 'comment' | 'bio' | 'message'` | No | - |
| `userId` | `string` | No | - |
| `contentId` | `string` | Yes | - |

#### Exports

- **`moderateContent`**: `(content: { text?: string; imageUrl?: string; videoUrl?: string },
  contentType: 'post' | 'comment' | 'bio' | 'message',
  userId: string,
  contentId?: string) => Promise<ModerationResult>`

#### Dependencies

- `openai`
- `../lib/supabase`


### `isUserBanned`

**Source:** `src/services/moderationService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `userId` | `string` | No | - |

#### Exports

- **`isUserBanned`**: `(userId: string) => Promise<`

#### Dependencies

- `openai`
- `../lib/supabase`


### `generateCaption`

OpenAI Service
Handles text generation, captioning, and hashtags using GPT-4o

**Source:** `src/services/openaiService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `topic` | `string` | No | - |
| `tone` | `string = 'fun'` | No | - |

#### Exports

- **`generateCaption`**: `(topic: string, tone: string = 'fun') => Promise<string>`

#### Dependencies

- `openai`


### `generateHashtags`

OpenAI Service
Handles text generation, captioning, and hashtags using GPT-4o

**Source:** `src/services/openaiService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `topic` | `string` | No | - |

#### Exports

- **`generateHashtags`**: `(topic: string) => Promise<string[]>`

#### Dependencies

- `openai`


### `analyzeImage`

Generate hashtags for a topic

**Source:** `src/services/openaiService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `file` | `File` | No | - |

#### Exports

- **`analyzeImage`**: `(file: File) => Promise<any>`

#### Dependencies

- `openai`


### `subscribeToPremium`

💳 STRIPE SERVICE
Payment processing for Marketplace and Premium subscriptions

**Source:** `src/services/stripeService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `tier` | `'bronze' | 'silver' | 'gold'` | No | - |

#### Exports

- **`subscribeToPremium`**: `(tier: 'bronze' | 'silver' | 'gold') => Promise<void>`

#### Dependencies

- `@stripe/stripe-js`
- `../lib/supabase`
- `../components/Toast`


### `purchaseProduct`

**Source:** `src/services/stripeService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `productId` | `string` | No | - |
| `price` | `number` | No | - |

#### Exports

- **`purchaseProduct`**: `(productId: string, price: number) => Promise<void>`

#### Dependencies

- `@stripe/stripe-js`
- `../lib/supabase`
- `../components/Toast`


### `handlePaymentSuccess`

Purchase product from Marketplace

**Source:** `src/services/stripeService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sessionId` | `string` | No | - |

#### Exports

- **`handlePaymentSuccess`**: `(sessionId: string) => Promise<void>`

#### Dependencies

- `@stripe/stripe-js`
- `../lib/supabase`
- `../components/Toast`


### `connectStripeAccount`

Purchase product from Marketplace

**Source:** `src/services/stripeService.ts`

#### Exports

- **`connectStripeAccount`**: `() => Promise<void>`

#### Dependencies

- `@stripe/stripe-js`
- `../lib/supabase`
- `../components/Toast`


### `requestPayout`

Handle successful payment (called from success redirect)

**Source:** `src/services/stripeService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `amount` | `number` | No | - |

#### Exports

- **`requestPayout`**: `(amount: number) => Promise<void>`

#### Dependencies

- `@stripe/stripe-js`
- `../lib/supabase`
- `../components/Toast`


### `calculateMarketplaceFees`

Get pricing for display

**Source:** `src/services/stripeService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `price` | `number` | No | - |

#### Exports

- **`calculateMarketplaceFees`**: `(price: number) => void`

#### Dependencies

- `@stripe/stripe-js`
- `../lib/supabase`
- `../components/Toast`


### `getStripe`

💳 STRIPE SERVICE
Payment processing for Marketplace and Premium subscriptions

**Source:** `src/services/stripeService.ts`

#### Exports

- **`getStripe`**: `() => Promise<Stripe | null>`

#### Dependencies

- `@stripe/stripe-js`
- `../lib/supabase`
- `../components/Toast`


### `getStripe`

💳 STRIPE SERVICE
Payment processing for Marketplace and Premium subscriptions

**Source:** `src/services/stripeService.ts`

#### Exports

- **`getStripe`**: `any`

#### Dependencies

- `@stripe/stripe-js`
- `../lib/supabase`
- `../components/Toast`


### `STRIPE_PRICING`

**Source:** `src/services/stripeService.ts`

#### Exports

- **`STRIPE_PRICING`**: `any`

#### Dependencies

- `@stripe/stripe-js`
- `../lib/supabase`
- `../components/Toast`


### `getCreatorTiers`

Subscription Service - Creator Monetization
Handles subscriptions, tiers, payments, and revenue tracking

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `creatorId` | `string` | No | - |

#### Exports

- **`getCreatorTiers`**: `(creatorId: string) => Promise<SubscriptionTier[]>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `createSubscriptionTier`

Subscription Service - Creator Monetization
Handles subscriptions, tiers, payments, and revenue tracking

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `creatorId` | `string` | No | - |
| `tier` | `{
    name: string;
    name_fr: string;
    description?: string;
    price: number;
    benefits: string[];
    max_subscribers?: number;
  }` | No | - |

#### Exports

- **`createSubscriptionTier`**: `(creatorId: string,
  tier: {
    name: string;
    name_fr: string;
    description?: string;
    price: number;
    benefits: string[];
    max_subscribers?: number;
  }) => Promise<SubscriptionTier | null>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `isSubscribedTo`

Get creator's subscription tiers

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `subscriberId` | `string` | No | - |
| `creatorId` | `string` | No | - |

#### Exports

- **`isSubscribedTo`**: `(subscriberId: string,
  creatorId: string) => Promise<boolean>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `getUserSubscriptions`

Get creator's subscription tiers

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `userId` | `string` | No | - |

#### Exports

- **`getUserSubscriptions`**: `(userId: string) => Promise<Subscription[]>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `getCreatorSubscribers`

Create subscription tier

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `creatorId` | `string` | No | - |

#### Exports

- **`getCreatorSubscribers`**: `(creatorId: string) => Promise<any[]>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `subscribeToCreator`

Check if user is subscribed to creator

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `subscriberId` | `string` | No | - |
| `creatorId` | `string` | No | - |
| `tierId` | `string` | No | - |

#### Exports

- **`subscribeToCreator`**: `(subscriberId: string,
  creatorId: string,
  tierId: string) => Promise<boolean>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `unsubscribeFromCreator`

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `subscriberId` | `string` | No | - |
| `creatorId` | `string` | No | - |

#### Exports

- **`unsubscribeFromCreator`**: `(subscriberId: string,
  creatorId: string) => Promise<boolean>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `getCreatorRevenue`

Unsubscribe from creator

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `creatorId` | `string` | No | - |

#### Exports

- **`getCreatorRevenue`**: `(creatorId: string) => Promise<RevenueSummary>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `getCreatorEarnings`

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `creatorId` | `string` | No | - |

#### Exports

- **`getCreatorEarnings`**: `(creatorId: string,
  limit = 50) => Promise<CreatorEarnings[]>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `requestPayout`

Get creator earnings history

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `creatorId` | `string` | No | - |
| `amount` | `number` | No | - |

#### Exports

- **`requestPayout`**: `(creatorId: string,
  amount: number) => Promise<boolean>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `markPostExclusive`

Request payout

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `postId` | `string` | No | - |
| `creatorId` | `string` | No | - |
| `minTierId` | `string` | Yes | - |
| `previewText` | `string` | Yes | - |

#### Exports

- **`markPostExclusive`**: `(postId: string,
  creatorId: string,
  minTierId?: string,
  previewText?: string) => Promise<boolean>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `canViewExclusiveContent`

Mark post as exclusive

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `userId` | `string` | No | - |
| `postId` | `string` | No | - |

#### Exports

- **`canViewExclusiveContent`**: `(userId: string,
  postId: string) => Promise<boolean>`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `testJoke`

Ti-Guy Agent Test Examples
This file demonstrates how to test the TiGuyAgent service.
It's not a formal test suite, but shows expected behavior.
To run these examples in your app:
1. Import this file in a component
2. Call the test functions
3. Check console output

**Source:** `src/services/tiGuyAgent.test.example.ts`

#### Exports

- **`testJoke`**: `() => void`

#### Dependencies

- `./tiGuyAgent`
- `../services/tiGuyAgent.test.example`


### `testEvent`

Ti-Guy Agent Test Examples
This file demonstrates how to test the TiGuyAgent service.
It's not a formal test suite, but shows expected behavior.
To run these examples in your app:
1. Import this file in a component
2. Call the test functions
3. Check console output

**Source:** `src/services/tiGuyAgent.test.example.ts`

#### Exports

- **`testEvent`**: `() => void`

#### Dependencies

- `./tiGuyAgent`
- `../services/tiGuyAgent.test.example`


### `testRant`

Ti-Guy Agent Test Examples
This file demonstrates how to test the TiGuyAgent service.
It's not a formal test suite, but shows expected behavior.
To run these examples in your app:
1. Import this file in a component
2. Call the test functions
3. Check console output

**Source:** `src/services/tiGuyAgent.test.example.ts`

#### Exports

- **`testRant`**: `() => void`

#### Dependencies

- `./tiGuyAgent`
- `../services/tiGuyAgent.test.example`


### `testAd`

Test: Generate content for an event

**Source:** `src/services/tiGuyAgent.test.example.ts`

#### Exports

- **`testAd`**: `() => void`

#### Dependencies

- `./tiGuyAgent`
- `../services/tiGuyAgent.test.example`


### `testPoem`

Test: Generate content for a rant

**Source:** `src/services/tiGuyAgent.test.example.ts`

#### Exports

- **`testPoem`**: `() => void`

#### Dependencies

- `./tiGuyAgent`
- `../services/tiGuyAgent.test.example`


### `runAllTests`

Test: Generate content for an ad

**Source:** `src/services/tiGuyAgent.test.example.ts`

#### Exports

- **`runAllTests`**: `() => void`

#### Dependencies

- `./tiGuyAgent`
- `../services/tiGuyAgent.test.example`


### `validateResponse`

Test: Generate content for an ad

**Source:** `src/services/tiGuyAgent.test.example.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `response` | `TiGuyResponse | null` | No | - |

#### Exports

- **`validateResponse`**: `(response: TiGuyResponse | null) => boolean`

#### Dependencies

- `./tiGuyAgent`
- `../services/tiGuyAgent.test.example`


### `TiGuyAgent`

**Source:** `src/services/tiGuyAgent.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `input` | `TiGuyInput` | No | - |

#### Exports

- **`TiGuyAgent`**: `(input: TiGuyInput) => Promise<TiGuyResponse | null>`

#### Dependencies

- `../services/tiGuyAgent`
- `openai`


### `TiGuyAgent`

**Source:** `src/services/tiGuyAgent.ts`

#### Exports

- **`TiGuyAgent`**: `any`

#### Dependencies

- `../services/tiGuyAgent`
- `openai`


### `processVideo`

🎬 VIDEO SERVICE - AI Video Editing
Ti-Guy Studio - Smart video processing

**Source:** `src/services/videoService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `file` | `File` | No | - |
| `options` | `VideoEditOptions = {}` | No | - |

#### Exports

- **`processVideo`**: `(file: File,
  options: VideoEditOptions = {}) => Promise<VideoProcessResult>`


### `generateCaptions`

🎬 VIDEO SERVICE - AI Video Editing
Ti-Guy Studio - Smart video processing

**Source:** `src/services/videoService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `file` | `File` | No | - |

#### Exports

- **`generateCaptions`**: `(file: File) => Promise<string[]>`


### `smartTrim`

🎬 VIDEO SERVICE - AI Video Editing
Ti-Guy Studio - Smart video processing

**Source:** `src/services/videoService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `file` | `File` | No | - |

#### Exports

- **`smartTrim`**: `(file: File) => Promise<`


### `addBackgroundMusic`

Process video with AI enhancements
NOTE: This is a MOCK implementation for MVP
In production, this would use ffmpeg.wasm or a backend service

**Source:** `src/services/videoService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `videoFile` | `File` | No | - |
| `musicTrack` | `'upbeat' | 'chill' | 'epic' | 'quebec'` | No | - |

#### Exports

- **`addBackgroundMusic`**: `(videoFile: File,
  musicTrack: 'upbeat' | 'chill' | 'epic' | 'quebec') => Promise<string>`


### `cropToVertical`

Generate captions for video using AI
Uses Gemini for speech-to-text (mock for now)

**Source:** `src/services/videoService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `file` | `File` | No | - |

#### Exports

- **`cropToVertical`**: `(file: File) => Promise<string>`


### `extractThumbnail`

Generate captions for video using AI
Uses Gemini for speech-to-text (mock for now)

**Source:** `src/services/videoService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `file` | `File` | No | - |
| `timeInSeconds` | `number = 0` | No | - |

#### Exports

- **`extractThumbnail`**: `(file: File, timeInSeconds: number = 0) => Promise<string>`


### `getVideoMetadata`

Add background music to video

**Source:** `src/services/videoService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `file` | `File` | No | - |

#### Exports

- **`getVideoMetadata`**: `(file: File) => Promise<`


## Hooks

### `useHaptics`

useHaptics Hook - Web-Compatible Haptic Feedback
Uses the Vibration API for mobile browsers and PWA
Provides premium tactile feedback for user interactions

**Source:** `src/hooks/useHaptics.ts`

#### Exports

- **`useHaptics`**: `() => void`

#### Dependencies

- `react`


### `useHaptics`

useHaptics Hook - Web-Compatible Haptic Feedback
Uses the Vibration API for mobile browsers and PWA
Provides premium tactile feedback for user interactions

**Source:** `src/hooks/useHaptics.ts`

#### Exports

- **`useHaptics`**: `any`

#### Dependencies

- `react`


### `usePremium`

💎 usePremium Hook
Check user's premium subscription status

**Source:** `src/hooks/usePremium.ts`

#### Exports

- **`usePremium`**: `() => void`

#### Dependencies

- `react`
- `../lib/supabase`


### `useSettingsPreferences`

**Source:** `src/hooks/useSettingsPreferences.ts`

#### Exports

- **`useSettingsPreferences`**: `() => void`

#### Dependencies

- `react`


### `useVideoAutoPlay`

Custom hook for auto-playing videos on scroll (TikTok-style)

**Source:** `src/hooks/useVideoAutoPlay.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `options` | `UseVideoAutoPlayOptions = {}` | No | - |

#### Exports

- **`useVideoAutoPlay`**: `(options: UseVideoAutoPlayOptions = {}) => void`

#### Dependencies

- `react`


### `useVideoAutoPlay`

Custom hook for auto-playing videos on scroll (TikTok-style)

**Source:** `src/hooks/useVideoAutoPlay.ts`

#### Exports

- **`useVideoAutoPlay`**: `any`

#### Dependencies

- `react`


## Types

### `AvatarProps`

Avatar component with gold ring and verified badge

**Source:** `src/components/Avatar.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `src` | `string | null` | Yes | - |
| `alt` | `string` | Yes | - |
| `size` | `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'` | Yes | - |
| `isVerified` | `boolean` | Yes | - |
| `isOnline` | `boolean` | Yes | - |
| `hasStory` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |
| `onClick` | `() => void` | Yes | - |

#### Exports

- **`AvatarProps`**: `interface`

#### Dependencies

- `react`
- `../lib/utils`


### `FeedGridProps`

FeedGrid - Masonry grid layout for posts

**Source:** `src/components/FeedGrid.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `posts` | `Post[]` | No | - |
| `isLoading` | `boolean` | Yes | - |
| `hasMore` | `boolean` | Yes | - |
| `onLoadMore` | `() => void` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`FeedGridProps`**: `interface`

#### Dependencies

- `react`
- `./features/VideoCard`
- `../types`
- `../lib/utils`


### `HeaderProps`

Header component with gold gradient and navigation
Updated for Leather & Gold Premium Theme

**Source:** `src/components/Header.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `showSearch` | `boolean` | Yes | - |
| `title` | `string` | Yes | - |
| `showBack` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`HeaderProps`**: `interface`

#### Dependencies

- `react`
- `react-router-dom`
- `../lib/utils`
- `../contexts/NotificationContext`
- `./Logo`


### `FireRatingProps`

FireRating - 5-fire rating system for posts

**Source:** `src/components/features/FireRating.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `postId` | `string` | No | - |
| `currentRating` | `number` | Yes | - |
| `averageRating` | `number` | Yes | - |
| `totalRatings` | `number` | Yes | - |
| `onRate` | `(level: number) => Promise<void>` | Yes | - |
| `readonly` | `boolean` | Yes | - |
| `size` | `'sm' | 'md' | 'lg'` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`FireRatingProps`**: `interface`

#### Dependencies

- `react`
- `../../lib/utils`


### `ProfileCardProps`

ProfileCard - Display user profile information

**Source:** `src/components/features/ProfileCard.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `user` | `User` | No | - |
| `showFollowButton` | `boolean` | Yes | - |
| `onFollowClick` | `() => void` | Yes | - |
| `isFollowing` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`ProfileCardProps`**: `interface`

#### Dependencies

- `react`
- `react-router-dom`
- `../Avatar`
- `../Button`
- `../../lib/utils`
- `../../types`


### `StoryCircleProps`

StoryCircle - Story thumbnail for horizontal carousel

**Source:** `src/components/features/StoryCircle.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `user` | `User` | No | - |
| `story` | `Story` | Yes | - |
| `isViewed` | `boolean` | Yes | - |
| `isOwnStory` | `boolean` | Yes | - |
| `onClick` | `() => void` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`StoryCircleProps`**: `interface`

#### Dependencies

- `react`
- `react-router-dom`
- `../../lib/utils`
- `../../types`


### `VideoPlayerProps`

VideoPlayer - Advanced video player with TikTok-style controls

**Source:** `src/components/features/VideoPlayer.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `src` | `string` | No | - |
| `poster` | `string` | Yes | - |
| `autoPlay` | `boolean` | Yes | - |
| `muted` | `boolean` | Yes | - |
| `loop` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |
| `onEnded` | `() => void` | Yes | - |
| `onPlay` | `() => void` | Yes | - |
| `onPause` | `() => void` | Yes | - |

#### Exports

- **`VideoPlayerProps`**: `interface`

#### Dependencies

- `react`
- `../../lib/utils`


### `FeedGridProps`

FeedGrid - Masonry grid layout for posts

**Source:** `src/components/layout/FeedGrid.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `posts` | `Post[]` | No | - |
| `isLoading` | `boolean` | Yes | - |
| `hasMore` | `boolean` | Yes | - |
| `onLoadMore` | `() => void` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`FeedGridProps`**: `interface`

#### Dependencies

- `react`
- `../features/VideoCard`
- `../../types`
- `../../lib/utils`


### `HeaderProps`

Header component with gold gradient and navigation

**Source:** `src/components/layout/Header.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `showSearch` | `boolean` | Yes | - |
| `title` | `string` | Yes | - |
| `showBack` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |

#### Exports

- **`HeaderProps`**: `interface`

#### Dependencies

- `react`
- `react-router-dom`
- `../../lib/utils`
- `../../contexts/NotificationContext`
- `../ui/Logo`


### `AvatarProps`

Avatar component with gold ring and verified badge

**Source:** `src/components/ui/Avatar.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `src` | `string | null` | Yes | - |
| `alt` | `string` | Yes | - |
| `size` | `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'` | Yes | - |
| `isVerified` | `boolean` | Yes | - |
| `isOnline` | `boolean` | Yes | - |
| `hasStory` | `boolean` | Yes | - |
| `className` | `string` | Yes | - |
| `onClick` | `() => void` | Yes | - |

#### Exports

- **`AvatarProps`**: `interface`

#### Dependencies

- `react`
- `../../lib/utils`


### `ThemeColors`

Theme Context - Manages edge lighting colors and theme customization

**Source:** `src/contexts/ThemeContext.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `edgeLighting` | `string` | No | - |
| `name` | `string` | No | - |

#### Exports

- **`ThemeColors`**: `interface`

#### Dependencies

- `react`


### `PremiumStatus`

💎 usePremium Hook
Check user's premium subscription status

**Source:** `src/hooks/usePremium.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `tier` | `PremiumTier` | No | - |
| `isActive` | `boolean` | No | - |
| `expiresAt` | `string` | Yes | - |
| `features` | `{` | No | - |
| `aiImagesPerMonth` | `number` | No | - |
| `aiVideosPerMonth` | `number` | No | - |
| `analytics` | `boolean` | No | - |
| `priorityFeed` | `boolean` | No | - |
| `noAds` | `boolean` | No | - |
| `badge` | `string` | No | - |
| `monthlyCennes` | `number` | No | - |

#### Exports

- **`PremiumStatus`**: `interface`

#### Dependencies

- `react`
- `../lib/supabase`


### `SettingsPreferences`

**Source:** `src/hooks/useSettingsPreferences.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `tags` | `{` | No | - |
| `allowTagging` | `boolean` | No | - |
| `requireApproval` | `boolean` | No | - |
| `mentionScope` | `MentionScope` | No | - |

#### Exports

- **`SettingsPreferences`**: `interface`

#### Dependencies

- `react`


### `VirtualGift`

**Source:** `src/lib/quebecFeatures.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `name` | `string` | No | - |
| `nameJoual` | `string` | No | - |
| `emoji` | `string` | No | - |
| `price` | `number` | No | - |
| `description` | `string` | No | - |

#### Exports

- **`VirtualGift`**: `interface`


### `QuebecMusic`

**Source:** `src/lib/quebecFeatures.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `title` | `string` | No | - |
| `artist` | `string` | No | - |
| `genre` | `string` | No | - |
| `vibes` | `string[]` | No | - |
| `spotifyUri` | `string` | Yes | - |

#### Exports

- **`QuebecMusic`**: `interface`


### `QuebecEvent`

**Source:** `src/lib/quebecFeatures.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `name` | `string` | No | - |
| `nameJoual` | `string` | No | - |
| `date` | `string` | No | - |
| `emoji` | `string` | No | - |
| `description` | `string` | No | - |
| `hashtag` | `string` | No | - |

#### Exports

- **`QuebecEvent`**: `interface`


### `PhotoFilter`

**Source:** `src/lib/quebecFeatures.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `name` | `string` | No | - |
| `nameJoual` | `string` | No | - |
| `css` | `string` | No | - |
| `description` | `string` | No | - |

#### Exports

- **`PhotoFilter`**: `interface`


### `ValidationResult`

Input Validation Utilities
Security: Validates user inputs to prevent injection attacks and ensure data integrity

**Source:** `src/lib/validation.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `valid` | `boolean` | No | - |
| `error` | `string` | Yes | - |

#### Exports

- **`ValidationResult`**: `interface`


### `SecurityAuditFinding`

Security Audit Schema
JSON schema for security vulnerability findings from security audits
Used by IntegrityForeman and security scanning tools

**Source:** `src/schemas/SecurityAuditSchema.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `issueId` | `string` | No | - |
| `module` | `string` | No | - |
| `severity` | `'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL'` | No | - |
| `lineStart` | `number` | Yes | - |
| `lineEnd` | `number` | Yes | - |
| `summary` | `string` | No | - |
| `remediation` | `string` | Yes | - |

#### Exports

- **`SecurityAuditFinding`**: `interface`


### `Achievement`

Achievement Service - Quebec Gamification System
Tracks and awards achievements, manages tiers, rewards users

**Source:** `src/services/achievementService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `name` | `string` | No | - |
| `name_fr` | `string` | No | - |
| `description` | `string` | No | - |
| `category` | `AchievementCategory` | No | - |
| `points` | `number` | No | - |
| `rarity` | `AchievementRarity` | No | - |
| `icon` | `string` | No | - |
| `color` | `string` | No | - |
| `unlock_condition` | `any` | No | - |
| `reward_cennes` | `number` | No | - |
| `reward_description` | `string` | Yes | - |
| `is_secret` | `boolean` | No | - |
| `sort_order` | `number` | No | - |

#### Exports

- **`Achievement`**: `interface`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `UserAchievement`

Achievement Service - Quebec Gamification System
Tracks and awards achievements, manages tiers, rewards users

**Source:** `src/services/achievementService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `user_id` | `string` | No | - |
| `achievement_id` | `string` | No | - |
| `progress` | `number` | No | - |
| `progress_max` | `number` | No | - |
| `is_earned` | `boolean` | No | - |
| `earned_at` | `string` | Yes | - |
| `achievement` | `Achievement` | Yes | - |

#### Exports

- **`UserAchievement`**: `interface`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `TierInfo`

Achievement Service - Quebec Gamification System
Tracks and awards achievements, manages tiers, rewards users

**Source:** `src/services/achievementService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `current` | `UserTier` | No | - |
| `name` | `string` | No | - |
| `icon` | `string` | No | - |
| `color` | `string` | No | - |
| `min_points` | `number` | No | - |
| `max_points` | `number` | No | - |
| `next_tier` | `string` | Yes | - |
| `points_to_next` | `number` | Yes | - |

#### Exports

- **`TierInfo`**: `interface`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `ImageGenerationResult`

AI Image Generation Service (Ti-Guy Artiste)
Uses OpenAI DALL-E 3 with robust fallback and demo modes

**Source:** `src/services/imageService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `url` | `string` | No | - |
| `prompt` | `string` | No | - |
| `revised_prompt` | `string` | Yes | - |
| `style` | `string` | Yes | - |

#### Exports

- **`ImageGenerationResult`**: `interface`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `ModerationResult`

AI Content Moderation Service
Uses OpenAI GPT-4o for Quebec-aware content moderation

**Source:** `src/services/moderationService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `is_safe` | `boolean` | No | - |
| `severity` | `ModerationSeverity` | No | - |
| `categories` | `ModerationCategory[]` | No | - |
| `confidence` | `number` | No | - |
| `reason` | `string` | No | - |
| `action` | `ModerationAction` | No | - |
| `context_note` | `string` | Yes | - |

#### Exports

- **`ModerationResult`**: `interface`

#### Dependencies

- `openai`
- `../lib/supabase`


### `SubscriptionTier`

Subscription Service - Creator Monetization
Handles subscriptions, tiers, payments, and revenue tracking

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `creator_id` | `string` | No | - |
| `name` | `string` | No | - |
| `name_fr` | `string` | No | - |
| `description` | `string` | Yes | - |
| `price` | `number` | No | - |
| `currency` | `string` | No | - |
| `benefits` | `string[]` | No | - |
| `is_active` | `boolean` | No | - |
| `max_subscribers` | `number` | Yes | - |
| `subscriber_count` | `number` | No | - |
| `monthly_revenue` | `number` | No | - |
| `stripe_price_id` | `string` | Yes | - |
| `stripe_product_id` | `string` | Yes | - |

#### Exports

- **`SubscriptionTier`**: `interface`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `Subscription`

Subscription Service - Creator Monetization
Handles subscriptions, tiers, payments, and revenue tracking

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `subscriber_id` | `string` | No | - |
| `creator_id` | `string` | No | - |
| `tier_id` | `string` | No | - |
| `status` | `'active' | 'canceled' | 'past_due' | 'paused' | 'expired'` | No | - |
| `stripe_subscription_id` | `string` | Yes | - |
| `current_period_start` | `string` | Yes | - |
| `current_period_end` | `string` | Yes | - |
| `canceled_at` | `string` | Yes | - |
| `tier` | `SubscriptionTier` | Yes | - |

#### Exports

- **`Subscription`**: `interface`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `CreatorEarnings`

Subscription Service - Creator Monetization
Handles subscriptions, tiers, payments, and revenue tracking

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `creator_id` | `string` | No | - |
| `source` | `'subscription' | 'gift' | 'tip' | 'sponsored'` | No | - |
| `amount` | `number` | No | - |
| `platform_fee` | `number` | No | - |
| `creator_net` | `number` | No | - |
| `payout_status` | `'pending' | 'paid' | 'failed'` | No | - |
| `created_at` | `string` | No | - |

#### Exports

- **`CreatorEarnings`**: `interface`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `RevenueSummary`

Subscription Service - Creator Monetization
Handles subscriptions, tiers, payments, and revenue tracking

**Source:** `src/services/subscriptionService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `total_earnings` | `number` | No | - |
| `pending_earnings` | `number` | No | - |
| `total_subscribers` | `number` | No | - |
| `monthly_recurring_revenue` | `number` | No | - |
| `this_month_revenue` | `number` | No | - |
| `last_month_revenue` | `number` | No | - |

#### Exports

- **`RevenueSummary`**: `interface`

#### Dependencies

- `../lib/supabase`
- `../components/Toast`


### `TiGuyInput`

Ti-Guy Agent Service
AI-powered assistant that generates Quebec-style content
Uses GPT-4 to create captions, emojis, tags, and replies in authentic Joual
```typescript
import { TiGuyAgent } from '../services/tiGuyAgent';
// Generate content for a joke
const response = await TiGuyAgent({
text: "J'ai vu 3 cônes orange sur le chemin!",
intent: 'joke'
});
if (response) {
console.log(response.caption);   // "Haha! C'est ben drôle ça..."
console.log(response.emojis);    // ['😂', '🔥', '🦫']
console.log(response.tags);      // ['Humour', 'Quebec', 'Construction']
console.log(response.reply);     // "C'est tiguidou! Continue comme ça..."
console.log(response.flagged);   // false
}
```
```typescript
// Generate content for an event
const response = await TiGuyAgent({
text: "Party sur la terrasse ce soir!",
intent: 'event'
});
```
```typescript
// Generate content for a rant
const response = await TiGuyAgent({
text: "La construction sur le pont Jacques-Cartier encore!",
intent: 'rant'
});
```

**Source:** `src/services/tiGuyAgent.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `text` | `string` | No | - |
| `intent` | `'joke' | 'rant' | 'event' | 'ad' | 'poem'` | No | - |

#### Exports

- **`TiGuyInput`**: `interface`

#### Dependencies

- `../services/tiGuyAgent`
- `openai`


### `TiGuyResponse`

Ti-Guy Agent Service
AI-powered assistant that generates Quebec-style content
Uses GPT-4 to create captions, emojis, tags, and replies in authentic Joual
```typescript
import { TiGuyAgent } from '../services/tiGuyAgent';
// Generate content for a joke
const response = await TiGuyAgent({
text: "J'ai vu 3 cônes orange sur le chemin!",
intent: 'joke'
});
if (response) {
console.log(response.caption);   // "Haha! C'est ben drôle ça..."
console.log(response.emojis);    // ['😂', '🔥', '🦫']
console.log(response.tags);      // ['Humour', 'Quebec', 'Construction']
console.log(response.reply);     // "C'est tiguidou! Continue comme ça..."
console.log(response.flagged);   // false
}
```
```typescript
// Generate content for an event
const response = await TiGuyAgent({
text: "Party sur la terrasse ce soir!",
intent: 'event'
});
```
```typescript
// Generate content for a rant
const response = await TiGuyAgent({
text: "La construction sur le pont Jacques-Cartier encore!",
intent: 'rant'
});
```

**Source:** `src/services/tiGuyAgent.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `caption` | `string` | No | - |
| `emojis` | `string[]` | No | - |
| `tags` | `string[]` | No | - |
| `flagged` | `boolean` | No | - |
| `reply` | `string` | No | - |

#### Exports

- **`TiGuyResponse`**: `interface`

#### Dependencies

- `../services/tiGuyAgent`
- `openai`


### `VideoProcessResult`

**Source:** `src/services/videoService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `url` | `string` | No | - |
| `duration` | `number` | No | - |
| `thumbnail` | `string` | Yes | - |
| `captions` | `string[]` | Yes | - |
| `highlights` | `{ start: number` | Yes | - |
| `end` | `number` | No | - |

#### Exports

- **`VideoProcessResult`**: `interface`


### `VideoEditOptions`

🎬 VIDEO SERVICE - AI Video Editing
Ti-Guy Studio - Smart video processing

**Source:** `src/services/videoService.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `trim` | `{ start: number` | Yes | - |
| `end` | `number` | No | - |

#### Exports

- **`VideoEditOptions`**: `interface`


### `SecurityAuditSchema`

**Source:** `src/types/SecurityAuditSchema.ts`

#### Exports

- **`SecurityAuditSchema`**: `any`


### `SecurityAuditFinding`

Security Audit Schema
JSON schema for security vulnerability findings from security audits
Used by IntegrityForeman and security scanning tools

**Source:** `src/types/SecurityAuditSchema.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `issueId` | `string` | No | - |
| `module` | `string` | No | - |
| `severity` | `'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL'` | No | - |
| `lineStart` | `number` | Yes | - |
| `lineEnd` | `number` | Yes | - |
| `summary` | `string` | No | - |
| `remediation` | `string` | Yes | - |

#### Exports

- **`SecurityAuditFinding`**: `interface`


### `ChatMessage`

Chat Message Types for TI-Guy Chat Modal

**Source:** `src/types/chat.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `sender` | `Sender` | No | - |
| `text` | `string` | No | - |
| `timestamp` | `Date` | No | - |

#### Exports

- **`ChatMessage`**: `interface`


### `Database`

Database types generated from Supabase schema
Includes all Enterprise Features:
- Subscriptions
- Moderation
- Gamification
- Live Streaming
- Marketplace

**Source:** `src/types/database.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `public` | `{` | No | - |
| `Tables` | `{` | No | - |
| `users` | `{` | No | - |
| `Row` | `{` | No | - |
| `id` | `string` | No | - |
| `username` | `string` | No | - |
| `display_name` | `string | null` | No | - |
| `avatar_url` | `string | null` | No | - |
| `bio` | `string | null` | No | - |
| `city` | `string | null` | No | - |
| `region` | `string | null` | No | - |
| `is_verified` | `boolean` | No | - |
| `coins` | `number` | No | - |
| `fire_score` | `number` | No | - |
| `created_at` | `string` | No | - |
| `updated_at` | `string` | No | - |
| `is_creator` | `boolean` | No | - |
| `creator_verified` | `boolean` | No | - |
| `total_subscribers` | `number` | No | - |
| `total_earnings` | `number` | No | - |
| `pending_earnings` | `number` | No | - |
| `stripe_account_id` | `string | null` | No | - |
| `stripe_customer_id` | `string | null` | No | - |
| `payout_email` | `string | null` | No | - |
| `payout_method` | `string | null` | No | - |

#### Exports

- **`Database`**: `interface`


### `User`

**Source:** `src/types/index.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `username` | `string` | No | - |
| `display_name` | `string | null` | No | - |
| `avatar_url` | `string | null` | No | - |
| `bio` | `string | null` | No | - |
| `city` | `string | null` | No | - |
| `region` | `string | null` | No | - |
| `is_verified` | `boolean` | No | - |
| `coins` | `number` | No | - |
| `fire_score` | `number` | No | - |
| `created_at` | `string` | No | - |
| `updated_at` | `string` | No | - |
| `followers_count` | `number` | Yes | - |
| `following_count` | `number` | Yes | - |
| `posts_count` | `number` | Yes | - |
| `is_following` | `boolean` | Yes | - |
| `is_online` | `boolean` | Yes | - |

#### Exports

- **`User`**: `interface`


### `Post`

TypeScript types for Zyeuté
Matches Supabase database schema

**Source:** `src/types/index.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `user_id` | `string` | No | - |
| `type` | `'photo' | 'video'` | No | - |
| `media_url` | `string` | No | - |
| `caption` | `string | null` | No | - |
| `hashtags` | `string[] | null` | No | - |
| `region` | `string | null` | No | - |
| `city` | `string | null` | No | - |
| `fire_count` | `number` | No | - |
| `comment_count` | `number` | No | - |
| `created_at` | `string` | No | - |
| `user` | `User` | Yes | - |
| `comments` | `Comment[]` | Yes | - |
| `user_fire` | `Fire` | Yes | - |
| `is_fired` | `boolean` | Yes | - |
| `fire_level` | `number` | Yes | - |

#### Exports

- **`Post`**: `interface`


### `Comment`

TypeScript types for Zyeuté
Matches Supabase database schema

**Source:** `src/types/index.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `post_id` | `string` | No | - |
| `user_id` | `string` | No | - |
| `text` | `string` | No | - |
| `content` | `string` | No | - |
| `parent_id` | `string | null` | Yes | - |
| `likes` | `number` | Yes | - |
| `created_at` | `string` | No | - |
| `user` | `User` | Yes | - |

#### Exports

- **`Comment`**: `interface`


### `Fire`

TypeScript types for Zyeuté
Matches Supabase database schema

**Source:** `src/types/index.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `user_id` | `string` | No | - |
| `post_id` | `string` | No | - |
| `fire_level` | `number` | No | - |
| `created_at` | `string` | No | - |

#### Exports

- **`Fire`**: `interface`


### `Follow`

TypeScript types for Zyeuté
Matches Supabase database schema

**Source:** `src/types/index.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `follower_id` | `string` | No | - |
| `following_id` | `string` | No | - |
| `created_at` | `string` | No | - |

#### Exports

- **`Follow`**: `interface`


### `Gift`

TypeScript types for Zyeuté
Matches Supabase database schema

**Source:** `src/types/index.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `from_user_id` | `string` | No | - |
| `to_user_id` | `string` | No | - |
| `post_id` | `string | null` | No | - |
| `gift_type` | `string` | No | - |
| `coin_value` | `number` | No | - |
| `created_at` | `string` | No | - |
| `from_user` | `User` | Yes | - |
| `to_user` | `User` | Yes | - |

#### Exports

- **`Gift`**: `interface`


### `Story`

TypeScript types for Zyeuté
Matches Supabase database schema

**Source:** `src/types/index.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `user_id` | `string` | No | - |
| `media_url` | `string` | No | - |
| `type` | `'photo' | 'video'` | No | - |
| `duration` | `number` | No | - |
| `created_at` | `string` | No | - |
| `expires_at` | `string` | No | - |
| `user` | `User` | Yes | - |
| `is_viewed` | `boolean` | Yes | - |

#### Exports

- **`Story`**: `interface`


### `Notification`

TypeScript types for Zyeuté
Matches Supabase database schema

**Source:** `src/types/index.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `user_id` | `string` | No | - |
| `type` | `'fire' | 'comment' | 'follow' | 'gift' | 'mention'` | No | - |
| `actor_id` | `string` | No | - |
| `post_id` | `string | null` | No | - |
| `comment_id` | `string | null` | No | - |
| `is_read` | `boolean` | No | - |
| `created_at` | `string` | No | - |
| `actor` | `User` | Yes | - |
| `post` | `Post` | Yes | - |

#### Exports

- **`Notification`**: `interface`


### `CreatePostInput`

**Source:** `src/types/index.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `type` | `'photo' | 'video'` | No | - |
| `media_url` | `string` | No | - |
| `caption` | `string` | Yes | - |
| `hashtags` | `string[]` | Yes | - |
| `region` | `string` | Yes | - |
| `city` | `string` | Yes | - |

#### Exports

- **`CreatePostInput`**: `interface`


### `UpdateProfileInput`

**Source:** `src/types/index.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `username` | `string` | Yes | - |
| `display_name` | `string` | Yes | - |
| `bio` | `string` | Yes | - |
| `avatar_url` | `string` | Yes | - |
| `city` | `string` | Yes | - |
| `region` | `string` | Yes | - |

#### Exports

- **`UpdateProfileInput`**: `interface`


### `LoginInput`

**Source:** `src/types/index.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `email` | `string` | No | - |
| `password` | `string` | No | - |

#### Exports

- **`LoginInput`**: `interface`


### `SignupInput`

**Source:** `src/types/index.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `email` | `string` | No | - |
| `password` | `string` | No | - |
| `username` | `string` | No | - |
| `display_name` | `string` | Yes | - |

#### Exports

- **`SignupInput`**: `interface`


## Utilities

### `useBorderColor`

BorderColorContext - Customizable App Accent Lighting
Allows users to customize the border glow color around the app

**Source:** `src/contexts/BorderColorContext.tsx`

#### Exports

- **`useBorderColor`**: `() => void`

#### Dependencies

- `react`


### `useBorderColor`

BorderColorContext - Customizable App Accent Lighting
Allows users to customize the border glow color around the app

**Source:** `src/contexts/BorderColorContext.tsx`

#### Exports

- **`useBorderColor`**: `any`

#### Dependencies

- `react`


### `BorderColorProvider`

BorderColorContext - Customizable App Accent Lighting
Allows users to customize the border glow color around the app

**Source:** `src/contexts/BorderColorContext.tsx`

#### Exports

- **`BorderColorProvider`**: `React.FC<{ children: React.ReactNode }>`

#### Dependencies

- `react`


### `useNotifications`

**Source:** `src/contexts/NotificationContext.tsx`

#### Exports

- **`useNotifications`**: `() => void`

#### Dependencies

- `react`
- `../lib/supabase`
- `../components/Toast`
- `../types`


### `NotificationProvider`

Notification Context - Real-time notifications using Supabase Realtime

**Source:** `src/contexts/NotificationContext.tsx`

#### Exports

- **`NotificationProvider`**: `React.FC<{ children: React.ReactNode }>`

#### Dependencies

- `react`
- `../lib/supabase`
- `../components/Toast`
- `../types`


### `useNotifications`

**Source:** `src/contexts/NotificationContext.tsx`

#### Exports

- **`useNotifications`**: `any`

#### Dependencies

- `react`
- `../lib/supabase`
- `../components/Toast`
- `../types`


### `useTheme`

**Source:** `src/contexts/ThemeContext.tsx`

#### Exports

- **`useTheme`**: `() => void`

#### Dependencies

- `react`


### `PRESET_THEMES`

Theme Context - Manages edge lighting colors and theme customization

**Source:** `src/contexts/ThemeContext.tsx`

#### Exports

- **`PRESET_THEMES`**: `Record<string, ThemeColors>`

#### Dependencies

- `react`


### `ThemeProvider`

Theme Context - Manages edge lighting colors and theme customization

**Source:** `src/contexts/ThemeContext.tsx`

#### Exports

- **`ThemeProvider`**: `React.FC<{ children: React.ReactNode }>`

#### Dependencies

- `react`


### `useTheme`

**Source:** `src/contexts/ThemeContext.tsx`

#### Exports

- **`useTheme`**: `any`

#### Dependencies

- `react`


### `checkIsAdmin`

Admin role checking utilities
Checks both user_profiles.is_admin and auth.users metadata for admin role
Admin-only areas that should be protected:
- Moderation tools (content reports, user strikes, bans)
- Database cleanup scripts and maintenance operations
- Revenue/Stripe test utilities and payment debugging
- User management (role changes, account deletions)
- Analytics dashboards with sensitive data
- Email campaign management
- System configuration changes
These should be enforced in both UI (ProtectedAdminRoute) and API routes (RLS policies)

**Source:** `src/lib/admin.ts`

#### Exports

- **`checkIsAdmin`**: `() => Promise<boolean>`

#### Dependencies

- `./supabase`
- `./logger`


### `getAdminStatus`

Check if current user is an admin
Checks both user_profiles.is_admin and auth.users metadata
Use this to protect:
- Moderation tools
- Database cleanup scripts
- Revenue/Stripe test utilities
- User management features
- Analytics dashboards
- Email campaigns
- System configuration

**Source:** `src/lib/admin.ts`

#### Exports

- **`getAdminStatus`**: `() => Promise<`

#### Dependencies

- `./supabase`
- `./logger`


### `useAdminCheck`

Get admin status with user details
Returns both admin status and user object

**Source:** `src/lib/admin.ts`

#### Exports

- **`useAdminCheck`**: `() => Promise<`

#### Dependencies

- `./supabase`
- `./logger`


### `logger`

Logger class with environment-aware logging

**Source:** `src/lib/logger.ts`

#### Exports

- **`logger`**: `any`


### `getCurrentQuebecSeason`

**Source:** `src/lib/quebecFeatures.ts`

#### Exports

- **`getCurrentQuebecSeason`**: `() => 'hiver' | 'printemps' | 'ete' | 'automne' | 'construction'`


### `getTodaysQuebecEvent`

Get current season in Quebec

**Source:** `src/lib/quebecFeatures.ts`

#### Exports

- **`getTodaysQuebecEvent`**: `() => QuebecEvent | null`


### `getRandomQuebecGreeting`

Get current season in Quebec

**Source:** `src/lib/quebecFeatures.ts`

#### Exports

- **`getRandomQuebecGreeting`**: `() => string`


### `formatQuebecNumber`

Get current season in Quebec

**Source:** `src/lib/quebecFeatures.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `num` | `number` | No | - |

#### Exports

- **`formatQuebecNumber`**: `(num: number) => string`


### `getAreaCode`

Get current season in Quebec

**Source:** `src/lib/quebecFeatures.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `region` | `string` | No | - |

#### Exports

- **`getAreaCode`**: `(region: string) => string`


### `QUEBEC_REGIONS`

**Source:** `src/lib/quebecFeatures.ts`

#### Exports

- **`QUEBEC_REGIONS`**: `any`


### `MONTREAL_QUARTIERS`

**Source:** `src/lib/quebecFeatures.ts`

#### Exports

- **`MONTREAL_QUARTIERS`**: `any`


### `JOUAL_DICTIONARY`

**Source:** `src/lib/quebecFeatures.ts`

#### Exports

- **`JOUAL_DICTIONARY`**: `any`


### `VIRTUAL_GIFTS`

**Source:** `src/lib/quebecFeatures.ts`

#### Exports

- **`VIRTUAL_GIFTS`**: `VirtualGift[]`


### `QUEBEC_MUSIC`

**Source:** `src/lib/quebecFeatures.ts`

#### Exports

- **`QUEBEC_MUSIC`**: `QuebecMusic[]`


### `QUEBEC_HASHTAGS`

**Source:** `src/lib/quebecFeatures.ts`

#### Exports

- **`QUEBEC_HASHTAGS`**: `any`


### `QUEBEC_EVENTS`

**Source:** `src/lib/quebecFeatures.ts`

#### Exports

- **`QUEBEC_EVENTS`**: `QuebecEvent[]`


### `QUEBEC_FILTERS`

**Source:** `src/lib/quebecFeatures.ts`

#### Exports

- **`QUEBEC_FILTERS`**: `PhotoFilter[]`


### `TI_GUY_PROMPTS`

**Source:** `src/lib/quebecFeatures.ts`

#### Exports

- **`TI_GUY_PROMPTS`**: `any`


### `checkRateLimit`

Get the number of attempts made in the current window

**Source:** `src/lib/rateLimiter.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `key` | `string` | No | - |
| `config` | `RateLimitConfig` | No | - |
| `errorMessage` | `string` | Yes | - |

#### Exports

- **`checkRateLimit`**: `(key: string, 
  config: RateLimitConfig,
  errorMessage?: string) => boolean`


### `rateLimiter`

Check if an action can proceed based on rate limits

**Source:** `src/lib/rateLimiter.ts`

#### Exports

- **`rateLimiter`**: `any`

#### Returns

- **Description**: true if action can proceed, false if rate limited


### `RATE_LIMITS`

Check if an action can proceed based on rate limits

**Source:** `src/lib/rateLimiter.ts`

#### Exports

- **`RATE_LIMITS`**: `any`

#### Returns

- **Description**: true if action can proceed, false if rate limited


### `getCurrentUser`

**Source:** `src/lib/supabase.ts`

#### Exports

- **`getCurrentUser`**: `() => void`

#### Dependencies

- `@supabase/supabase-js`
- `../types/database`
- `./utils`
- `./logger`


### `signIn`

Get current user session

**Source:** `src/lib/supabase.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `email` | `string` | No | - |
| `password` | `string` | No | - |

#### Exports

- **`signIn`**: `(email: string, password: string) => void`

#### Dependencies

- `@supabase/supabase-js`
- `../types/database`
- `./utils`
- `./logger`


### `signUp`

Get current user session

**Source:** `src/lib/supabase.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `email` | `string` | No | - |
| `password` | `string` | No | - |
| `username` | `string` | No | - |

#### Exports

- **`signUp`**: `(email: string, password: string, username: string) => void`

#### Dependencies

- `@supabase/supabase-js`
- `../types/database`
- `./utils`
- `./logger`


### `signOut`

Get current user session

**Source:** `src/lib/supabase.ts`

#### Exports

- **`signOut`**: `() => void`

#### Dependencies

- `@supabase/supabase-js`
- `../types/database`
- `./utils`
- `./logger`


### `signInWithGoogle`

Get current user session

**Source:** `src/lib/supabase.ts`

#### Exports

- **`signInWithGoogle`**: `() => void`

#### Dependencies

- `@supabase/supabase-js`
- `../types/database`
- `./utils`
- `./logger`


### `uploadFile`

Get current user session

**Source:** `src/lib/supabase.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `bucket` | `string` | No | - |
| `path` | `string` | No | - |
| `file` | `File` | No | - |

#### Exports

- **`uploadFile`**: `(bucket: string,
  path: string,
  file: File) => Promise<`

#### Dependencies

- `@supabase/supabase-js`
- `../types/database`
- `./utils`
- `./logger`


### `deleteFile`

Sign out

**Source:** `src/lib/supabase.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `bucket` | `string` | No | - |
| `path` | `string` | No | - |

#### Exports

- **`deleteFile`**: `(bucket: string, path: string) => void`

#### Dependencies

- `@supabase/supabase-js`
- `../types/database`
- `./utils`
- `./logger`


### `supabase`

**Source:** `src/lib/supabase.ts`

#### Exports

- **`supabase`**: `any`

#### Dependencies

- `@supabase/supabase-js`
- `../types/database`
- `./utils`
- `./logger`


### `cn`

Utility functions for Zyeuté

**Source:** `src/lib/utils.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `inputs` | `ClassValue[]` | No | - |

#### Exports

- **`cn`**: `(...inputs: ClassValue[]) => void`

#### Dependencies

- `clsx`
- `tailwind-merge`


### `formatNumber`

Utility functions for Zyeuté

**Source:** `src/lib/utils.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `num` | `number` | No | - |

#### Exports

- **`formatNumber`**: `(num: number) => string`

#### Dependencies

- `clsx`
- `tailwind-merge`


### `formatDuration`

Utility functions for Zyeuté

**Source:** `src/lib/utils.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `seconds` | `number` | No | - |

#### Exports

- **`formatDuration`**: `(seconds: number) => string`

#### Dependencies

- `clsx`
- `tailwind-merge`


### `getTimeAgo`

Utility functions for Zyeuté

**Source:** `src/lib/utils.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `date` | `Date` | No | - |

#### Exports

- **`getTimeAgo`**: `(date: Date) => string`

#### Dependencies

- `clsx`
- `tailwind-merge`


### `isValidPostalCode`

Format video duration from seconds

**Source:** `src/lib/utils.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `code` | `string` | No | - |

#### Exports

- **`isValidPostalCode`**: `(code: string) => boolean`

#### Examples

```typescript
formatDuration(125) => "2:05"
```

```typescript
formatDuration(3665) => "1:01:05"
```

#### Dependencies

- `clsx`
- `tailwind-merge`


### `extractHashtags`

Format video duration from seconds

**Source:** `src/lib/utils.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `text` | `string` | No | - |

#### Exports

- **`extractHashtags`**: `(text: string) => string[]`

#### Examples

```typescript
formatDuration(125) => "2:05"
```

```typescript
formatDuration(3665) => "1:01:05"
```

#### Dependencies

- `clsx`
- `tailwind-merge`


### `truncate`

Get relative time ago in Quebec French

**Source:** `src/lib/utils.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `text` | `string` | No | - |
| `maxLength` | `number` | No | - |

#### Exports

- **`truncate`**: `(text: string, maxLength: number) => string`

#### Examples

```typescript
getTimeAgo(new Date(Date.now() - 60000)) => "Il y a 1 minute"
```

#### Dependencies

- `clsx`
- `tailwind-merge`


### `generateId`

Get relative time ago in Quebec French

**Source:** `src/lib/utils.ts`

#### Exports

- **`generateId`**: `() => string`

#### Examples

```typescript
getTimeAgo(new Date(Date.now() - 60000)) => "Il y a 1 minute"
```

#### Dependencies

- `clsx`
- `tailwind-merge`


### `isUserOnline`

Get relative time ago in Quebec French

**Source:** `src/lib/utils.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `lastSeen` | `Date | null` | No | - |

#### Exports

- **`isUserOnline`**: `(lastSeen: Date | null) => boolean`

#### Examples

```typescript
getTimeAgo(new Date(Date.now() - 60000)) => "Il y a 1 minute"
```

#### Dependencies

- `clsx`
- `tailwind-merge`


### `extractSupabaseProjectRef`

Validate Quebec postal code format

**Source:** `src/lib/utils.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `url` | `string` | No | - |

#### Exports

- **`extractSupabaseProjectRef`**: `(url: string) => string | null`

#### Dependencies

- `clsx`
- `tailwind-merge`


### `validateSupabaseUrl`

Truncate text with ellipsis

**Source:** `src/lib/utils.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `url` | `string` | No | - |
| `expectedRef` | `string = 'vuanulvyqkfefmjcikfk'` | No | - |

#### Exports

- **`validateSupabaseUrl`**: `(url: string, expectedRef: string = 'vuanulvyqkfefmjcikfk') => void`

#### Dependencies

- `clsx`
- `tailwind-merge`


### `validateComment`

Input Validation Utilities
Security: Validates user inputs to prevent injection attacks and ensure data integrity

**Source:** `src/lib/validation.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `text` | `string` | No | - |

#### Exports

- **`validateComment`**: `(text: string) => ValidationResult`


### `validatePostCaption`

Input Validation Utilities
Security: Validates user inputs to prevent injection attacks and ensure data integrity

**Source:** `src/lib/validation.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `text` | `string` | No | - |

#### Exports

- **`validatePostCaption`**: `(text: string) => ValidationResult`


### `validateBio`

Validate comment input
Checks length and scans for suspicious patterns (XSS attempts)

**Source:** `src/lib/validation.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `text` | `string` | No | - |

#### Exports

- **`validateBio`**: `(text: string) => ValidationResult`


### `validateSearchQuery`

Validate post caption

**Source:** `src/lib/validation.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `text` | `string` | No | - |

#### Exports

- **`validateSearchQuery`**: `(text: string) => ValidationResult`


### `sanitizeText`

Validate profile bio

**Source:** `src/lib/validation.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `text` | `string` | No | - |

#### Exports

- **`sanitizeText`**: `(text: string) => string`


### `validateUsername`

Validate profile bio

**Source:** `src/lib/validation.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `username` | `string` | No | - |

#### Exports

- **`validateUsername`**: `(username: string) => ValidationResult`


### `validateEmail`

Validate search query

**Source:** `src/lib/validation.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `email` | `string` | No | - |

#### Exports

- **`validateEmail`**: `(email: string) => ValidationResult`


### `MAX_COMMENT_LENGTH`

**Source:** `src/lib/validation.ts`

#### Exports

- **`MAX_COMMENT_LENGTH`**: `any`


### `MIN_COMMENT_LENGTH`

Input Validation Utilities
Security: Validates user inputs to prevent injection attacks and ensure data integrity

**Source:** `src/lib/validation.ts`

#### Exports

- **`MIN_COMMENT_LENGTH`**: `any`


### `MAX_POST_CAPTION_LENGTH`

Input Validation Utilities
Security: Validates user inputs to prevent injection attacks and ensure data integrity

**Source:** `src/lib/validation.ts`

#### Exports

- **`MAX_POST_CAPTION_LENGTH`**: `any`


### `MAX_BIO_LENGTH`

Input Validation Utilities
Security: Validates user inputs to prevent injection attacks and ensure data integrity

**Source:** `src/lib/validation.ts`

#### Exports

- **`MAX_BIO_LENGTH`**: `any`


### `MAX_SEARCH_QUERY_LENGTH`

Input Validation Utilities
Security: Validates user inputs to prevent injection attacks and ensure data integrity

**Source:** `src/lib/validation.ts`

#### Exports

- **`MAX_SEARCH_QUERY_LENGTH`**: `any`


### `Achievements`

Achievements Page - View all Quebec-themed achievements
Track progress, tier, and unlock rewards

**Source:** `src/pages/Achievements.tsx`

#### Exports

- **`Achievements`**: `React.FC`

#### Dependencies

- `react`
- `../components/Header`
- `../components/BottomNav`
- `../components/Button`
- `../lib/utils`
- `../lib/supabase`


### `Analytics`

Analytics Page - Creator dashboard with statistics and insights

**Source:** `src/pages/Analytics.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `totalPosts` | `number` | No | - |
| `totalViews` | `number` | No | - |
| `totalFires` | `number` | No | - |
| `totalComments` | `number` | No | - |
| `totalFollowers` | `number` | No | - |
| `totalGiftsReceived` | `number` | No | - |
| `avgFireRating` | `number` | No | - |
| `topPost` | `any` | No | - |
| `recentGrowth` | `{` | No | - |
| `posts` | `number` | No | - |
| `followers` | `number` | No | - |
| `engagement` | `number` | No | - |

#### Exports

- **`Analytics`**: `React.FC`

#### Dependencies

- `react`
- `../components/Header`
- `../components/BottomNav`
- `../lib/supabase`
- `../lib/utils`
- `../types`


### `CreatorRevenue`

Creator Revenue Dashboard - Track earnings, subscribers, and payouts
Professional dashboard for content creators

**Source:** `src/pages/CreatorRevenue.tsx`

#### Exports

- **`CreatorRevenue`**: `React.FC`

#### Dependencies

- `react`
- `../components/Header`
- `../components/BottomNav`
- `../components/Button`
- `../lib/supabase`
- `../lib/utils`


### `Explore`

Explore Page - Premium Quebec Heritage Design
Discover trending content with leather grid and gold filters

**Source:** `src/pages/Explore.tsx`

#### Exports

- **`Explore`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `@/components/Header`
- `@/components/BottomNav`
- `@/lib/supabase`
- `@/services/api`
- `@/lib/quebecFeatures`
- `@/lib/utils`
- `@/hooks/useHaptics`
- `@/components/Toast`
- *... and 1 more*


### `Feed`

Feed Page - Premium Quebec Heritage Design
Leather post cards with gold accents and stitching

**Source:** `src/pages/Feed.tsx`

#### Exports

- **`Feed`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `@/components/Header`
- `@/components/BottomNav`
- `@/components/ChatButton`
- `@/components/GoldButton`
- `@/components/SectionHeader`
- `@/components/features/StoryCircle`
- `@/components/features/VideoCard`
- `@/services/api`
- *... and 1 more*


### `Login`

Login Page - Luxury Quebec Heritage Design
Beaver leather texture with gold fleur-de-lys
Louis Vuitton meets Roots Canada aesthetic

**Source:** `src/pages/Login.tsx`

#### Exports

- **`Login`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `@/lib/supabase`


### `Notifications`

Notifications Page - Activity feed

**Source:** `src/pages/Notifications.tsx`

#### Exports

- **`Notifications`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `../components/Header`
- `../components/BottomNav`
- `../components/Avatar`
- `../contexts/NotificationContext`
- `../lib/utils`


### `Player`

Player Page - Full-screen continuous video player
Instagram/TikTok-style vertical scrolling video feed

**Source:** `src/pages/Player.tsx`

#### Exports

- **`Player`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `@/components/features/SingleVideoView`
- `@/lib/supabase`
- `@/hooks/useHaptics`
- `@/types`


### `PostDetail`

PostDetail Page - Full post view with comments and fire rating

**Source:** `src/pages/PostDetail.tsx`

#### Exports

- **`PostDetail`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `../components/Header`
- `../components/Avatar`
- `../components/Button`
- `../components/features/FireRating`
- `../components/features/VideoPlayer`
- `../components/features/CommentThread`
- `../components/features/GiftModal`
- `../lib/supabase`
- *... and 4 more*


### `Profile`

Profile Page - Premium Quebec Heritage Design
Luxury leather profile with gold stats and stitched sections

**Source:** `src/pages/Profile.tsx`

#### Exports

- **`Profile`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `@/components/Header`
- `@/components/BottomNav`
- `@/components/ChatButton`
- `@/components/GoldButton`
- `@/components/Avatar`
- `@/components/Image`
- `@/components/Button`
- `@/services/api`
- *... and 5 more*


### `Settings`

Settings Page - Premium Quebec Heritage Design
Instagram-style layout with beaver leather & gold aesthetic

**Source:** `src/pages/Settings.tsx`

#### Exports

- **`Settings`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `@/components/Header`
- `@/components/BottomNav`
- `@/components/Avatar`
- `@/components/Button`
- `@/lib/supabase`
- `@/components/Toast`
- `@/lib/utils`
- `@/lib/quebecFeatures`
- *... and 3 more*


### `Signup`

Signup Page - Premium Quebec Heritage Design
Matching the luxury login aesthetic

**Source:** `src/pages/Signup.tsx`

#### Exports

- **`Signup`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `@/components/Button`
- `@/components/Logo`
- `@/lib/supabase`
- `@/components/Toast`


### `Upload`

Upload Page - Premium Quebec Heritage Design
Luxury content creation with Ti-Guy AI and gold accents

**Source:** `src/pages/Upload.tsx`

#### Exports

- **`Upload`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `../components/Header`
- `../components/Button`
- `../lib/supabase`
- `../lib/utils`
- `../lib/quebecFeatures`
- `../components/Toast`


### `AdminDashboard`

**Source:** `src/pages/admin/Dashboard.tsx`

#### Exports

- **`AdminDashboard`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `../../components/Header`
- `../../components/BottomNav`
- `../../lib/supabase`
- `../../components/Button`


### `EmailCampaigns`

**Source:** `src/pages/admin/EmailCampaigns.tsx`

#### Exports

- **`EmailCampaigns`**: `React.FC`

#### Dependencies

- `react`
- `../../components/Header`
- `../../components/BottomNav`
- `../../components/Button`
- `../../services/emailService`
- `../../components/Toast`


### `CommunityGuidelines`

Community Guidelines - Quebec-aware content moderation rules

**Source:** `src/pages/legal/CommunityGuidelines.tsx`

#### Exports

- **`CommunityGuidelines`**: `React.FC`

#### Dependencies

- `react`
- `../../components/Header`
- `../../components/BottomNav`


### `PrivacyPolicy`

Privacy Policy - GDPR, PIPEDA, Quebec Law 25, CCPA Compliant

**Source:** `src/pages/legal/PrivacyPolicy.tsx`

#### Exports

- **`PrivacyPolicy`**: `React.FC`

#### Dependencies

- `react`
- `../../components/Header`
- `../../components/BottomNav`


### `TermsOfService`

Terms of Service - Legal agreement for Zyeuté
Quebec Law compliant

**Source:** `src/pages/legal/TermsOfService.tsx`

#### Exports

- **`TermsOfService`**: `React.FC`

#### Dependencies

- `react`
- `../../components/Header`
- `../../components/BottomNav`


### `Moderation`

Moderation Dashboard - Admin-only moderation queue
Real-time content moderation and user management

**Source:** `src/pages/moderation/Moderation.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | No | - |
| `content_type` | `string` | No | - |
| `content_id` | `string` | No | - |
| `user_id` | `string` | No | - |
| `user` | `User` | Yes | - |
| `ai_severity` | `string` | No | - |
| `ai_categories` | `string[]` | No | - |
| `ai_confidence` | `number` | No | - |
| `ai_reason` | `string` | No | - |
| `ai_action` | `string` | No | - |
| `status` | `string` | No | - |
| `created_at` | `string` | No | - |

#### Exports

- **`Moderation`**: `React.FC`

#### Dependencies

- `react`
- `../../components/Header`
- `../../components/Button`
- `../../components/Avatar`
- `../../lib/supabase`
- `../../components/Toast`
- `../../lib/utils`
- `../../types`


### `AppSettings`

App Settings Page

**Source:** `src/pages/settings/AppSettings.tsx`

#### Exports

- **`AppSettings`**: `React.FC`

#### Dependencies

- `react`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/components/Toast`
- `@/hooks/useHaptics`


### `AudioSettings`

Audio and Music Settings Page

**Source:** `src/pages/settings/AudioSettings.tsx`

#### Exports

- **`AudioSettings`**: `React.FC`

#### Dependencies

- `react`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/components/Toast`
- `@/hooks/useHaptics`


### `CommentsSettings`

Comments Settings Page

**Source:** `src/pages/settings/CommentsSettings.tsx`

#### Exports

- **`CommentsSettings`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/components/Toast`
- `@/hooks/useHaptics`


### `ContentPreferencesSettings`

Content Preferences Settings Page

**Source:** `src/pages/settings/ContentPreferencesSettings.tsx`

#### Exports

- **`ContentPreferencesSettings`**: `React.FC`

#### Dependencies

- `react`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/components/Toast`
- `@/hooks/useHaptics`


### `FavoritesSettings`

Favorites Settings Page

**Source:** `src/pages/settings/FavoritesSettings.tsx`

#### Exports

- **`FavoritesSettings`**: `React.FC`

#### Dependencies

- `react`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/components/Toast`
- `@/hooks/useHaptics`


### `LanguageSettings`

Language Settings Page

**Source:** `src/pages/settings/LanguageSettings.tsx`

#### Exports

- **`LanguageSettings`**: `React.FC`

#### Dependencies

- `react`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/components/Toast`
- `@/hooks/useHaptics`


### `MediaSettings`

Photos and Videos Settings Page

**Source:** `src/pages/settings/MediaSettings.tsx`

#### Exports

- **`MediaSettings`**: `React.FC`

#### Dependencies

- `react`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/components/Toast`
- `@/hooks/useHaptics`


### `MutedAccountsSettings`

Muted Accounts Settings Page

**Source:** `src/pages/settings/MutedAccountsSettings.tsx`

#### Exports

- **`MutedAccountsSettings`**: `React.FC`

#### Dependencies

- `react`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/components/Toast`
- `@/hooks/useHaptics`
- `@/lib/supabase`


### `NotificationSettings`

Notification Settings Page

**Source:** `src/pages/settings/NotificationSettings.tsx`

#### Exports

- **`NotificationSettings`**: `React.FC`

#### Dependencies

- `react`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/components/Toast`
- `@/hooks/useHaptics`


### `PrivacySettings`

Privacy and Security Settings Page

**Source:** `src/pages/settings/PrivacySettings.tsx`

#### Exports

- **`PrivacySettings`**: `React.FC`

#### Dependencies

- `react`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/components/Toast`
- `@/hooks/useHaptics`


### `ProfileEditSettings`

Profile Edit Settings Page

**Source:** `src/pages/settings/ProfileEditSettings.tsx`

#### Exports

- **`ProfileEditSettings`**: `React.FC`

#### Dependencies

- `react`
- `@/components/Header`
- `@/components/BottomNav`
- `@/components/Avatar`
- `@/lib/supabase`
- `@/lib/quebecFeatures`
- `@/components/Toast`
- `@/hooks/useHaptics`
- `@/services/api`


### `RegionSettings`

Region Settings Page - Select Quebec Region

**Source:** `src/pages/settings/RegionSettings.tsx`

#### Exports

- **`RegionSettings`**: `React.FC`

#### Dependencies

- `react`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/lib/quebecFeatures`
- `@/lib/supabase`
- `@/components/Toast`
- `@/hooks/useHaptics`


### `RestrictedAccountsSettings`

Restricted Accounts Settings Page

**Source:** `src/pages/settings/RestrictedAccountsSettings.tsx`

#### Exports

- **`RestrictedAccountsSettings`**: `React.FC`

#### Dependencies

- `react`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/components/Toast`
- `@/hooks/useHaptics`
- `@/lib/supabase`


### `SharingSettings`

Sharing and Remixes Settings Page

**Source:** `src/pages/settings/SharingSettings.tsx`

#### Exports

- **`SharingSettings`**: `React.FC`

#### Dependencies

- `react`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/components/Toast`
- `@/hooks/useHaptics`


### `StorageSettings`

Storage and Data Settings Page

**Source:** `src/pages/settings/StorageSettings.tsx`

#### Exports

- **`StorageSettings`**: `React.FC`

#### Dependencies

- `react`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/components/Toast`
- `@/hooks/useHaptics`


### `TagsSettings`

Tags and Mentions Settings Page

**Source:** `src/pages/settings/TagsSettings.tsx`

#### Exports

- **`TagsSettings`**: `React.FC`

#### Dependencies

- `react`
- `react-router-dom`
- `@/components/Header`
- `@/components/BottomNav`
- `@/hooks/useSettingsPreferences`
- `@/components/Toast`
- `@/hooks/useHaptics`


### `SecurityAuditSchema`

**Source:** `src/schemas/SecurityAuditSchema.ts`

#### Exports

- **`SecurityAuditSchema`**: `any`


### `getTiGuyResponse`

Detects the intent from user message using keyword matching

**Source:** `src/utils/tiGuyResponses.ts`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `userMessage` | `string` | No | - |

#### Exports

- **`getTiGuyResponse`**: `(userMessage: string) => ChatMessage`

#### Dependencies

- `@/types/chat`


### `getTiGuyWelcomeMessage`

Generates a TI-Guy response based on user message

**Source:** `src/utils/tiGuyResponses.ts`

#### Exports

- **`getTiGuyWelcomeMessage`**: `() => ChatMessage`

#### Dependencies

- `@/types/chat`

#### Returns

- **Description**: A ChatMessage object with TI-Guy's response

