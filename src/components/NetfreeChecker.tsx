import React, { useEffect, useState } from 'react';

export const NetfreeChecker: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'open' | 'blocked'>('checking');

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // מנסים לטעון את קובץ הליבה של פיירבייס שנטפרי בדרך כלל מאשרים
        const response = await fetch('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js', { 
          mode: 'no-cors',
          cache: 'no-store' 
        });
        setStatus('open');
      } catch (e) {
        setStatus('blocked');
      }
    };
    testFirebase();
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-[500] animate-bounce">
      {status === 'checking' && (
        <div className="bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl">
          בודק חיבור לתשתית ענן...
        </div>
      )}
      {status === 'open' && (
        <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-black shadow-xl flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          תשתית Firebase מאושרת בנטפרי
        </div>
      )}
      {status === 'blocked' && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-black shadow-xl flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full" />
          שירותי הענן חסומים בסינון זה
        </div>
      )}
    </div>
  );
};
