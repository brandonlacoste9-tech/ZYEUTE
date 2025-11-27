/**
 * ProtectedAdminRoute - Route wrapper for admin-only pages
 * TODO: Implement proper admin role checking
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  // TODO: Check if user has admin role
  const isAdmin = false; // Placeholder - should check actual admin status
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};
