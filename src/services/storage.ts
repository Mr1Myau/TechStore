import { Product, Order, CartItem, AdminUser, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const STORAGE_KEYS = {
  PRODUCTS: 'techstore_products_kz_v2',
  ORDERS: 'techstore_orders_kz_v2',
  CART: 'techstore_cart_kz_v2',
  ADMIN_SESSION: 'techstore_admin_session_kz_v2',
};

// Initial orders to populate the admin panel
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'TS-KZ-1042',
    customerName: 'Азамат Серікбаев',
    customerPhone: '+7 (777) 234-56-78',
    customerEmail: 'azamat.serik@example.kz',
    customerCity: 'Алматы',
    customerAddress: 'пр. Достык, д. 42, кв. 15',
    comment: 'Позвонить перед доставкой за час.',
    items: [
      {
        productId: 'prod-au-01',
        productName: 'Беспроводные TWS наушники SoundPulse ANC Pro с пространственным звуком',
        price: 34990,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      },
      {
        productId: 'prod-ch-01',
        productName: 'Сетевое GaN-зарядное устройство 100W UltraFast',
        price: 21990,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      },
    ],
    totalAmount: 56980,
    status: 'В обработке',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'ord-1002',
    orderNumber: 'TS-KZ-1043',
    customerName: 'Аружан Касымова',
    customerPhone: '+7 (701) 789-01-23',
    customerEmail: 'aruzhan.k@example.kz',
    customerCity: 'Астана',
    customerAddress: 'ул. Достык, д. 18, БЦ Москва',
    comment: 'Доставка в офис в рабочее время с 10:00 до 18:00.',
    items: [
      {
        productId: 'prod-cp-01',
        productName: 'Механическая беспроводная клавиатура MechCraft 75% Hot-Swap RGB',
        price: 42990,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      },
      {
        productId: 'prod-cp-02',
        productName: 'Эргономичная беспроводная мышь ErgoMaster Silent',
        price: 23990,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
      },
      {
        productId: 'prod-cp-05',
        productName: 'Большой коврик для мыши и клавиатуры DeskMat 900x400 мм',
        price: 7490,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
      },
    ],
    totalAmount: 74470,
    status: 'Новый',
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
  },
  {
    id: 'ord-1003',
    orderNumber: 'TS-KZ-1040',
    customerName: 'Данияр Ибраев',
    customerPhone: '+7 (705) 456-78-90',
    customerCity: 'Шымкент',
    customerAddress: 'пр. Тауке хана, д. 24, кв. 10',
    items: [
      {
        productId: 'prod-sp-01',
        productName: 'Магнитный чехол MagSafe Matte Armor для iPhone 16 Pro',
        price: 9990,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
      },
      {
        productId: 'prod-sp-02',
        productName: 'Ультрапрочное защитное стекло 9D Crystal Shield',
        price: 4990,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80',
      },
    ],
    totalAmount: 14980,
    status: 'Завершён',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const storage = {
  // PRODUCTS
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  },

  resetProducts(): Product[] {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  // ORDERS
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order {
    const orders = this.getOrders();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `TS-KZ-${randomSuffix}`,
      status: 'Новый',
      createdAt: new Date().toISOString(),
    };
    const updated = [newOrder, ...orders];
    this.saveOrders(updated);

    // Deduct stock for ordered products
    const products = this.getProducts();
    const updatedProducts = products.map((prod) => {
      const itemInOrder = orderData.items.find((item) => item.productId === prod.id);
      if (itemInOrder) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - itemInOrder.quantity),
        };
      }
      return prod;
    });
    this.saveProducts(updatedProducts);

    return newOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatus): Order[] {
    const orders = this.getOrders();
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
    );
    this.saveOrders(updated);
    return updated;
  },

  deleteOrder(orderId: string): Order[] {
    const orders = this.getOrders();
    const updated = orders.filter((o) => o.id !== orderId);
    this.saveOrders(updated);
    return updated;
  },

  // CART
  getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCart(items: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  },

  clearCart(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CART);
    } catch (e) {
      console.error('Failed to clear cart', e);
    }
  },

  // ADMIN SESSION
  getAdminSession(): AdminUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setAdminSession(user: AdminUser | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      }
    } catch (e) {
      console.error('Failed to update admin session', e);
    }
  },
};
