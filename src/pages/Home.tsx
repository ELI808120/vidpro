import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/DataService';
import VideoCard from '../components/VideoCard';
import CategoryBar from '../components/CategoryBar';
import { Sparkles, PlayCircle, SearchX, Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('הכל');
  
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      let query = supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (activeCategory !== 'הכל') query = query.eq('category', activeCategory);
      if (searchQuery) query = query.ilike('title', `%${searchQuery}%`);
      const { data, error } = await query;
      if (!error) setVideos(data || []);
      setLoading(false);
    };
    fetchVideos();
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#001e3c] text-white pb-20 px-6" dir="rtl">
      {/* סרגל קטגוריות משוכלל */}
      <div className="max-w-[1700px] mx-auto pt-6 mb-12">
        <CategoryBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </div>

      <div className="max-w-[1700px] mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="h-12 w-2 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)]"></div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
              {searchQuery ? `חיפוש: ${searchQuery}` : 'גלריית Streamil'}
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-[#0a2744] px-6 py-3 rounded-2xl border border-blue-800/50">
            <PlayCircle className="text-yellow-400" />
            <span className="font-bold text-blue-100">{videos.length} תכנים זמינים</span>
          </div>
        </div>

        {/* גריד 12 עמודות - פריסה דינמית (Bento) */}
        {loading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-8 auto-rows-[260px]">
            {videos.map((video, index) => {
              // כל סרטון שישי הוא גדול (4/12) והשאר קטנים (2/12) - יוצר סדר מושלם
              const isLarge = index % 6 === 0;
              return (
                <div 
                  key={video.id} 
                  className={`
                    ${isLarge 
                      ? 'col-span-2 row-span-2 md:col-span-4 lg:col-span-4' 
                      : 'col-span-2 row-span-1 md:col-span-2 lg:col-span-2'
                    }
                  `}
                >
                  <VideoCard video={video} size={isLarge ? 'large' : 'small'} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-40 bg-[#0a2744]/20 rounded-[40px] border-2 border-dashed border-blue-800/30">
             <SearchX size={64} className="mx-auto text-blue-500/50 mb-6" />
             <h2 className="text-3xl font-black text-blue-200 italic mb-4">אופס! לא מצאנו כלום</h2>
             <button onClick={() => setActiveCategory('הכל')} className="text-yellow-400 font-black hover:underline text-lg">
               חזרה לכל הסרטונים
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;