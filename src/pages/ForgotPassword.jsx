import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft, Check, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  // Simulate OTP timer
  const startTimer = () => {
    setTimer(60);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle email verification
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate API call to send OTP
    setTimeout(() => {
      console.log('OTP sent to:', email);
      setSuccess('Verification code sent to your email');
      setStep(2);
      startTimer();
      setIsLoading(false);
    }, 1500);
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);

    // Simulate API call to verify OTP
    setTimeout(() => {
      console.log('OTP verified:', otpString);
      setSuccess('Code verified successfully');
      setStep(3);
      setIsLoading(false);
    }, 1500);
  };

  // Handle password reset
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    // Simulate API call to reset password
    setTimeout(() => {
      console.log('Password reset for:', email);
      setSuccess('Password reset successfully!');
      setIsLoading(false);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 1500);
  };

  // Handle go back
  const handleGoBack = () => {
    if (step > 1) {
      setError('');
      setSuccess('');
      setStep(step - 1);
    } else {
      navigate('/login');
    }
  };

  const handleResendOtp = () => {
    setError('');
    setSuccess('');
    startTimer();
    // Simulate resending OTP
    console.log('OTP resent to:', email);
    setSuccess('Verification code resent to your email');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white pt-20 pb-20">
        <div className="max-w-md mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Reset Password</h1>
              <p className="text-slate-400">
                {step === 1 && 'Enter your email address'}
                {step === 2 && 'Enter the verification code'}
                {step === 3 && 'Create your new password'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map((num) => (
                <motion.div
                  key={num}
                  className={`flex-1 h-1 rounded-full transition-all ${
                    num <= step ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.3, delay: num * 0.1 }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Email Verification */}
              {step === 1 && (
                <motion.form
                  key="step1"
                  onSubmit={handleEmailSubmit}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {error && (
                    <motion.div
                      className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Check className="w-5 h-5" />
                      {success}
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      We'll send a verification code to this email
                    </p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    {isLoading ? 'Sending...' : 'Send Code'}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="text-slate-400 hover:text-slate-200 transition flex items-center justify-center gap-2 mx-auto"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to login
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Step 2: OTP Verification */}
              {step === 2 && (
                <motion.form
                  key="step2"
                  onSubmit={handleOtpSubmit}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {error && (
                    <motion.div
                      className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Check className="w-5 h-5" />
                      {success}
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Verification Code</label>
                    <p className="text-xs text-slate-400 mb-4">Enter the 6-digit code sent to {email}</p>
                    
                    <div className="flex gap-3 justify-center">
                      {otp.map((digit, index) => (
                        <motion.input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          className="w-12 h-12 bg-slate-700/50 border border-slate-600 rounded-lg text-center text-white text-lg font-bold focus:border-indigo-500 focus:outline-none transition"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Timer */}
                  {timer > 0 ? (
                    <div className="text-center text-sm text-slate-400 flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      Resend code in {timer}s
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="w-full text-center text-indigo-400 hover:text-indigo-300 transition text-sm font-medium"
                    >
                      Didn't receive the code? Resend
                    </button>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="text-slate-400 hover:text-slate-200 transition flex items-center justify-center gap-2 mx-auto"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <motion.form
                  key="step3"
                  onSubmit={handlePasswordSubmit}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {error && (
                    <motion.div
                      className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Check className="w-5 h-5" />
                      {success}
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Must be at least 6 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {newPassword && confirmPassword && newPassword === confirmPassword && (
                    <motion.div
                      className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Check className="w-5 h-5" />
                      Passwords match
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="text-slate-400 hover:text-slate-200 transition flex items-center justify-center gap-2 mx-auto"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
