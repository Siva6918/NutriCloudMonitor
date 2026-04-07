import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { authAPI, adminAuthAPI, ASSET_URL } from '../../services/api';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const userAuth = useAuth();
  const adminAuth = useAdminAuth();
  const navigate = useNavigate();

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 5000);
  };

  const emailValue = email.trim();
  const showEmailValidation = emailValue.length > 0;
  const emailIsValid = isValidEmail(emailValue);

  const handleLogin = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      showToast('Please enter a valid email address');
      return;
    }

    if (!password.trim()) {
      showToast('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      try {
        const response = await authAPI.login({
          email: normalizedEmail,
          password
        });
        userAuth.login(response.data.user, response.data.token);
        navigate('/dashboard');
      } catch (userError) {
        if (
          userError.response?.status === 401 ||
          userError.response?.status === 404 ||
          userError.response?.status === 400
        ) {
          const adminResponse = await adminAuthAPI.login({
            email: normalizedEmail,
            password
          });
          adminAuth.login(adminResponse.data.admin, adminResponse.data.token);
          navigate('/admin/dashboard');
        } else {
          throw userError;
        }
      }
    } catch (error) {
      showToast(
        'Authentication Failed: ' +
          (error.response?.data?.message || 'Invalid Credentials')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen relative bg-black font-sans text-white selection:bg-[#E50914] selection:text-white">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${ASSET_URL}/images/auth/login_bg.jpg")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="absolute top-0 left-0 w-full p-6 md:px-12 z-20">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-[#E50914] drop-shadow-md">
          NUTRI
        </h1>
      </div>

      <div className="w-full flex justify-center items-center z-10 px-4 pt-16 pb-8 min-h-screen">
        <div className="bg-black/60 md:bg-black/40 w-full max-w-[450px] p-10 md:p-16 rounded-xl md:rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 ring-1 ring-white/20">
          <h2 className="text-[32px] font-bold text-white mb-7 tracking-tight">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#333] border border-transparent rounded-[4px] px-5 py-4 text-white text-base focus:outline-none focus:bg-[#454545] transition-colors peer"
                placeholder=" "
                required
              />
              <label className="absolute text-zinc-400 text-sm duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none">
                Email address
              </label>
              {showEmailValidation && (
                <p className={`mt-2 text-sm ${emailIsValid ? 'text-green-400' : 'text-red-400'}`}>
                  {emailIsValid ? 'Valid email address' : 'Invalid email address'}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#333] border border-transparent rounded-[4px] px-5 py-4 pr-14 text-white text-base focus:outline-none focus:bg-[#454545] transition-colors peer"
                placeholder=" "
                required
              />
              <label className="absolute text-zinc-400 text-sm duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E50914] hover:bg-[#c11119] text-white py-3.5 rounded-[4px] font-bold text-base mt-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="flex justify-between items-center text-[#B3B3B3] text-sm mt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded-sm bg-[#737373] border-none accent-[#B3B3B3] cursor-pointer"
                id="remember"
              />
              <label htmlFor="remember" className="cursor-pointer font-medium">
                Remember me
              </label>
            </div>
            <a href="#" className="hover:underline">Need help?</a>
          </div>

          <div className="mt-16 text-[#737373] text-base">
            New to Nutri?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-white hover:underline focus:outline-none font-medium"
            >
              Sign up now.
            </button>

            <div className="mt-6">
              <p className="text-white font-medium"><b>ADMIN LOGIN:</b></p>
              <p className="text-red-500 font-medium"><b>Email:</b> <u className="text-blue-500">admin@nutri.co</u></p>
              <p className="text-red-500 font-medium"><b>Password:</b> <u className="text-blue-500">admin918</u></p>
            </div>

            <p className="mt-3 text-[13px] text-[#8c8c8c]">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
              <a href="#" className="text-[#0071eb] hover:underline">Learn more.</a>
            </p>
          </div>
        </div>
      </div>

      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-[#181818] border border-zinc-800 text-white px-6 py-4 rounded shadow-2xl z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3">
          <AlertCircle className="text-[#E87C03]" size={24} />
          <span className="font-bold text-base md:text-lg">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Login;
