import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/initialProducts';
import { ProductCategory, FilterState } from '../types';
import { ProductCard } from '../components/ProductCard';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Smartphone,
  Headphones,
  Laptop,
  Zap,
  ArrowUpDown,
  Search,
  Sparkles,
  ShieldCheck,
  Truck,
  Flame,
} from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { products, filters, setFilters, resetFilters } = useStore();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Compute price bounds from actual products
  const { maxAvailablePrice } = useMemo(() => {
    if (products.length === 0) return { maxAvailablePrice: 80000 };
    const prices = products.map((p) => p.price);
    return {
      maxAvailablePrice: Math.max(...prices),
    };
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (filters.category !== 'all' && p.category !== filters.category) {
          return false;
        }
        // Search query filter
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }
        // Price filter
        if (p.price < filters.minPrice) return false;
        if (filters.maxPrice > 0 && p.price > filters.maxPrice) return false;
        // Stock filter
        if (filters.inStockOnly && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'name':
            return a.name.localeCompare(b.name, 'ru');
          case 'popular':
          default:
            return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.reviewsCount - a.reviewsCount;
        }
      });
  }, [products, filters]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    CATEGORIES.forEach((cat) => {
      counts[cat.id] = products.filter((p) => p.category === cat.id).length;
    });
    return counts;
  }, [products]);

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

  const isFiltered =
    filters.category !== 'all' ||
    filters.searchQuery !== '' ||
    filters.minPrice > 0 ||
    filters.maxPrice < maxAvailablePrice ||
    filters.inStockOnly;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200/80 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Официальный магазин электроники и аксессуаров</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4 leading-tight">
              Премиальные аксессуары для вашей техники в{' '}
              <span className="text-blue-600">
                TechStore
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-medium">
              Оригинальные чехлы MagSafe, Hi-Res наушники с активным шумоподавлением, эргономичные клавиатуры и скоростные GaN-зарядки до 100W.
            </p>

            {/* Quick feature pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Доставка по Казахстану от 1 дня</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Гарантия 12 месяцев</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>30 топовых моделей</span>
              </div>
            </div>
          </div>

          {/* 4 Category Quick Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => {
              const isActive = filters.category === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      category: prev.category === cat.id ? 'all' : cat.id,
                    }));
                    const catalogEl = document.getElementById('catalog-section');
                    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none group shadow-xs ${
                    isActive
                      ? 'bg-blue-50 border-blue-500 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                      }`}
                    >
                      {getCategoryIcon(cat.id)}
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {categoryCounts[cat.id]} шт.
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {cat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Catalog Content Area */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Control Bar: Search info, filter count, sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>Каталог аксессуаров</span>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                {filteredProducts.length} из {products.length}
              </span>
            </h2>
            {filters.searchQuery && (
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <span>Результаты поиска: </span>
                <span className="font-bold text-slate-900">«{filters.searchQuery}»</span>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  className="text-blue-600 hover:underline ml-1 font-semibold"
                >
                  очистить
                </button>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Фильтры</span>
              {isFiltered && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="sort-select" className="text-xs text-slate-500 hidden sm:inline font-medium">Сортировка:</label>
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as FilterState['sortBy'],
                  }))
                }
                className="bg-transparent text-xs text-slate-900 font-bold focus:outline-none cursor-pointer pr-2"
              >
                <option value="popular">По популярности</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
                <option value="rating">По рейтингу</option>
                <option value="name">По названию (А-Я)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid with Sidebar Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs sticky top-28 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Фильтры
                  </h3>
                </div>
                {isFiltered && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Сбросить</span>
                  </button>
                )}
              </div>

              {/* Categories Section */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Категории
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      filters.category === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>Все товары</span>
                    <span className="text-[11px] opacity-80">{categoryCounts.all}</span>
                  </button>

                  {CATEGORIES.map((cat) => {
                    const isSelected = filters.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            category: isSelected ? 'all' : cat.id,
                          }))
                        }
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          {getCategoryIcon(cat.id)}
                          <span className="truncate">{cat.name}</span>
                        </div>
                        <span className="text-[11px] opacity-80 shrink-0">
                          {categoryCounts[cat.id]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter Section (Tenge) */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Цена, ₸
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium">От:</label>
                    <input
                      type="number"
                      min={0}
                      max={filters.maxPrice}
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minPrice: Number(e.target.value) || 0,
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium">До:</label>
                    <input
                      type="number"
                      min={filters.minPrice}
                      max={120000}
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          maxPrice: Number(e.target.value) || 80000,
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={80000}
                  step={1000}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>0 ₸</span>
                  <span>{filters.maxPrice.toLocaleString('ru-RU')} ₸</span>
                </div>
              </div>

              {/* In Stock Only Checkbox */}
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 hover:text-slate-900 select-none">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                    }
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Только товары в наличии</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {/* Mobile Category Horizontal Slider */}
            <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none -mx-4 px-4">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs shrink-0 ${
                  filters.category === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>Все</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filters.category === 'all' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {categoryCounts.all}
                </span>
              </button>
              {CATEGORIES.map((cat) => {
                const isActive = filters.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {getCategoryIcon(cat.id)}
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {categoryCounts[cat.id]}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Товары не найдены</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                  По выбранным параметрам ничего не найдено. Попробуйте сбросить фильтры или изменить поисковый запрос.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                >
                  Сбросить все фильтры
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-sm bg-white border-l border-slate-200 text-slate-900 flex flex-col h-full animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Фильтры каталога
                </h3>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              {/* Category selector */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Категория
                </span>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setFilters((p) => ({ ...p, category: 'all' }))}
                    className={`w-full flex justify-between p-2.5 rounded-xl text-xs font-semibold ${
                      filters.category === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>Все товары</span>
                    <span>{categoryCounts.all}</span>
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilters((p) => ({ ...p, category: cat.id }))}
                      className={`w-full flex justify-between p-2.5 rounded-xl text-xs ${
                        filters.category === cat.id
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(cat.id)}
                        <span>{cat.name}</span>
                      </div>
                      <span>{categoryCounts[cat.id]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Максимальная цена
                </span>
                <input
                  type="range"
                  min={0}
                  max={80000}
                  step={1000}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                  }
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-600 font-semibold">
                  <span>До:</span>
                  <span className="font-bold text-slate-900">
                    {filters.maxPrice.toLocaleString('ru-RU')} ₸
                  </span>
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Только товары в наличии</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Сбросить
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Показать ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
