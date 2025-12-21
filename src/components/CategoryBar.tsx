import React from 'react';
import { Sparkles, Music, BookOpen, Baby, Globe, Cpu, Leaf, LayoutGrid } from 'lucide-react';

// הגדרת קטגוריות עם אייקונים חיים מרכיב Lucide
const categories = [
  { id: 'הכל', name: 'הכל', icon: <LayoutGrid size={18} /> },
  { id: 'תורה ויהדות', name: 'תורה ויהדות', icon: <BookOpen size={18} /> },
  { id: 'מוזיקה', name: 'מוזיקה', icon: <Music size={18} /> },
  { id: 'ילדים', name: 'ילדים', icon: <Baby size={18} /> },
  { id: 'חדשות', name: 'חדשות', icon: <Globe size={18} /> },
  { id: 'טכנולוגיה', name: 'טכנולוגיה', icon: <Cpu size={18} /> },
  { id: 'טבע ומדע', name: 'טבע ומדע', icon: <Leaf size={18} /> },
];

interface CategoryBarProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="relative w-full overflow-hidden mb-4">
      {/* אזור גלילה אופקי */}
      <div 
        className="flex gap-4 overflow-x-auto pb-6 no-scrollbar scroll-smooth px-2" 
        dir="rtl"
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                flex items-center gap-3 px-8 py-4 rounded-[22px] font-black whitespace-nowrap transition-all duration-300
                ${isActive 
                  ? 'bg-yellow-400 text-[#001e3c] shadow-[0_0_25px_rgba(250,204,21,0.4)] scale-105 -translate-y-1' 
                  : 'bg-[#0a2744] text-blue-300 border border-blue-800/50 hover:bg-[#12365a] hover:border-blue-700 hover:text-white'
                }
              `}
            >
              <span className={`${isActive ? 'text-[#001e3c]' : 'text-yellow-400/70'}`}>
                {cat.icon}
              </span>
              <span className="text-sm uppercase tracking-wide italic">
                {cat.name}
              </span>
              
              {/* נקודה זוהרת לקטגוריה פעילה */}
              {isActive && (
                <span className="w-1.5 h-1.5 bg-[#001e3c] rounded-full animate-pulse shadow-sm"></span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* אפקט דהייה בקצוות לגלילה יפה יותר */}
      <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-[#001e3c] to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-[#001e3c] to-transparent pointer-events-none"></div>
    </div>
  );
};

export default CategoryBar;