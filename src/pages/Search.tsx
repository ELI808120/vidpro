import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/DataService';
import VideoCard from '../components/VideoCard';
import { Search as SearchIcon, Film, Loader2, Sparkles, TrendingUp } from 'lucide-react';

const Search: React.FC = () => {
  const location = useLocation();
  const [query, setQuery] = useState(new URLSearchParams(location.search).get('q') || '');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (searchQuery: string) => {
    setLoading(true);
    let queryBuilder = supabase.from('videos').select('*');
    
    if (searchQuery) {
      queryBuilder = queryBuilder.or(`title.ilike.%${searchQuery}%,desc.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false });
    if (!error) setResults(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const urlQuery = new URLSearchParams(location.search).get('q') || '';
    setQuery(urlQuery);
    fetchResults(urlQuery);
  }, [location.search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    fetchResults(val);
  };

  return (
    <div className="min-h-screen bg-[#001e3c] py-12 px-6" dir="rtl">
      <div className="max-w-[1700px] mx-auto">
        
        {/* שורת חיפוש Bento-Style */}
        <div className="relative max-w-4xl mx-auto mb-20 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="חפש משהו מעניין..." 
              className="w-full p-7 bg-[#0a2744] text-white rounded-3xl border border-blue-800 focus:border-yellow-400 shadow-2xl text-2xl font-black outline-none transition-all pr-20 placeholder:text-blue-500/30"
              value={query}
              onChange={handleInputChange}
            />
            <SearchIcon className="absolute right-7 text-yellow-400" size={32} />
            {loading && (
              <Loader2 className="absolute left-7 text-blue-400 animate-spin" size={24} />
            )}
          </div>
        </div>

        {/* סטטוס תוצאות */}
        <div className="flex items-center justify-between mb-12 border-b border-blue-800/30 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-10 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.4)]"></div>
            <h2 className="text-3xl font-black text-white italic">
              {query ? `תוצאות עבור: ${query}` : 'מגלים תוכן חדש'}
            </h2>
          </div>
          <div className="bg-blue-900/40 px-6 py-2 rounded-2xl border border-blue-800/50">
            <span className="text-blue-300 font-bold">{results.length} תוצאות נמצאו</span>
          </div>
        </div>

        {/* גריד 12 עמודות - פריסה סימטרית */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-8 auto-rows-[280px]">
            {results.map((video, index) => {
              // כל סרטון רביעי הוא גדול (4 עמודות) והשאר קטנים (2 עמודות)
              const isLarge = index % 4 === 0;
              return (
                <div 
                  key={video.id} 
                  className={isLarge ? 'col-span-2 row-span-2 md:col-span-4 lg:col-span-4' : 'col-span-2 row-span-1 md:col-span-2 lg:col-span-2'}
                >
                  <VideoCard video={video} size={isLarge ? 'large' : 'small'} />
                </div>
              );
            })}
          </div>
        ) : !loading && (
          <div className="text-center py-32 bg-[#0a2744]/20 rounded-[40px] border-2 border-dashed border-blue-800/30 max-w-2xl mx-auto">
            <Film size={80} className="mx-auto text-blue-900/50 mb-6" />
            <h3 className="text-3xl font-black text-blue-200 mb-4 italic">החיפוש לא העלה דבר...</h3>
            <p className="text-blue-400 font-bold text-lg mb-8">נסו לשנות את מילות החיפוש או לחזור לראות את הכל.</p>
            <button 
              onClick={() => { setQuery(''); fetchResults(''); }}
              className="bg-yellow-400 text-[#001e3c] px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all flex items-center gap-2 mx-auto"
            >
              <Sparkles size={20} /> חזרה לכל הסרטונים
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;