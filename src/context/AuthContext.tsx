import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { storage } from '../services/storage';

interface AuthContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// Strictly authorized administrator credentials
const VALID_ADMIN_EMAILS = [
  'mr.admin@techstore.demo',
  'mr.admin@techstore.kz',
  'admin@techstore.kz',
];
const ADMIN_PASSWORD = '!TechStoreDemo!';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => storage.getAdminSession());

  useEffect(() => {
    const saved = storage.getAdminSession();
    if (saved) {
      setAdminUser(saved);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Artificial security delay
    await new Promise((res) => setTimeout(res, 400));

    const normalizedEmail = email.trim().toLowerCase();

    const isAuthorizedEmail = VALID_ADMIN_EMAILS.some(
      (valid) => valid.toLowerCase() === normalizedEmail
    );

    if (isAuthorizedEmail && pass === ADMIN_PASSWORD) {
      const user: AdminUser = {
        email: normalizedEmail,
        name: 'Главный Администратор',
        role: 'admin',
        token: `auth-admin-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      };
      storage.setAdminSession(user);
      setAdminUser(user);
      return { success: true };
    }

    return {
      success: false,
      error: 'Доступ запрещен. Неверный адрес электронной почты или пароль.',
    };
  };

  const logout = () => {
    storage.setAdminSession(null);
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
