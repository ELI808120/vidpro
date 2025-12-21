import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/DataService';
import { useNavigate } from 'react-router-dom';
import { User, Loader2, LogOut, MessageSquare, CheckCircle, Clock } from 'lucide-react';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }
      setUser(session.user);

      const { data: msgData } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      setMessages(msgData || []);
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#001e3c]"><Loader2 className="animate-spin text-yellow-400" size={48} /></div>;

  return (
    <div className="min-h-screen bg-[#001e3c] text-white py-12 px-6" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* כרטיס פרופיל */}
        <div className="bg-[#0a2744] p-10 rounded-[50px] border border-blue-800 shadow-2xl flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-[#001e3c] shadow-lg">
            <User size={48} />
          </div>
          <div className="flex-grow text-center md:text-right">
            <h1 className="text-3xl font-black italic uppercase">{user?.email?.split('@')[0]}</h1>
            <p className="text-blue-400 font-bold">{user?.email}</p>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => navigate('/login'))} className="bg-red-500/10 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
            <LogOut />
          </button>
        </div>

        {/* היסטוריית פניות ותשובות */}
        <div className="bg-[#0a2744] p-10 rounded-[50px] border border-blue-800 shadow-2xl">
          <h2 className="text-2xl font-black italic mb-8 flex items-center gap-3 text-yellow-400">
            <MessageSquare /> הפניות שלי
          </h2>
          <div className="space-y-4">
            {messages.length === 0 && <p className="text-blue-500 italic font-bold text-center">טרם שלחת פניות לשירות הלקוחות.</p>}
            {messages.map(msg => (
              <div key={msg.id} className="bg-[#001e3c] p-6 rounded-3xl border border-blue-900">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-black text-lg">{msg.subject}</h4>
                  {msg.admin_reply ? (
                    <span className="flex items-center gap-1 text-green-400 text-xs font-black italic"><CheckCircle size={14}/> התקבלה תשובה</span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-400 text-xs font-black italic"><Clock size={14}/> בטיפול</span>
                  )}
                </div>
                <p className="text-blue-200 text-sm mb-4">" {msg.message} "</p>
                {msg.admin_reply && (
                  <div className="bg-blue-900/30 p-4 rounded-2xl border-r-4 border-yellow-400 mt-2">
                    <p className="text-yellow-400 text-xs font-black mb-1 uppercase tracking-widest">תשובת המנהל:</p>
                    <p className="text-white font-bold">{msg.admin_reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;