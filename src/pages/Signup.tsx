import React, { useState } from 'react';
import { supabase } from '../lib/DataService';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

// אייקון פשוט של גוגל
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" {...props}>
        <path fill="#EA4335" d="M24 9.5c3.21 0 5.83 1.13 7.78 3.01l5.96-5.96C34.35 3.33 29.61 1 24 1 14.77 1 7.14 6.64 3.99 14.54l7.1 5.46C12.72 13.44 17.88 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.12 24.5c0-1.66-.15-3.27-.42-4.82H24v9.1h12.4c-.54 3.1-2.25 5.76-4.78 7.54l7.02 5.49c4.14-3.83 6.48-9.45 6.48-16.31z"/>
        <path fill="#34A853" d="M11.09 29.54c-1.13-3.41-1.13-7.23 0-10.64l-7.1-5.46C.92 19.34 0 24.56 0 30c0 5.56.92 10.78 3.99 16.46l7.1-5.46c-1.63-1.56-2.64-3.71-2.64-6.1z"/>
        <path fill="#FBBC05" d="M24 38.5c6.12 0 11.28-3.96 12.91-9.46l-7.1-5.46c-1.69 3.19-5.06 5.46-9.17 5.46-5.12 0-9.48-3.36-11.02-7.92l-7.1 5.46C7.14 41.36 14.77 47 24 47c5.61 0 10.35-1.93 13.88-5.1l-7-5.4c-1.95 1.88-4.57 3-7.78 3z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
);

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    
    if (data.user && data.user.identities?.length === 0) {
      toast.error("האימייל הזה כבר רשום במערכת.");
    } else {
      toast.success("נרשמת בהצלחה! כעת תוכל להתחבר.");
      setTimeout(() => navigate('/login'), 2000);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
        toast.error('שגיאה בהתחברות עם גוגל: ' + error.message);
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#001e3c]" dir="rtl">
      <Toaster />
      <div className="bg-blue-900/20 p-8 rounded-[32px] border border-blue-800 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-black mb-6 italic text-white text-center">
          יצירת <span className="text-yellow-400">חשבון</span>
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* ...שדות אימייל וסיסמה... */}
          <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-black italic uppercase transition-all shadow-lg bg-yellow-400 text-black hover:scale-105 active:scale-95 disabled:opacity-50">
            {loading ? 'רושם אותך...' : 'הרשמה עם אימייל'}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-blue-700/50"></div>
            <span className="flex-shrink mx-4 text-blue-400 text-xs font-bold">או</span>
            <div className="flex-grow border-t border-blue-700/50"></div>
        </div>

        <button onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white text-gray-700 py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
          <GoogleIcon className="w-6 h-6" />
          המשך עם גוגל
        </button>

        <p className="mt-6 text-center text-blue-400 text-sm">
          כבר יש לך חשבון? <Link to="/login" className="text-yellow-400 font-bold hover:underline">התחבר כאן</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
