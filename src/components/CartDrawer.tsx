import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotalCount,
    cartTotalPrice,
    setIsCheckoutOpen,
  } = useStore();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const isFreeDelivery = cartTotalPrice >= 15000;
  const deliveryCost = isFreeDelivery ? 0 : 1500;
  const finalTotal = cartTotalPrice + deliveryCost;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 text-slate-900 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">Корзина</h2>
              {cartTotalCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                  {cartTotalCount}
                </span>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery notification */}
          {cart.length > 0 && (
            <div className={`px-5 py-2.5 text-xs font-semibold flex items-center gap-2 border-b ${
              isFreeDelivery
                ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                : 'bg-blue-50 text-blue-800 border-blue-100'
            }`}>
              <Truck className="w-4 h-4 shrink-0" />
              <span>
                {isFreeDelivery
                  ? 'Вам доступна бесплатная доставка по Казахстану!'
                  : `До бесплатной доставки добавьте еще ${(15000 - cartTotalPrice).toLocaleString('ru-RU')} ₸`}
              </span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Ваша корзина пуста</h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Выберите современные аксессуары для смартфонов, аудио или ПК в каталоге.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                >
                  Перейти к покупкам
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                  <span>Товары ({cartTotalCount})</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-600 hover:text-rose-700 font-medium transition-colors"
                  >
                    Очистить всё
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-18 h-18 rounded-xl object-cover bg-white shrink-0 border border-slate-200"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                            title="Удалить"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-black text-slate-900 mt-1">
                          {item.product.price.toLocaleString('ru-RU')} ₸
                        </p>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white p-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-black text-blue-600">
                          {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₸
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-white space-y-3">
              {/* Price Calculation */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Стоимость товаров</span>
                  <span className="font-semibold text-slate-800">{cartTotalPrice.toLocaleString('ru-RU')} ₸</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка</span>
                  {isFreeDelivery ? (
                    <span className="text-emerald-600 font-bold">Бесплатно</span>
                  ) : (
                    <span className="font-semibold text-slate-800">{deliveryCost.toLocaleString('ru-RU')} ₸</span>
                  )}
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
                  <span>Итого к оплате</span>
                  <span className="text-lg text-blue-600">
                    {finalTotal.toLocaleString('ru-RU')} ₸
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/25 active:scale-[0.98] transition-all duration-150"
              >
                <span>Перейти к оформлению</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
