export type ProductCategory = 'smartphones' | 'audio' | 'computers' | 'chargers';

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  description: string;
  iconName: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  oldPrice?: number;
  description: string;
  stock: number;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  features?: string[];
  specs?: Record<string, string>;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Новый' | 'В обработке' | 'Завершён' | 'Отменён';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCity?: string;
  customerAddress?: string;
  comment?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin';
  token: string;
}

export interface FilterState {
  category: ProductCategory | 'all';
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'name';
}
