import React from 'react';
import { ShieldCheck, Eye, UploadCloud, Scale } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-right" dir="rtl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-slate-900 mb-4">תקנון השימוש ב-STREAM<span className="text-blue-600">free</span></h1>
        <p className="text-xl text-slate-500 font-bold">הבית לתוכן וידאו כשר, איכותי ומבוקר</p>
      </div>

      <div className="grid gap-8">
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-600 p-3 rounded-2xl text-white"><ShieldCheck /></div>
            <h2 className="text-2xl font-black">התחייבות לתוכן כשר</h2>
          </div>
          <p className="text-slate-600 font-bold leading-relaxed">
            פלטפורמת STREAMfree הוקמה במטרה לספק סביבת צפייה בטוחה למשפחה היהודית. 
            כל תוכן המועלה לאתר נבדק באופן ידני ופרטני על ידי הנהלת האתר. 
            אנו מתחייבים שכל הסרטונים באתר יעמדו בגדרי ההלכה והצניעות, ללא פשרות.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 text-white p-8 rounded-[3rem]">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-blue-400">
              <UploadCloud size={20} /> העלאת תכנים
            </h3>
            <p className="text-slate-300 font-bold text-sm leading-relaxed">
              העלאת תכנים לאתר מתבצעת על ידי שליחת הצעה (קישור חיצוני) למנהל המערכת בלבד. 
              אין למשתמשים אפשרות להעלות קבצים ישירות לשרתי האתר. 
              הנהלת האתר שומרת לעצמה את הזכות המלאה לדחות כל תוכן שאינו עומד ברוח האתר.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-[3rem] border border-blue-100">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-blue-700">
              <Eye size={20} /> פרטיות וצפייה
            </h3>
            <p className="text-blue-900/70 font-bold text-sm leading-relaxed">
              הצפייה בתכנים מותרת למשתמשים רשומים בלבד. 
              אנו שומרים על פרטיות המשתמשים ומתחייבים שלא לעשות שימוש במידע האישי מעבר לצרכי התפעול השוטפים של האתר.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200">
          <h3 className="text-xl font-black mb-4 flex items-center gap-2">
            <Scale size={20} className="text-slate-400" /> הצהרת משתמש
          </h3>
          <p className="text-slate-500 font-bold text-sm">
            בעת ההרשמה לאתר, המשתמש מצהיר כי הוא מודע לכך שהאתר מבוקר וכי כל ניסיון להעלות או להפיץ תוכן שאינו הולם יגרור חסימה מיידית לצמיתות.
          </p>
        </div>
      </div>
    </div>
  );
};
export default About;
