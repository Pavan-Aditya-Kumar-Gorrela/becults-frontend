import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Users, Award, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, oauthAPI } from '../services/api';
import useGoogleSignIn from '../hooks/useGoogleSignIn';
import useGitHubSignIn from '../hooks/useGitHubSignIn';
import Becults from '../assets/logo.jpg';
import SignupModel from '../assets/signup_model.png';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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
      renderGoogleSignInButton('google-signup-button');
    }, 100);
  }, []);

  const validateForm = () => {
    if (!fullName.trim()) return 'Full name is required';
    if (!email.includes('@')) return 'Valid email is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    if (!agreedToTerms) return 'You must agree to the terms';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.signup({
        fullName,
        email,
        password,
        confirmPassword,
      });

      if (response.success) {
        // Store token and user info
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Redirect to home after successful signup
        navigate('/home');
      }
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignUp = () => {
    initiateGitHubAuth();
  };

  const passwordStrength = password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak';

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side - Image Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-7/12 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center items-start w-full  text-white mb-30">

        
            {/* Placeholder - Replace with your actual image */}
            <img
              src={SignupModel}
              alt="Join Our Platform"
              className="w-3/4 h-3/4 object-cover "
              
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
            
            <div className="relative w-[85%] h-1 ml-4 mb-12 overflow-hidden rounded-xl
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

      {/* Right Side - SignUp Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md my-8"
        >
          {/* Header */}
          <div className="text-center ">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="flex justify-center mb-2"
            >
              <img src={Becults} alt="Becults Logo" className="w-1/2 h-auto rounded-full shadow-lg" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Create Account
            </h1>
            <p className="text-slate-400 text-lg mb-5">Join us and start building amazing things</p>
          </div>

          {/* SignUp Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 space-y-5 shadow-2xl"
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

            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

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
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-700">
                    <div
                      className={`h-full rounded-full transition-all ${
                        passwordStrength === 'strong'
                          ? 'w-full bg-green-500'
                          : passwordStrength === 'medium'
                          ? 'w-2/3 bg-yellow-500'
                          : 'w-1/3 bg-red-500'
                      }`}
                    />
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap capitalize">
                    {passwordStrength}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && password === confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start gap-3 cursor-pointer group pt-2">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer mt-0.5"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                I agree to the{' '}
                <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-indigo-600 hover:to-indigo-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/50 hover:shadow-indigo-500/20 disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-slate-400">Or sign up with</span>
              </div>
            </div>

            {/* Social Sign Up Buttons */}
            <div className="flex flex-row gap-2">
              <div id="google-signup-button" className="w-full"></div>
              <motion.button
                type="button"
                onClick={handleGitHubSignUp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-slate-800/50 border border-slate-700 hover:border-slate-600 hover:bg-slate-800  py-2 mb-1 transition-all font-medium text-white"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </motion.button>
            </div>
          </motion.form>

          {/* Login Link */}
          <motion.p
            className="text-center text-slate-400 text-sm mt-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Sign in here
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}