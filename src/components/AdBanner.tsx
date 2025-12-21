import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/DataService';

interface AdBannerProps {
  position: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    const fetchAd = async () => {
      const { data } = await supabase
        .from('ads')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .limit(1)
        .single();
      
      if (data) setAd(data);
    };
    fetchAd();
  }, [position]);

  if (!ad) return null;

  return (
    <div className="w-full my-6 flex justify-center">
      <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block w-full max-w-4xl transition-transform hover:scale-[1.01]">
        <div className="relative group">
          <img src={ad.image_url} alt={ad.title} className="w-full h-auto rounded-2xl shadow-md border border-slate-100" />
          <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold">Ad</span>
        </div>
      </a>
    </div>
  );
};

export default AdBanner;
