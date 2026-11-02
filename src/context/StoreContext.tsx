import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, CartItem, FilterState, OrderStatus, ProductCategory } from '../types';
import { storage } from '../services/storage';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  filters: FilterState;
  selectedProduct: Product | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  completedOrder: Order | null;
  toast: { message: string; type?: 'success' | 'info' | 'error' } | null;

  // Actions
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  setSelectedProduct: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setCompletedOrder: (order: Order | null) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Cart operations
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartTotalPrice: number;

  // Order operations
  checkout: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerCity?: string;
    customerAddress?: string;
    comment?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Product Admin operations
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  resetAllProductsToDefault: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  searchQuery: '',
  minPrice: 0,
  maxPrice: 80000,
  inStockOnly: false,
  sortBy: 'popular',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => storage.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => storage.getOrders());
  const [cart, setCart] = useState<CartItem[]>(() => storage.getCart());
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    storage.saveCart(cart);
  }, [cart]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // CART
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast('Товара нет в наличии', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });

    showToast(`«${product.name.slice(0, 30)}...» добавлен в корзину`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.min(item.product.stock, quantity);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Товар удален из корзины', 'info');
  };

  const clearCart = () => {
    setCart([]);
    storage.clearCart();
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // CHECKOUT
  const checkout = async (customerData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerCity?: string;
    customerAddress?: string;
    comment?: string;
  }) => {
    const items = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl,
    }));

    const newOrder = storage.createOrder({
      customerName: customerData.customerName,
      customerPhone: customerData.customerPhone,
      customerEmail: customerData.customerEmail,
      customerCity: customerData.customerCity,
      customerAddress: customerData.customerAddress,
      comment: customerData.comment,
      items,
      totalAmount: cartTotalPrice,
    });

    // Refresh state
    setOrders(storage.getOrders());
    setProducts(storage.getProducts());
    clearCart();
    setIsCheckoutOpen(false);
    setCompletedOrder(newOrder);

    showToast(`Заказ №${newOrder.orderNumber} успешно принят!`, 'success');
    return newOrder;
  };

  // ORDERS MANAGEMENT
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = storage.updateOrderStatus(orderId, status);
    setOrders(updated);
    showToast(`Статус заказа изменен на "${status}"`);
  };

  const deleteOrder = (orderId: string) => {
    const updated = storage.deleteOrder(orderId);
    setOrders(updated);
    showToast('Заказ удален', 'info');
  };

  // PRODUCT ADMIN MANAGEMENT
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-custom-${Date.now()}`,
    };
    const current = storage.getProducts();
    const updated = [newProduct, ...current];
    storage.saveProducts(updated);
    setProducts(updated);
    showToast('Товар успешно добавлен в каталог!');
    return newProduct;
  };

  const updateProduct = (product: Product) => {
    const current = storage.getProducts();
    const updated = current.map((p) => (p.id === product.id ? product : p));
    storage.saveProducts(updated);
    setProducts(updated);
    showToast('Товар успешно обновлен');
  };

  const deleteProduct = (productId: string) => {
    const current = storage.getProducts();
    const updated = current.filter((p) => p.id !== productId);
    storage.saveProducts(updated);
    setProducts(updated);
    showToast('Товар удален из каталога', 'info');
  };

  const resetAllProductsToDefault = () => {
    const reset = storage.resetProducts();
    setProducts(reset);
    showToast('Каталог сброшен к исходным 30 товарам', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        cart,
        filters,
        selectedProduct,
        isCartOpen,
        isCheckoutOpen,
        completedOrder,
        toast,
        setFilters,
        resetFilters,
        setSelectedProduct,
        setIsCartOpen,
        setIsCheckoutOpen,
        setCompletedOrder,
        showToast,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartTotalPrice,
        checkout,
        updateOrderStatus,
        deleteOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        resetAllProductsToDefault,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
