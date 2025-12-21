import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/DataService';
import { Search, User, MessageSquare } from 'lucide-react';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  // סנכרון התחלתי מול ה-LocalStorage
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('is_admin') === 'true');
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false); 
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          // אם כבר יש אישור בזיכרון, נשתמש בו ונביא הודעות
          if (localStorage.getItem('is_admin') === 'true') {
            setIsAdmin(true);
            fetchUnreadCount();
          } else {
            await checkAdminStatus(currentUser.email);
          }
        }
      } catch (err) {
        console.error("[NAVBAR ERROR]", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // האזנה לשינויי התחברות/התנתקות
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('is_admin');
        setIsAdmin(false);
        setUnreadCount(0);
      } else if (currentUser) {
        await checkAdminStatus(currentUser.email);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (email: string | undefined) => {
    if (!email) return;
    try {
      const { data, error } = await supabase
        .from('site_admins')
        .select('email')
        .eq('email', email.trim().toUpperCase())
        .maybeSingle();

      const status = !!data && !error;
      setIsAdmin(status);
      localStorage.setItem('is_admin', String(status));
      if (status) fetchUnreadCount();
    } catch (err) {
      setIsAdmin(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const { count } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');
      setUnreadCount(count || 0);
    } catch (err) {
      console.error("Error fetching unread count", err);
    }
  };

  return (
    <nav className="bg-[#001e3c] border-b border-blue-900/50 px-6 py-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-90" dir="rtl">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
        <Link to="/" className="text-2xl font-black italic text-white hover:text-yellow-400 transition-all">
          VID<span className="text-yellow-400">PRO</span>
        </Link>

        {/* שדה חיפוש מלא */}
        <form onSubmit={(e) => { e.preventDefault(); navigate(`/search?q=${searchQuery}`); }} className="flex-grow max-w-2xl relative hidden md:block">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
          <input 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder="חפש סרטון..." 
            className="w-full bg-blue-900/20 border border-blue-800 rounded-2xl py-3 pr-12 pl-6 outline-none focus:border-yellow-400 text-white font-bold" 
          />
        </form>

        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin/control" className="p-3 bg-blue-900/40 rounded-xl text-blue-400 hover:text-yellow-400 relative transition-all">
                      <MessageSquare size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -left-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#001e3c]">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  )}
                  <Link to="/profile" className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-[#001e3c] font-black hover:scale-105 transition-all">
                    <User size={20} />
                  </Link>
                </>
              ) : (
                <Link to="/login" className="bg-yellow-400 text-[#001e3c] px-6 py-2.5 rounded-xl font-black text-sm uppercase italic hover:bg-yellow-300 transition-all">
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;