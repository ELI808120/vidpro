import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/DataService';
import { Share2, ChevronRight, Loader2, Play, ThumbsUp, X } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const VideoView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<any>(null);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: currentVideo } = await supabase.from('videos').select('*').eq('id', id).single();
      if (!currentVideo) { navigate('/'); return; }
      setVideo(currentVideo);

      const { data: others } = await supabase.from('videos').select('*').neq('id', id).limit(6);
      setRelatedVideos(others || []);
      setLoading(false);

      // תיקון ה-RPC:
      try {
        await supabase.rpc('increment_views', { video_id: id });
      } catch (e) {
        console.warn("View increment failed, skipping...");
      }
    };
    fetchData();
  }, [id, navigate]);

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#001e3c]"><Loader2 className="animate-spin text-yellow-400" size={48} /></div>;

  const embedUrl = getEmbedUrl(video.url);

  return (
    <div className="min-h-screen bg-[#001e3c] text-white pb-20 px-4 md:px-8" dir="rtl">
      <Toaster />
      <div className="max-w-[1600px] mx-auto py-6">
        <button onClick={() => navigate('/')} className="text-blue-400 font-black italic flex items-center gap-2 uppercase"><ChevronRight /> חזרה</button>
      </div>
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="aspect-video bg-black rounded-[40px] overflow-hidden border border-blue-800 shadow-2xl">
            {embedUrl ? (
              <iframe src={embedUrl} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen></iframe>
            ) : (
              <video src={video.url} controls autoPlay className="w-full h-full object-contain" />
            )}
          </div>
          <div className="bg-[#0a2744] p-8 rounded-[40px] border border-blue-800">
            <h1 className="text-3xl font-black italic mb-4">{video.title}</h1>
            <p className="text-blue-100/80 pt-6 border-t border-blue-800 italic">{video.description || "אין תיאור"}</p>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <div className="bg-[#0a2744] p-8 rounded-[40px] border border-blue-800">
            <h3 className="text-xl font-black italic mb-8 text-yellow-400 uppercase">הבאים בתור</h3>
            <div className="space-y-6">
              {relatedVideos.map((rv) => (
                <Link key={rv.id} to={`/video/${rv.id}`} className="flex gap-4 group">
                  <div className="w-28 h-16 bg-black rounded-xl overflow-hidden shrink-0 border border-blue-900 group-hover:border-yellow-400">
                    <img src={rv.thumbnail} className="w-full h-full object-cover opacity-70" />
                  </div>
                  <h5 className="font-bold text-sm group-hover:text-yellow-400 transition-colors">{rv.title}</h5>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoView;