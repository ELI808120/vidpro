import React, { useEffect, useState } from 'react';
import { localDB, Video } from '../lib/mockData';
import { Check, Trash2, Tag, Plus, Video as VideoIcon, Eye } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCat, setNewCat] = useState('');

  const loadData = async () => {
    const all = await localDB.getAllVideos();
    setVideos(all);
    setCategories(localDB.getCategories());
  };

  useEffect(() => { loadData(); }, []);

  const addCategory = () => {
    if (!newCat) return;
    const updated = [...categories, newCat];
    localDB.saveCategories(updated);
    setCategories(updated);
    setNewCat('');
  };

  const removeCategory = (cat: string) => {
    const updated = categories.filter(c => c !== cat);
    localDB.saveCategories(updated);
    setCategories(updated);
  };

  const handleAction = async (id: number, action: 'approved' | 'rejected') => {
    await localDB.updateStatus(id, action);
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* ניהול קטגוריות */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border dark:border-slate-800">
        <h2 className="text-2xl font-black mb-6 dark:text-white flex items-center gap-2">
          <Tag className="text-blue-600" /> ניהול קטגוריות
        </h2>
        <div className="flex gap-4 mb-6">
          <input 
            value={newCat} 
            onChange={e => setNewCat(e.target.value)}
            placeholder="קטגוריה חדשה..." 
            className="flex-grow p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl dark:text-white border-none outline-none focus:ring-2 ring-blue-500"
          />
          <button onClick={addCategory} className="bg-blue-600 text-white px-6 rounded-2xl font-bold flex items-center gap-2"><Plus /> הוסף</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <div key={cat} className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl flex items-center gap-3 dark:text-white font-bold">
              {cat} <button onClick={() => removeCategory(cat)} className="text-red-500 hover:scale-110"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      </section>

      {/* רשימת סרטונים לאישור */}
      <section>
        <h2 className="text-2xl font-black mb-6 dark:text-white flex items-center gap-2">
          <VideoIcon className="text-blue-600" /> ממתינים לאישור ({videos.filter(v => v.status === 'pending').length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.filter(v => v.status === 'pending').map(video => (
            <div key={video.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl flex gap-4 border dark:border-slate-800 hover:border-blue-500 transition-colors">
              <video src={URL.createObjectURL(video.blob)} className="w-40 aspect-video rounded-2xl object-cover bg-black" />
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold dark:text-white">{video.title}</h3>
                  <div className="flex gap-1 mt-1">
                    {video.tags.map(t => <span key={t} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">#{t}</span>)}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleAction(video.id!, 'approved')} className="flex-grow py-2 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-1 hover:bg-green-600 transition-colors"><Check size={18}/> אשר</button>
                  <button onClick={() => handleAction(video.id!, 'rejected')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-red-500 rounded-xl hover:bg-red-50 transition-colors"><Trash2 size={18}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
