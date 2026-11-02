import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/initialProducts';
import { ProductCategory } from '../types';
import {
  ShoppingBag,
  Search,
  ShieldCheck,
  Menu,
  X,
  Smartphone,
  Headphones,
  Laptop,
  Zap,
  Truck,
  ArrowRight,
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { cartTotalCount, cartTotalPrice, setIsCartOpen, filters, setFilters } = useStore();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState(filters.searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, searchQuery: searchVal }));
    if (currentPath !== '/') {
      onNavigate('/');
    }
  };

  const handleCategoryClick = (catId: ProductCategory | 'all') => {
    setFilters((prev) => ({ ...prev, category: catId }));
    setMobileMenuOpen(false);
    if (currentPath !== '/') {
      onNavigate('/');
    }
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (id: ProductCategory) => {
    switch (id) {
      case 'smartphones':
        return <Smartphone className="w-4 h-4" />;
      case 'audio':
        return <Headphones className="w-4 h-4" />;
      case 'computers':
        return <Laptop className="w-4 h-4" />;
      case 'chargers':
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Truck className="w-3.5 h-3.5" />
        <span>Бесплатная экспресс-доставка по Казахстану при заказе от 15 000 ₸ • Гарантия качества на все товары</span>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  TechStore
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Аксессуары для электроники
              </p>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg relative"
          >
            <input
              type="text"
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
              }}
              placeholder="Поиск по каталогу (например, чехол, GaN, наушники, хаб)..."
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-full py-2.5 pl-11 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            {searchVal && (
              <button
                type="button"
                onClick={() => {
                  setSearchVal('');
                  setFilters((prev) => ({ ...prev, searchQuery: '' }));
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Admin Access Button */}
            <button
              onClick={() => onNavigate(isAuthenticated ? '/admin' : '/admin/login')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                currentPath.startsWith('/admin')
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs'
              }`}
              title="Панель администратора"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">
                {isAuthenticated ? 'Панель управления' : 'Вход для админа'}
              </span>
              <span className="sm:hidden">Админ</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all duration-150"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">
                {cartTotalPrice > 0 ? `${cartTotalPrice.toLocaleString('ru-RU')} ₸` : 'Корзина'}
              </span>
              {cartTotalCount > 0 && (
                <span className="flex items-center justify-center bg-rose-500 text-white text-xs font-black w-5 h-5 rounded-full ring-2 ring-white">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories Bar (Desktop) */}
        <div className="hidden md:flex items-center gap-2 py-3 border-t border-slate-100 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all duration-150 ${
              filters.category === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Все товары
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 ${
                filters.category === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
              }}
              placeholder="Поиск товаров..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Категории каталога
            </p>
            <button
              onClick={() => handleCategoryClick('all')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
                filters.category === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Все товары</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                  filters.category === cat.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {getCategoryIcon(cat.id)}
                  <span>{cat.name}</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(isAuthenticated ? '/admin' : '/admin/login');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-semibold"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>{isAuthenticated ? 'Панель управления' : 'Вход для администратора'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
