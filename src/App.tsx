import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CatalogView } from './views/CatalogView';
import { AdminLoginView } from './views/AdminLoginView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Toast } from './components/Toast';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Client-side router supporting '/', '/admin', '/admin/login'
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin/login')) return '/admin/login';
    if (path.startsWith('/admin')) return '/admin';
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin/login')) setCurrentPath('/admin/login');
      else if (path.startsWith('/admin')) setCurrentPath('/admin');
      else setCurrentPath('/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <StoreProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
          {/* Header */}
          {currentPath !== '/admin' && (
            <Header currentPath={currentPath} onNavigate={navigate} />
          )}

          {/* Main Views routing */}
          <main className="flex-1">
            {currentPath === '/admin' && (
              <AdminDashboardView onNavigate={navigate} />
            )}
            {currentPath === '/admin/login' && (
              <AdminLoginView onNavigate={navigate} />
            )}
            {currentPath === '/' && <CatalogView />}
          </main>

          {/* Footer */}
          {currentPath !== '/admin' && (
            <Footer onNavigate={navigate} />
          )}

          {/* Global Interactive Modals & Drawers */}
          <ProductDetailModal />
          <CartDrawer />
          <CheckoutModal />
          <OrderSuccessModal onNavigate={navigate} />
          <Toast />
          <OfflineIndicator />
        </div>
      </StoreProvider>
    </AuthProvider>
  );
}
