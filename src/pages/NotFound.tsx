import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Home } from 'lucide-react';

const NotFound: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4" dir="rtl">
    <div className="bg-blue-100 dark:bg-blue-900/20 p-8 rounded-[50px] mb-8 animate-bounce">
      <Ghost size={80} className="text-blue-600" />
    </div>
    <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4 italic text-[120px] opacity-10 absolute -z-10">404</h1>
    <h2 className="text-3xl font-black dark:text-white mb-2 italic">אופס! הלכת לאיבוד?</h2>
    <p className="text-slate-500 dark:text-slate-400 font-bold mb-8 italic">הדף שחיפשת יצא להפסקת פרסומות ולא חזר...</p>
    <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl shadow-blue-500/20">
      <Home size={20} /> חזרה הביתה
    </Link>
  </div>
);
export default NotFound;
