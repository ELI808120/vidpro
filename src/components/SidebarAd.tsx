import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/DataService';

const SidebarAd = () => {
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    const fetchAd = async () => {
      const { data } = await supabase.from('ads').select('*').eq('type', 'sidebar').eq('active', true).limit(1).maybeSingle();
      if (data) setAd(data);
    };
    fetchAd();
  }, []);

  if (!ad) return null;
  return (
    <div className="bg-blue-900/20 border border-blue-800 rounded-2xl p-2 mb-4">
      <p className="text-[10px] text-blue-500 font-bold mb-1 uppercase mr-2">ממומן</p>
      <a href={ad.link_url} target="_blank" rel="noopener noreferrer">
        <img src={ad.image_url} alt="Ad" className="w-full rounded-xl hover:opacity-80 transition-opacity" />
      </a>
    </div>
  );
};
export default SidebarAd;