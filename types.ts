export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export enum InventoryCategory {
  BASE = 'BASE',
  SAUCE = 'SAUCE',
  CHEESE = 'CHEESE',
  VEGGIE = 'VEGGIE',
  MEAT = 'MEAT',
}

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  threshold: number;
  price: number;
}

export interface CustomPizza {
  base: string;
  sauce: string;
  cheese: string;
  veggies: string[];
  name?: string;
  description?: string;
}

export type MenuCategory = 
  | 'ITALIAN' 
  | 'ITALIAN_REGIONAL' 
  | 'AMERICAN' 
  | 'GOURMET' 
  | 'MEAT' 
  | 'VEGGIE' 
  | 'SEAFOOD' 
  | 'INTERNATIONAL' 
  | 'FORMATS' 
  | 'DESSERTS' 
  | 'FUSION' 
  | 'SEASONAL'
  | 'SIDES';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  isVeg: boolean;
  rating: number;
  calories?: number;
}

export interface CartItem {
  cartId: string;
  type: 'MENU' | 'CUSTOM';
  menuItem?: MenuItem;
  customPizza?: CustomPizza;
  quantity: number;
  unitPrice: number;
}

export enum OrderStatus {
  RECEIVED = 'Order Received',
  KITCHEN = 'In the Kitchen',
  DELIVERY = 'Sent to Delivery',
  DELIVERED = 'Delivered',
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: number;
  deliveryLocation?: { lat: number; lng: number };
  deliveryStartedAt?: number;
}

export type ViewState = 'LOGIN' | 'MENU' | 'BUILDER' | 'CART' | 'ADMIN_INVENTORY' | 'ADMIN_ORDERS' | 'ORDER_TRACKING';