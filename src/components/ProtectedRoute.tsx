import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/DataService';

// זיכרון גלובלי מהיר למניעת בדיקות חוזרות באותו סשן
let cachedAdminStatus: boolean | null = null;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // בדיקה משולבת של זיכרון RAM וזיכרון דפדפן לאישור מיידי
  const [isAdmin, setIsAdmin] = useState<boolean | null>(() => {
    if (cachedAdminStatus !== null) return cachedAdminStatus;
    const local = localStorage.getItem('is_admin');
    if (local === 'true') return true;
    if (local === 'false') return false;
    return null;
  });

  useEffect(() => {
    // אם הסטטוס כבר חיובי, אין צורך בבדיקה נוספת שעלולה לחסום גישה
    if (isAdmin === true) return;

    const checkAdmin = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          updateStatus(false);
          return;
        }

        // בדיקה מול טבלת המנהלים
        const { data, error } = await supabase
          .from('site_admins')
          .select('email')
          .eq('email', session.user.email.toUpperCase())
          .maybeSingle();

        updateStatus(!!data && !error);
        
      } catch (err) {
        console.error("--- [DEBUG] Protection Error:", err);
        updateStatus(false);
      }
    };

    const updateStatus = (status: boolean) => {
      cachedAdminStatus = status;
      localStorage.setItem('is_admin', String(status));
      setIsAdmin(status);
    };

    checkAdmin();
  }, [isAdmin]);

  // מצב טעינה (רק כשבאמת אין מידע)
  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#001e3c] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-yellow-400 font-bold animate-pulse uppercase tracking-widest text-xs">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  // חסימת גישה למשתמשים רגילים
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;