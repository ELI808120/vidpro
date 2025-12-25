import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/DataService';
import { Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Upload from './pages/Upload';
import VideoView from './pages/VideoView';
import VideoDetails from './pages/VideoDetails';
import Search from './pages/Search';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import AdminAds from './pages/AdminAds';
import AdminControl from './pages/AdminControl';
import AdminDashboard from './pages/AdminDashboard';
import AdminChangelog from './pages/AdminChangelog';
import About from './pages/About';
import Contact from './pages/Contact';
import Policy from './pages/Policy';
import Terms from './pages/Terms';
import Maintenance from './pages/Maintenance';
import Advertisers from './pages/Advertisers';
import NotFound from './pages/NotFound';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async (currentSession: Session | null) => {
      if (currentSession?.user) {
        // Check if the user is in the site_admins table
        const { data, error } = await supabase
          .from('site_admins')
          .select('email')
          .eq('email', currentSession.user.email?.toUpperCase())
          .maybeSingle();
        
        // Set admin status based on the query result
        setIsAdmin(!!data && !error);
      } else {
        // No active session, so user is not an admin
        setIsAdmin(false);
      }
    };

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkUser(session);
      // We only stop loading after the first check is complete
      if (loading) setLoading(false);
    });

    // Initial check when the component mounts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkUser(session).finally(() => {
        setLoading(false);
      });
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show a full-screen loader while the initial session is being verified.
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
        <main className="flex-grow">
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
            
            {/* Protected Routes for Standard Users (if any in the future) */}
            {/* For now, Profile and Settings are also admin-protected as a safe default */}
            <Route path="/profile" element={<ProtectedRoute session={session} isAdmin={isAdmin}><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute session={session} isAdmin={isAdmin}><Settings /></ProtectedRoute>} />

            {/* Protected Admin Routes */}
            <Route path="/upload" element={<ProtectedRoute session={session} isAdmin={isAdmin}><Upload /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute session={session} isAdmin={isAdmin}><Admin /></ProtectedRoute>} />
            <Route path="/admin/ads" element={<ProtectedRoute session={session} isAdmin={isAdmin}><AdminAds /></ProtectedRoute>} />
            <Route path="/admin/control" element={<ProtectedRoute session={session} isAdmin={isAdmin}><AdminControl /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute session={session} isAdmin={isAdmin}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/changelog" element={<ProtectedRoute session={session} isAdmin={isAdmin}><AdminChangelog /></ProtectedRoute>} />

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
