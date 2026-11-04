import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../data/initialProducts';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, cart } = useStore();
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const categoryInfo = CATEGORIES.find((c) => c.id === selectedProduct.category);
  const cartItem = cart.find((i) => i.product.id === selectedProduct.id);
  const isOutOfStock = selectedProduct.stock <= 0;

  const handleAdd = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden text-slate-900 max-sm:max-h-[92vh] max-sm:flex max-sm:flex-col sm:my-8 animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-300">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mobile drag handle */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

        <div className="grid grid-cols-1 md:grid-cols-2 max-sm:overflow-y-auto flex-1">
          {/* Left Column: Image */}
          <div className="relative bg-slate-50 p-6 flex items-center justify-center min-h-[320px] md:min-h-[480px]">
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="max-h-[380px] w-full object-contain drop-shadow-md rounded-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {selectedProduct.stock > 0 && selectedProduct.stock <= 5 && (
              <div className="absolute bottom-4 left-4 bg-amber-100 border border-amber-300 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
                Заканчивается! Осталось {selectedProduct.stock} шт.
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  {categoryInfo?.name || selectedProduct.category}
                </span>

                <div className="flex items-center gap-1.5 text-amber-500 text-xs">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-slate-800">{selectedProduct.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({selectedProduct.reviewsCount} отзывов)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 leading-snug">
                {selectedProduct.name}
              </h2>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {selectedProduct.price.toLocaleString('ru-RU')} ₸
                </span>
                {selectedProduct.oldPrice && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      {selectedProduct.oldPrice.toLocaleString('ru-RU')} ₸
                    </span>
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Скидка {(selectedProduct.oldPrice - selectedProduct.price).toLocaleString('ru-RU')} ₸
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Описание товара
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Features List */}
              {selectedProduct.features && selectedProduct.features.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Особенности
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedProduct.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specs Table */}
              {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Характеристики
                  </h4>
                  <div className="divide-y divide-slate-100 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    {Object.entries(selectedProduct.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between px-3.5 py-2.5">
                        <span className="text-slate-500">{key}</span>
                        <span className="text-slate-800 font-semibold text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-[11px] text-slate-600 mb-6">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">Гарантия 1 год</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">Быстрая доставка</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold">14 дней обмен</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Sticky on Mobile */}
            <div className="pt-3 sticky bottom-0 bg-white/95 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-slate-100 sm:border-0 sm:static sm:bg-transparent -mx-6 px-6 sm:mx-0 sm:px-0 z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(selectedProduct.stock, q + 1))}
                    disabled={quantity >= selectedProduct.stock || isOutOfStock}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-200 shadow-md ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-[0.98]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isOutOfStock
                      ? 'Нет в наличии'
                      : `В корзину • ${(selectedProduct.price * quantity).toLocaleString('ru-RU')} ₸`}
                  </span>
                </button>
              </div>

              {cartItem && (
                <p className="text-center text-xs text-emerald-600 mt-2 font-medium">
                  ✓ Этот товар уже в корзине ({cartItem.quantity} шт.)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
