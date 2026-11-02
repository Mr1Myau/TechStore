import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Star, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct, cart } = useStore();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const isInCart = !!cartItem;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <div className="group bg-white border border-slate-200 hover:border-blue-500 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
      {/* Image container */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative aspect-square w-full overflow-hidden bg-slate-50 cursor-pointer select-none"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {discountPercent && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-600 text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-600 text-white shadow-xs">
              NEW
            </span>
          )}
          {product.isPopular && !product.isNew && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-400 text-slate-900 shadow-xs">
              ХИТ
            </span>
          )}
        </div>

        {/* Quick View Button on hover */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl shadow-lg pointer-events-auto hover:bg-blue-600 hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Быстрый просмотр</span>
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Stock bar */}
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-slate-800">{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 text-[11px]">({product.reviewsCount})</span>
            </div>

            <div>
              {isOutOfStock ? (
                <span className="text-[11px] font-semibold text-rose-600">Нет в наличии</span>
              ) : isLowStock ? (
                <span className="text-[11px] font-semibold text-amber-600">Осталось: {product.stock} шт.</span>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-600">В наличии: {product.stock} шт.</span>
              )}
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-snug mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short description preview */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Price and Add to Cart action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-slate-900">
                {product.price.toLocaleString('ru-RU')} ₸
              </span>
              {product.oldPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {product.oldPrice.toLocaleString('ru-RU')} ₸
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 shrink-0 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isInCart
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-95'
            }`}
            title={isOutOfStock ? 'Товар закончился' : isInCart ? `В корзине (${cartItem.quantity} шт.). Добавить еще?` : 'Добавить в корзину'}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>+1 ({cartItem.quantity})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>В корзину</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
