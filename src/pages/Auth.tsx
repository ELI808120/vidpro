import React, { useState } from 'react';
import { supabase } from '../lib/DataService';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success(isSignUp ? 'נרשמת בהצלחה!' : 'התחברת בהצלחה!');
      // התיקון הקריטי: מרענן את הדף כדי לאפס את כל ה-State של האפליקציה
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 text-right" dir="rtl">
      <Toaster />
      <div className="text-center mb-8">
        <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <LogIn className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-black dark:text-white italic">{isSignUp ? 'הרשמה' : 'התחברות'}</h1>
        <p className="text-slate-400 font-bold mt-2 italic">ברוך הבא ל-Streamil</p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div className="relative">
          <input 
            type="email" placeholder="אימייל" required
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl pr-12 outline-none focus:ring-2 ring-blue-500 transition-all font-bold"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <Mail className="absolute right-4 top-4 text-slate-400" size={20} />
        </div>
        <div className="relative">
          <input 
            type="password" placeholder="סיסמה" required
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl pr-12 outline-none focus:ring-2 ring-blue-500 transition-all font-bold"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <Lock className="absolute right-4 top-4 text-slate-400" size={20} />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'צור חשבון' : 'כניסה למערכת')}
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
            או התחבר עם
          </span>
        </div>
      </div>

      <div>
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'התחבר עם גוגל'}
        </button>
      </div>

      <button 
        onClick={() => setIsSignUp(!isSignUp)}
        className="w-full mt-6 text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-blue-600 transition-colors"
      >
        {isSignUp ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם עכשיו'}
      </button>
    </div>
  );
};

export default Auth;
