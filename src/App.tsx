import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/DataService';
import { Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load page components for code-splitting
const Home = lazy(() => import('./pages/Home'));
const Upload = lazy(() => import('./pages/Upload'));
const VideoView = lazy(() => import('./pages/VideoView'));
const VideoDetails = lazy(() => import('./pages/VideoDetails'));
const Search = lazy(() => import('./pages/Search'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Auth = lazy(() => import('./pages/Auth'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminAds = lazy(() => import('./pages/AdminAds'));
const AdminControl = lazy(() => import('./pages/AdminControl'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminChangelog = lazy(() => import('./pages/AdminChangelog'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Policy = lazy(() => import('./pages/Policy'));
const Terms = lazy(() => import('./pages/Terms'));
const Maintenance = lazy(() => import('./pages/Maintenance'));
const Advertisers = lazy(() => import('./pages/Advertisers'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Fallback component for Suspense
const LoadingFallback = () => (
  <div className="flex-grow flex items-center justify-center">
    <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
  </div>
);

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async (currentSession: Session | null) => {
      if (currentSession?.user) {
        const { data, error } = await supabase
          .from('site_admins')
          .select('email')
          .eq('email', currentSession.user.email?.toUpperCase())
          .maybeSingle();
        setIsAdmin(!!data && !error);
      } else {
        setIsAdmin(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkUser(session);
      if (loading) setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkUser(session).finally(() => {
        setLoading(false);
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001e3c] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-[#001e3c] flex flex-col font-sans text-white">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public and General Routes */}
              <Route path="/" element={<Home session={session} />} />
              <Route path="/video/:id" element={<VideoView />} />
              <Route path="/details/:id" element={<VideoDetails />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/policy" element={<Policy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/advertisers" element={<Advertisers />} />
              <Route path="/maintenance" element={<Maintenance />} />
              
              {/* Protected Admin Routes */}
              <Route path="/profile" element={<ProtectedRoute session={session} isAdmin={isAdmin}><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute session={session} isAdmin={isAdmin}><Settings /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute session={session} isAdmin={isAdmin}><Upload /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute session={session} isAdmin={isAdmin}><Admin /></ProtectedRoute>} />
              <Route path="/admin/ads" element={<ProtectedRoute session={session} isAdmin={isAdmin}><AdminAds /></ProtectedRoute>} />
              <Route path="/admin/control" element={<ProtectedRoute session={session} isAdmin={isAdmin}><AdminControl /></ProtectedRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute session={session} isAdmin={isAdmin}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/changelog" element={<ProtectedRoute session={session} isAdmin={isAdmin}><AdminChangelog /></ProtectedRoute>} />

              {/* Fallback 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
