import React, { useState } from 'react';
import { supabase } from '../lib/DataService';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    // מניעת רענון הדף - קריטי כדי שהטופס לא יתאפס סתם
    e.preventDefault();
    
    console.log("--- [DEBUG] Signup Attempt Started ---");
    console.log("Email:", email);

    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        console.error("--- [DEBUG] Supabase Signup Error:", error.message);
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      console.log("--- [DEBUG] Signup Success! Data:", data);
      
      if (data.user && data.user.identities?.length === 0) {
        setErrorMsg("האימייל הזה כבר רשום במערכת.");
      } else {
        alert("נרשמת בהצלחה! בדוק את תיבת המייל לאישור החשבון (אם מוגדר אישור מייל).");
        navigate('/login');
      }
    } catch (err) {
      console.error("--- [DEBUG] Unexpected Crash:", err);
      setErrorMsg("אירעה שגיאה בלתי צפויה.");
    } finally {
      setLoading(false);
      console.log("--- [DEBUG] Signup Process Finished ---");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#001e3c]" dir="rtl">
      <div className="bg-blue-900/20 p-8 rounded-[32px] border border-blue-800 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-black mb-6 italic text-white text-center">
          יצירת <span className="text-yellow-400">חשבון</span>
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2 mr-2 text-blue-200">אימייל</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-blue-900/40 border border-blue-800 p-4 rounded-2xl outline-none focus:border-yellow-400 text-white transition-all"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 mr-2 text-blue-200">סיסמה</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-blue-900/40 border border-blue-800 p-4 rounded-2xl outline-none focus:border-yellow-400 text-white transition-all"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm font-bold text-center">
              {errorMsg}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black italic uppercase transition-all shadow-lg ${
              loading ? 'bg-blue-800 text-blue-400' : 'bg-yellow-400 text-black hover:scale-105 active:scale-95'
            }`}
          >
            {loading ? 'רושם אותך...' : 'הרשמה עכשיו'}
          </button>
        </form>

        <p className="mt-6 text-center text-blue-400 text-sm">
          כבר יש לך חשבון? <Link to="/login" className="text-yellow-400 font-bold hover:underline">התחבר כאן</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;