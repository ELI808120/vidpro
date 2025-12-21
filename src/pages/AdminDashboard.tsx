import React, { useState, useEffect } from 'react';
import { localDB, Video } from '../lib/mockData';
import { Check, X, Trash2, ShieldAlert } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [pendingVideos, setPendingVideos] = useState<Video[]>([]);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    const all = await localDB.getAllVideos();
    setPendingVideos(all.filter(v => v.status === 'pending'));
  };

  const handleAction = async (vId: number, newStatus: 'approved' | 'rejected') => {
    await localDB.updateVideoStatus(vId, newStatus);
    loadPending(); // ריענון הרשימה
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex items-center gap-4 border-b pb-6">
        <div className="bg-red-500 p-3 rounded-2xl text-white shadow-lg">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black italic">לוח בקרת מנהל</h1>
          <p className="font-bold text-slate-500">יש לאשר תוכן לפני פרסומו באתר</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {pendingVideos.length === 0 && (
          <div className="text-center py-20 bg-slate-100 rounded-[2rem] border-4 border-dashed border-slate-200">
            <p className="text-2xl font-bold text-slate-400">אין סרטונים הממתינים לאישור. הכל נקי!</p>
          </div>
        )}
        
        {pendingVideos.map(video => (
          <div key={video.id} className="bg-white rounded-3xl p-6 shadow-xl flex items-center gap-6 border border-slate-100">
            <div className="w-48 aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
               <video src={URL.createObjectURL(video.blob)} className="w-full h-full object-cover" controls />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black mb-1">{video.title}</h3>
              <p className="text-sm text-slate-500 mb-4 font-bold">הועלה ע"י: משתמש #{video.id}</p>
              <div className="flex gap-2">
                {video.tags.map(t => <span key={t} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black">#{t}</span>)}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleAction(video.id!, 'approved')} className="bg-green-100 text-green-600 p-4 rounded-2xl hover:bg-green-600 hover:text-white transition-all">
                <Check size={24} />
              </button>
              <button onClick={() => handleAction(video.id!, 'rejected')} className="bg-red-100 text-red-600 p-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all">
                <X size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
