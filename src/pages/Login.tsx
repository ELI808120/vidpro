import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/DataService';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // אם המשתמש כבר מחובר, אין סיבה שיהיה בדף הזה
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/');
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast.error('שגיאה בהתחברות: ' + error.message);
      setLoading(false);
    } else {
      toast.success('התחברת בהצלחה! מעביר אותך...');
      // השהייה קלה כדי שהמשתמש יראה את הודעת ההצלחה
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#001e3c] px-4" dir="rtl">
      <Toaster />
      <div className="w-full max-w-md bg-[#0a2744] rounded-[40px] p-10 border border-blue-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-400 opacity-10 blur-3xl rounded-full"></div>
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-2xl mb-6 shadow-lg rotate-3">
            <LogIn className="text-[#001e3c]" size={40} />
          </div>
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">ברוכים הבאים</h1>
          <p className="text-blue-300 font-bold mt-2 text-sm italic">התחברו כדי לשתף ולהגיב ב-Streamil</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute right-4 top-4 text-blue-400 group-focus-within:text-yellow-400 transition-colors" size={20} />
            <input 
              type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full bg-[#001e3c] border border-blue-800 focus:border-yellow-400 rounded-2xl p-4 pr-12 text-white outline-none transition-all font-bold"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute right-4 top-4 text-blue-400 group-focus-within:text-yellow-400 transition-colors" size={20} />
            <input 
              type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full bg-[#001e3c] border border-blue-800 focus:border-yellow-400 rounded-2xl p-4 pr-12 text-white outline-none transition-all font-bold"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-yellow-400 text-[#001e3c] py-5 rounded-2xl font-black text-xl hover:bg-yellow-300 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'התחברות'}
          </button>
        </form>

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