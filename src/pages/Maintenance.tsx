import React from 'react';
import { Clock, ShieldAlert } from 'lucide-react';

const Maintenance: React.FC = () => (
  <div className="min-h-[70vh] flex items-center justify-center p-6 text-center" dir="rtl">
    <div className="max-w-lg space-y-6">
      <div className="bg-amber-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto animate-pulse">
        <Clock className="text-amber-600" size={48} />
      </div>
      <h1 className="text-4xl font-black text-slate-900">האתר בהפסקה זמנית</h1>
      <p className="text-xl text-slate-500 font-bold leading-relaxed">
        מערכת <span className="text-blue-600 font-black italic">STREAMfree</span> נמצאת כרגע בעדכון תוכן או במצב מנוחה. 
        <br /> נחזור לפעילות מלאה בקרוב מאוד, תודה על הסבלנות!
      </p>
      <div className="p-4 bg-slate-100 rounded-2xl inline-flex items-center gap-2 text-slate-600 font-bold">
        <ShieldAlert size={20} />
        בפיקוח צוות המערכת
      </div>
    </div>
  </div>
);
export default Maintenance;
