import React from 'react';
import { ShieldAlert, Eye, Lock } from 'lucide-react';

const Policy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm transition-colors">
      <h1 className="text-3xl font-bold dark:text-white text-slate-900 border-b pb-4 dark:border-slate-800">מדיניות האתר ותנאי שימוש</h1>
      
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-blue-500 font-bold text-xl">
          <ShieldAlert size={24} />
          <h2>כללי העלאת תוכן</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          אין להעלות תוכן המפר זכויות יוצרים, תוכן אלים, או תוכן שאינו הולם את רוח האתר. הנהלת האתר שומרת לעצמה את הזכות להסיר כל תוכן ללא הודעה מראש.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-blue-500 font-bold text-xl">
          <Eye size={24} />
          <h2>פרטיות וסינון</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          האתר מותאם לשימוש בטוח. סרטונים עוברים בדיקה בסיסית ואינם משותפים עם צד ג' ללא אישור.
        </p>
      </section>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
        <p className="text-blue-800 dark:text-blue-300 text-sm">
          בשימושך באתר זה, אתה מאשר כי קראת והבנת את תנאי השימוש.
        </p>
      </div>
    </div>
  );
};

export default Policy;
