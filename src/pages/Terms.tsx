import React, { useState } from 'react';
import { ShieldAlert, FileText, AlertTriangle, Send, CheckCircle, X } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto py-16 px-6 text-right transition-colors dark:text-white" dir="rtl">
      <Toaster />
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
        
        <h1 className="text-4xl font-black mb-8 flex items-center gap-4 italic">
          מדיניות תוכן ותנאי שימוש <ShieldAlert size={36} className="text-blue-600" />
        </h1>

        <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          <section className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
            <h2 className="text-xl font-black mb-4 text-slate-900 dark:text-white flex items-center gap-2 italic">
              <FileText size={20} className="text-blue-500" /> כללי הקהילה
            </h2>
            <p>אין להעלות תוכן המפר זכויות יוצרים, תוכן פוגעני, אלים או כזה המפר את חוקי מדינת ישראל.</p>
          </section>

          <section className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
            <h2 className="text-xl font-black mb-4 text-slate-900 dark:text-white flex items-center gap-2 italic">
              <AlertTriangle size={20} className="text-orange-500" /> דיווח על הפרות
            </h2>
            <p className="mb-6">נתקלתם בתוכן שעובר על הכללים? אנחנו לוקחים זאת ברצינות רבה.</p>
            
            {/* הכפתור החדש שמחליף את המייל */}
            <button 
              onClick={() => setShowReportModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-red-500/20 flex items-center gap-3"
            >
              <AlertTriangle size={20} /> דווח על תוכן פוגעני באתר
            </button>
          </section>
        </div>
      </div>

      {/* מודאל דיווח (חלון קופץ) */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6 flex-row-reverse">
                <h3 className="text-2xl font-black italic dark:text-white">דיווח על תוכן</h3>
                <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleReport} className="space-y-5">
                <div>
                  <label className="block text-sm font-black mb-2 mr-2">סוג ההפרה</label>
                  <select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl border-none focus:ring-2 ring-red-500 font-bold"
                  >
                    <option>תוכן לא ראוי</option>
                    <option>הפרת זכויות יוצרים</option>
                    <option>הטרדה או בריונות</option>
                    <option>תוכן מטעה / ספאם</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 mr-2">פרטים נוספים (לינק לסרטון, סיבה)</label>
                  <textarea 
                    required
                    value={reportMsg}
                    onChange={(e) => setReportMsg(e.target.value)}
                    rows={4}
                    placeholder="פרט כאן מדוע התוכן בעייתי..."
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl border-none focus:ring-2 ring-red-500 outline-none"
                  ></textarea>
                </div>

                <button 
                  disabled={isSending}
                  className="w-full bg-red-500 hover:bg-red-600 text-white p-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all"
                >
                  {isSending ? 'שולח דיווח...' : <><Send size={20} /> שלח דיווח למנהל</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Terms;
