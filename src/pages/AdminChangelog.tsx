import React from 'react';
import { ClipboardList, CheckCircle2 } from 'lucide-react';

const AdminChangelog: React.FC = () => {
  const updates = [
    { title: "נגן וידאו מותאם אישית", desc: "הטמעת CustomPlayer ב-FeatureHub עם כפתורי שליטה מעוצבים ומצב לילה", date: "21/12/2025" },
    { title: "הפרדת רשויות (FeatureHub)", desc: "העברת פיצ'רים (חיפוש, Theme) למודול נפרד להגנה על ליבת האתר", date: "21/12/2025" },
    { title: "מערכת ניהול פרסומות", desc: "הוספת טבלת ads, רכיב AdBanner ודף ניהול /admin/ads", date: "21/12/2025" },
    { title: "הגנת מנהל (Admin Shield)", desc: "חסימת דף Upload וניהול פרסומות למייל מורשה בלבד", date: "21/12/2025" }
  ];
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-right" dir="rtl">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-3 justify-end">
        יומן שדרוגים (Changelog) <ClipboardList className="text-blue-600" />
      </h1>
      <div className="space-y-4">
        {updates.map((upd, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-start gap-4 flex-row-reverse">
            <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{upd.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{upd.desc}</p>
              <span className="text-xs text-slate-300 block mt-2">{upd.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminChangelog;
