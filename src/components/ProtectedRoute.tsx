import React from 'react';
import { Navigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
  session: Session | null;
  isAdmin: boolean;
}

/**
 * A component that protects routes, allowing access only to authenticated admin users.
 * It relies on the parent component (`App.tsx`) to provide the session and admin status,
 * and does not perform any data fetching itself.
 */
const ProtectedRoute = ({ children, session, isAdmin }: ProtectedRouteProps) => {
  // Global loading state is now handled by App.tsx.
  // If there is no active session or the user is not an admin, redirect.
  if (!session || !isAdmin) {
    // Redirect to the home page, replacing the current entry in the history stack
    // so the user can't click "back" to the protected page.
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated and is an admin, render the requested component.
  return <>{children}</>;
};

export default ProtectedRoute;
