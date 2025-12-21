import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/DataService';
import { toast, Toaster } from 'react-hot-toast';
import { Send, MessageSquare, Mail, User as UserIcon, Loader2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({ subject: '', message: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('עליך להיות מחובר כדי לשלוח פנייה');
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.from('contact_messages').insert([{
      user_id: user.id,
      email: user.email,
      subject: formData.subject,
      message: formData.message,
      status: 'open'
    }]);

    if (error) {
      toast.error('שגיאה בשליחת ההודעה');
    } else {
      toast.success('הפנייה נשלחה! המנהל ישיב לך בהקדם.');
      setFormData({ subject: '', message: '' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#001e3c] text-white py-20 px-6" dir="rtl">
      <Toaster />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-yellow-400 p-4 rounded-3xl text-[#001e3c] mb-6 shadow-xl">
            <MessageSquare size={40} />
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">צור <span className="text-yellow-400">קשר</span></h1>
          <p className="text-blue-300 mt-4 font-bold">יש לך שאלה? נתקלת בבעיה? אנחנו כאן בשבילך.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0a2744] p-10 rounded-[50px] border border-blue-800 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
             <div className="bg-[#001e3c] p-4 rounded-2xl border border-blue-900 flex items-center gap-3">
               <UserIcon size={20} className="text-yellow-400" />
               <span className="font-bold text-sm">{user?.email || 'אורח'}</span>
             </div>
             <div className="bg-[#001e3c] p-4 rounded-2xl border border-blue-900 flex items-center gap-3">
               <Mail size={20} className="text-yellow-400" />
               <span className="font-bold text-sm">המייל שלך מזוהה אוטומטית</span>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase italic mr-2 text-blue-400">נושא הפנייה</label>
            <input 
              required 
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              placeholder="לדוגמה: בעיה בהעלאת סרטון" 
              className="w-full bg-[#001e3c] border border-blue-800 rounded-2xl px-6 py-4 outline-none focus:border-yellow-400 font-bold" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase italic mr-2 text-blue-400">תוכן ההודעה</label>
            <textarea 
              required 
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              placeholder="כתוב לנו כאן את כל הפרטים..." 
              className="w-full bg-[#001e3c] border border-blue-800 rounded-2xl px-6 py-4 outline-none focus:border-yellow-400 font-bold h-40 resize-none"
            />
          </div>

          <button 
            disabled={loading || !user} 
            className="w-full bg-yellow-400 text-[#001e3c] font-black py-5 rounded-2xl shadow-xl hover:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase italic disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={24} />} 
            {user ? 'שלח פנייה עכשיו' : 'יש להתחבר כדי לשלוח'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;