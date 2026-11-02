import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, ProductCategory } from '../types';
import { CATEGORIES } from '../data/initialProducts';
import {
  ShieldCheck,
  LogOut,
  Package,
  ShoppingBag,
  Clock,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
  RotateCcw,
  X,
  ChevronRight,
  Eye,
  DollarSign,
} from 'lucide-react';

interface AdminDashboardViewProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const { adminUser, isAuthenticated, logout } = useAuth();
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    resetAllProductsToDefault,
    updateOrderStatus,
    deleteOrder,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

  // Product modal states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'smartphones' as ProductCategory,
    price: 9990,
    oldPrice: 0,
    stock: 15,
    imageUrl: '',
    description: '',
  });

  // Order detail modal state
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Search & Filter states inside Admin
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Protection: If not authenticated, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('/admin/login');
    }
  }, [isAuthenticated, onNavigate]);

  // Statistics Calculations
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const newOrders = orders.filter((o) => o.status === 'Новый').length;
    const processingOrders = orders.filter((o) => o.status === 'В обработке').length;
    const completedOrders = orders.filter((o) => o.status === 'Завершён').length;
    const totalRevenue = orders
      .filter((o) => o.status !== 'Отменён')
      .reduce((acc, o) => acc + o.totalAmount, 0);
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const outOfStockCount = products.filter((p) => p.stock <= 0).length;

    return {
      totalProducts,
      totalOrders,
      newOrders,
      processingOrders,
      completedOrders,
      totalRevenue,
      lowStockCount,
      outOfStockCount,
    };
  }, [products, orders]);

  // Filtered Products for Admin
  const filteredAdminProducts = useMemo(() => {
    return products.filter((p) => {
      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) {
        return false;
      }
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Filtered Orders for Admin
  const filteredAdminOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter]);

  // Handle open Product Create/Edit
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'smartphones',
      price: 14990,
      oldPrice: 0,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      description: '',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      oldPrice: prod.oldPrice || 0,
      stock: prod.stock,
      imageUrl: prod.imageUrl,
      description: prod.description,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.description.trim()) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: productForm.name.trim(),
        category: productForm.category,
        price: Number(productForm.price),
        oldPrice: productForm.oldPrice > 0 ? Number(productForm.oldPrice) : undefined,
        stock: Number(productForm.stock),
        imageUrl: productForm.imageUrl.trim(),
        description: productForm.description.trim(),
      });
    } else {
      addProduct({
        name: productForm.name.trim(),
        category: productForm.category,
        price: Number(productForm.price),
        oldPrice: productForm.oldPrice > 0 ? Number(productForm.oldPrice) : undefined,
        stock: Number(productForm.stock),
        imageUrl:
          productForm.imageUrl.trim() ||
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
        description: productForm.description.trim(),
        rating: 5.0,
        reviewsCount: 1,
        isNew: true,
      });
    }
    setIsProductModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('/admin/login');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Новый':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            Новый
          </span>
        );
      case 'В обработке':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            В обработке
          </span>
        );
      case 'Завершён':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            Завершён
          </span>
        );
      case 'Отменён':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            Отменён
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Admin Navigation Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black text-slate-900">Панель управления TechStore</h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                    Admin
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Авторизован: {adminUser?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onNavigate('/')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>В магазин</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors"
                title="Выйти из сессии"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 border-t border-slate-100 pt-1 pb-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Обзор и статистика</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Управление товарами</span>
              <span className="px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700 text-[11px] font-mono">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Заказы клиентов</span>
              {stats.newOrders > 0 && (
                <span className="px-1.5 py-0.2 rounded-md bg-blue-600 text-white text-[11px] font-black">
                  +{stats.newOrders}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Stat 1: Total Products */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Всего товаров
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalProducts}</div>
                  <p className="text-xs text-slate-500 mt-1">В 4 категориях каталога</p>
                </div>
              </div>

              {/* Stat 2: Total Orders */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Всего заказов
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalOrders}</div>
                  <p className="text-xs text-slate-500 mt-1">Клиентских заявок</p>
                </div>
              </div>

              {/* Stat 3: New Orders */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Новых заказов
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-600">{stats.newOrders}</div>
                  <p className="text-xs text-slate-500 mt-1">Ожидают подтверждения</p>
                </div>
              </div>

              {/* Stat 4: Revenue */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Общая сумма заказов
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600">
                    {stats.totalRevenue.toLocaleString('ru-RU')} ₸
                  </div>
                  <p className="text-xs text-slate-500 mt-1">По активным заказам</p>
                </div>
              </div>
            </div>

            {/* Sub-block: Warehouse alert + Category distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category distribution */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Распределение товаров по категориям
                  </h3>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Перейти к товарам</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {CATEGORIES.map((cat) => {
                    const count = products.filter((p) => p.category === cat.id).length;
                    const percent = Math.round((count / (products.length || 1)) * 100);
                    return (
                      <div key={cat.id} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-800">{cat.name}</span>
                          <span className="text-slate-500 font-mono">
                            {count} товаров ({percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Warehouse alerts & Controls */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                    Состояние склада
                  </h3>
                  <div className="space-y-3 text-xs font-medium">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-150">
                      <span className="text-slate-600">Мало на складе (≤ 5 шт.):</span>
                      <span className="font-bold text-amber-600">{stats.lowStockCount} тов.</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-150">
                      <span className="text-slate-600">Закончились (0 шт.):</span>
                      <span className="font-bold text-rose-600">{stats.outOfStockCount} тов.</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={handleOpenCreateProduct}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добавить новый товар</span>
                  </button>

                  <button
                    onClick={resetAllProductsToDefault}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    title="Сбросить все товары к исходным 30 товарам"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Сбросить каталог к 30 товарам</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Orders table preview */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Последние заказы
                  </h3>
                  <p className="text-xs text-slate-500">Свежие заявки клиентов</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Все заказы ({orders.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400">Заказов пока нет</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500">
                        <th className="pb-3 font-semibold">Номер</th>
                        <th className="pb-3 font-semibold">Клиент</th>
                        <th className="pb-3 font-semibold">Телефон</th>
                        <th className="pb-3 font-semibold">Сумма</th>
                        <th className="pb-3 font-semibold">Статус</th>
                        <th className="pb-3 font-semibold text-right">Действие</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-mono font-bold text-blue-600">
                            {order.orderNumber}
                          </td>
                          <td className="py-3 text-slate-900 font-semibold">{order.customerName}</td>
                          <td className="py-3 text-slate-600">{order.customerPhone}</td>
                          <td className="py-3 font-black text-slate-900">
                            {order.totalAmount.toLocaleString('ru-RU')} ₸
                          </td>
                          <td className="py-3">{getStatusBadge(order.status)}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setViewingOrder(order)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                            >
                              Подробнее
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: PRODUCTS MANAGEMENT ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Search */}
                <div className="relative min-w-[240px]">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Поиск по названию или описанию..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Category select */}
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-semibold"
                >
                  <option value="all">Все категории ({products.length})</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={resetAllProductsToDefault}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Восстановить 30 стандартных товаров"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Сброс к 30</span>
                </button>

                <button
                  onClick={handleOpenCreateProduct}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить товар</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                      <th className="p-4 font-semibold">Товар</th>
                      <th className="p-4 font-semibold">Категория</th>
                      <th className="p-4 font-semibold">Цена</th>
                      <th className="p-4 font-semibold">Склад</th>
                      <th className="p-4 font-semibold">Рейтинг</th>
                      <th className="p-4 font-semibold text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAdminProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          Товары не найдены
                        </td>
                      </tr>
                    ) : (
                      filteredAdminProducts.map((product) => {
                        const isOutOfStock = product.stock <= 0;
                        const isLowStock = product.stock > 0 && product.stock <= 5;
                        const cat = CATEGORIES.find((c) => c.id === product.category);

                        return (
                          <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                            {/* Product preview */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.imageUrl}
                                  alt=""
                                  className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                                />
                                <div className="max-w-md">
                                  <h4 className="font-bold text-slate-900 line-clamp-1">
                                    {product.name}
                                  </h4>
                                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                    {product.description}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="p-4 text-slate-700 font-medium">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold">
                                {cat?.name || product.category}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="p-4">
                              <div className="font-black text-slate-900 text-sm">
                                {product.price.toLocaleString('ru-RU')} ₸
                              </div>
                              {product.oldPrice && (
                                <div className="text-[10px] text-slate-400 line-through">
                                  {product.oldPrice.toLocaleString('ru-RU')} ₸
                                </div>
                              )}
                            </td>

                            {/* Stock */}
                            <td className="p-4">
                              {isOutOfStock ? (
                                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[11px] font-bold">
                                  0 шт. (нет)
                                </span>
                              ) : isLowStock ? (
                                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[11px] font-bold">
                                  {product.stock} шт. (мало)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                                  {product.stock} шт.
                                </span>
                              )}
                            </td>

                            {/* Rating */}
                            <td className="p-4 text-slate-700 font-medium">
                              ★ {product.rating.toFixed(1)} ({product.reviewsCount})
                            </td>

                            {/* Actions */}
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditProduct(product)}
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors"
                                  title="Редактировать товар"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Удалить товар «${product.name}» из каталога?`)) {
                                      deleteProduct(product.id);
                                    }
                                  }}
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 transition-colors"
                                  title="Удалить товар"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter orders */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Фильтр по статусу:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'Новый', 'В обработке', 'Завершён', 'Отменён'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        orderStatusFilter === st
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st === 'all' ? `Все (${orders.length})` : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                      <th className="p-4 font-semibold">Номер заказа</th>
                      <th className="p-4 font-semibold">Дата</th>
                      <th className="p-4 font-semibold">Покупатель</th>
                      <th className="p-4 font-semibold">Товары</th>
                      <th className="p-4 font-semibold">Сумма</th>
                      <th className="p-4 font-semibold">Статус</th>
                      <th className="p-4 font-semibold text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAdminOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          Заказы не найдены
                        </td>
                      </tr>
                    ) : (
                      filteredAdminOrders.map((order) => {
                        const dateFormatted = new Date(order.createdAt).toLocaleString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                            {/* Order Number */}
                            <td className="p-4 font-mono font-bold text-blue-600 text-sm">
                              {order.orderNumber}
                            </td>

                            {/* Date */}
                            <td className="p-4 text-slate-500 text-[11px] whitespace-nowrap">
                              {dateFormatted}
                            </td>

                            {/* Customer */}
                            <td className="p-4">
                              <div className="font-bold text-slate-900">{order.customerName}</div>
                              <div className="text-[11px] text-slate-500">{order.customerPhone}</div>
                              {order.customerCity && (
                                <div className="text-[10px] text-slate-400">{order.customerCity}</div>
                              )}
                            </td>

                            {/* Items count */}
                            <td className="p-4 text-slate-700 font-medium">
                              {order.items.length} наим. ({order.items.reduce((s, i) => s + i.quantity, 0)} шт.)
                            </td>

                            {/* Total Amount */}
                            <td className="p-4 font-black text-slate-900 text-sm">
                              {order.totalAmount.toLocaleString('ru-RU')} ₸
                            </td>

                            {/* Status Changer */}
                            <td className="p-4">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateOrderStatus(order.id, e.target.value as OrderStatus)
                                }
                                className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:border-blue-500"
                              >
                                <option value="Новый">Новый</option>
                                <option value="В обработке">В обработке</option>
                                <option value="Завершён">Завершён</option>
                                <option value="Отменён">Отменён</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setViewingOrder(order)}
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                  title="Посмотреть подробности заказа"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Удалить заказ ${order.orderNumber}?`)) {
                                      deleteOrder(order.id);
                                    }
                                  }}
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 transition-colors"
                                  title="Удалить заказ"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">
                {editingProduct ? 'Редактирование товара' : 'Добавление нового товара'}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Название товара *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Например, Беспроводные наушники Studio ANC..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Категория *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Количество на складе *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Цена (₸) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Старая цена (для скидки, ₸)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.oldPrice}
                    onChange={(e) =>
                      setProductForm({ ...productForm, oldPrice: Number(e.target.value) })
                    }
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ссылка на изображение (URL)
                </label>
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Подробное описание товара *
                </label>
                <textarea
                  rows={4}
                  required
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  placeholder="Опишите особенности, материалы и преимущества аксессуара..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/20"
                >
                  {editingProduct ? 'Сохранить изменения' : 'Создать товар'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ORDER DETAILS ================= */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Карточка заказа
                </span>
                <h2 className="text-xl font-mono font-bold text-blue-600">
                  {viewingOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 block mb-0.5">Получатель:</span>
                  <span className="font-bold text-slate-900 text-sm">{viewingOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Телефон:</span>
                  <span className="font-bold text-blue-600 text-sm">
                    {viewingOrder.customerPhone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Город и адрес:</span>
                  <span className="text-slate-800 font-medium">
                    {viewingOrder.customerCity || 'Не указан'}, {viewingOrder.customerAddress}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Дата создания:</span>
                  <span className="text-slate-800 font-mono">
                    {new Date(viewingOrder.createdAt).toLocaleString('ru-RU')}
                  </span>
                </div>
                {viewingOrder.comment && (
                  <div className="col-span-2 pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block mb-0.5">Комментарий покупателя:</span>
                    <span className="text-slate-800 font-medium">{viewingOrder.comment}</span>
                  </div>
                )}
              </div>

              {/* Status Changer */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700">Текущий статус заказа:</span>
                <select
                  value={viewingOrder.status}
                  onChange={(e) => {
                    const nextStatus = e.target.value as OrderStatus;
                    updateOrderStatus(viewingOrder.id, nextStatus);
                    setViewingOrder({ ...viewingOrder, status: nextStatus });
                  }}
                  className="bg-white border border-slate-300 rounded-xl py-1.5 px-3 text-xs font-bold text-slate-900 cursor-pointer"
                >
                  <option value="Новый">Новый</option>
                  <option value="В обработке">В обработке</option>
                  <option value="Завершён">Завершён</option>
                  <option value="Отменён">Отменён</option>
                </select>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Заказанные товары ({viewingOrder.items.length})
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {viewingOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-white shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item.productName}</p>
                        <p className="text-[11px] text-slate-500">
                          {item.price.toLocaleString('ru-RU')} ₸ × {item.quantity} шт.
                        </p>
                      </div>
                      <div className="font-black text-slate-900 text-right">
                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₸
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-black text-slate-900">
                <span>Итоговая сумма заказа:</span>
                <span className="text-xl text-blue-600">
                  {viewingOrder.totalAmount.toLocaleString('ru-RU')} ₸
                </span>
              </div>

              {/* Close */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setViewingOrder(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
