import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, cartAPI, ASSET_URL } from '../../services/api';
import { ShoppingCart, Search, Bell, ChevronDown, Play, Plus, Info, X, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const dropdownRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
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
    fetchProducts();
    fetchCategories();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAllProducts({});
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Group products by category for horizontal scrolling
  const productsByCategory = categories.reduce((acc, cat) => {
    const catProducts = products.filter(p => p.category === cat && (!searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase())));
    if (catProducts.length > 0) acc[cat] = catProducts;
    return acc;
  }, {});

  const handleAddHero = async () => {
    if (!products || products.length === 0) return;
    try {
      await cartAPI.addToCart({ productId: products[0]._id, quantity: 1 });
      setToast({ show: true, message: 'Featured product added to My List!', type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
    } catch (error) {
      setToast({ show: true, message: 'Failed pushing to My List.', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-[#E50914] selection:text-white pb-20 overflow-x-hidden">

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
              <button onClick={() => handleNavigate('/products')} className="text-white font-bold cursor-default">
                Products
              </button>
              <button onClick={() => handleNavigate('/cart')} className="text-[#e5e5e5] hover:text-gray-300 transition-colors cursor-pointer">
                My List
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-black/40 border border-[#333] px-3 py-1.5 rounded-sm focus-within:bg-black focus-within:border-gray-500 transition-colors text-white hover:text-gray-300 cursor-pointer w-48 lg:w-64">
              <Search size={18} className="text-gray-400 mr-2 shrink-0" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Titles, people, genres"
                className="bg-transparent text-sm w-full outline-none text-white placeholder-gray-500"
              />
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
            <button onClick={() => handleNavigate('/products')} className="text-white font-bold">Products</button>
            <button onClick={() => handleNavigate('/cart')} className="text-[#e5e5e5]">My List</button>
          </div>
          <Search size={20} className="text-white ml-2" />
        </div>
      </nav>

      {/* Hero Content Area */}
      {products.length > 0 && !searchTerm && !selectedCategory && (
        <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center">
          <div className="absolute inset-0 z-0 select-none overflow-hidden">
            <img
              src={`${ASSET_URL}${products[0]?.image}`}
              alt="Featured"
              className="w-full h-[150%] object-cover opacity-60 brightness-75 -translate-y-[15%] pointer-events-none"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80"; // Branded dark gym fallback
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10 px-4 md:px-12 w-full max-w-2xl mt-16 md:mt-24">
            <div className="flex items-center gap-2 mb-2 font-bold text-sm tracking-widest text-shadow drop-shadow-md">
              <span className="text-[#E50914]">N</span><span className="text-gray-400">SERIES</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-none mb-4 drop-shadow-lg drop-shadow-black uppercase">
              {products[0]?.name}
            </h2>
            <p className="text-lg text-white font-medium mb-6 line-clamp-3 leading-relaxed drop-shadow-md drop-shadow-black">
              {products[0]?.description.replace(/\[.*?\]\s*/g, '')}
            </p>
            <div className="flex items-center gap-4">
              <button onClick={handleAddHero} className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded-[4px] font-bold text-lg hover:bg-white/80 transition-colors shadow-lg">
                <ShoppingCart size={24} className="fill-black" />
                Add to List
              </button>
              <button
                onClick={() => setSelectedProduct(products[0])}
                className="flex items-center gap-2 bg-[#515451]/70 text-white px-6 md:px-8 py-2 md:py-3 rounded-[4px] font-bold text-lg hover:bg-[#515451]/90 transition-colors shadow-lg backdrop-blur-sm">
                <Info size={24} />
                More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search / Category Categories */}
      <div className={`relative z-40 px-4 md:px-12 mb-4 flex items-center gap-4 ${(!searchTerm && !selectedCategory) ? '-mt-4 pt-24 md:pt-4' : 'pt-32'}`}>
        <select
          className="bg-black/60 border border-[#333] text-white font-bold py-1.5 px-4 rounded-sm outline-none cursor-pointer focus:bg-black focus:border-white transition-colors"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Genres</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {searchTerm && (
          <p className="text-gray-400 font-medium">Exploring <span className="text-white border-b border-gray-600 pb-0.5">"{searchTerm}"</span></p>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 z-10 relative">
          <div className="w-12 h-12 border-4 border-zinc-800 border-t-[#E50914] rounded-full animate-spin mb-4"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center justify-center relative z-10 text-gray-400">
          <h3 className="text-xl font-medium mb-2">No matching nutritional profiles found.</h3>
          <p className="text-sm">Try searching for generic terms or resetting genres.</p>
        </div>
      ) : (
        <div className="relative z-10 space-y-12">

          {/* If searching or filtering, show grid view. Otherwise, Netflix row view. */}
          {(searchTerm || selectedCategory) ? (
            <div className="px-4 md:px-12">
              <h3 className="text-xl font-bold text-gray-400 mb-4">{searchTerm ? 'Top Results' : `${selectedCategory} Nutrition`}</h3>
              <div className="flex flex-wrap gap-4 md:gap-6 items-start pb-16">
                {filteredProducts.map(p => (
                  <div key={p._id} className="w-[240px] shrink-0 z-10 hover:z-20">
                    <ProductThumbnail product={p} onSelectProduct={setSelectedProduct} setToast={setToast} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            Object.entries(productsByCategory).map(([category, catProds], index) => (
              <div key={category} className="pl-4 md:pl-12 group/row mb-16">
                <h3 className="text-xl font-bold font-sans text-[#e5e5e5] mb-3 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2 group/title">
                  {category} <ChevronDown size={16} className="-rotate-90 text-[#E50914] opacity-0 group-hover/title:opacity-100 transition-opacity -ml-3 group-hover/title:ml-0" />
                </h3>
                {/* 2-Row Layout Slider Component */}
                <div className="grid grid-rows-2 grid-flow-col gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 pt-4 -mx-1 px-1 auto-cols-[calc((100%-1rem)/2)] md:auto-cols-[calc((100%-2rem)/3)] lg:auto-cols-[calc((100%-3rem)/4)] xl:auto-cols-[calc((100%-4rem)/5)]">
                  {catProds.map((product) => (
                    <div key={product._id} className="w-full h-full transition-all duration-300 snap-start flex flex-col justify-start">
                      <ProductThumbnail product={product} onSelectProduct={setSelectedProduct} setToast={setToast} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative bg-[#181818] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 border border-zinc-700 scrollbar-hide">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors">
              <X size={24} />
            </button>
            <div className="w-full aspect-video bg-zinc-900 relative">
              <img
                src={`${ASSET_URL}${selectedProduct.image}`}
                className="w-full h-full object-cover brightness-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80";
                }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#181818] to-transparent pointer-events-none"></div>
            </div>
            <div className="p-8 pb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md">{selectedProduct.name}</h2>
              <div className="flex items-center gap-4 text-sm font-bold mb-6">
                <span className="text-green-500">98% Match</span>
                <span className="text-gray-300 border border-gray-600 px-2 rounded-sm">₹{selectedProduct.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="text-white border border-gray-600 px-2 py-0.5 rounded-sm bg-[#333]">{(selectedProduct.stock > 0) ? 'In Stock' : 'Out of Stock'}</span>
                <span className="text-gray-400">{selectedProduct.category}</span>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl">{selectedProduct.description.replace(/\[.*?\]\s*/g, '')}</p>
              <button
                onClick={async () => {
                  try {
                    await cartAPI.addToCart({ productId: selectedProduct._id, quantity: 1 });
                    setToast({ show: true, message: 'Added to your list.', type: 'success' });
                    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
                  } catch (e) {
                    setToast({ show: true, message: 'Failed adding to list', type: 'error' });
                    setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 5000);
                  }
                }}
                className="flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-[4px] font-bold text-lg hover:bg-gray-200 transition-colors w-full md:w-auto shadow-xl">
                <ShoppingCart size={24} />
                Add to List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification (Bottom Right) */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-[#181818] border border-zinc-800 text-white px-6 py-4 rounded shadow-2xl z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3">
          {toast.type === 'success' ? <Check className="text-green-500" size={24} /> : <AlertCircle className="text-[#E87C03]" size={24} />}
          <span className="font-bold text-base md:text-lg">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

// Thumbnail Component styled like the Dashboard Recommended cards, without complex animations
const ProductThumbnail = ({ product, onSelectProduct, setToast }) => {
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      await cartAPI.addToCart({ productId: product._id, quantity: 1 });
      setToast({ show: true, message: 'Added to your list.', type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
    } catch (error) {
      setToast({ show: true, message: 'Failed pushing to My List.', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 5000);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="relative w-full h-48 md:h-56 rounded-sm bg-zinc-900 cursor-pointer shadow-xl border border-zinc-800 overflow-hidden group hover:border-zinc-500 transition-colors"
      onClick={() => onSelectProduct(product)}
    >
      <div className="absolute inset-0 bg-neutral-800 overflow-hidden">
        <img
          src={`${ASSET_URL}${product.image}`}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80";
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 md:p-5 flex flex-col justify-end">
        <span className="text-xs font-bold text-[#E50914] tracking-widest uppercase mb-1 shadow-black drop-shadow-md">{product.category}</span>
        <h4 className="text-lg font-bold text-white shadow-black drop-shadow-md line-clamp-1">{product.name}</h4>

        <div className="mt-2">
          <div className="flex items-center gap-2 text-[10px] md:text-sm font-bold flex-wrap mb-1">
            <span className="text-green-500">98% Match</span>
            <span className="border border-gray-600 px-1 rounded-sm text-gray-300">₹{product.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <p className="text-sm text-gray-300 line-clamp-2 leading-tight">{product.description.replace(/\[.*?\]\s*/g, '')}</p>
        </div>
      </div>

      <button
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 focus:outline-none shadow-md"
        onClick={handleAdd}
      >
        {adding ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <ShoppingCart size={14} className="fill-black" />}
      </button>
    </div>
  );
};

export default Products;
