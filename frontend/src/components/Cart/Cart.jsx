import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI, ASSET_URL } from '../../services/api';
import { Trash2, Search, Bell, ChevronDown, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchCart();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    try {
      await cartAPI.updateCartItem(productId, newQuantity);
      fetchCart();
    } catch (error) {
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      await cartAPI.removeFromCart(productId);
      fetchCart();
    } catch (error) {
      alert('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      await orderAPI.createOrder({
        shippingAddress: '123 Health St, Wellness, State, Country, 12345'
      });
      fetchCart();
      setToast({ show: true, message: 'Checkout Successful' });
      setTimeout(() => {
        setToast({ show: false, message: '' });
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Checkout failed' });
      setTimeout(() => setToast({ show: false, message: '' }), 5000);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-[#E50914] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-[#E50914] selection:text-white pb-20">

      {/* Top Navigation Bar - Netflix Style Navbar */}
      <nav className={`fixed w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="w-full px-4 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <h1 onClick={() => handleNavigate('/dashboard')} className="text-2xl md:text-3xl font-black tracking-tighter text-[#E50914] drop-shadow-md cursor-pointer">
              NUTRI
            </h1>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-5 text-sm font-medium">
              <button onClick={() => handleNavigate('/dashboard')} className="text-[#e5e5e5] hover:text-gray-300 transition-colors cursor-pointer">
                Home
              </button>
              <button onClick={() => handleNavigate('/products')} className="text-[#e5e5e5] hover:text-gray-300 transition-colors cursor-pointer">
                Products
              </button>
              <button onClick={() => handleNavigate('/cart')} className="text-white font-bold cursor-default">
                My List
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-white hover:text-gray-300 transition-colors cursor-pointer">
              <Search size={22} />
            </div>
            <div className="hidden md:block text-white hover:text-gray-300 transition-colors cursor-pointer relative">
              <Bell size={22} />
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#E50914] rounded-full border border-[#141414]"></div>
            </div>

            {/* User Avatar & Dropdown */}
            <div
              ref={dropdownRef}
              className="relative flex items-center gap-2 cursor-pointer group"
              onClick={() => setProfileDropdown(!profileDropdown)}
            >
              <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <ChevronDown size={16} className={`text-white transition-transform duration-300 ${profileDropdown ? 'rotate-180' : ''}`} />

              {profileDropdown && (
                <div className="absolute top-full right-0 mt-4 w-48 bg-black/90 border border-[#333] py-2 rounded shadow-2xl z-50 animate-in fade-in duration-200">
                  <div className="absolute -top-2 right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white/90"></div>

                  <div className="px-4 py-3 flex items-center gap-3 hover:underline">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-xs">{user?.name?.charAt(0).toUpperCase()}</div>
                    <span className="text-sm font-medium">{user?.name || 'User'}</span>
                  </div>
                  <div className="w-full h-px bg-[#333] my-1"></div>
                  <button onClick={() => navigate('/dashboard')} className="w-full text-left px-4 py-2.5 text-sm hover:underline border-b border-[#333]">Manage Profiles</button>
                  <a href="mailto:vasanthavenkatasiva@gmail.com?subject=Help Request" className="block w-full text-left px-4 py-2.5 text-sm hover:underline border-b border-[#333]">Help Center</a>
                  <div className="p-3 text-center">
                    <button onClick={handleLogout} className="text-sm font-bold text-white hover:underline transition-colors w-full p-2 bg-[#E50914] rounded shadow-md">
                      Sign out of Nutri
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between px-4 pb-3 border-b border-[#333]">
          <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide text-sm font-medium flex-1">
            <button onClick={() => handleNavigate('/dashboard')} className="text-[#e5e5e5]">Home</button>
            <button onClick={() => handleNavigate('/products')} className="text-[#e5e5e5]">Products</button>
            <button onClick={() => handleNavigate('/cart')} className="text-white font-bold">My List</button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="w-full px-4 md:px-12 pt-28 md:pt-32 z-10 flex flex-col items-center">

        <div className="w-full max-w-6xl">
          <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold font-sans text-white">Your List</h2>
            <span className="text-gray-400 font-medium bg-[#333] px-3 py-1 rounded-sm text-sm border border-zinc-700">
              {cart?.items?.length || 0} Total Titles
            </span>
          </div>

          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 rounded-full border border-zinc-700 flex items-center justify-center mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-[#E50914] opacity-[0.05]"></div>
                <X size={40} className="text-[#E50914] font-light z-10" strokeWidth={1} />
              </div>
              <h2 className="text-2xl font-bold text-gray-200 mb-2">You haven't added any items yet.</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto line-clamp-2">
                Explore our catalog of personalized supplements to build your perfect health profile.
              </p>
              <button
                onClick={() => navigate('/products')}
                className="bg-white text-black hover:bg-gray-200 font-bold py-3 px-8 rounded-sm transition-colors text-lg"
              >
                Find Products to Add
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items List - Netflix Episode List Style */}
              <div className="flex-1 space-y-4">
                {cart.items.map((item, index) => (
                  <div key={item.product?._id} className="group relative flex flex-col md:flex-row gap-4 p-4 border-b border-zinc-800 hover:bg-[#222] transition-colors rounded-sm cursor-pointer">

                    <div className="flex items-center absolute md:static top-0 right-0 mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity z-20 mr-4 md:mr-0">
                      <button
                        onClick={() => removeItem(item.product?._id)}
                        className="p-2 border border-zinc-700 hover:border-gray-500 rounded-full text-zinc-500 hover:text-white transition-colors bg-[#141414]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="w-full md:w-48 aspect-[16/9] md:aspect-auto md:h-28 bg-[#222] rounded-sm overflow-hidden flex-shrink-0 relative group/img">
                      <div className="absolute left-2 top-2 bg-black/60 px-1.5 py-0.5 rounded-sm z-10 font-bold text-white text-[10px] tabular-nums">{index + 1}</div>
                      {item.product?.image ? (
                        <img src={`${ASSET_URL}${item.product?.image}`} alt={item.product?.name} className="w-full h-full object-cover mix-blend-luminosity brightness-90 group-hover/img:brightness-110 transition-all" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-[#E50914] font-black text-2xl tracking-tighter opacity-30">NUTRI</div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-[#444]">
                        <div className="h-full bg-[#E50914]" style={{ width: `${Math.min(100, item.quantity * 20)}%` }}></div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center min-w-0 pr-0 md:pr-12 md:pl-2">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base md:text-lg font-bold text-white line-clamp-1">{item.product?.name}</h3>
                        <p className="font-bold text-white hidden md:block">₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                      <p className="text-gray-400 text-xs md:text-sm line-clamp-2 md:line-clamp-2 mb-3 leading-relaxed w-[90%] md:w-[85%]">{item.product?.description}</p>

                      <div className="flex items-center gap-4 text-sm mt-auto">
                        <div className="flex items-center bg-[#333] border border-zinc-700 rounded-sm">
                          <button
                            onClick={() => updateQuantity(item.product?._id, item.quantity, -1)}
                            className="px-3 md:px-4 py-1.5 text-gray-300 hover:text-white hover:bg-[#444] transition-colors focus:outline-none"
                          >-</button>
                          <span className="w-8 text-center font-bold font-mono text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product?._id, item.quantity, 1)}
                            className="px-3 md:px-4 py-1.5 text-gray-300 hover:text-white hover:bg-[#444] transition-colors focus:outline-none"
                          >+</button>
                        </div>
                        <span className="text-green-500 font-bold text-[10px] md:text-xs">Available to Drop</span>
                        <p className="font-bold text-white text-lg block md:hidden ml-auto">₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary - Netflix Sidebar Checkout Style */}
              <div className="w-full lg:w-96 flex-shrink-0">
                <div className="bg-[#181818] rounded-[4px] border border-zinc-800 p-6 sticky top-24 shadow-2xl">
                  <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-4 mb-6 uppercase tracking-wider">Account Billing Summary</h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-300">
                      <span>Plan Details ({cart.items.length} titles)</span>
                      <span>₹{cart.total?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Delivery Bandwidth</span>
                      <span className="text-green-500 font-medium">Included</span>
                    </div>
                    <div className="h-px w-full bg-zinc-800 my-4"></div>
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total Value</span>
                      <span>₹{cart.total?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
                    You agree to subscribe to Nutri Premium access. This purchase represents a serialized payload dispatched to your primary node. Terms apply.
                  </p>

                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading || cart.items.length === 0}
                    className="w-full bg-[#E50914] text-white py-4 rounded-sm font-bold text-lg hover:bg-red-700 transition-all font-sans disabled:opacity-50 flex items-center justify-center gap-2 tracking-wide"
                  >
                    {checkoutLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Secure Checkout'
                    )}
                  </button>

                  <div className="mt-6 flex flex-wrap gap-2 justify-center opacity-60 pointer-events-none">
                    {/* Simulated payment badges */}
                    <div className="w-8 h-5 bg-white rounded-sm"></div>
                    <div className="w-8 h-5 bg-white rounded-sm"></div>
                    <div className="w-8 h-5 bg-white rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification (Bottom Right) */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-[#181818] border border-zinc-800 text-white px-6 py-4 rounded shadow-2xl z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3">
          <Check className="text-green-500" size={24} />
          <span className="font-bold text-lg">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Cart;
