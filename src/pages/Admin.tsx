import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/DataService';
import { Megaphone, Save, ShieldAlert, Loader2 } from 'lucide-react';

const ADMIN_EMAIL = "A052763527@GMAIL.COM";

const Admin: React.FC = () => {
  const [adTitle, setAdTitle] = useState("הצטרפו למהפכת הוידאו");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.email?.toUpperCase() !== ADMIN_EMAIL.toUpperCase()) {
        navigate('/');
        return;
      }
      setLoading(false);
    };
    checkAdmin();
  }, [navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#001e3c]"><Loader2 className="animate-spin text-yellow-400" /></div>;

  return (
    <div className="min-h-screen bg-[#001e3c] text-white p-12" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-10 italic flex items-center gap-4">
          <ShieldAlert className="text-yellow-400" /> פאנל ניהול פרסומות
        </h1>
        <div className="bg-[#0a2744] p-8 rounded-[32px] border border-blue-800 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6"><Megaphone className="text-yellow-400" /><h2 className="text-xl font-bold">ערוך באנר ראשי</h2></div>
          <div className="space-y-6">
            <div>
              <label className="block text-blue-300 mb-2 mr-2 text-sm font-bold">כותרת הבאנר</label>
              <input value={adTitle} onChange={(e) => setAdTitle(e.target.value)} className="w-full bg-[#001e3c] border border-blue-800 rounded-2xl p-4 outline-none focus:border-yellow-400 transition-all font-bold" />
            </div>
            <button className="bg-yellow-400 text-[#001e3c] px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg w-full justify-center"><Save size={20} /> שמור שינויים</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;