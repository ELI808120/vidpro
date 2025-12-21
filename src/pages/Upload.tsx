import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/DataService';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Upload as UploadIcon, Loader2, Film, Link as LinkIcon, CheckCircle2, AlertCircle } from 'lucide-react';

const ADMIN_EMAIL = "A052763527@GMAIL.COM";

const Upload: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{message: string, type: 'success' | 'error' | ''}>({message: '', type: ''});
  
  const [uploadType, setUploadType] = useState<'file' | 'link'>('link');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('כללי');

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }
      setUser(session.user);
      setIsAdmin(session.user.email?.toUpperCase() === ADMIN_EMAIL.toUpperCase());
    };
    checkAuth();
  }, [navigate]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let finalUrl = videoUrl;

      if (uploadType === 'file' && videoFile) {
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('video-content').upload(`videos/${fileName}`, videoFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('video-content').getPublicUrl(`videos/${fileName}`);
        finalUrl = publicUrl;
      }

      // שליחה לעמודה הנכונה description
      const { error: dbError } = await supabase.from('videos').insert([{
        title,
        url: finalUrl,
        category,
        user_id: user.id,
        description: `הועלה בתאריך ${new Date().toLocaleDateString()}`
      }]);

      if (dbError) throw dbError;
      setStatus({ message: 'הסרטון פורסם בהצלחה!', type: 'success' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      setStatus({ message: 'שגיאה: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin === null) return <div className="min-h-screen flex items-center justify-center bg-[#001e3c]"><Loader2 className="animate-spin text-yellow-400" /></div>;
  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center bg-[#001e3c] text-white italic font-black">גישה למנהלים בלבד</div>;

  return (
    <div className="min-h-screen bg-[#001e3c] text-white py-12 px-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black italic mb-10 text-center uppercase tracking-tighter">Upload <span className="text-yellow-400">Content</span></h1>
        
        <div className="flex gap-4 mb-8 justify-center">
          <button type="button" onClick={() => setUploadType('link')} className={`px-6 py-3 rounded-2xl font-black italic transition-all ${uploadType === 'link' ? 'bg-yellow-400 text-[#001e3c]' : 'bg-blue-900/40 text-blue-400'}`}>קישור יוטיוב / חיצוני</button>
          <button type="button" onClick={() => setUploadType('file')} className={`px-6 py-3 rounded-2xl font-black italic transition-all ${uploadType === 'file' ? 'bg-yellow-400 text-[#001e3c]' : 'bg-blue-900/40 text-blue-400'}`}>העלאת קובץ</button>
        </div>

        <form onSubmit={handleUpload} className="bg-[#0a2744] p-10 rounded-[50px] border border-blue-800 shadow-2xl space-y-6">
          {uploadType === 'link' ? (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase italic mr-2 text-blue-400">הדבק קישור (יוטיוב וכו')</label>
              <input type="url" required value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-[#001e3c] border border-blue-800 rounded-2xl px-6 py-4 outline-none focus:border-yellow-400 font-bold" />
            </div>
          ) : (
            <div className="border-4 border-dashed border-blue-800 rounded-[30px] p-10 text-center hover:border-yellow-400/50 transition-all relative">
              <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
              <Film className="mx-auto mb-4 opacity-30" size={48} />
              <p className="font-bold">{videoFile ? videoFile.name : 'לחץ להעלאת קובץ מהמחשב'}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="כותרת הסרטון" className="w-full bg-[#001e3c] border border-blue-800 rounded-2xl px-6 py-4 outline-none focus:border-yellow-400 font-bold" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#001e3c] border border-blue-800 rounded-2xl px-6 py-4 outline-none focus:border-yellow-400 font-bold uppercase italic appearance-none">
              <option>כללי</option><option>מוזיקה</option><option>גיימינג</option><option>טכנולוגיה</option>
            </select>
          </div>

          {status.message && <div className={`p-4 rounded-2xl font-bold ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{status.message}</div>}

          <button disabled={loading} className="w-full bg-yellow-400 text-[#001e3c] font-black py-5 rounded-2xl shadow-xl hover:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase italic">
            {loading ? <Loader2 className="animate-spin" /> : <UploadIcon size={24} />} פרסם תוכן
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;