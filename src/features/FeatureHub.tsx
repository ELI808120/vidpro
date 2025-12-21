import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Search, Play, Pause, Volume2, VolumeX, Maximize, ThumbsUp, Share2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/DataService';
import { toast } from 'react-hot-toast';

// ThemeToggle ו-SmartSearch נשארים אותו דבר...
export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export const SmartSearch: React.FC<{className?: string}> = ({className}) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/?search=${search}`);
  };
  return (
    <form onSubmit={handleSearch} className={`${className} relative`} dir="rtl">
      <input type="text" placeholder="חיפוש..." className="w-full bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl py-2 pr-10 pl-4 focus:ring-2 ring-blue-500 outline-none transition-colors" value={search} onChange={(e) => setSearch(e.target.value)} />
      <Search className="absolute right-3 top-2.5 text-slate-400" size={18} />
    </form>
  );
};

// מערכת לייקים חכמה ושיתוף
export const VideoActions: React.FC<{videoId: string}> = ({videoId}) => {
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initActions = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id || null;
      setUserId(currentUserId);

      // שליפת כמות לייקים
      const { count } = await supabase.from('video_likes').select('*', { count: 'exact', head: true }).eq('video_id', videoId);
      setLikesCount(count || 0);

      // בדיקה אם המשתמש הנוכחי כבר עשה לייק
      if (currentUserId) {
        const { data } = await supabase.from('video_likes').select('id').eq('video_id', videoId).eq('user_id', currentUserId).single();
        setHasLiked(!!data);
      }
    };
    initActions();
  }, [videoId]);

  const handleLike = async () => {
    if (!userId) return toast.error('צריך להתחבר כדי לעשות לייק');

    if (hasLiked) {
      // ביטול לייק
      await supabase.from('video_likes').delete().eq('video_id', videoId).eq('user_id', userId);
      setLikesCount(prev => prev - 1);
      setHasLiked(false);
    } else {
      // הוספת לייק
      const { error } = await supabase.from('video_likes').insert([{ video_id: videoId, user_id: userId }]);
      if (error) return toast.error('כבר סימנת לייק');
      setLikesCount(prev => prev + 1);
      setHasLiked(true);
      toast.success('אהבת את הסרטון!');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    toast.success('הקישור הועתק!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-4 flex-row-reverse">
      <button 
        onClick={handleLike} 
        className={`flex items-center gap-2 px-6 py-2 rounded-2xl font-black transition-all border-2 ${
          hasLiked 
          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30' 
          : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:border-blue-500'
        }`}
      >
        <ThumbsUp size={20} fill={hasLiked ? "white" : "none"} /> {likesCount}
      </button>
      <button onClick={copyLink} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-6 py-2 rounded-2xl font-black hover:border-green-500 border-2 border-transparent transition-all text-slate-500 dark:text-slate-400">
        {isCopied ? <Check size={20} className="text-green-500" /> : <Share2 size={20} />} שיתוף
      </button>
    </div>
  );
};

// נגן וידאו מותאם אישית
export const CustomPlayer: React.FC<{src: string, poster?: string, videoId: string}> = ({src, poster, videoId}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasCounted = useRef(false);

  useEffect(() => {
    if (isPlaying && !hasCounted.current) {
      // עדכון צפיות פשוט בטבלת הווידאו
      supabase.rpc('increment_views', { vid: videoId }).then();
      hasCounted.current = true;
    }
  }, [isPlaying, videoId]);

  return (
    <div className="relative group bg-black rounded-[35px] overflow-hidden shadow-2xl aspect-video border border-slate-200 dark:border-slate-800">
      <video ref={videoRef} src={src} poster={poster} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} className="w-full h-full" controls />
    </div>
  );
};
export const VideoSkeleton: React.FC = () => (
  <div className="animate-pulse flex flex-col gap-4">
    <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-[30px]"></div>
    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4 mx-auto"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/2 mx-auto opacity-50"></div>
  </div>
);
