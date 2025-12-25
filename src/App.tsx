import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/DataService';

// רכיבים קבועים
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// דפים ראשיים
import Home from './pages/Home';
import Upload from './pages/Upload';
import VideoView from './pages/VideoView';
import VideoDetails from './pages/VideoDetails';
import Search from './pages/Search';

// מערכת משתמשים
import Login from './pages/Login';
import Signup from './pages/Signup';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// ניהול (Admin)
import Admin from './pages/Admin';
import AdminAds from './pages/AdminAds';
import AdminControl from './pages/AdminControl';
import AdminDashboard from './pages/AdminDashboard';
import AdminChangelog from './pages/AdminChangelog';

// מידע ותמיכה
import About from './pages/About';
import Contact from './pages/Contact';
import Policy from './pages/Policy';
import Terms from './pages/Terms';
import Maintenance from './pages/Maintenance';
import Advertisers from './pages/Advertisers';
import NotFound from './pages/NotFound';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-[#001e3c] flex flex-col font-sans text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* נתיבים ציבוריים */}
            <Route path="/" element={<Home session={session}/>} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/video/:id" element={<VideoView />} />
            <Route path="/details/:id" element={<VideoDetails />} />
            <Route path="/search" element={<Search />} />

            {/* נתיבי משתמשים */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />

            {/* נתיבי ניהול מוגנים */}
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/admin/ads" element={<ProtectedRoute><AdminAds /></ProtectedRoute>} />
            <Route path="/admin/control" element={<ProtectedRoute><AdminControl /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/changelog" element={<ProtectedRoute><AdminChangelog /></ProtectedRoute>} />

            {/* מידע כללי */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policy" emelent={<Policy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/advertisers" element={<Advertisers />} />
            <Route path="/maintenance" element={<Maintenance />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
