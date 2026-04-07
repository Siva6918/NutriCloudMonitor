import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI, ASSET_URL } from '../../services/api';
import { AlertCircle } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const { login } = useAuth();
  const navigate = useNavigate();

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 5000);
  };

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  };

  const getPasswordStrength = (password) => {
    const value = String(password || '');
    let score = 0;

    if (value.length >= 8) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (!value) {
      return {
        score: 0,
        label: '',
        color: 'transparent',
        width: '0%'
      };
    }

    if (score <= 2) {
      return {
        score,
        label: 'Weak',
        color: '#ef4444',
        width: '33%'
      };
    }

    if (score <= 4) {
      return {
        score,
        label: 'Medium',
        color: '#f59e0b',
        width: '66%'
      };
    }

    return {
      score,
      label: 'Strong',
      color: '#22c55e',
      width: '100%'
    };
  };

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedName = formData.name.trim();
    const normalizedEmail = formData.email.trim().toLowerCase();

    if (!normalizedName) {
      showToast('Please enter your full name.');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      showToast('Please enter a valid email address.');
      return;
    }

    if (passwordStrength.label === 'Weak') {
      showToast('Password is too weak. Use 8+ characters with uppercase, lowercase, number, and special character.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.signup({
        name: normalizedName,
        email: normalizedEmail,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen relative bg-black font-sans text-white selection:bg-[#E50914] selection:text-white">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${ASSET_URL}/images/auth/signup_bg.jpg")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/40 via-transparent to-black/80"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="absolute top-0 left-0 w-full p-6 md:px-12 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <h1
          className="text-3xl md:text-5xl font-black tracking-tighter text-[#E50914] drop-shadow-md cursor-pointer"
          onClick={() => navigate('/login')}
        >
          NUTRI
        </h1>

        <button
          onClick={() => navigate('/login')}
          className="text-white hover:underline text-lg font-medium"
        >
          Sign In
        </button>
      </div>

      <div className="w-full flex justify-center items-center z-10 px-4 pt-24 pb-12 min-h-screen">
        <div className="bg-black/60 md:bg-black/40 w-full max-w-[450px] p-10 md:p-14 rounded-xl md:rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 ring-1 ring-white/20">
          <h2 className="text-[32px] font-bold text-white mb-7 tracking-tight">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#333] border border-transparent rounded-[4px] px-5 py-4 text-white text-base focus:outline-none focus:bg-[#454545] transition-colors peer"
                placeholder=" "
                required
              />
              <label className="absolute text-zinc-400 text-sm duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none">
                Full Name
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#333] border border-transparent rounded-[4px] px-5 py-4 text-white text-base focus:outline-none focus:bg-[#454545] transition-colors peer"
                placeholder=" "
                required
              />
              <label className="absolute text-zinc-400 text-sm duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none">
                Email address
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#333] border border-transparent rounded-[4px] px-5 py-4 text-white text-base focus:outline-none focus:bg-[#454545] transition-colors peer"
                placeholder=" "
                required
              />
              <label className="absolute text-zinc-400 text-sm duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none">
                Add a password
              </label>
            </div>

            {formData.password && (
              <div className="mt-2">
                <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: passwordStrength.width,
                      backgroundColor: passwordStrength.color
                    }}
                  ></div>
                </div>
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: passwordStrength.color }}
                >
                  Password strength: {passwordStrength.label}
                </p>
              </div>
            )}

            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-[#333] border border-transparent rounded-[4px] px-5 py-4 text-white text-base focus:outline-none focus:bg-[#454545] transition-colors peer"
                placeholder=" "
                required
              />
              <label className="absolute text-zinc-400 text-sm duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none">
                Confirm password
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E50914] hover:bg-[#c11119] text-white py-3.5 rounded-[4px] font-bold text-base mt-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-8 text-[#737373] text-sm md:text-base">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-white hover:underline focus:outline-none font-medium"
            >
              Sign In.
            </button>
          </div>

          <p className="mt-4 text-[13px] text-[#8c8c8c] leading-relaxed">
            Nutri is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
            <a href="#" className="text-[#0071eb] hover:underline">Learn more.</a>
          </p>
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

export default Signup;
