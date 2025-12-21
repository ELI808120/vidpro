import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const DataService = {
  async login(email, password) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email, password) {
    return await supabase.auth.signUp({ email, password });
  },

  async logout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const adminEmails = ['a052763527@gmail.com'];
    return { ...user, isAdmin: adminEmails.includes(user.email) };
  },

  async getVideos() {
    return await supabase.from('videos').select('*').order('created_at', { ascending: false });
  },

  // פונקציה חדשה להעלאת קובץ וידאו אמיתי
  async uploadVideoFile(file) {
    const fileName = `${Math.random()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);
      
    return publicUrl;
  }
};
