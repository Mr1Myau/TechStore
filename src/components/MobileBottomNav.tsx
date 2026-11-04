import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Grid,
  Search,
  ShoppingBag,
  ShieldCheck,
  Download,
  Zap,
  X,
  Share,
  PlusSquare,
  Sparkles,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPath,
  onNavigate,
}) => {
  const { cartTotalCount, setIsCartOpen, filters, setFilters } = useStore();
  const { isAuthenticated } = useAuth();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchQuery);

  const handleCatalogClick = () => {
    if (currentPath !== '/') {
      onNavigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, searchQuery: searchInput }));
    setSearchModalOpen(false);
    if (currentPath !== '/') {
      onNavigate('/');
    }
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminClick = () => {
    onNavigate(isAuthenticated ? '/admin' : '/admin/login');
  };

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else {
      setInstallModalOpen(true);
    }
  };

  const isCatalogActive = currentPath === '/';
  const isAdminActive = currentPath.startsWith('/admin');

  return (
    <>
      {/* Fixed Native-Style Bottom Navigation Bar for Mobile */}
      <nav
        aria-label="Мобильная навигация"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-5 items-center max-w-md mx-auto">
          {/* 1. Catalog */}
          <button
            onClick={handleCatalogClick}
            type="button"
            className={`flex flex-col items-center justify-center py-1 transition-all duration-150 active:scale-95 ${
              isCatalogActive && !searchModalOpen
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div
              className={`relative p-1 rounded-xl transition-all ${
                isCatalogActive && !searchModalOpen
                  ? 'bg-blue-50 text-blue-600'
                  : ''
              }`}
            >
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-tight tracking-tight mt-0.5">Каталог</span>
          </button>

          {/* 2. Search */}
          <button
            onClick={() => {
              setSearchInput(filters.searchQuery);
              setSearchModalOpen(true);
            }}
            type="button"
            className={`flex flex-col items-center justify-center py-1 transition-all duration-150 active:scale-95 ${
              filters.searchQuery
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div
              className={`relative p-1 rounded-xl transition-all ${
                filters.searchQuery ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <Search className="w-5 h-5" />
              {filters.searchQuery && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-600" />
              )}
            </div>
            <span className="text-[10px] leading-tight tracking-tight mt-0.5">Поиск</span>
          </button>

          {/* 3. Center Cart Button (Emphasized) */}
          <button
            onClick={() => setIsCartOpen(true)}
            type="button"
            className="flex flex-col items-center justify-center py-0.5 transition-all duration-150 active:scale-95 relative group"
          >
            <div className="relative -mt-3 w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 ring-4 ring-white group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-rose-600 text-white text-[10px] font-black rounded-full ring-2 ring-white flex items-center justify-center">
                  {cartTotalCount > 99 ? '99+' : cartTotalCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight tracking-tight mt-0.5">
              Корзина
            </span>
          </button>

          {/* 4. Install PWA / App */}
          <button
            onClick={handleInstallClick}
            type="button"
            className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-blue-600 font-medium transition-all duration-150 active:scale-95"
            title="Установить приложение"
          >
            <div className="relative p-1 rounded-xl text-blue-600 bg-blue-50">
              <Zap className="w-5 h-5 fill-blue-600" />
              {!isInstalled && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white animate-pulse" />
              )}
            </div>
            <span className="text-[10px] leading-tight tracking-tight mt-0.5 font-bold text-blue-700">
              {isInstalled ? 'Приложение' : 'Установить'}
            </span>
          </button>

          {/* 5. Admin */}
          <button
            onClick={handleAdminClick}
            type="button"
            className={`flex flex-col items-center justify-center py-1 transition-all duration-150 active:scale-95 ${
              isAdminActive
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div
              className={`relative p-1 rounded-xl transition-all ${
                isAdminActive ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-tight tracking-tight mt-0.5">
              {isAuthenticated ? 'Кабинет' : 'Админ'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Quick Search Sheet */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-start p-4 pt-12 animate-in fade-in duration-150 md:hidden">
          <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Поиск по каталогу</h3>
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Название, бренд или тип (чехол, GaN, AirPods)..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-2xl py-3 pl-11 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Suggestion Pills */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Популярные запросы:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['MagSafe', 'AirPods', 'GaN 65W', 'PowerBank', 'Хаб Type-C', 'Чехол'].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSearchInput(tag);
                          setFilters((prev) => ({ ...prev, searchQuery: tag }));
                          setSearchModalOpen(false);
                          if (currentPath !== '/') onNavigate('/');
                          const catalogEl = document.getElementById('catalog-section');
                          if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setFilters((prev) => ({ ...prev, searchQuery: '' }));
                    setSearchModalOpen(false);
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Сбросить
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  Найти товары
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PWA / Mobile App Install Modal */}
      {installModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900 relative animate-in slide-in-from-bottom duration-300">
            <button
              onClick={() => setInstallModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* App Icon with Blue gradient and lightning bolt */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                <Zap className="w-8 h-8 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-black text-slate-900">TechStore App</h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">PWA</span>
                </div>
                <p className="text-xs text-slate-500">Мобильное приложение для смартфонов</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed mb-5">
              <div className="flex items-center gap-2 text-blue-700 font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Преимущества приложения:</span>
              </div>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>Мгновенный запуск прямо с экрана смартфона</li>
                <li>Работает автономно даже без стабильного интернета</li>
                <li>Удобное управление корзиной и заказами в 1 касание</li>
              </ul>
            </div>

            {isInstallable ? (
              <button
                onClick={() => {
                  setInstallModalOpen(false);
                  install();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-md shadow-blue-600/25 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Установить приложение на телефон</span>
              </button>
            ) : isIOS ? (
              <div className="space-y-2.5 text-xs text-slate-700 bg-blue-50/70 p-4 rounded-2xl border border-blue-200">
                <p className="font-bold text-blue-900">Инструкция для iPhone (Safari):</p>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">1.</span>
                  <span>Нажмите кнопку «Поделиться» <Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" /> внизу Safari</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">2.</span>
                  <span>Выберите «На экран «Домой»» <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" /></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">3.</span>
                  <span>Нажмите «Добавить» в правом верхнем углу</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p>
                  Откройте меню браузера (три точки в углу) и выберите <strong>«Установить приложение»</strong> или <strong>«Добавить на главный экран»</strong>.
                </p>
              </div>
            )}

            <button
              onClick={() => setInstallModalOpen(false)}
              className="mt-3 w-full rounded-xl py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};
