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
  Clock,
  LogIn,
  Eye,
  EyeOff
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

declare const L: any;

// --- Components ---

const Navbar: React.FC<{ 
  user: User | null; 
  view: ViewState; 
  setView: (v: ViewState) => void; 
  cartCount: number;
  onLogout: () => void;
  onOpenCart: () => void;
  onLoginClick: () => void;
}> = ({ user, view, setView, cartCount, onLogout, onOpenCart, onLoginClick }) => (
  <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center cursor-pointer" onClick={() => setView(user && user.role === UserRole.ADMIN ? 'ADMIN_INVENTORY' : 'MENU')}>
          <div className="bg-red-600 p-1.5 rounded-full mr-2">
            <Pizza className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Slice<span className="text-red-600">Genius</span></span>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-6">
            {/* Navigation Links - Visible to Guests and Customers */}
            {(!user || user.role === UserRole.CUSTOMER) && (
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
                    {user && (
                        <button 
                        onClick={() => setView('ORDER_TRACKING')}
                        className={`px-3 py-2 rounded-full text-sm font-bold transition ${view === 'ORDER_TRACKING' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                        >
                        Orders
                        </button>
                    )}
                </div>
            )}

            {/* Admin Links */}
            {user && user.role === UserRole.ADMIN && (
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

            {/* Cart - Visible to Everyone */}
            {(!user || user.role === UserRole.CUSTOMER) && (
                <button onClick={onOpenCart} className="relative p-2 text-gray-600 hover:text-red-600 transition">
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                            {cartCount}
                        </span>
                    )}
                </button>
            )}

            {/* User Actions */}
            <div className="flex items-center ml-2 pl-4 border-l border-gray-200">
              {user ? (
                  <>
                    <div className="mr-3 text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    </div>
                    <button onClick={onLogout} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-600" title="Logout">
                        <LogOut className="h-5 w-5" />
                    </button>
                  </>
              ) : (
                  <button 
                    onClick={onLoginClick}
                    className="flex items-center px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-full hover:bg-red-700 transition shadow-sm"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </button>
              )}
            </div>
        </div>
      </div>
    </div>
  </nav>
);

const LoginModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
}> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
    const [identifier, setIdentifier] = useState(''); 
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            try {
                let u: User | null = null;
                if (authMode === 'LOGIN') {
                    u = loginUser(identifier);
                    if (!u) throw new Error("Invalid login. Try 'admin' or sign up.");
                } else {
                    u = registerUser(name, identifier, phone, password);
                }
                
                if (u) {
                    onLoginSuccess(u);
                    onClose();
                }
            } catch (e: any) {
                alert(e.message);
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
                
                <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all w-full max-w-md">
                    <div className="bg-red-600 p-6 text-center relative">
                        <button onClick={onClose} className="absolute top-4 right-4 text-red-100 hover:text-white">
                            <X className="h-6 w-6" />
                        </button>
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                            <Pizza className="h-8 w-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                        <p className="text-red-100 text-sm">Login to access your orders & rewards</p>
                    </div>

                    <div className="p-8">
                        <div className="flex border-b border-gray-200 mb-6">
                            <button 
                                className={`flex-1 pb-2 font-bold text-sm transition ${authMode === 'LOGIN' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}
                                onClick={() => setAuthMode('LOGIN')}
                            >
                                LOGIN
                            </button>
                            <button 
                                className={`flex-1 pb-2 font-bold text-sm transition ${authMode === 'REGISTER' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}
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
                                        placeholder="John Doe"
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
                                        placeholder="123-456-7890"
                                    />
                                </div>
                                </>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                                    {authMode === 'LOGIN' ? 'Email or Username' : 'Email Address'}
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                                    placeholder={authMode === 'LOGIN' ? "user@example.com or username" : "user@example.com"}
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Password</label>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required 
                                    value