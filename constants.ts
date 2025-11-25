import { InventoryCategory, InventoryItem, MenuItem } from "./types";

export const INITIAL_INVENTORY: InventoryItem[] = [
  // Bases
  { id: 'b1', name: 'Thin Crust', category: InventoryCategory.BASE, quantity: 50, threshold: 20, price: 5 },
  { id: 'b2', name: 'Cheese Burst', category: InventoryCategory.BASE, quantity: 30, threshold: 10, price: 7 },
  { id: 'b3', name: 'Whole Wheat', category: InventoryCategory.BASE, quantity: 40, threshold: 15, price: 6 },
  { id: 'b4', name: 'Gluten Free', category: InventoryCategory.BASE, quantity: 15, threshold: 5, price: 8 },
  { id: 'b5', name: 'Pan Pizza', category: InventoryCategory.BASE, quantity: 50, threshold: 20, price: 5 },

  // Sauces
  { id: 's1', name: 'Classic Tomato', category: InventoryCategory.SAUCE, quantity: 100, threshold: 20, price: 1 },
  { id: 's2', name: 'Spicy Arrabbiata', category: InventoryCategory.SAUCE, quantity: 80, threshold: 15, price: 2 },
  { id: 's3', name: 'Pesto', category: InventoryCategory.SAUCE, quantity: 40, threshold: 10, price: 3 },
  { id: 's4', name: 'BBQ', category: InventoryCategory.SAUCE, quantity: 60, threshold: 15, price: 2 },
  { id: 's5', name: 'White Garlic', category: InventoryCategory.SAUCE, quantity: 50, threshold: 10, price: 2 },

  // Cheeses
  { id: 'c1', name: 'Mozzarella', category: InventoryCategory.CHEESE, quantity: 100, threshold: 20, price: 3 },
  { id: 'c2', name: 'Cheddar', category: InventoryCategory.CHEESE, quantity: 80, threshold: 15, price: 3 },
  { id: 'c3', name: 'Parmesan', category: InventoryCategory.CHEESE, quantity: 60, threshold: 10, price: 4 },
  { id: 'c4', name: 'Vegan Cheese', category: InventoryCategory.CHEESE, quantity: 20, threshold: 5, price: 5 },

  // Veggies
  { id: 'v1', name: 'Onion', category: InventoryCategory.VEGGIE, quantity: 200, threshold: 30, price: 1 },
  { id: 'v2', name: 'Tomato', category: InventoryCategory.VEGGIE, quantity: 150, threshold: 30, price: 1 },
  { id: 'v3', name: 'Capsicum', category: InventoryCategory.VEGGIE, quantity: 150, threshold: 30, price: 1 },
  { id: 'v4', name: 'Mushroom', category: InventoryCategory.VEGGIE, quantity: 100, threshold: 20, price: 2 },
  { id: 'v5', name: 'Olives', category: InventoryCategory.VEGGIE, quantity: 80, threshold: 15, price: 2 },
  { id: 'v6', name: 'Jalapeno', category: InventoryCategory.VEGGIE, quantity: 80, threshold: 15, price: 2 },
  { id: 'v7', name: 'Corn', category: InventoryCategory.VEGGIE, quantity: 120, threshold: 25, price: 1 },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Margherita',
    description: 'Classic delight with 100% real mozzarella cheese.',
    price: 109,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80',
    category: 'VEG',
    isVeg: true,
    rating: 4.5,
    calories: 250
  },
  {
    id: 'm2',
    name: 'Farmhouse',
    description: 'Delightful combination of onion, capsicum, tomato & grilled mushroom.',
    price: 259,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80',
    category: 'BESTSELLER',
    isVeg: true,
    rating: 4.8,
    calories: 320
  },
  {
    id: 'm3',
    name: 'Peppy Paneer',
    description: 'Flavorful trio of juicy paneer, crisp capsicum with spicy red paprika.',
    price: 269,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80',
    category: 'VEG',
    isVeg: true,
    rating: 4.7,
    calories: 340
  },
  {
    id: 'm4',
    name: 'Pepper Barbecue Chicken',
    description: 'Pepper barbecue chicken for that extra zing.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80',
    category: 'NON-VEG',
    isVeg: false,
    rating: 4.6,
    calories: 380
  },
  {
    id: 'm5',
    name: 'Chicken Sausage',
    description: 'Cheesy pizza with delicious chicken sausage.',
    price: 199,
    image: 'https://images.unsplash.com/photo-1593560708920-6316e4e61f32?auto=format&fit=crop&w=500&q=80',
    category: 'NON-VEG',
    isVeg: false,
    rating: 4.3,
    calories: 360
  },
  {
    id: 'm6',
    name: 'Garlic Breadsticks',
    description: 'Baked to perfection. Your perfect pizza partner!',
    price: 109,
    image: 'https://images.unsplash.com/photo-1573140247632-f84660f67126?auto=format&fit=crop&w=500&q=80',
    category: 'SIDES',
    isVeg: true,
    rating: 4.9,
    calories: 180
  },
  {
    id: 'm7',
    name: 'Choco Lava Cake',
    description: 'Chocolate lovers delight! Indulgent, gooey molten lava cake.',
    price: 119,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80',
    category: 'DESSERTS',
    isVeg: true,
    rating: 4.9,
    calories: 450
  },
  {
    id: 'm8',
    name: 'Veggie Paradise',
    description: 'Goldern Corn, Black Olives, Capsicum & Red Paprika.',
    price: 239,
    image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=500&q=80',
    category: 'BESTSELLER',
    isVeg: true,
    rating: 4.4,
    calories: 280
  }
];