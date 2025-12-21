import { openDB } from 'idb';

export interface Video {
  id?: number;
  title: string;
  blob: Blob;
  duration: number;
  type: 'short' | 'long'; 
  tags: string[];
  status: 'pending' | 'approved';
  likes: number;
  views: number;
  created_at: string;
}

const DB_NAME = 'StreamilV3';
const STORE_VIDEOS = 'videos';
const STORE_CATS = 'categories';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_VIDEOS)) {
      db.createObjectStore(STORE_VIDEOS, { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains(STORE_CATS)) {
      db.createObjectStore(STORE_CATS, { keyPath: 'id', autoIncrement: true });
    }
  },
});

export const localDB = {
  // ניהול קטגוריות
  async getCategories() {
    const db = await dbPromise;
    const cats = await db.getAll(STORE_CATS);
    return cats.length > 0 ? cats : [{ id: 1, name: 'כללי' }];
  },
  async addCategory(name: string) {
    const db = await dbPromise;
    return db.add(STORE_CATS, { name });
  },
  async deleteCategory(id: number) {
    const db = await dbPromise;
    return db.delete(STORE_CATS, id);
  },

  // ניהול סרטונים
  async getAllVideos() {
    const db = await dbPromise;
    return db.getAll(STORE_VIDEOS);
  },
  async addView(id: number) {
    const db = await dbPromise;
    const video = await db.get(STORE_VIDEOS, id);
    if (video) {
      video.views = (video.views || 0) + 1;
      await db.put(STORE_VIDEOS, video);
      return video.views;
    }
    return 0;
  },
  async addLike(id: number, tags: string[]) {
    const db = await dbPromise;
    const video = await db.get(STORE_VIDEOS, id);
    if (video) {
      video.likes = (video.likes || 0) + 1;
      await db.put(STORE_VIDEOS, video);
      tags.forEach(tag => {
        const score = Number(localStorage.getItem(`pref_${tag}`) || 0);
        localStorage.setItem(`pref_${tag}`, (score + 1).toString());
      });
    }
  },
  async submitVideo(video: any) {
    const db = await dbPromise;
    return db.add(STORE_VIDEOS, {
      ...video,
      status: 'pending',
      likes: 0,
      views: 0,
      created_at: new Date().toISOString()
    });
  },
  async updateStatus(id: number, status: 'approved' | 'rejected') {
    const db = await dbPromise;
    if (status === 'rejected') return db.delete(STORE_VIDEOS, id);
    const video = await db.get(STORE_VIDEOS, id);
    video.status = 'approved';
    return db.put(STORE_VIDEOS, video);
  }
};

// פונקציית אבטחה לבדיקת מנהל
export const auth = {
  isAdmin: () => localStorage.getItem('admin_token') === 'streamil_secure_8899',
  login: (pass: string) => {
    if (pass === '1234') { // תוכל לשנות את הסיסמה כאן
      localStorage.setItem('admin_token', 'streamil_secure_8899');
      return true;
    }
    return false;
  },
  logout: () => localStorage.removeItem('admin_token')
};
// ... (המשך לקוד הקיים ב-mockData.ts)
// הוסף את אלו למערכת ה-localDB:

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'contributor';
  status: 'active' | 'blocked';
  joinedAt: string;
}

// עדכון ה-Upgrade ב-dbPromise (הוסף את החלק הזה בתוך upgrade(db))
// if (!db.objectStoreNames.contains('users')) {
//   db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
// }

export const userDB = {
  async getUsers() {
    const db = await (await import('./mockData')).dbPromise;
    const users = await db.getAll('users');
    return users.length > 0 ? users : [
      { id: 1, username: 'מנהל ראשי', role: 'admin', status: 'active', joinedAt: '2023-01-01' },
      { id: 2, username: 'ישראל ישראלי', role: 'contributor', status: 'active', joinedAt: '2023-05-12' }
    ];
  },
  async toggleBlock(userId: number) {
    const db = await (await import('./mockData')).dbPromise;
    const user = await db.get('users', userId);
    if (user) {
      user.status = user.status === 'active' ? 'blocked' : 'active';
      await db.put('users', user);
    }
  }
};
// הוסף את זה ל-lib/mockData.ts
export type UserRole = 'admin' | 'contributor' | 'guest';

export interface UserProfile {
  id: number;
  username: string;
  role: UserRole;
}

// פונקציית לוגיקה לקבלת המשתמש הנוכחי מהזיכרון המקומי
export const getAuthUser = (): UserProfile => {
  const saved = localStorage.getItem('current_user');
  if (saved) return JSON.parse(saved);
  // ברירת מחדל אם לא מחובר
  return { id: 0, username: 'אורח', role: 'guest' };
};

// פונקציה לשינוי משתמש (לצורך בדיקות)
export const loginAs = (user: UserProfile) => {
  localStorage.setItem('current_user', JSON.stringify(user));
  window.location.reload();
};
