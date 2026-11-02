import React from 'react';
import { ProductCategory } from '../types';
import { CATEGORIES } from '../data/initialProducts';
import { Zap, ShieldCheck, Phone, Mail, MapPin, Clock, CreditCard, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { setFilters } = useStore();
  const { isAuthenticated } = useAuth();

  const handleCategoryClick = (catId: ProductCategory) => {
    setFilters((prev) => ({ ...prev, category: catId }));
    onNavigate('/');
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top benefits strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-slate-100">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Быстрая доставка</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                По Алматы и Астане в день заказа. По всему Казахстану от 1 дня.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Гарантия 12 месяцев</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Только оригинальная продукция с официальной гарантией качества.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Удобная оплата</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Kaspi QR, Kaspi Red, банковские карты и при получении.
              </p>
            </div>
          </div>
        </div>

        {/* 4-column footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: About */}
          <div>
            <div className="flex items-center gap-2.5 mb-4 select-none">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="text-xl font-black text-slate-900">TechStore</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 mb-4">
              Специализированный интернет-магазин аксессуаров для электроники в Казахстане. Большой выбор чехлов, защитных стекол, аудиоустройств, кабелей и компьютерной периферии.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Город Алматы, проспект Достык, 180</p>
              <p>ТОО «TechStore Kazakhstan»</p>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Категории товаров
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className="hover:text-blue-600 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer service info */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Контакты и поддержка
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold text-slate-800">+7 (727) 355-22-11</span>
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>+7 (777) 100-20-30 (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>info@techstore.kz</span>
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Ежедневно: 09:00 — 21:00</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Admin Access & Info */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Сотрудникам
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Панель управления заказами, остатками склада и каталогом товаров.
            </p>
            <div>
              <button
                onClick={() => onNavigate(isAuthenticated ? '/admin' : '/admin/login')}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>{isAuthenticated ? 'Панель управления' : 'Вход для сотрудников'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 TechStore Kazakhstan. Все права защищены.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-blue-600 transition-colors"
            >
              Каталог
            </button>
            <button
              onClick={() => onNavigate('/admin')}
              className="hover:text-blue-600 transition-colors"
            >
              Панель управления
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
