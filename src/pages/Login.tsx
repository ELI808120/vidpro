import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/DataService';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
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

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/');
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast.error('שגיאה בהתחברות: ' + error.message);
      setLoading(false);
    } else {
      toast.success('התחברת בהצלחה! מעביר אותך...');
      setTimeout(() => navigate('/'), 1000);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // יחזיר את המשתמש לדף הבית לאחר אימות
      },
    });
    if (error) {
        toast.error('שגיאה בהתחברות עם גוגל: ' + error.message);
        setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#001e3c] px-4" dir="rtl">
      <Toaster />
      <div className="w-full max-w-md bg-[#0a2744] rounded-[40px] p-10 border border-blue-800 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-2xl mb-6 shadow-lg rotate-3">
            <LogIn className="text-[#001e3c]" size={40} />
          </div>
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">ברוכים הבאים</h1>
          <p className="text-blue-300 font-bold mt-2 text-sm italic">התחברו כדי לשתף ולהגיב ב-Streamil</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* ...שדות אימייל וסיסמה נשארים ללא שינוי... */}

          <button 
            disabled={loading}
            className="w-full bg-yellow-400 text-[#001e3c] py-5 rounded-2xl font-black text-xl hover:bg-yellow-300 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'התחברות עם אימייל'}
          </button>
        </form>

        {/* קו הפרדה */}
        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-blue-700/50"></div>
            <span className="flex-shrink mx-4 text-blue-400 text-xs font-bold">או</span>
            <div className="flex-grow border-t border-blue-700/50"></div>
        </div>

        {/* כפתור גוגל */}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-gray-700 py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
        >
          <GoogleIcon className="w-6 h-6" />
          התחברות עם גוגל
        </button>

        <div className="mt-8 text-center">
          <p className="text-blue-400 font-bold text-sm">
            עדיין אין לך חשבון? <button onClick={() => navigate('/signup')} className="text-yellow-400 hover:underline">הירשם עכשיו</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
