import React, { useEffect, useState, useRef } from 'react';
import { 
  Pizza, 
  ChefHat, 
  ShoppingCart, 
  LayoutDashboard, 
  LogOut, 
  ClipboardList,
  AlertTriangle,
  Loader2,
  Sparkles,
  MapPin,
  Navigation,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  History,
  Search,
  Star,
  Plus,
  Minus,
  Trash2,
  X,
  Flame,
  User as UserIcon,
  Globe,
  Clock
} from 'lucide-react';
import { 
  CustomPizza, 
  InventoryCategory, 
  InventoryItem, 
  Order, 
  OrderStatus, 
  User, 
  UserRole, 
  ViewState,
  MenuItem,
  CartItem,
  MenuCategory
} from './types';
import { 
  getInventory, 
  getOrders, 
  initializeDb, 
  loginUser, 
  registerUser,
  placeOrder, 
  updateInventory, 
  updateOrderStatus,
  getShopLocation
} from './services/mockDb';
import { MENU_ITEMS } from './constants';
import { generatePizzaNameAndDescription, suggestPizzaConfig, suggestToppings } from './services/geminiService';

// Declare Leaflet global
declare const L: any;

// --- Components ---

const Navbar: React.FC<{ 
  user: User | null; 
  view: ViewState; 
  setView: (v: ViewState) => void; 
  cartCount: number;
  onLogout: () => void;
  onOpenCart: () => void;
}> = ({ user, view, setView, cartCount, onLogout, onOpenCart }) => (
  <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center cursor-pointer" onClick={() => setView(user ? (user.role === UserRole.ADMIN ? 'ADMIN_INVENTORY' : 'MENU') : 'LOGIN')}>
          <div className="bg-red-600 p-1.5 rounded-full mr-2">
            <Pizza className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Slice<span className="text-red-600">Genius</span></span>
        </div>
        
        {user && (
          <div className="flex items-center space-x-2 md:space-x-6">
            {user.role === UserRole.CUSTOMER ? (
              <>
                <div className="hidden md:flex space-x-4">
                    <button 
                    onClick={() => setView('MENU')}
                    className={`px-3 py-2 rounded-full text-sm font-bold transition ${view === 'MENU' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                    >
                    Menu
                    </button>
                    <button 
                    onClick={() => setView('BUILDER')}
                    className={`px-3 py-2 rounded-full text-sm font-bold transition ${view === 'BUILDER' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                    >
                    AI Builder
                    </button>
                    <button 
                    onClick={() => setView('ORDER_TRACKING')}
                    className={`px-3 py-2 rounded-full text-sm font-bold transition ${view === 'ORDER_TRACKING' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                    >
                    Orders
                    </button>
                </div>
                
                <button onClick={onOpenCart} className="relative p-2 text-gray-600 hover:text-red-600 transition">
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                            {cartCount}
                        </span>
                    )}
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                 <button 
                  onClick={() => setView('ADMIN_INVENTORY')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${view === 'ADMIN_INVENTORY' ? 'bg-orange-100 text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                >
                  Inventory
                </button>
                <button 
                  onClick={() => setView('ADMIN_ORDERS')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${view === 'ADMIN_ORDERS' ? 'bg-orange-100 text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                >
                  All Orders
                </button>
              </div>
            )}
            <div className="flex items-center ml-2 pl-4 border-l border-gray-200">
              <div className="mr-3 text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user.name}</p>
              </div>
              <button onClick={onLogout} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </nav>
);

const InventoryManager: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    setItems(getInventory());
  }, []);

  const handleRestock = (id: string, amount: number) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + amount } : item
    );
    setItems(newItems);
    updateInventory(newItems);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center"><ClipboardList className="mr-2" /> Inventory Management</h2>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price ($)</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => {
                const isOut = item.quantity === 0;
                const isLow = item.quantity < item.threshold;
                let rowClass = "hover:bg-gray-50 transition";
                if (isOut) rowClass = "bg-red-50 hover:bg-red-100";
                else if (isLow) rowClass = "bg-orange-50 hover:bg-orange-100";

                return (
                  <tr key={item.id} className={rowClass}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-gray-900">
                        {item.quantity} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isOut ? (
                          <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-200 text-red-800 flex items-center w-fit">
                              <AlertTriangle className="w-3 h-3 mr-1" /> Out of Stock
                          </span>
                      ) : isLow ? (
                          <span className="px-2 py-1 text-xs font-bold rounded-full bg-orange-200 text-orange-800 flex items-center w-fit">
                              <AlertTriangle className="w-3 h-3 mr-1" /> Low Stock
                          </span>
                      ) : (
                          <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">In Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => handleRestock(item.id, 10)}
                                className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm text-xs hover:bg-gray-50 text-gray-700 font-bold flex items-center"
                            >
                                <Plus className="w-3 h-3 mr-1" /> 10
                            </button>
                            <button 
                                onClick={() => handleRestock(item.id, 50)}
                                className="px-3 py-1 bg-blue-50 border border-blue-200 rounded shadow-sm text-xs hover:bg-blue-100 text-blue-700 font-bold flex items-center"
                            >
                                <Plus className="w-3 h-3 mr-1" /> 50
                            </button>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const OrderManager: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
  
    useEffect(() => {
      const fetch = () => setOrders(getOrders().reverse());
      fetch();
      const interval = setInterval(fetch, 3000);
      return () => clearInterval(interval);
    }, []);
  
    const handleStatusUpdate = (id: string, newStatus: OrderStatus) => {
      updateOrderStatus(id, newStatus);
      setOrders(getOrders().reverse());
    };
  
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center"><ChefHat className="mr-2" /> All Orders</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Order #{order.id.slice(-4)}</h3>
                  <p className="text-sm text-gray-500">{order.customerName}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold 
                  ${order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4 border-t border-b border-gray-100 py-3">
                 <p className="text-sm font-medium text-gray-700">Items:</p>
                 <ul className="text-sm text-gray-600 list-disc pl-5">
                    {order.items.map((item, idx) => (
                        <li key={idx}>
                            {item.quantity}x {item.type === 'MENU' ? item.menuItem?.name : (item.customPizza?.name || "Custom")}
                        </li>
                    ))}
                 </ul>
                 <p className="text-right font-bold text-gray-900 mt-2">Total: ${order.totalAmount.toFixed(2)}</p>
              </div>
  
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {Object.values(OrderStatus).map((status) => (
                    <button
                      key={status}
                      disabled={order.status === status}
                      onClick={() => handleStatusUpdate(order.id, status)}
                      className={`px-2 py-1 text-xs rounded border 
                        ${order.status === status 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'border-orange-200 text-orange-600 hover:bg-orange-50'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-gray-500 col-span-3 text-center py-10">No active orders.</p>}
        </div>
      </div>
    );
};

const CartDrawer: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    items: CartItem[]; 
    onUpdateQty: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    onCheckout: () => void;
}> = ({ isOpen, onClose, items, onUpdateQty, onRemove, onCheckout }) => {
    const total = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
            <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
                <div className="w-full h-full flex flex-col bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                            <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="mt-8">
                            {items.length === 0 ? (
                                <div className="text-center py-10">
                                    <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Your cart is empty.</p>
                                    <button onClick={onClose} className="mt-4 text-red-600 font-bold hover:underline">Start Ordering</button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <li key={item.cartId} className="py-6 flex">
                                            {item.type === 'MENU' && item.menuItem ? (
                                                <img src={item.menuItem.image} alt={item.menuItem.name} className="h-20 w-20 rounded-md object-cover" />
                                            ) : (
                                                <div className="h-20 w-20 rounded-md bg-orange-100 flex items-center justify-center text-orange-600">
                                                    <ChefHat className="h-8 w-8" />
                                                </div>
                                            )}
                                            <div className="ml-4 flex-1 flex flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>{item.type === 'MENU' ? item.menuItem?.name : (item.customPizza?.name || "Custom Pizza")}</h3>
                                                        <p className="ml-4">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {item.type === 'MENU' ? item.menuItem?.description.slice(0, 40) + '...' : 'Custom ingredients'}
                                                    </p>
                                                </div>
                                                <div className="flex-1 flex items-end justify-between text-sm">
                                                    <div className="flex items-center border border-gray-300 rounded-md">
                                                        <button 
                                                            onClick={() => onUpdateQty(item.cartId, -1)}
                                                            className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="px-2 font-medium text-gray-900">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => onUpdateQty(item.cartId, 1)}
                                                            className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                    <button 
                                                        onClick={() => onRemove(item.cartId)}
                                                        className="font-medium text-red-600 hover:text-red-500 flex items-center"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {items.length > 0 && (
                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                                <p>Subtotal</p>
                                <p>${total.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={onCheckout}
                                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
                            >
                                Checkout & Pay
                            </button>
                            <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                                <p>
                                    or <button onClick={onClose} className="text-red-600 font-medium hover:text-red-500">Continue Shopping<span aria-hidden="true"> &rarr;</span></button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const MenuGrid: React.FC<{ 
    onAddToCart: (item: MenuItem) => void; 
    onCustomize: () => void;
}> = ({ onAddToCart, onCustomize }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<MenuCategory | 'ALL'>('ALL');

    const categories: { id: MenuCategory | 'ALL'; label: string }[] = [
        { id: 'ALL', label: 'All' },
        { id: 'ITALIAN', label: 'Classic Italian' },
        { id: 'ITALIAN_REGIONAL', label: 'Regional Italian' },
        { id: 'AMERICAN', label: 'American' },
        { id: 'GOURMET', label: 'Gourmet' },
        { id: 'MEAT', label: 'Meat Lovers' },
        { id: 'VEGGIE', label: 'Vegetarian' },
        { id: 'SEAFOOD', label: 'Seafood' },
        { id: 'INTERNATIONAL', label: 'International' },
        { id: 'FORMATS', label: 'Special Formats' },
        { id: 'DESSERTS', label: 'Desserts' },
        { id: 'FUSION', label: 'Fusion' },
        { id: 'SEASONAL', label: 'Seasonal' },
        { id: 'SIDES', label: 'Sides' },
    ];

    const filteredItems = MENU_ITEMS.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filter === 'ALL' || item.category === filter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Promo Banner */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-6 md:p-10 mb-10 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                    <h2 className="text-4xl font-extrabold mb-4">Craving Something Special?</h2>
                    <p className="text-lg opacity-90 mb-6">Get 50% OFF on your first custom built pizza using code: SLICE50</p>
                    <button 
                        onClick={onCustomize}
                        className="bg-white text-red-600 px-6 py-3 rounded-full font-bold hover:bg-red-50 transition shadow-md flex items-center"
                    >
                        <ChefHat className="mr-2 h-5 w-5" /> Build Your Own
                    </button>
                </div>
                <Pizza className="absolute -right-10 -bottom-20 text-red-700 opacity-20 w-96 h-96 transform rotate-12" />
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition ${
                                filter === cat.id 
                                ? 'bg-gray-900 text-white shadow-md' 
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
                <div className="relative w-full lg:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input 
                        type="text" 
                        placeholder="Search for pizzas..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
                    />
                </div>
            </div>

            {/* Pizza Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition duration-300 flex flex-col group">
                        <div className="relative h-48 overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            {item.category === 'ITALIAN' && (
                                <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center">
                                    <Star className="w-3 h-3 mr-1 fill-current" /> Classic
                                </span>
                            )}
                            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.isVeg ? 'VEG' : 'NON-VEG'}
                                </span>
                                {item.category === 'DESSERTS' && (
                                     <span className="px-2 py-1 rounded text-xs font-bold shadow-sm bg-purple-100 text-purple-700">
                                        Sweet
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.name}</h3>
                                <div className="flex items-center bg-green-50 px-1.5 py-0.5 rounded">
                                    <span className="text-xs font-bold text-green-700">{item.rating}</span>
                                    <Star className="w-3 h-3 text-green-700 fill-current ml-0.5" />
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-xl font-bold text-gray-900">${item.price}</span>
                                <button 
                                    onClick={() => onAddToCart(item)}
                                    className="px-4 py-2 bg-white border-2 border-red-100 text-red-600 rounded-lg font-bold text-sm hover:bg-red-50 hover:border-red-200 transition"
                                >
                                    ADD +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredItems.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-lg">No pizzas found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}

const PizzaBuilder: React.FC<{ user: User; onAddToCart: (pizza: CustomPizza, price: number) => void }> = ({ user, onAddToCart }) => {
    const [inventory] = useState<InventoryItem[]>(getInventory());
    const [step, setStep] = useState(1);
    const [selection, setSelection] = useState<CustomPizza>({ base: '', sauce: '', cheese: '', veggies: [] });
    const [total, setTotal] = useState(0);
    
    // AI States
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [aiMood, setAiMood] = useState("");
    const [suggestionsHistory, setSuggestionsHistory] = useState<Array<{name: string, description: string}>>([]);
    const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
    const [generatingDescription, setGeneratingDescription] = useState(false);
  
    const bases = inventory.filter(i => i.category === InventoryCategory.BASE);
    const sauces = inventory.filter(i => i.category === InventoryCategory.SAUCE);
    const cheeses = inventory.filter(i => i.category === InventoryCategory.CHEESE);
    const veggies = inventory.filter(i => i.category === InventoryCategory.VEGGIE);
  
    useEffect(() => {
      let t = 0;
      const baseP = bases.find(b => b.name === selection.base)?.price || 0;
      const sauceP = sauces.find(b => b.name === selection.sauce)?.price || 0;
      const cheeseP = cheeses.find(b => b.name === selection.cheese)?.price || 0;
      const veggieP = selection.veggies.reduce((acc, v) => acc + (veggies.find(veg => veg.name === v)?.price || 0), 0);
      setTotal(baseP + sauceP + cheeseP + veggieP);
    }, [selection, bases, sauces, cheeses, veggies]);
  
    // Clear generated info if user modifies pizza
    useEffect(() => {
      setSuggestionsHistory([]);
      setCurrentSuggestionIndex(0);
    }, [selection]);
  
    const handleGenerateDescription = async () => {
      setGeneratingDescription(true);
      const info = await generatePizzaNameAndDescription(selection);
      setSuggestionsHistory(prev => {
          const newData = [...prev, info];
          setCurrentSuggestionIndex(newData.length - 1);
          return newData;
      });
      setGeneratingDescription(false);
    };
  
    // Auto-generate when reaching step 4
    useEffect(() => {
      if (step === 4 && suggestionsHistory.length === 0 && !generatingDescription) {
        handleGenerateDescription();
      }
    }, [step]);
  
    const handleAiSuggest = async () => {
      if(!aiMood.trim()) return;
      setSuggestionsLoading(true);
      
      const inventoryNames = {
        bases: bases.filter(b => b.quantity > 0).map(b => b.name),
        sauces: sauces.filter(s => s.quantity > 0).map(s => s.name),
        cheeses: cheeses.filter(c => c.quantity > 0).map(c => c.name),
        veggies: veggies.filter(v => v.quantity > 0).map(v => v.name)
      };
  
      if (step === 3) {
         const suggestedVeggies = await suggestToppings(
             aiMood, 
             { base: selection.base, sauce: selection.sauce, cheese: selection.cheese },
             inventoryNames.veggies
         );
         setSelection({ ...selection, veggies: suggestedVeggies });
      } else {
         const config = await suggestPizzaConfig(aiMood, inventoryNames);
         setSelection({
          base: config.base || selection.base,
          sauce: config.sauce || selection.sauce,
          cheese: config.cheese || selection.cheese,
          veggies: config.veggies || []
        });
      }
      
      setSuggestionsLoading(false);
    };
  
    const handleAddToCart = async () => {
      const selectedSuggestion = suggestionsHistory[currentSuggestionIndex];
      const pizza: CustomPizza = { 
        ...selection, 
        name: selectedSuggestion?.name || "Custom Pizza",
        description: selectedSuggestion?.description
      };
      onAddToCart(pizza, total);
    };
  
    const renderOption = (item: InventoryItem, isSelected: boolean, onSelect: () => void) => (
      <div 
        key={item.id}
        onClick={() => item.quantity > 0 && onSelect()}
        className={`
          relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
          ${isSelected ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-orange-200'}
          ${item.quantity === 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        `}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold text-gray-900">{item.name}</span>
          <span className="text-sm font-medium text-red-600">${item.price}</span>
        </div>
        {item.quantity === 0 && <span className="text-xs text-red-500 font-bold">Out of Stock</span>}
        {item.quantity > 0 && item.quantity < 10 && <span className="text-xs text-orange-500">Low Stock</span>}
      </div>
    );
  
    const currentSuggestion = suggestionsHistory[currentSuggestionIndex];
  
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-white">
            <h2 className="text-3xl font-bold flex items-center">
              <span className="mr-2">🍕</span> Craft Your Pizza
            </h2>
            <p className="opacity-90 mt-1">Step {step} of 4</p>
          </div>
  
          {/* AI Auto-Builder */}
          {step < 4 && (
            <div className="bg-orange-50 p-4 border-b border-orange-100 flex gap-2 items-center flex-wrap sm:flex-nowrap">
              <div className="flex items-center text-orange-700 font-bold text-sm whitespace-nowrap">
                <Sparkles className="text-orange-500 h-5 w-5 mr-1" />
                AI Chef:
              </div>
              <input 
                type="text" 
                placeholder="Tell me what you're craving (e.g. 'Spicy and crunchy', 'Cheesy delight')" 
                className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 min-w-[200px]"
                value={aiMood}
                onChange={(e) => setAiMood(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest()}
              />
              <button 
                onClick={handleAiSuggest}
                disabled={suggestionsLoading}
                className="bg-orange-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-orange-600 disabled:opacity-50 whitespace-nowrap min-w-[140px] flex justify-center"
              >
                {suggestionsLoading ? <Loader2 className="animate-spin h-4 w-4" /> : (step === 3 ? 'Suggest Toppings' : 'Auto-Fill Pizza')}
              </button>
            </div>
          )}
  
          {/* Content */}
          <div className="p-6 min-h-[400px]">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Choose your Base</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bases.map(item => renderOption(item, selection.base === item.name, () => setSelection({...selection, base: item.name})))}
                </div>
              </div>
            )}
  
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Select Sauce & Cheese</h3>
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Sauce</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sauces.map(item => renderOption(item, selection.sauce === item.name, () => setSelection({...selection, sauce: item.name})))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Cheese</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cheeses.map(item => renderOption(item, selection.cheese === item.name, () => setSelection({...selection, cheese: item.name})))}
                  </div>
                </div>
              </div>
            )}
  
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Add Toppings (Veggies)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {veggies.map(item => renderOption(
                    item, 
                    selection.veggies.includes(item.name), 
                    () => {
                      const current = selection.veggies;
                      const updated = current.includes(item.name) 
                        ? current.filter(v => v !== item.name)
                        : [...current, item.name];
                      setSelection({...selection, veggies: updated});
                    }
                  ))}
                </div>
              </div>
            )}
  
            {step === 4 && (
               <div className="space-y-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800">Review Your Creation</h3>
                
                <div className="min-h-[180px] flex flex-col justify-center items-center bg-orange-50 rounded-xl p-6 border border-orange-100 relative overflow-hidden transition-all">
                  {generatingDescription && !currentSuggestion ? (
                    <div className="py-4">
                        <Loader2 className="animate-spin h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-gray-500 animate-pulse text-sm">Our AI Chef is naming your masterpiece...</p>
                    </div>
                  ) : currentSuggestion ? (
                    <div className="animate-in fade-in zoom-in duration-500 relative z-10 w-full flex flex-col items-center">
                      <div className="flex items-center justify-center gap-2 mb-2 text-orange-600">
                          <Sparkles className="h-5 w-5" />
                          <span className="text-xs font-bold uppercase tracking-wider">AI Chef's Special</span>
                      </div>
                      <h4 className="text-3xl font-black text-gray-900 font-serif italic mb-2">"{currentSuggestion.name}"</h4>
                      <p className="text-gray-600 italic text-lg max-w-lg mx-auto leading-relaxed mb-4">"{currentSuggestion.description}"</p>
                      
                      {/* Navigation Controls */}
                      <div className="flex items-center justify-center gap-4 mt-2">
                          <button 
                              onClick={() => setCurrentSuggestionIndex(i => Math.max(0, i - 1))}
                              disabled={currentSuggestionIndex === 0}
                              className="p-1 rounded-full hover:bg-orange-100 disabled:opacity-30 disabled:hover:bg-transparent text-orange-600 transition"
                          >
                              <ChevronLeft className="h-6 w-6" />
                          </button>
                          <span className="text-xs font-bold text-orange-400">
                              {currentSuggestionIndex + 1} / {suggestionsHistory.length}
                          </span>
                          <button 
                              onClick={() => setCurrentSuggestionIndex(i => Math.min(suggestionsHistory.length - 1, i + 1))}
                              disabled={currentSuggestionIndex === suggestionsHistory.length - 1}
                              className="p-1 rounded-full hover:bg-orange-100 disabled:opacity-30 disabled:hover:bg-transparent text-orange-600 transition"
                          >
                              <ChevronRight className="h-6 w-6" />
                          </button>
                      </div>
  
                      <button 
                          onClick={handleGenerateDescription}
                          disabled={generatingDescription}
                          className="mt-5 px-6 py-2.5 bg-white border-2 border-orange-100 rounded-full text-sm font-bold text-orange-600 shadow-sm hover:border-orange-300 hover:bg-orange-50 transition-all flex items-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                          {generatingDescription ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-700" />}
                          {generatingDescription ? "Chefs are thinking..." : "Regenerate Name & Description"}
                      </button>
                    </div>
                  ) : (
                    // Fallback button in rare case auto-trigger fails or pending
                    <div className="text-center py-2 relative z-10">
                      <button 
                          onClick={handleGenerateDescription}
                          className="bg-white border-2 border-orange-500 text-orange-600 px-6 py-2 rounded-full font-bold shadow-sm hover:bg-orange-50 hover:shadow-md transform transition flex items-center mx-auto"
                      >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Name & Description
                      </button>
                    </div>
                  )}
                  {/* Decorative background element */}
                  <div className="absolute -bottom-10 -right-10 opacity-5">
                     <Pizza className="w-40 h-40" />
                  </div>
                </div>

                {/* History List */}
                {suggestionsHistory.length > 1 && (
                  <div className="mt-6 text-left">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                      <History className="h-4 w-4 mr-1" /> Idea History
                    </h4>
                    <div className="space-y-2">
                      {suggestionsHistory.map((item, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setCurrentSuggestionIndex(idx)}
                          className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition-all ${
                            idx === currentSuggestionIndex 
                              ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500' 
                              : 'bg-white border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className={`font-bold text-sm truncate ${idx === currentSuggestionIndex ? 'text-orange-700' : 'text-gray-700'}`}>{item.name}</p>
                            <p className="text-xs text-gray-500 truncate">{item.description}</p>
                          </div>
                          {idx === currentSuggestionIndex && <div className="h-2 w-2 rounded-full bg-orange-500 ml-3 flex-shrink-0"></div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
  
                <div className="bg-white p-6 rounded-xl border border-gray-200 inline-block text-left min-w-[300px] shadow-sm">
                  <div className="space-y-2">
                    <p><span className="font-bold text-gray-600">Base:</span> {selection.base || 'None'}</p>
                    <p><span className="font-bold text-gray-600">Sauce:</span> {selection.sauce || 'None'}</p>
                    <p><span className="font-bold text-gray-600">Cheese:</span> {selection.cheese || 'None'}</p>
                    <p><span className="font-bold text-gray-600">Toppings:</span> {selection.veggies.length ? selection.veggies.join(', ') : 'None'}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-red-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
  
          {/* Footer Navigation */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            {step > 1 ? (
               <button onClick={() => setStep(step - 1)} className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition">
                 Back
               </button>
            ) : <div></div>}
            
            {step < 4 ? (
              <button 
                onClick={() => setStep(step + 1)} 
                disabled={
                  (step === 1 && !selection.base) || 
                  (step === 2 && (!selection.sauce || !selection.cheese))
                }
                className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            ) : (
              <button 
                onClick={handleAddToCart} 
                disabled={generatingDescription}
                className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-lg flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Add To Cart - ${total.toFixed(2)}
              </button>
            )}
          </div>
        </div>
      </div>
    );
};

const DeliveryMap: React.FC<{ 
    destination: { lat: number; lng: number }; 
    startTime?: number;
    orderId: string;
    customerName: string;
  }> = ({ destination, startTime, orderId, customerName }) => {
    const mapRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const shopLocation = getShopLocation();
  
    useEffect(() => {
      if (!mapContainerRef.current) return;
  
      if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
      }
  
      mapRef.current = L.map(mapContainerRef.current).setView([shopLocation.lat, shopLocation.lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);
  
      const shopIcon = L.divIcon({ html: '<div class="bg-red-600 text-white p-1 rounded-full"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></div>', className: '', iconSize: [30, 30] });
      const homeIcon = L.divIcon({ html: '<div class="bg-blue-600 text-white p-1 rounded-full"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>', className: '', iconSize: [30, 30] });
      const bikeIcon = L.divIcon({ 
        html: '<div class="bg-orange-500 text-white p-1 rounded-full shadow-lg"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg></div>', 
        className: '', 
        iconSize: [32, 32] 
      });
  
      L.marker([shopLocation.lat, shopLocation.lng], { icon: shopIcon }).addTo(mapRef.current).bindPopup("<b>SliceGenius Kitchen</b><br>Order Origin");
      
      const destPopupContent = `<div class="text-center"><b>${customerName}</b><br><span class="text-xs text-gray-500">Order #${orderId.slice(-4)}</span></div>`;
      L.marker([destination.lat, destination.lng], { icon: homeIcon }).addTo(mapRef.current).bindPopup(destPopupContent);
  
      const driverMarker = L.marker([shopLocation.lat, shopLocation.lng], { icon: bikeIcon }).addTo(mapRef.current);
      
      const DURATION = 60000;
      const start = startTime || Date.now();
  
      const updatePosition = () => {
        const now = Date.now();
        const elapsed = now - start;
        const progress = Math.min(elapsed / DURATION, 1);
  
        const lat = shopLocation.lat + (destination.lat - shopLocation.lat) * progress;
        const lng = shopLocation.lng + (destination.lng - shopLocation.lng) * progress;
        
        driverMarker.setLatLng([lat, lng]);
        
        if (progress < 1) {
            const secondsLeft = Math.ceil((DURATION - elapsed) / 1000);
            driverMarker.bindPopup(`On the way! ETA: ${secondsLeft}s`).openPopup();
        } else {
            driverMarker.bindPopup(`Arrived!`).openPopup();
        }
      };
  
      const interval = setInterval(updatePosition, 100);
      updatePosition(); 
  
      const bounds = L.latLngBounds([
        [shopLocation.lat, shopLocation.lng],
        [destination.lat, destination.lng]
      ]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  
      return () => {
        clearInterval(interval);
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
      };
    }, [destination, shopLocation, startTime, orderId, customerName]);
  
    return <div ref={mapContainerRef} className="h-64 w-full rounded-lg z-0 relative" />;
};

const UserOrders: React.FC<{ userId: string }> = ({ userId }) => {
    const [orders, setOrders] = useState<Order[]>([]);
  
    useEffect(() => {
      const fetch = () => {
         const all = getOrders();
         setOrders(all.filter(o => o.userId === userId).reverse());
      };
      fetch();
      const i = setInterval(fetch, 3000);
      return () => clearInterval(i);
    }, [userId]);
  
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Order History</h2>
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">Order #{order.id.slice(-6)}</span>
                    <span className="text-sm text-gray-500">• {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                      {order.items.map(i => i.type === 'MENU' ? i.menuItem?.name : (i.customPizza?.name || "Custom")).join(", ")}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center gap-3">
                   <span className="text-xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</span>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                     order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                   }`}>
                     {order.status}
                   </span>
                </div>
              </div>
  
              {order.status === OrderStatus.DELIVERY && order.deliveryLocation && (
                <div className="mt-4 border rounded-lg overflow-hidden">
                  <div className="bg-orange-50 px-4 py-2 border-b border-orange-100 flex items-center text-sm text-orange-700 font-medium">
                    <Navigation className="w-4 h-4 mr-2 animate-pulse" />
                    Live Tracking: Driver is on the way!
                  </div>
                  <DeliveryMap 
                      destination={order.deliveryLocation} 
                      startTime={order.deliveryStartedAt}
                      orderId={order.id}
                      customerName={order.customerName}
                  />
                </div>
              )}
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <Pizza className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No orders yet. Get baking!</p>
            </div>
          )}
        </div>
      </div>
    );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('LOGIN');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeDb();
    const stored = localStorage.getItem('slice_current_user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setView(u.role === UserRole.ADMIN ? 'ADMIN_INVENTORY' : 'MENU');
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        try {
            if (authMode === 'LOGIN') {
                const u = loginUser(email);
                if (u) {
                  setUser(u);
                  localStorage.setItem('slice_current_user', JSON.stringify(u));
                  setView(u.role === UserRole.ADMIN ? 'ADMIN_INVENTORY' : 'MENU');
                } else {
                  alert("Invalid login. Try 'admin' or sign up.");
                }
            } else {
                const u = registerUser(name, email, phone, password);
                setUser(u);
                localStorage.setItem('slice_current_user', JSON.stringify(u));
                setView('MENU');
            }
        } catch (e: any) {
            alert(e.message);
        }
      setLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('slice_current_user');
    setView('LOGIN');
    setEmail('');
    setCart([]);
  };

  const addToCart = (item: MenuItem | CustomPizza, price: number) => {
      setCart(prev => {
          if ('id' in item) {
             const existing = prev.find(i => i.type === 'MENU' && i.menuItem?.id === item.id);
             if (existing) {
                 return prev.map(i => i.cartId === existing.cartId ? { ...i, quantity: i.quantity + 1 } : i);
             }
             return [...prev, {
                 cartId: Date.now().toString(),
                 type: 'MENU',
                 menuItem: item as MenuItem,
                 quantity: 1,
                 unitPrice: price
             }];
          } else {
             return [...prev, {
                 cartId: Date.now().toString(),
                 type: 'CUSTOM',
                 customPizza: item as CustomPizza,
                 quantity: 1,
                 unitPrice: price
             }];
          }
      });
      setIsCartOpen(true);
      if (view === 'BUILDER') setView('MENU');
  };

  const updateCartQty = (id: string, delta: number) => {
      setCart(prev => prev.map(item => {
          if (item.cartId === id) {
              return { ...item, quantity: Math.max(1, item.quantity + delta) };
          }
          return item;
      }));
  };

  const removeFromCart = (id: string) => {
      setCart(prev => prev.filter(item => item.cartId !== id));
  };

  const handleCheckout = () => {
      if (!user) return;
      const total = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      const order: Order = {
          id: Date.now().toString(),
          userId: user.id,
          customerName: user.name,
          items: cart,
          totalAmount: total,
          status: OrderStatus.RECEIVED,
          createdAt: Date.now()
      };
      
      const result = placeOrder(order);
      if (result.success) {
          setCart([]);
          setIsCartOpen(false);
          setView('ORDER_TRACKING');
          alert("Order Placed Successfully!");
      } else {
          alert("Failed to place order: " + result.alerts[0]);
      }
  };

  return (
    <div className="min-h-screen bg-orange-50 pb-20 font-sans">
      <Navbar 
        user={user} 
        view={view} 
        setView={setView} 
        onLogout={handleLogout} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQty={updateCartQty}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      {view === 'LOGIN' && (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-red-600 p-8 text-center">
              <Pizza className="h-16 w-16 text-white mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white">SliceGenius</h2>
              <p className="text-red-100 mt-2">Delicious Pizza, Delivered Fast.</p>
            </div>
            <div className="p-8">
                <div className="flex border-b border-gray-200 mb-6">
                    <button 
                        className={`flex-1 pb-2 font-bold text-sm ${authMode === 'LOGIN' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}
                        onClick={() => setAuthMode('LOGIN')}
                    >
                        LOGIN
                    </button>
                    <button 
                        className={`flex-1 pb-2 font-bold text-sm ${authMode === 'REGISTER' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}
                        onClick={() => setAuthMode('REGISTER')}
                    >
                        SIGN UP
                    </button>
                </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'REGISTER' && (
                    <>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Full Name</label>
                        <input 
                            type="text" 
                            required 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Phone Number</label>
                        <input 
                            type="tel" 
                            required 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                        />
                    </div>
                    </>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  />
                </div>
                {authMode === 'REGISTER' && (
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Password</label>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                        />
                    </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-70 flex justify-center mt-6"
                >
                  {loading ? <Loader2 className="animate-spin" /> : (authMode === 'LOGIN' ? 'Login' : 'Create Account')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {view === 'MENU' && user && (
          <MenuGrid 
            onAddToCart={(item) => addToCart(item, item.price)} 
            onCustomize={() => setView('BUILDER')} 
          />
      )}

      {view === 'BUILDER' && user && (
        <PizzaBuilder user={user} onAddToCart={addToCart} />
      )}

      {view === 'ORDER_TRACKING' && user && (
        <UserOrders userId={user.id} />
      )}

      {view === 'ADMIN_INVENTORY' && user?.role === UserRole.ADMIN && (
        <InventoryManager />
      )}

      {view === 'ADMIN_ORDERS' && user?.role === UserRole.ADMIN && (
        <OrderManager />
      )}
    </div>
  );
};

export default App;