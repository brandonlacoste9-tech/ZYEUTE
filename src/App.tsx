/**
 * Main App Component with Routing
 * Global Styles Applied via leather-overlay
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { TiGuy } from '@/components/features/TiGuy';
import { LoadingScreen } from '@/components/LoadingScreen';

// Pages
import Feed from '@/pages/Feed';
import Profile from '@/pages/Profile';
import Upload from '@/pages/Upload';
import Explore from '@/pages/Explore';
import PostDetail from '@/pages/PostDetail';
import Notifications from '@/pages/Notifications';
import Settings from '@/pages/Settings';
import Analytics from '@/pages/Analytics';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import AuthCallback from '@/pages/AuthCallback';
import StoryCreator from '@/components/features/StoryCreator';
import Achievements from '@/pages/Achievements';
import { AchievementListener } from '@/components/gamification/AchievementModal';
import CreatorRevenue from '@/pages/CreatorRevenue';
import AdminDashboard from '@/pages/admin/Dashboard';
import EmailCampaigns from '@/pages/admin/EmailCampaigns';
import { ProtectedAdminRoute } from '@/components/auth/ProtectedAdminRoute';

// New Phase 2 Pages
import Artiste from '@/pages/Artiste';
import Studio from '@/pages/Studio';
import Marketplace from '@/pages/Marketplace';
import Premium from '@/pages/Premium';
import Challenges from '@/pages/Challenges';
import VoiceSettingsPage from '@/pages/VoiceSettingsPage';
import GoLive from '@/pages/GoLive';
import WatchLive from '@/pages/WatchLive';
import LiveDiscover from '@/pages/LiveDiscover';

// Moderation
import Moderation from '@/pages/moderation/Moderation';

// Legal Pages
import CommunityGuidelines from '@/pages/legal/CommunityGuidelines';
import TermsOfService from '@/pages/legal/TermsOfService';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <LoadingScreen message="Chargement de Zyeuté..." />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <BrowserRouter>
          {/* Global Leather Overlay for consistent texture */}
          <div className="min-h-screen leather-overlay text-white">
            
            {/* Achievement Listener (Global) */}
            <AchievementListener />

            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Feed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute>
                    <Explore />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/story/create"
                element={
                  <ProtectedRoute>
                    <StoryCreator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:slug"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/p/:id"
                element={
                  <ProtectedRoute>
                    <PostDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              
              {/* Phase 2 Feature Routes */}
              <Route
                path="/artiste"
                element={
                  <ProtectedRoute>
                    <Artiste />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/studio"
                element={
                  <ProtectedRoute>
                    <Studio />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute>
                    <Marketplace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/premium"
                element={
                  <ProtectedRoute>
                    <Premium />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/challenges"
                element={
                  <ProtectedRoute>
                    <Challenges />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/voice"
                element={
                  <ProtectedRoute>
                    <VoiceSettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Live Streaming Routes */}
              <Route
                path="/live"
                element={
                  <ProtectedRoute>
                    <LiveDiscover />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/live/go"
                element={
                  <ProtectedRoute>
                    <GoLive />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/live/watch/:id"
                element={
                  <ProtectedRoute>
                    <WatchLive />
                  </ProtectedRoute>
                }
              />
              
              {/* Moderation Routes (Admin Only) */}
              <Route
                path="/moderation"
                element={
                  <ProtectedRoute>
                    <Moderation />
                  </ProtectedRoute>
                }
              />

              {/* Legal Pages (Public) */}
              <Route path="/legal/community-guidelines" element={<CommunityGuidelines />} />
              <Route path="/legal/terms" element={<TermsOfService />} />
              <Route path="/legal/privacy" element={<PrivacyPolicy />} />

              {/* Gamification */}
              <Route
                path="/achievements"
                element={
                  <ProtectedRoute>
                    <Achievements />
                  </ProtectedRoute>
                }
              />

              {/* Creator Monetization */}
              <Route
                path="/revenue"
                element={
                  <ProtectedRoute>
                    <CreatorRevenue />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/emails"
                element={
                  <ProtectedAdminRoute>
                    <EmailCampaigns />
                  </ProtectedAdminRoute>
                }
              />

              {/* Catch all - redirect to feed */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Ti-Guy mascot assistant (always available) */}
            <TiGuy />
          </div>
          </BrowserRouter>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
