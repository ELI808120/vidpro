import React, { useState, useEffect } from 'react';
import { DataService } from '../lib/DataService';
import { Video } from '../lib/mockData';
import { ShieldCheck, CheckCircle, XCircle, Clock, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommunityReview: React.FC = () => {
  const [pending, setPending] = useState<Video[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = DataService.getCurrentUser();
    setUser(currentUser);
    DataService.getVideos().then(vids => setPending(vids.filter(v => v.status === 'pending')));
  }, []);

  const castVote = async (videoId: number, isClean: boolean) => {
    // 1. בדיקה אם מחובר
    if (!user) {
      alert("עליך להירשם עם מייל כדי להשתתף בסינון!");
      navigate('/auth');
      return;
    }

    // 2. בדיקת וותק (3 ימים = 259,200,000 מילישניות)
    const userAge = Date.now() - new Date(user.createdAt).getTime();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    
    if (userAge < threeDays) {
      alert("כדי למנוע זיופים, רק משתמשים עם וותק של 3 ימים יכולים לאשר תוכן. נשמח שתצביע בעוד מספר ימים!");
      return;
    }

    await DataService.voteForPurity(videoId, isClean);
    setPending(prev => prev.filter(v => v.id !== videoId));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto" dir="rtl">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-10 rounded-[3rem] text-white shadow-2xl mb-12">
        <h1 className="text-4xl font-black mb-4 flex items-center gap-3">
          <ShieldCheck size={40} /> מרכז בקרת כשרות
        </h1>
        {!user ? (
          <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-3">
            <Lock size={20} />
            <p className="font-bold">עליך להתחבר כדי להצביע</p>
          </div>
        ) : (
          <p className="text-blue-100 font-bold italic">שלום {user.name}, דרושים 10 אישורים כדי להכשיר סרטון.</p>
        )}
      </div>

      <div className="grid gap-8">
        {pending.length === 0 && (
          <div className="text-center py-20 bg-slate-100 rounded-[3rem] border-4 border-dashed border-slate-200">
             <Clock size={48} className="mx-auto text-slate-300 mb-4" />
             <p className="text-xl font-bold text-slate-400">אין סרטונים הממתינים לבדיקה כרגע</p>
          </div>
        )}
        
        {pending.map(video => (
          <div key={video.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl flex flex-col md:row gap-8 border-2 border-slate-50">
            <div className="w-full md:w-80 aspect-video rounded-3xl overflow-hidden bg-black">
               <video src={URL.createObjectURL(video.blob)} className="w-full h-full object-cover" controls />
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-black mb-4">{video.title}</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => castVote(video.id!, true)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} /> נקי וכשר
                </button>
                <button 
                  onClick={() => castVote(video.id!, false)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"
                >
                  <XCircle size={20} /> לא ראוי
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityReview;
