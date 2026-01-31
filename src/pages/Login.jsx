import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, oauthAPI } from '../services/api';
import useGoogleSignIn from '../hooks/useGoogleSignIn';
import useGitHubSignIn from '../hooks/useGitHubSignIn';
import LoginModel from '../assets/login_model.png';
import Becults from '../assets/logo.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { initializeGoogleSignIn, renderGoogleSignInButton } = useGoogleSignIn();
  const { initiateGitHubAuth } = useGitHubSignIn();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    initializeGoogleSignIn();
    setTimeout(() => {
      renderGoogleSignInButton('google-signin-button');
    }, 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      const response = await authAPI.login({ email, password });

      if (response.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Redirect to home after successful login
        navigate('/home');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    initiateGitHubAuth();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side - Image Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white mb-30">
          {/* Replace this div with your image */}
          
            {/* Placeholder - Replace with your actual image */}
            <img
              src={LoginModel}
              alt="Becults Platform"
              className="w-9/10 h-auto object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <style>{`
              @keyframes laserPulse {
                0% {
                  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
                }
                50% {
                  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.5), inset 0 0 20px rgba(59, 130, 246, 0.3);
                }
                100% {
                  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
                }
              }
              
              @keyframes laserFlare {
                0% {
                  opacity: 0;
                  transform: scaleX(0.8) scaleY(0.8);
                }
                50% {
                  opacity: 1;
                }
                100% {
                  opacity: 0;
                  transform: scaleX(1.2) scaleY(1.2);
                }
              }
              
              .laser-div {
                animation: laserPulse 3s ease-in-out infinite;
              }
            `}</style>
            
            <div className="relative w-[95%] h-1 ml-4 mb-12 overflow-hidden rounded-xl
                bg-blue-500
                shadow-[0_0_10px_#3b82f6,0_0_25px_#3b82f6,0_0_50px_#3b82f6]">
              <div className="absolute inset-0 bg-blue-300 opacity-90"></div>
              <div className="absolute inset-0 bg-gradient-to-r 
                 from-transparent via-white to-transparent
                  opacity-60 animate-laser"></div>
              <div className="absolute -inset-2 bg-blue-500 blur-xl opacity-50"></div>
            </div>
         

          

         
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-slate-700/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="flex justify-center"
            >
              <img src={Becults} alt="Becults Logo" className="w-1/2 h-auto" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-lg">Sign in to your account to continue</p>
          </div>

          {/* Login Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl mb-5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer" 
                />
                <span className="text-slate-300 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-indigo-600 hover:to-indigo-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/50 hover:shadow-indigo-500/20 disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-slate-400">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex flex-row gap-2">
              <div id="google-signin-button" className="w-8/10"></div>
              <motion.button
                type="button"
                onClick={handleGitHubLogin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-8/10 flex items-center justify-center gap-2 bg-slate-800/50 border border-slate-700 hover:border-slate-600 hover:bg-slate-800  py-2 transition-all font-medium text-white "
              >
                <svg className="w-4 h-5 " viewBox="0 0 24 24" fill="white">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </motion.button>
            </div>
          </motion.form>

          {/* Sign Up Link */}
          <motion.p
            className="text-center text-slate-400 text-sm mt-8 leading-relaxed mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Sign up here
            </Link>
          </motion.p>

          
          
        </motion.div>
      </div>
    </div>
  );
}