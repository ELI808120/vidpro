import React from 'react';
import { Briefcase, Mail, Phone, MessageSquare } from 'lucide-react';

const Advertisers: React.FC = () => (
  <div className="max-w-4xl mx-auto py-12 px-6 text-right" dir="rtl">
    <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] mb-10 relative overflow-hidden">
      <Briefcase className="absolute -left-10 -top-10 text-white/5" size={250} />
      <h1 className="text-4xl font-black mb-4">שיתופי פעולה ופרסום</h1>
      <p className="text-slate-300 text-xl font-bold max-w-xl">רוצים להגיע לקהל יעד איכותי וממוקד? STREAMfree מציעה פלטפורמת פרסום נקייה וכשרה.</p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
        <h2 className="text-2xl font-black flex items-center gap-2"><MessageSquare className="text-blue-600" /> דברו איתנו</h2>
        <form className="space-y-4">
          <input type="text" placeholder="שם העסק / המפרסם" className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none" />
          <input type="email" placeholder="אימייל לחזרה" className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none" />
          <textarea placeholder="מה אתם מתכננים?" className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none h-32"></textarea>
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">שליחת בקשת פרסום</button>
        </form>
      </div>
      
      <div className="space-y-6">
        <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100">
          <h3 className="text-xl font-black text-blue-900 mb-4">למה לפרסם אצלנו?</h3>
          <ul className="space-y-3 font-bold text-blue-800">
            <li>• חשיפה לקהל חרדי ודתי מבוקר</li>
            <li>• סביבת תוכן נקייה ללא סיכונים</li>
            <li>• אפשרויות פרסום בוידאו ובדף הבית</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);
export default Advertisers;
