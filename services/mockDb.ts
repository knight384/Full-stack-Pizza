import { INITIAL_INVENTORY } from "../constants";
import { InventoryItem, Order, OrderStatus, User, UserRole, CartItem } from "../types";

// Keys for LocalStorage
const STORAGE_KEYS = {
  USERS: 'slice_users',
  INVENTORY: 'slice_inventory',
  ORDERS: 'slice_orders',
  CURRENT_USER: 'slice_current_user'
};

// Mock Shop Location (Central Park, NY for demo purposes)
const SHOP_LOCATION = { lat: 40.785091, lng: -73.968285 };

// Initialize DB if empty
export const initializeDb = () => {
  if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const admin: User = { id: 'admin1', name: 'Admin User', email: 'admin@slice.com', role: UserRole.ADMIN, phone: '1234567890' };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([admin]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
};

// Inventory Logic
export const getInventory = (): InventoryItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
  return data ? JSON.parse(data) : INITIAL_INVENTORY;
};

export const updateInventory = (newInventory: InventoryItem[]) => {
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(newInventory));
  // Check low stock
  checkLowStock(newInventory);
};

// Returns a list of alerts if any
const checkLowStock = (inventory: InventoryItem[]): string[] => {
  const alerts: string[] = [];
  inventory.forEach(item => {
    if (item.quantity < item.threshold) {
      const msg = `ALERT: Low Stock for ${item.name}. Remaining: ${item.quantity}`;
      console.warn(msg); // Simulating email to admin
      alerts.push(msg);
    }
  });
  return alerts;
};

// Order Logic
export const placeOrder = (order: Order): { success: boolean; alerts: string[] } => {
  const inventory = getInventory();
  let possible = true;
  const alerts: string[] = [];

  // Deduct Inventory - Only strictly for Custom Pizzas as they use specific ingredients
  // For standard menu items, we are not tracking specific ingredient usage in this mock to keep it simple,
  // but in a real app, you'd map MenuItem -> Ingredients.
  const newInventory = inventory.map(invItem => {
    let quantityToDeduct = 0;
    
    order.items.forEach((cartItem: CartItem) => {
        if (cartItem.type === 'CUSTOM' && cartItem.customPizza) {
            const pizza = cartItem.customPizza;
            // Multiply deduction by quantity ordered
            const qty = cartItem.quantity;
            if (invItem.name === pizza.base) quantityToDeduct += qty;
            if (invItem.name === pizza.sauce) quantityToDeduct += qty;
            if (invItem.name === pizza.cheese) quantityToDeduct += qty;
            if (pizza.veggies.includes(invItem.name)) quantityToDeduct += qty;
        }
    });

    if (invItem.quantity < quantityToDeduct) {
      possible = false;
    }
    return { ...invItem, quantity: invItem.quantity - quantityToDeduct };
  });

  if (!possible) {
    return { success: false, alerts: ["Insufficient stock for custom ingredients."] };
  }

  // Commit Inventory
  updateInventory(newInventory);
  const stockAlerts = checkLowStock(newInventory);
  
  // Assign a random location nearby (within ~0.02 degrees)
  const deliveryLocation = {
    lat: SHOP_LOCATION.lat + (Math.random() - 0.5) * 0.04,
    lng: SHOP_LOCATION.lng + (Math.random() - 0.5) * 0.04
  };

  // Save Order
  const orders = getOrders();
  orders.push({ ...order, deliveryLocation });
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

  return { success: true, alerts: stockAlerts };
};

export const getOrders = (): Order[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

export const updateOrderStatus = (orderId: string, status: OrderStatus) => {
  const orders = getOrders();
  const updated = orders.map(o => {
    if (o.id === orderId) {
      const updates: Partial<Order> = { status };
      // If moving to delivery, record the timestamp to start map simulation
      if (status === OrderStatus.DELIVERY && !o.deliveryStartedAt) {
        updates.deliveryStartedAt = Date.now();
      }
      return { ...o, ...updates };
    }
    return o;
  });
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
};

// Auth Logic
export const registerUser = (name: string, email: string, phone: string, password: string): User => {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    // Check exists
    if (users.find(u => u.email === email)) {
        throw new Error("User already exists");
    }
    const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        role: UserRole.CUSTOMER
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
};

export const loginUser = (email: string): User | null => {
  const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const user = users.find(u => u.email === email);
  if (user) return user;
  
  // Mock login for demo if not found in specific list but valid email format and starts with admin
  if (email.startsWith('admin')) {
      const newUser: User = {
          id: Date.now().toString(),
          name: 'Admin User',
          email,
          role: UserRole.ADMIN
      }
      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return newUser;
  }
  return null;
};

export const getShopLocation = () => SHOP_LOCATION;