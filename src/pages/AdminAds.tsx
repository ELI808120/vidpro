import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/DataService';
import { useNavigate } from 'react-router-dom';
import { Layout, PlusCircle, Trash2, ExternalLink, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const AdminAds: React.FC = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAd, setNewAd] = useState({ title: '', image_url: '', link_url: '', position: 'top' });
  const navigate = useNavigate();
  const ADMIN_EMAIL = 'a052763527@gmail.com';

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.email !== ADMIN_EMAIL) {
      navigate('/');
      return;
    }
    fetchAds();
  };

  const fetchAds = async () => {
    const { data, error } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    if (error) toast.error('שגיאה בטעינת פרסומות');
    else setAds(data || []);
    setLoading(false);
  };

  const handleAddAd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('ads').insert([newAd]);
    if (error) {
      toast.error('שגיאה בהוספת הפרסומת');
    } else {
      toast.success('הפרסומת נוספה בהצלחה!');
      setNewAd({ title: '', image_url: '', link_url: '', position: 'top' });
      fetchAds();
    }
  };

  const deleteAd = async (id: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק פרסומת זו?')) return;
    const { error } = await supabase.from('ads').delete().eq('id', id);
    if (error) toast.error('שגיאה במחיקה');
    else {
      toast.success('נמחק בהצלחה');
      fetchAds();
    }
  };

  const toggleAdStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('ads').update({ is_active: !currentStatus }).eq('id', id);
    if (error) toast.error('שגיאה בעדכון סטטוס');
    else fetchAds();
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 text-right" dir="rtl">
      <Toaster />
      <div className="flex justify-between items-center mb-10 flex-row-reverse">
        <h1 className="text-4xl font-black flex items-center gap-3">
          <Layout className="text-blue-600" /> ניהול פרסומות
        </h1>
      </div>

      {/* טופס הוספה */}
      <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 mb-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <PlusCircle size={20} className="text-green-500" /> הוספת פרסומת חדשה
        </h2>
        <form onSubmit={handleAddAd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input 
            type="text" placeholder="כותרת הפרסומת" 
            className="p-4 bg-slate-50 rounded-2xl border-none font-bold"
            value={newAd.title} onChange={e => setNewAd({...newAd, title: e.target.value})} required
          />
          <input 
            type="text" placeholder="מיקום (למשל: top, sidebar, popup)" 
            className="p-4 bg-slate-50 rounded-2xl border-none font-bold"
            value={newAd.position} onChange={e => setNewAd({...newAd, position: e.target.value})} required
          />
          <input 
            type="url" placeholder="קישור לתמונה (URL)" 
            className="p-4 bg-slate-50 rounded-2xl border-none font-bold"
            value={newAd.image_url} onChange={e => setNewAd({...newAd, image_url: e.target.value})} required
          />
          <input 
            type="url" placeholder="קישור ליעד (Destination URL)" 
            className="p-4 bg-slate-50 rounded-2xl border-none font-bold"
            value={newAd.link_url} onChange={e => setNewAd({...newAd, link_url: e.target.value})} required
          />
          <button type="submit" className="md:col-span-2 bg-blue-600 text-white p-4 rounded-2xl font-black hover:bg-blue-700 transition-colors">
            פרסם פרסומת
          </button>
        </form>
      </div>

      {/* רשימת פרסומות */}
      <div className="grid gap-6">
        {ads.map(ad => (
          <div key={ad.id} className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm flex items-center justify-between flex-row-reverse">
            <div className="flex items-center gap-6 flex-row-reverse">
              <div className="w-32 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                <img src={ad.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-black text-lg">{ad.title}</h3>
                <p className="text-slate-400 text-sm flex items-center gap-1 justify-end">
                  {ad.position} <ImageIcon size={12} />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleAdStatus(ad.id, ad.is_active)}
                className={`p-2 rounded-full ${ad.is_active ? 'text-green-500 bg-green-50' : 'text-slate-300 bg-slate-50'}`}
              >
                {ad.is_active ? <CheckCircle /> : <XCircle />}
              </button>
              <a href={ad.link_url} target="_blank" className="p-2 text-blue-500 bg-blue-50 rounded-full">
                <ExternalLink size={20} />
              </a>
              <button onClick={() => deleteAd(ad.id)} className="p-2 text-red-500 bg-red-50 rounded-full">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAds;
