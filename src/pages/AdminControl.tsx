import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/DataService';
import { 
  Megaphone, Users, Trash2, Loader2, MessageCircle, 
  Send, CheckCircle, Plus, ShieldCheck, 
  Inbox, ExternalLink, BarChart3, MousePointer2, Upload, FileVideo, Link as LinkIcon
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const AdminControl: React.FC = () => {
  // הוספת טאב upload לרשימה
  const [activeTab, setActiveTab] = useState<'ads' | 'messages' | 'team' | 'upload'>('messages');
  const [ads, setAds] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [msgStatusFilter, setMsgStatusFilter] = useState<'open' | 'closed'>('open');
  const [replies, setReplies] = useState<{[key: string]: string}>({});
  const [newAd, setNewAd] = useState({ title: '', image_url: '', link_url: '', type: 'popup' });
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // סטייט חדש לניהול העלאת וידאו (קובץ או קישור)
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoData, setVideoData] = useState({ title: '', description: '' });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [msgStatusFilter, activeTab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const { data: adsData } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
      const { data: adminsData } = await supabase.from('site_admins').select('*');
      const { data: msgsData } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('status', msgStatusFilter)
        .order('created_at', { ascending: false });

      setAds(adsData || []);
      setAdmins(adminsData || []);
      setMessages(msgsData || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error('שגיאה בטעינת נתונים');
    }
    setLoading(false);
  };

  // פונקציית העלאה למנהל בלבד - מעודכנת עם תיקון ה-URL
  const handleAdminUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalUrl = videoUrl;

      if (uploadType === 'file' && videoFile) {
        const fileExtension = videoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`;
        
        const { error: storageError } = await supabase.storage
          .from('videos')
          .upload(fileName, videoFile);
        
        if (storageError) throw storageError;

        // חילוץ מפורש ותקין של הכתובת הציבורית
        const { data } = supabase.storage.from('videos').getPublicUrl(fileName);
        
        if (!data || !data.publicUrl) {
          throw new Error("לא הצלחתי לייצר קישור ציבורי לקובץ");
        }
        
        finalUrl = data.publicUrl; 
      }

      if (!finalUrl) throw new Error('יש להזין קובץ או קישור');

      // שמירה לטבלה עם וידוא שה-URL נשלח כטקסט נקי
      const { error: dbError } = await supabase.from('videos').insert([{
        title: videoData.title,
        description: videoData.description,
        url: String(finalUrl),
        status: 'approved', // מנהל מעלה - מאושר אוטומטית
        created_at: new Date().toISOString()
      }]);

      if (dbError) throw dbError;

      toast.success('הסרטון פורסם בהצלחה!');
      setVideoFile(null);
      setVideoUrl('');
      setVideoData({ title: '', description: '' });
    } catch (err: any) {
      toast.error('שגיאה: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // פונקציות קיימות (ללא שינוי)
  const handleAddAd = async (e: React.FormEvent) => {
    e.preventDefault();
    const adToInsert = {
      title: newAd.title, image_url: newAd.image_url, link_url: newAd.link_url, type: newAd.type, created_at: new Date().toISOString()
    };
    const { error } = await supabase.from('ads').insert([adToInsert]);
    if (error) toast.error(`שגיאה: ${error.message}`);
    else { toast.success('הפרסומת הועלתה!'); setNewAd({ title: '', image_url: '', link_url: '', type: 'popup' }); fetchAllData(); }
  };

  const handleReply = async (msgId: string) => {
    if (!replies[msgId]) return toast.error('כתוב תגובה קודם');
    const { error } = await supabase.from('contact_messages').update({ admin_reply: replies[msgId], status: 'closed' }).eq('id', msgId);
    if (error) toast.error('שגיאה');
    else { toast.success('נשלח'); fetchAllData(); }
  };

  const deleteItem = async (table: string, id: string) => {
    if (!window.confirm('למחוק לצמיתות?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) toast.error('נכשל'); else { toast.success('נמחק'); fetchAllData(); }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail) return;
    const { error } = await supabase.from('site_admins').insert([{ email: newAdminEmail.toUpperCase() }]);
    if (error) toast.error('שגיאה'); else { toast.success('נוסף'); setNewAdminEmail(''); fetchAllData(); }
  };

  return (
    <div className="min-h-screen bg-[#001e3c] text-white p-6 md:p-12" dir="rtl">
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-10">
        
        <header className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-blue-900/50 pb-8">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-400 p-3 rounded-2xl text-[#001e3c] shadow-xl">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Admin<span className="text-yellow-400">Control</span></h1>
          </div>

          <div className="flex bg-[#0a2744] p-1.5 rounded-2xl border border-blue-800 shadow-xl overflow-x-auto">
            {['messages', 'ads', 'team', 'upload'].map((tab: any) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`px-6 py-2 rounded-xl font-black transition-all whitespace-nowrap ${activeTab === tab ? 'bg-yellow-400 text-[#001e3c]' : 'text-blue-400'}`}
              >
                {tab === 'messages' ? 'פניות' : tab === 'ads' ? 'פרסומות' : tab === 'team' ? 'צוות' : 'העלאת תוכן'}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-yellow-400" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            
            {/* טאב העלאת תוכן חדש למנהל */}
            {activeTab === 'upload' && (
              <div className="max-w-2xl mx-auto w-full bg-[#0a2744] p-8 rounded-[40px] border border-blue-800 shadow-2xl">
                <h2 className="text-2xl font-black italic mb-6 text-yellow-400 flex items-center gap-3"><Upload/> New Content</h2>
                
                <div className="flex gap-2 mb-6 bg-[#001e3c] p-1 rounded-xl border border-blue-900">
                  <button onClick={() => setUploadType('file')} className={`flex-1 py-2 rounded-lg font-bold transition-all ${uploadType === 'file' ? 'bg-blue-600 text-white' : 'text-blue-400'}`}>קובץ</button>
                  <button onClick={() => setUploadType('link')} className={`flex-1 py-2 rounded-lg font-bold transition-all ${uploadType === 'link' ? 'bg-blue-600 text-white' : 'text-blue-400'}`}>קישור</button>
                </div>

                <form onSubmit={handleAdminUpload} className="space-y-4">
                  {uploadType === 'file' ? (
                    <div className="border-2 border-dashed border-blue-800 rounded-2xl p-6 text-center cursor-pointer hover:border-yellow-400 transition-colors">
                      <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} className="hidden" id="admin-file" />
                      <label htmlFor="admin-file" className="cursor-pointer">
                        <FileVideo className="mx-auto mb-2 text-blue-500" size={32} />
                        <p className="text-sm font-bold">{videoFile ? videoFile.name : 'בחר קובץ וידאו גולמי'}</p>
                      </label>
                    </div>
                  ) : (
                    <input placeholder="הדבק קישור (YouTube/Drive/etc)" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-[#001e3c] border border-blue-800 rounded-xl p-4 font-bold outline-none focus:border-yellow-400" />
                  )}
                  <input placeholder="כותרת" value={videoData.title} onChange={e => setVideoData({...videoData, title: e.target.value})} className="w-full bg-[#001e3c] border border-blue-800 rounded-xl p-4 font-bold outline-none focus:border-yellow-400" required />
                  <textarea placeholder="תיאור" value={videoData.description} onChange={e => setVideoData({...videoData, description: e.target.value})} className="w-full bg-[#001e3c] border border-blue-800 rounded-xl p-4 font-bold outline-none focus:border-yellow-400 h-24" />
                  <button disabled={isUploading} className="w-full bg-yellow-400 text-[#001e3c] font-black py-4 rounded-xl hover:bg-yellow-300 transition-all flex justify-center items-center gap-2">
                    {isUploading ? <Loader2 className="animate-spin" /> : 'פרסם עכשיו'}
                  </button>
                </form>
              </div>
            )}

            {/* שאר הטאבים כפי שהיו */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black italic text-blue-400 uppercase tracking-widest flex items-center gap-3"><Inbox/> Inbox</h2>
                  <div className="flex gap-2 bg-blue-900/20 p-1 rounded-xl">
                    <button onClick={() => setMsgStatusFilter('open')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${msgStatusFilter === 'open' ? 'bg-blue-600' : ''}`}>פתוחות</button>
                    <button onClick={() => setMsgStatusFilter('closed')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${msgStatusFilter === 'closed' ? 'bg-blue-600' : ''}`}>סגורות</button>
                  </div>
                </div>
                {messages.map(msg => (
                  <div key={msg.id} className="bg-[#0a2744] p-8 rounded-[35px] border border-blue-800 shadow-xl relative overflow-hidden">
                    <div className="flex justify-between mb-4">
                      <span className="text-yellow-400 font-black text-xs">{msg.email}</span>
                      <button onClick={() => deleteItem('contact_messages', msg.id)} className="text-red-500 hover:scale-110 transition-transform"><Trash2 size={18}/></button>
                    </div>
                    <h3 className="text-xl font-black mb-3">{msg.subject}</h3>
                    <p className="bg-[#001e3c] p-6 rounded-2xl italic text-blue-100 mb-6 border-r-4 border-yellow-400">"{msg.message}"</p>
                    {msgStatusFilter === 'open' ? (
                      <div className="flex gap-3">
                        <input placeholder="השב למשתמש..." className="flex-grow bg-[#001e3c] border border-blue-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-400" onChange={e => setReplies({...replies, [msg.id]: e.target.value})} />
                        <button onClick={() => handleReply(msg.id)} className="bg-yellow-400 text-[#001e3c] px-6 rounded-xl font-black hover:bg-yellow-300"><Send size={18}/></button>
                      </div>
                    ) : (
                      <div className="text-green-400 font-bold bg-green-500/5 p-4 rounded-xl border border-green-500/10 italic">תשובה: {msg.admin_reply}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'ads' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <form onSubmit={handleAddAd} className="bg-[#0a2744] p-8 rounded-[40px] border border-blue-800 space-y-4 shadow-2xl">
                    <h3 className="text-xl font-black italic mb-4 text-yellow-400 uppercase">New Ad</h3>
                    <input placeholder="כותרת" value={newAd.title} onChange={e => setNewAd({...newAd, title: e.target.value})} className="w-full bg-[#001e3c] border border-blue-800 rounded-xl p-4 font-bold outline-none focus:border-yellow-400" required />
                    <input placeholder="Image URL" value={newAd.image_url} onChange={e => setNewAd({...newAd, image_url: e.target.value})} className="w-full bg-[#001e3c] border border-blue-800 rounded-xl p-4 font-bold outline-none focus:border-yellow-400" required />
                    <input placeholder="Link URL" value={newAd.link_url} onChange={e => setNewAd({...newAd, link_url: e.target.value})} className="w-full bg-[#001e3c] border border-blue-800 rounded-xl p-4 font-bold outline-none focus:border-yellow-400" required />
                    <select value={newAd.type} onChange={e => setNewAd({...newAd, type: e.target.value})} className="w-full bg-[#001e3c] border border-blue-800 rounded-xl p-4 font-bold">
                      <option value="popup">פופ-אפ</option>
                      <option value="sidebar">באנר צדדי</option>
                    </select>
                    <button className="w-full bg-yellow-400 text-[#001e3c] font-black py-4 rounded-xl hover:scale-95 transition-all">הוסף פרסומת</button>
                  </form>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-2xl font-black italic text-blue-400 uppercase tracking-widest flex items-center gap-3"><BarChart3/> Active Ads</h2>
                  {ads.map(ad => (
                    <div key={ad.id} className="bg-[#0a2744] p-4 rounded-3xl border border-blue-800 flex items-center gap-4 group">
                      <img src={ad.image_url} className="w-16 h-16 rounded-xl object-cover border border-blue-700 shadow-lg" />
                      <div className="flex-grow">
                        <h4 className="font-black text-sm">{ad.title}</h4>
                        <span className="text-[10px] bg-blue-900 px-2 py-0.5 rounded text-blue-300 uppercase font-black">{ad.type}</span>
                      </div>
                      <button onClick={() => deleteItem('ads', ad.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="max-w-2xl mx-auto w-full bg-[#0a2744] p-10 rounded-[40px] border border-blue-800 shadow-2xl">
                <h2 className="text-2xl font-black italic mb-8 text-yellow-400 flex items-center gap-3"><Users/> Management Team</h2>
                <div className="flex gap-3 mb-8">
                  <input placeholder="Admin Email..." value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} className="flex-grow bg-[#001e3c] border border-blue-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-400 font-bold" />
                  <button onClick={handleAddAdmin} className="bg-yellow-400 text-[#001e3c] px-6 rounded-xl font-black hover:bg-yellow-300 transition-all">Add</button>
                </div>
                <div className="space-y-3">
                  {admins.map(admin => (
                    <div key={admin.id} className="bg-[#001e3c] p-4 rounded-xl border border-blue-900 flex justify-between items-center group shadow-md">
                      <span className="font-bold text-blue-100 italic">{admin.email}</span>
                      <button onClick={() => deleteItem('site_admins', admin.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminControl;