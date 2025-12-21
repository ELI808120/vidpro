import React, { useState } from 'react';
import { ShieldAlert, FileText, AlertTriangle, Send, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/DataService';
import { toast, Toaster } from 'react-hot-toast';

const Terms: React.FC = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('תוכן לא ראוי');
  const [reportMsg, setReportMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const { error } = await supabase.from('contact_messages').insert([{
      email: session?.user?.email || 'אנונימי',
      message: `[דיווח תוכן - ${reportType}]: ${reportMsg}`,
      user_id: session?.user?.id || null
    }]);

    if (error) {
      toast.error('שגיאה בשליחת הדיווח');
    } else {
      toast.success('הדיווח התקבל וייבדק בהקדם');
      setReportMsg('');
      setShowReportModal(false);
    }
    setIsSending(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-right" dir="rtl">
      <Toaster />
      
      {/* כרטיס ראשי עם ניגודיות גבוהה */}
      <div className="bg-white border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden text-black">
        
        {/* כותרת עליונה בולטת */}
        <div className="bg-blue-700 p-6 text-white flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
             מדיניות ותנאי שימוש <ShieldAlert size={30} />
          </h1>
        </div>

        <div className="p-6 md:p-10 space-y-8">
          
          {/* הבהרת אי-קשר לנטפרי - בולט מאוד */}
          <div className="bg-yellow-50 border-2 border-yellow-400 p-5 rounded-lg text-black">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              <AlertTriangle className="text-red-600" /> הבהרה חשובה
            </h3>
            <p className="text-md leading-relaxed">
              אתר <strong>VIDPRO</strong> הינו אתר פרטי. 
              <span className="underline decoration-red-500 font-black px-1">האתר אינו קשור, מופעל או ממומן על ידי ארגון "נטפרי".</span> 
              המדיניות להלן נועדה להתאים את האתר לכללי הקהילה החרדית בלבד.
            </p>
          </div>

          {/* סעיף נטפרי */}
          <section className="border-b-2 border-gray-100 pb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-800">
              <ShieldCheck className="text-green-600" /> התאמה למדיניות נטפרי
            </h2>
            <p className="mb-4 text-lg">
              אנו מחויבים לכללי המדיניות של נטפרי כפי שמופיעים ב
              <a href="https://netfree.link/wiki/%D7%9E%D7%93%D7%99%D7%A0%D7%99%D7%95%D7%AA_%D7%A0%D7%98%D7%A4%D7%A8%D7%99" 
                 target="_blank" rel="noopener noreferrer" className="font-bold text-blue-700 underline mx-1">
                וויקי נטפרי <ExternalLink size={14} className="inline" />
              </a>:
            </p>
            <ul className="list-disc list-inside space-y-3 font-medium text-gray-800 text-md">
              <li>איסור מוחלט על תכני תועבה, כפירה או בידור פסול.</li>
              <li>איסור על העלאת תמונות או סרטונים הכוללים נשים.</li>
              <li>האתר מיועד לתוכן תועלתי/לימודי לטובת הציבור החרדי.</li>
            </ul>
          </section>

          {/* כפתור דיווח ענק ובולט */}
          <section className="bg-red-50 p-6 rounded-xl border-2 border-red-200 text-center">
            <h3 className="text-xl font-bold text-red-700 mb-4 italic">מצאתם תוכן בעייתי או כזה שאינו תואם למדיניות?</h3>
            <button 
              onClick={() => setShowReportModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white text-xl font-black py-5 px-10 rounded-xl transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-3 mx-auto w-full md:w-auto"
            >
              <AlertTriangle size={24} /> לחץ כאן לדיווח על תוכן
            </button>
          </section>

        </div>
      </div>

      {/* מודאל דיווח - עיצוב נקי עם אותיות שחורות בולטות */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl border-4 border-gray-300 shadow-2xl p-8 relative">
            
            <div className="flex justify-between items-center mb-6 border-b-2 pb-2">
              <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:text-red-600">
                <X size={30} />
              </button>
              <h3 className="text-2xl font-bold text-black italic">דיווח למנהל</h3>
            </div>

            <form onSubmit={handleReport} className="space-y-6 text-right">
              <div>
                <label className="block text-black font-bold mb-2">סוג הבעיה:</label>
                <select 
                  value={reportType} 
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-4 bg-gray-100 text-black font-bold border-2 border-gray-400 rounded-lg focus:border-blue-600 outline-none"
                >
                  <option>תוכן שאינו הולם את מדיניות נטפרי</option>
                  <option>הפרת זכויות יוצרים</option>
                  <option>תוכן פוגעני או אלים</option>
                  <option>אחר</option>
                </select>
              </div>

              <div>
                <label className="block text-black font-bold mb-2">פרטים (לינק או סיבה):</label>
                <textarea 
                  required
                  value={reportMsg}
                  onChange={(e) => setReportMsg(e.target.value)}
                  rows={4}
                  placeholder="כתוב כאן..."
                  className="w-full p-4 bg-gray-100 text-black font-bold border-2 border-gray-400 rounded-lg focus:border-red-600 outline-none placeholder-gray-500"
                ></textarea>
              </div>

              <button 
                disabled={isSending}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white p-5 rounded-xl font-black text-xl flex items-center justify-center gap-3"
              >
                {isSending ? 'שולח כעת...' : <><Send size={24} /> שלח דיווח למנהל</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Terms;
