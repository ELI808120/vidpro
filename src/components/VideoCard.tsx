import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Star } from 'lucide-react';

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnail?: string;
    url: string;
    created_at?: string;
    category?: string;
    desc?: string;
  };
  size?: 'small' | 'large';
}

const VideoCard: React.FC<VideoCardProps> = ({ video, size = 'small' }) => {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isLarge = size === 'large';

  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return 'חדש ב-STREAMIL';
    const now = new Date();
    const uploaded = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - uploaded.getTime()) / (1000 * 3600 * 24));
    if (diffInDays === 0) return 'הועלה היום';
    if (diffInDays === 1) return 'הועלה אתמול';
    if (diffInDays < 7) return `לפני ${diffInDays} ימים`;
    return uploaded.toLocaleDateString('he-IL');
  };

  return (
    <Link 
      to={`/video/${video.id}`} 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group relative block bg-[#0a2744]/40 backdrop-blur-md overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-800/40 hover:border-yellow-400/50 h-full 
      ${isLarge ? 'rounded-3xl' : 'rounded-2xl'}`} 
    >
      <div className="relative h-full w-full flex flex-col">
        {/* אזור המדיה */}
        <div className={`relative overflow-hidden bg-black ${isLarge ? 'flex-1' : 'aspect-video'}`}>
          <img 
            src={video.thumbnail || `https://source.unsplash.com/1200x800/?dark,abstract`} 
            alt={video.title}
            className={`w-full h-full object-cover transition-all duration-700 ${isHovering ? 'opacity-0 scale-105' : 'opacity-100'}`}
          />
          {isHovering && (
            <video
              ref={videoRef}
              src={video.url}
              autoPlay
              muted
              loop
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001e3c] via-transparent to-transparent opacity-90" />
          
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className={`bg-yellow-400/90 rounded-2xl shadow-2xl transform transition-transform ${isLarge ? 'p-8' : 'p-5'}`}>
              <Play className="text-[#001e3c] fill-[#001e3c]" size={isLarge ? 48 : 32} />
            </div>
          </div>
        </div>

        {/* תוכן הכרטיס */}
        <div className={`p-5 text-right flex flex-col justify-end ${isLarge ? 'md:p-8' : 'p-4'}`} dir="rtl">
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-black text-yellow-400 italic tracking-wider ${isLarge ? 'text-sm' : 'text-[9px]'}`}>
              {video.category || 'PREMIUM CONTENT'}
            </span>
          </div>
          
          <h3 className={`font-black text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors italic ${isLarge ? 'text-2xl md:text-3xl' : 'text-lg leading-tight'}`}>
            {video.title}
          </h3>
          
          <div className="flex items-center justify-between mt-3 border-t border-blue-800/20 pt-3">
            <div className="flex items-center gap-2 text-blue-300/60 text-[10px] font-bold">
              <Clock size={12} />
              <span>{getRelativeTime(video.created_at)}</span>
            </div>
            <Star size={isLarge ? 18 : 14} className={`${isLarge ? 'text-yellow-400 fill-yellow-400' : 'text-blue-500/30'}`} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;