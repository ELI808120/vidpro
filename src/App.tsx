import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/DataService';
import { Loader2 } from 'lucide-react';

// ... imports for components and pages ...
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
  const [session, setSession] = useState<any | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // בדוק את הסשן הנוכחי פעם אחת כשהאפליקציה נטענת
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });

    // האזן לשינויים במצב האימות (כניסה/יציאה)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // אין צורך לשנות את loadingAuth כאן, זה רק לטעינה הראשונית
    });

    // נקה את המאזין כשהרכיב יורד
    return () => subscription.unsubscribe();
  }, []);

  // בזמן בדיקת האימות, הצג מסך טעינה כללי
  if (loadingAuth) {
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
            {/* העבר את הסשן המאומת לכל הדפים הזקוקים לו */}
            <Route path="/" element={<Home session={session}/>} />
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/video/:id" element={<VideoView />} />
            <Route path="/details/:id" element={<VideoDetails />} />
            <Route path="/search" element={<Search />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/admin/ads" element={<ProtectedRoute><AdminAds /></ProtectedRoute>} />
            <Route path="/admin/control" element={<ProtectedRoute><AdminControl /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/changelog" element={<ProtectedRoute><AdminChangelog /></ProtectedRoute>} />

            {/* ... שאר הנתיבים ... */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/advertisers" element={<Advertisers />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
