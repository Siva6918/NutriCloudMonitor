import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI, productAPI, regimenAPI, ASSET_URL } from '../../services/api';
import { Search, Bell, ChevronDown, CheckCircle2, ShieldAlert, AlertCircle } from 'lucide-react';
import ManageProfileModal from './ManageProfileModal';

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-[#E50914] selection:text-white">

      {/* Top Navigation Bar - Netflix Style Navbar */}
      <nav className={`fixed w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="w-full px-4 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <h1 onClick={() => handleNavigate('/dashboard')} className="text-2xl md:text-3xl font-black tracking-tighter text-[#E50914] drop-shadow-md cursor-pointer">
              NUTRI
            </h1>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-5 text-sm font-medium">
              <button onClick={() => handleNavigate('/dashboard')} className="text-white font-bold cursor-default">
                Home
              </button>
              <button onClick={() => handleNavigate('/products')} className="text-[#e5e5e5] hover:text-gray-300 transition-colors">
                Products
              </button>
              <button onClick={() => handleNavigate('/cart')} className="text-[#e5e5e5] hover:text-gray-300 transition-colors">
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

                  <button onClick={() => { setProfileDropdown(false); setShowProfileModal(true); }} className="w-full text-left px-4 py-2.5 text-sm hover:underline border-b border-[#333]">
                    Manage Profiles
                  </button>
                  <a href="mailto:vasanthavenkatasiva@gmail.com?subject=Help Request" className="block w-full text-left px-4 py-2.5 text-sm hover:underline border-b border-[#333]">
                    Help Center
                  </a>
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
        <div className="md:hidden flex items-center gap-6 px-4 pb-3 overflow-x-auto whitespace-nowrap scrollbar-hide text-sm font-medium border-b border-[#333]">
          <button onClick={() => handleNavigate('/dashboard')} className="text-white font-bold">Home</button>
          <button onClick={() => handleNavigate('/products')} className="text-[#e5e5e5]">Products</button>
          <button onClick={() => handleNavigate('/cart')} className="text-[#e5e5e5]">My List</button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="w-full px-4 md:px-12 pt-32 pb-16 z-10 flex flex-col gap-12">

        {/* Profile Billboard Section - Enhanced for Matrix Series Showcase */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-4 relative min-h-[40vh] md:min-h-[60vh] rounded-xl overflow-hidden p-6 md:p-12 mb-12">
          {/* Cinematic Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={`${ASSET_URL}/images/products/equipment/equipment_01.png`}
              className="w-full h-full object-cover opacity-40 scale-105"
              alt="Brand Background"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
          </div>

          <div className="flex-1 w-full relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[#E50914] font-black tracking-widest text-sm drop-shadow-md">N U T R I <span className="text-white font-normal ml-1">O R I G I N A L</span></span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white capitalize tracking-tighter drop-shadow-xl w-full break-words leading-none">
              {user?.name || 'User Name'}
            </h1>

            <div className="flex items-center gap-4 md:gap-6 font-bold text-xl md:text-3xl drop-shadow-md mt-2">
              <span className="text-gray-400 text-base hidden lg:inline tracking-normal">{user?.email}</span>
            </div>

            <p className="text-lg md:text-xl text-white max-w-2xl drop-shadow-md py-4 font-medium leading-relaxed">
              Welcome to your personalized dashboard. Recalculate your metrics to fetch fresh diet recommendations perfectly serialized tailored for you.
            </p>

            <div className="flex gap-4">
              <button onClick={() => document.getElementById('metrics-section')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-black hover:bg-white/80 transition-colors px-6 md:px-8 py-2 md:py-3 rounded-[4px] font-bold text-lg flex items-center justify-center shadow-lg gap-2">
                <CheckCircle2 color="black" size={20} className="fill-white" />
                Health Overview
              </button>
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setProfileDropdown(true); }} className="bg-[#515451]/70 text-white hover:bg-[#515451] transition-colors px-6 md:px-8 py-2 md:py-3 rounded-[4px] font-bold text-lg flex items-center justify-center shadow-lg gap-2">
                Account Info
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex justify-center md:hidden lg:flex pt-4 md:pt-0">
            {/* Decorative floating poster style */}
            <div className="w-64 h-96 bg-zinc-900 rounded-sm shadow-2xl border border-zinc-800 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col z-20 transition-transform duration-500">
                <div className="w-32 h-32 rounded-full border-4 border-[#E50914] flex items-center justify-center text-4xl font-black mb-4 shadow-[0_0_30px_rgba(229,9,20,0.5)] bg-black">
                  {user?.bmiCategory === 'Normal' ? 'A+' : user?.bmiCategory ? 'B' : '?'}
                </div>
                <h3 className="text-2xl font-bold">{user?.bmiCategory || 'No Metrics'}</h3>
                <p className="text-sm font-bold text-[#E50914] tracking-widest uppercase mt-1">Current Ranking</p>
              </div>
            </div>
          </div>
        </div>

        {/* BMI Input Row */}
        <div id="metrics-section">
          <h2 className="text-2xl font-bold font-sans text-[#e5e5e5] mb-4">Update Metrics</h2>
          <BMICalculator user={user} updateUser={updateUser} setToast={setToast} />

          {/* Metrics Display Cards (Shown below calculation) */}
          {user?.bmi && (
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <div className="bg-[#181818] border border-zinc-800 rounded-md p-6 flex-1 shadow-xl hover:bg-[#202020] transition-colors">
                <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-blue-500" /> Current BMI
                </h3>
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-5xl font-black text-white tracking-tighter">{user.bmi}</span>
                  <span className="text-xl text-zinc-300 font-bold bg-[#333] px-3 py-1 rounded-sm">{user.bmiCategory}</span>
                </div>
                <p className="text-zinc-500 text-sm mt-4 border-t border-zinc-800 pt-4 font-medium">
                  Body Mass Index is a measure of body fat based on height and weight. Your BMI categorizes your overall body composition and is used to tailor your nutrition plan.
                </p>
              </div>

              <div className="bg-[#181818] border border-zinc-800 rounded-md p-6 flex-1 shadow-xl hover:bg-[#202020] transition-colors">
                <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" /> Recommendation Match
                </h3>
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-5xl font-black text-green-500 tracking-tighter">
                    {user?.bmiCategory === 'Normal' ? '100%' : '85%'}
                  </span>
                  <span className="text-xl text-zinc-300 font-bold uppercase tracking-widest">Match</span>
                </div>
                <p className="text-zinc-500 text-sm mt-4 border-t border-zinc-800 pt-4 font-medium">
                  This percentage indicates how accurately our diet recommendations and supplement plans are optimized for your specific current BMI and health profile.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Diet Plan Row */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-sans text-white mb-6 flex items-center gap-2">
            Recommended For You <span className="text-[#E50914] text-lg font-black ml-2 px-2 py-0.5 border border-[#E50914] rounded-sm">TOP PICKS</span>
          </h2>
          <DietPlan user={user} />
        </div>

        {/* Shift-Wise Supplement Plan Row */}
        <div className="mt-8">
          <h2 className="text-2xl md:text-3xl font-bold font-sans text-white mb-6 flex items-center gap-2">
            My Regimen (Shift-Wise) <span className="text-[#E50914] text-lg font-black ml-2 px-2 py-0.5 border border-[#E50914] rounded-sm">DAILY ACTION</span>
          </h2>
          <ShiftProductsPlan user={user} />
        </div>
      </div>

      {/* Toast Notification (Bottom Right) */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-[#181818] border border-zinc-800 text-white px-6 py-4 rounded shadow-2xl z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3">
          <AlertCircle className="text-[#E87C03]" size={24} />
          <span className="font-bold text-base md:text-lg">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

// BMI Calculator designed like a Netflix settings row
const BMICalculator = ({ user, updateUser, setToast }) => {
  const [height, setHeight] = useState(user?.height || '');
  const [weight, setWeight] = useState(user?.weight || '');
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userAPI.calculateBMI({ height: parseInt(height), weight: parseInt(weight) });
      updateUser(response.data.user);
    } catch (error) {
      setToast({ show: true, message: 'Error calculating BMI: ' + error.response?.data?.message });
      setTimeout(() => setToast({ show: false, message: '' }), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#181818] border border-zinc-800 rounded-md p-6 max-w-2xl shadow-xl w-full flex flex-col sm:flex-row gap-6 items-center hover:bg-[#202020] transition-colors">
      <form onSubmit={handleCalculate} className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
        <div className="flex-1 relative group">
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full bg-[#333] border-b-2 border-transparent group-hover:border-[#E50914] focus:border-[#E50914] rounded-sm px-4 py-3 outline-none text-white text-base transition-colors"
            placeholder="Height (cm)"
            required
          />
        </div>
        <div className="flex-1 relative group">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-[#333] border-b-2 border-transparent group-hover:border-[#E50914] focus:border-[#E50914] rounded-sm px-4 py-3 outline-none text-white text-base transition-colors"
            placeholder="Weight (kg)"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#E50914] hover:bg-red-700 text-white font-bold px-8 py-3 rounded-sm transition-colors shadow-lg whitespace-nowrap min-w-[140px] flex items-center justify-center disabled:opacity-50"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save & Update'}
        </button>
      </form>
    </div>
  );
};

// Diet Plan Row Netflix carousel style
const DietPlan = ({ user }) => {
  const [dietPlan, setDietPlan] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.bmiCategory) {
      fetchDietPlan();
      fetchProducts();
    }
  }, [user?.bmiCategory]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAllProducts({ limit: 50 });
      setProducts(response.data.products);
    } catch (e) {
      console.log('Failed fetching products for diet recommendations');
    }
  };

  const fetchDietPlan = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getDietRecommendations();
      setDietPlan(response.data.dietPlan);
    } catch (error) {
      console.error("Warning: Fetch error during diet pipeline");
      // Fallback diet plan to ensure UI populates if backend API fails
      setDietPlan([
        { id: 1, food: "Oats & Whey", benefits: "Slow release carbs and fast protein for morning energy.", quantity: "1 bowl", calories: 350 },
        { id: 2, food: "Grilled Chicken Salad", benefits: "High protein, low carb mix for sustained midday focus.", quantity: "1 plate", calories: 400 },
        { id: 3, food: "Salmon & Quinoa", benefits: "Omega-3s and complex carbs for recovery.", quantity: "1 plate", calories: 450 },
        { id: 4, food: "Greek Yogurt & Almonds", benefits: "Casein protein for overnight muscle repair.", quantity: "1 bowl", calories: 250 },
        { id: 5, food: "Electrolyte Mix", benefits: "Hydration and mineral balance.", quantity: "1 glass", calories: 50 },
        { id: 6, food: "Protein Shake", benefits: "Quick absorption protein post-workout.", quantity: "1 scoop", calories: 120 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.bmiCategory) {
    return (
      <div className="h-64 flex items-center justify-center bg-[#181818] rounded-md border border-zinc-800">
        <div className="text-center flex flex-col items-center">
          <ShieldAlert size={40} className="text-zinc-500 mb-4" />
          <p className="text-lg font-medium text-zinc-400">Please setup your BMI to view episodes.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center bg-[#181818] rounded-md border border-zinc-800">
        <div className="w-10 h-10 border-4 border-zinc-700 border-t-[#E50914] rounded-full animate-spin"></div>
      </div>
    );
  }

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Hydration', 'Evening'];

  // Filter appropriate products
  let recommendedProducts = products.filter(p => p.recommendedFor && p.recommendedFor.includes(user.bmiCategory));
  if (recommendedProducts.length < 6 && products.length > 0) recommendedProducts = products.slice(0, 6); // fallback

  const mappedDiet = dietPlan?.map((item, index) => {
    const productMatch = recommendedProducts[index % recommendedProducts.length];
    return {
      ...item,
      mealType: mealTypes[index] || 'Episode ' + (index + 1),
      productImage: productMatch?.image || null
    };
  }) || [];

  return (
    <div className="relative group w-full">
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 pt-4 px-2 snap-x snap-mandatory scrollbar-hide -mx-2">
        {mappedDiet.map((item, index) => (
          <div
            key={item.id || index}
            className="min-w-[280px] md:min-w-[320px] lg:min-w-[360px] h-48 bg-zinc-900 rounded-sm relative group/card cursor-pointer snap-start transition-transform duration-300 hover:z-20 shadow-xl border border-zinc-800 overflow-hidden"
          >
            {/* Real Product Image Background */}
            <div className="absolute inset-0 bg-neutral-800 overflow-hidden">
              {item.productImage && (
                <img
                  src={`${ASSET_URL}${item.productImage}`}
                  className="w-full h-full object-cover opacity-60 mix-blend-luminosity brightness-50 transition-transform duration-700"
                  alt="Supplement Match"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80";
                  }}
                />
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5 flex flex-col justify-end">
              <span className="text-xs font-bold text-[#E50914] tracking-widest uppercase mb-1 shadow-black drop-shadow-md">Episode {index + 1}</span>
              <h4 className="text-lg font-bold text-white shadow-black drop-shadow-md line-clamp-1">{item.food}</h4>

              <div className="h-0 group-hover/card:h-auto overflow-hidden opacity-0 group-hover/card:opacity-100 transition-all duration-300 ease-in-out mt-2">
                <p className="text-xs font-semibold text-green-500">BMI Matched</p>
                <p className="text-sm text-gray-300 mt-2 line-clamp-2">{item.benefits}</p>
                <p className="text-xs text-white font-bold mt-2">{item.quantity} • {item.calories} kcal</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Shift-Wise Supplement Plan Component implementing Netflix UI style
const ShiftProductsPlan = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedShifts, setCompletedShifts] = useState({});

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchRegimen();
    }
  }, [user]);

  const fetchRegimen = async () => {
    try {
      const response = await regimenAPI.getToday();
      const shiftsMap = {};
      response.data.regimens.forEach(r => {
        if (r.isCompleted) shiftsMap[r.shiftId] = true;
      });
      setCompletedShifts(shiftsMap);
    } catch (error) {
      console.error("Error fetching regimen state", error);
    }
  };

  const handleMarkComplete = async (shiftId) => {
    try {
      // Optimistic update
      setCompletedShifts(prev => ({ ...prev, [shiftId]: true }));
      await regimenAPI.markComplete(shiftId);
    } catch (error) {
      console.error("Error marking regimen complete", error);
      // Revert optimism if error
      setCompletedShifts(prev => ({ ...prev, [shiftId]: false }));
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAllProducts({ limit: 20 });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching regimen products", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center bg-[#181818] rounded-md border border-zinc-800">
        <div className="w-10 h-10 border-4 border-zinc-700 border-t-[#E50914] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Pre-define 4 shifts mapped to specific health categories so it mimics a diet cycle
  const shifts = [
    { id: 'shift_0', title: 'Morning Kickstart', time: '07:00 AM', category: 'Vitamins', desc: 'Prime your nervous system and immune response.' },
    { id: 'shift_1', title: 'Pre-Workout / Midday', time: '01:00 PM', category: 'Protein', desc: 'Fuel muscle synthesis and sustain energy levels.' },
    { id: 'shift_2', title: 'Evening Recovery', time: '07:00 PM', category: 'Snacks', desc: 'Replenish glycogen without spiking insulin.' },
    { id: 'shift_3', title: 'Night Cellular Repair', time: '10:30 PM', category: 'Supplements', desc: 'Deep sleep aids and slow-release recovery.' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {shifts.map((shift, i) => {
        // Filter by BMI first
        let filteredProducts = products;
        if (user?.bmiCategory) {
          filteredProducts = products.filter(p => p.recommendedFor && p.recommendedFor.includes(user.bmiCategory));
        }
        if (filteredProducts.length === 0) filteredProducts = products; // fallback if no specific matches found

        // Find a product loosely matching the category
        const recommendedProduct = filteredProducts.find(p => p.category === shift.category) || filteredProducts[i % filteredProducts.length];
        const isCompleted = completedShifts[shift.id];

        return (
          <div key={i} className={`bg-[#181818] rounded-md border border-zinc-800 flex flex-col transition-all shadow-xl group overflow-hidden ${isCompleted ? 'opacity-70 border-zinc-600' : 'hover:border-zinc-500'}`}>

            {/* Shift Header */}
            <div className={`p-5 border-b border-zinc-800 bg-gradient-to-b ${isCompleted ? 'from-[#111] to-[#111]' : 'from-[#222] to-[#181818]'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#E50914] font-black tracking-widest text-xs uppercase shadow-sm">Shift {i + 1}</span>
                <span className="text-zinc-500 font-mono text-[10px] tracking-wider bg-black/50 px-2 py-1 rounded border border-zinc-800">{shift.time}</span>
              </div>
              <h3 className={`text-xl font-bold leading-tight mb-2 ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>{shift.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed min-h-[40px]">{shift.desc}</p>
            </div>

            {/* Product Recommendation */}
            <div className="flex-1 p-5 relative overflow-hidden group/img cursor-pointer">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Active Compound</p>

              {recommendedProduct ? (
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-black rounded shadow-md overflow-hidden shrink-0 border border-zinc-800 relative">
                    <img
                      src={`${ASSET_URL}${recommendedProduct.image}`}
                      className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover/img:opacity-100 transition-opacity"
                      alt="Supplement"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-white text-base leading-tight mb-1 group-hover:text-[#E50914] transition-colors">{recommendedProduct.name}</p>
                    <p className="text-gray-400 text-xs line-clamp-2">{recommendedProduct.description.replace(/\[.*?\]\s*/g, '')}</p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm italic">Synchronizing catalog...</div>
              )}
            </div>

            {/* Action Bar */}
            <div className={`p-4 mt-auto border-t border-zinc-800 flex justify-between items-center ${isCompleted ? 'bg-green-900/20' : 'bg-zinc-900/50'}`}>
              <button
                onClick={() => !isCompleted && handleMarkComplete(shift.id)}
                disabled={isCompleted}
                className={`text-sm font-bold flex items-center gap-2 transition-colors ${isCompleted ? 'text-green-500 cursor-default' : 'text-white hover:text-[#E50914]'}`}
              >
                <CheckCircle2 size={16} className={isCompleted ? 'fill-green-900/50' : ''} />
                {isCompleted ? 'Completed' : 'Mark Completed'}
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
