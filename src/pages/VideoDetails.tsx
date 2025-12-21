import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/DataService';
import { CustomPlayer, VideoActions } from '../features/FeatureHub';
import { Calendar, Eye, User, PlayCircle } from 'lucide-react';

const VideoDetails: React.FC = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true);
      // שליפת הסרטון הנוכחי
      const { data: currentVideo } = await supabase.from('videos').select('*').eq('id', id).single();
      
      if (currentVideo) {
        setVideo(currentVideo);
        
        // שליפת סרטונים דומים (מאותה קטגוריה, למעט הנוכחי)
        const { data: related } = await supabase
          .from('videos')
          .select('*')
          .eq('category', currentVideo.category)
          .neq('id', id)
          .limit(4);
        
        setRelatedVideos(related || []);
      }
      setLoading(false);
    };
    fetchVideoData();
  }, [id]);

  if (loading) return <div className="p-20 text-center dark:text-white animate-pulse font-bold italic text-2xl">טוען חוויית צפייה...</div>;
  if (!video) return <div className="p-20 text-center dark:text-white">סרטון לא נמצא</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 text-right" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* צד ימין: הנגן והמידע (2/3 מהמסך) */}
        <div className="lg:col-span-2 space-y-6">
          <CustomPlayer src={video.video_url} poster={video.thumbnail_url} videoId={video.id} />
          
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 italic">{video.title}</h1>
            
            {/* שורת פעולות: לייקים ושיתוף */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-6 text-slate-400 font-bold text-sm flex-row-reverse">
                <span className="flex items-center gap-2"><Eye size={18} /> {video.views_count || 0} צפיות</span>
                <span className="flex items-center gap-2"><Calendar size={18} /> {new Date(video.created_at).toLocaleDateString('he-IL')}</span>
              </div>
              <VideoActions videoId={video.id} initialLikes={video.likes_count || 0} />
            </div>

            <div className="flex items-center gap-3 mb-6 flex-row-reverse">
               <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                  <User size={24} />
               </div>
               <div className="text-right">
                  <p className="font-black dark:text-white">מערכת Streamil</p>
                  <p className="text-xs text-slate-400 font-bold italic">פורסם רשמית</p>
               </div>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium whitespace-pre-wrap">
              {video.description || "אין תיאור לסרטון זה."}
            </p>
          </div>
        </div>

        {/* צד שמאל: סרטונים דומים (1/3 מהמסך) */}
        <div className="space-y-6">
          <h3 className="text-xl font-black dark:text-white italic flex items-center gap-2 justify-end">
            סרטונים דומים <PlayCircle className="text-blue-500" size={20} />
          </h3>
          <div className="space-y-4">
            {relatedVideos.length > 0 ? relatedVideos.map(v => (
              <Link key={v.id} to={`/video/${v.id}`} className="flex gap-3 group bg-white dark:bg-slate-900 p-2 rounded-2xl border border-transparent hover:border-blue-500/30 transition-all shadow-sm">
                <div className="w-32 h-20 flex-shrink-0 rounded-xl overflow-hidden relative">
                  <img src={v.thumbnail_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                </div>
                <div className="flex flex-col justify-center text-right overflow-hidden">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-tight mb-1">{v.title}</h4>
                  <span className="text-[10px] text-slate-400 font-black italic">{v.views_count || 0} צפיות</span>
                </div>
              </Link>
            )) : (
              <p className="text-slate-400 text-sm italic text-center py-10">אין סרטונים דומים בקטגוריה זו</p>
            )}
          </div>
          
          {/* באנר פרסומת בצד (אופציונלי) */}
          <div className="bg-blue-600/5 dark:bg-blue-600/10 border-2 border-dashed border-blue-600/20 rounded-[30px] p-8 text-center">
             <p className="text-blue-600 font-black italic">מקום לפרסומת שלך</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoDetails;
