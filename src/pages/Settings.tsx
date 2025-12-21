import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/DataService';
import { Lock, Settings as SettingsIcon, ShieldCheck, Mail, User, Bell, Save, Loader2 } from 'lucide-react';

const ADMIN_EMAIL = "YOUR_ADMIN_EMAIL@GMAIL.COM"; // <-- וודא שהמייל שלך כאן

const Settings: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getUser();
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newPassword = formData.get('password') as string;

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage({ text: 'שגיאה בעדכון הסיסמה: ' + error.message, type: 'error' });
    } else {
      setMessage({ text: 'הסיסמה עודכנה בהצלחה!', type: 'success' });
      (e.target as HTMLFormElement).reset();
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#001e3c]">
      <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#001e3c] py-12 px-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* כותרת דף */}
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-yellow-400 p-3 rounded-2xl shadow-[0_0_20px_rgba(250,204,21,0.4)]">
            <SettingsIcon size={28} className="text-[#001e3c]" />
          </div>
          <h1 className="text-4xl font-black text-white italic">הגדרות חשבון</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* תפריט צדי/מידע משתמש */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0a2744] rounded-[40px] p-8 border border-blue-800 text-center">
              <div className="w-20 h-20 bg-blue-800 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/30">
                <User size={40} className="text-yellow-400" />
              </div>
              <h2 className="text-white font-black text-xl mb-1 truncate">{user?.email?.split('@')[0]}</h2>
              <p className="text-blue-400 text-sm font-bold mb-6 italic">{user?.email}</p>
              
              <div className="pt-6 border-t border-blue-800/50 space-y-4">
                <div className="flex items-center gap-3 text-blue-300 text-sm">
                  <Mail size={16} className="text-yellow-400" />
                  <span>סטטוס: {user?.email_confirmed_at ? 'מאומת' : 'ממתין'}</span>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-3 text-yellow-400 text-sm font-black">
                    <ShieldCheck size={16} />
                    <span>גישת מנהל פעילה</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* טפסים והגדרות */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* טופס שינוי סיסמה */}
            <div className="bg-[#0a2744] rounded-[50px] p-10 border border-blue-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-yellow-400"></div>
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3 italic">
                <Lock className="text-yellow-400" /> אבטחה וסיסמה
              </h3>

              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-blue-300 font-bold mr-2 text-sm uppercase">סיסמה חדשה</label>
                  <input 
                    name="password"
                    type="password" 
                    required
                    placeholder="הזן לפחות 6 תווים..."
                    className="w-full bg-[#001e3c] border border-blue-800 rounded-2xl px-6 py-4 text-white focus:border-yellow-400 outline-none transition-all font-bold"
                  />
                </div>

                {message.text && (
                  <div className={`p-4 rounded-2xl font-bold text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message.text}
                  </div>
                )}

                <button 
                  disabled={saving}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#001e3c] font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  עדכן סיסמה
                </button>
              </form>
            </div>

            {/* העדפות נוספות */}
            <div className="bg-[#0a2744] rounded-[50px] p-10 border border-blue-800 shadow-2xl opacity-60">
               <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3 italic">
                <Bell className="text-blue-400" /> התראות והעדפות
              </h3>
              <p className="text-blue-300 font-bold italic">אפשרויות אלו יהיו זמינות בגרסאות הבאות של Streamil.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;