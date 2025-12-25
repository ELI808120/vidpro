import React from 'react';
import { ShieldCheck, Users, Eye } from 'lucide-react';

const Policy: React.FC = () => {
  return (
    <div className="bg-[#001e3c] min-h-screen text-white" dir="rtl">
      <div className="max-w-4xl mx-auto p-6 sm:p-10">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-yellow-400">מדיניות ותנאי שימוש</h1>
          <p className="text-blue-300 font-bold mt-2 text-lg italic">המחויבות שלנו לחוויה איכותית ובטוחה</p>
        </header>
        
        <div className="space-y-8 bg-blue-900/20 p-8 rounded-[32px] border border-blue-800 shadow-2xl">
          
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-yellow-400 font-black text-2xl border-b-2 border-yellow-400/20 pb-2 mb-3">
              <ShieldCheck size={28} />
              <h2>מדיניות התוכן באתר</h2>
            </div>
            <p className="text-blue-200 leading-relaxed text-lg">
              אנו ב-Streamil מחויבים לספק חווית צפייה בטוחה, נקייה ואיכותית. לשם כך, <strong className="font-extrabold text-white">כל התכנים באתר נבחרים, נבדקים ומאושרים באופן ידני על ידי צוות האתר</strong>.
            </p>
            <p className="text-blue-300 leading-relaxed">
              מדיניות זו מבטיחה שכל סרטון שאתם רואים עומד בסטנדרטים הקהילתיים שלנו, מתאים לכלל הקהלים, ונקי מתכנים המפרים זכויות יוצרים, אלימות או חומרים פוגעניים.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-yellow-400 font-black text-2xl border-b-2 border-yellow-400/20 pb-2 mb-3">
              <Users size={28} />
              <h2>כללי התנהגות קהילה</h2>
            </div>
            <p className="text-blue-300 leading-relaxed">
              השימוש באתר מיועד לצפייה, תגובה ושיתוף. אנו מצפים מכלל המשתמשים לשמור על שיח מכבד ומכיל בתגובות. חל איסור על שימוש בשפה פוגענית, איומים, הטרדות, או ניסיון לעקוף את מנגנוני האתר.
            </p>
             <p className="text-blue-300 leading-relaxed">
              הנהלת האתר שומרת לעצמה את הזכות לחסום משתמשים שיפרו כללים אלו ולהסיר תגובות בלתי הולמות ללא הודעה מוקדמת.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-yellow-400 font-black text-2xl border-b-2 border-yellow-400/20 pb-2 mb-3">
              <Eye size={28} />
              <h2>פרטיות המשתמש</h2>
            </div>
            <p className="text-blue-300 leading-relaxed">
              אנו מכבדים את פרטיותך. פרטי ההתחברות שלך (אימייל וסיסמה מוצפנת) נשמרים באופן מאובטח ולא ישותפו עם אף צד שלישי. האתר מותאם לשימוש בטוח וסביבה נקייה.
            </p>
          </section>

          <div className="p-5 bg-yellow-400/10 rounded-2xl border border-yellow-400/30 mt-10">
            <p className="text-yellow-300 text-center font-bold">
              המשך השימוש באתר מהווה הסכמה מלאה לכל התנאים המצוינים לעיל.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policy;
