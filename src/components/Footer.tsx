import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 flex-row-reverse text-right">
        <div className="text-blue-600 dark:text-blue-400 font-black text-xl italic">STREAMIL</div>
        
        <div className="flex gap-8 flex-row-reverse text-sm font-bold text-slate-500 dark:text-slate-400">
          <Link to="/terms" className="hover:text-blue-600">תנאי שימוש</Link>
          <Link to="/contact" className="hover:text-blue-600">צור קשר</Link>
          <Link to="/profile" className="hover:text-blue-600">הודעות שלי</Link>
          <Link to="/admin" className="hover:text-blue-600">פאנל ניהול</Link>
        </div>

        <div className="text-slate-400 text-xs font-medium">
          © 2025 Streamil. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
