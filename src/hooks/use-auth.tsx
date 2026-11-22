'use client';

import * as React from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserSettings, createUserSettings, initializeHolidays, initializeLeaveBalances } from '@/lib/firestore';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { setUser: setStoreUser, setSettings, logout: storeLogout, setIsLoading } = useAppStore();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setStoreUser({ uid: firebaseUser.uid, email: firebaseUser.email!, displayName: firebaseUser.displayName });

        // Load or create user settings
        let settings = await getUserSettings(firebaseUser.uid);
        if (!settings) {
          settings = await createUserSettings(firebaseUser.uid, {
            employeeName: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
          });
          // Initialize holidays and leave balances for current year
          const currentYear = new Date().getFullYear();
          await initializeHolidays(firebaseUser.uid, currentYear);
          await initializeLeaveBalances(firebaseUser.uid, currentYear, settings);
        }
        setSettings(settings);
      } else {
        setUser(null);
        setStoreUser(null);
        storeLogout();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setStoreUser, setSettings, storeLogout]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('مرحباً بك!');
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found'
        ? 'البريد الإلكتروني غير مسجل'
        : error.code === 'auth/wrong-password'
        ? 'كلمة المرور غير صحيحة'
        : error.code === 'auth/invalid-email'
        ? 'صيغة البريد الإلكتروني غير صحيحة'
        : 'فشل في تسجيل الدخول';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile with name
      await result.user.updateProfile({ displayName: name });
      toast.success('تم إنشاء الحساب بنجاح!');
    } catch (error: any) {
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'البريد الإلكتروني مستخدم بالفعل'
        : error.code === 'auth/weak-password'
        ? 'كلمة المرور ضعيفة جداً (6 أحرف على الأقل)'
        : error.code === 'auth/invalid-email'
        ? 'صيغة البريد الإلكتروني غير صحيحة'
        : 'فشل في إنشاء الحساب';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      toast.success('تم تسجيل الخروج');
    } catch (error) {
      toast.error('فشل في تسجيل الخروج');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}