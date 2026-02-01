import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function GitHubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [redirectCountdown, setRedirectCountdown] = useState(0);
  const hasExecuted = useRef(false); // Prevent double execution in StrictMode

  useEffect(() => {
    // Prevent double execution in development StrictMode
    if (hasExecuted.current) {
      console.log('[GitHub Callback] Skipping duplicate execution (StrictMode)');
      return;
    }
    hasExecuted.current = true;

    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');

        console.log('[GitHub Callback] Processing callback...');

        if (errorParam) {
          const errorMsg = searchParams.get('error_description') || 'Authentication was cancelled';
          console.error('[GitHub Callback] GitHub returned error:', errorMsg);
          setError(errorMsg);
          setStatus('error');
          startRedirectCountdown('/login');
          return;
        }

        if (!code) {
          console.error('[GitHub Callback] No authorization code received');
          setError('No authorization code received from GitHub');
          setStatus('error');
          startRedirectCountdown('/login');
          return;
        }

        console.log('[GitHub Callback] Code received, exchanging for token...');

        // Exchange code for access token via backend
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/oauth/github/callback`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          }
        );

        console.log('[GitHub Callback] Response status:', response.status);
        const data = await response.json();
        console.log('[GitHub Callback] Response data:', { success: data.success, message: data.message });

        if (data.success) {
          console.log('[GitHub Callback] Authentication successful');
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setStatus('success');
          console.log('[GitHub Callback] Redirecting to home...');
          setTimeout(() => navigate('/home'), 1500);
        } else {
          console.error('[GitHub Callback] Authentication failed:', data.message);
          setError(data.message || 'Authentication failed');
          setStatus('error');
          startRedirectCountdown('/login');
        }
      } catch (error) {
        console.error('[GitHub Callback] Error:', error);
        setError(error.message || 'An error occurred during authentication');
        setStatus('error');
        startRedirectCountdown('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const startRedirectCountdown = (path) => {
    let count = 3;
    setRedirectCountdown(count);
    const interval = setInterval(() => {
      count--;
      setRedirectCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        navigate(path);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center"
      >
        {status === 'loading' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="w-16 h-16 border-4 border-blue-600 border-t-purple-600 rounded-full mx-auto mb-6"
            ></motion.div>
            <h2 className="text-2xl font-bold mb-2">Signing you in...</h2>
            <p className="text-slate-400">Please wait while we authenticate your GitHub account</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-green-400" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2 text-green-400">Authentication Successful!</h2>
            <p className="text-slate-400">You are being redirected to your dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <AlertCircle className="w-8 h-8 text-red-400" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2 text-red-400">Authentication Failed</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6 text-left">
              <p className="text-xs text-slate-400 mb-3 font-semibold">Quick Fixes:</p>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>✓ Check backend is running: <code className="bg-slate-900 px-2 py-1 rounded">npm run dev</code></li>
                <li>✓ Backend must have `.env` with GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET</li>
                <li>✓ Make GitHub email public: Settings → Email (uncheck "Keep private")</li>
                <li>✓ Verify GitHub Callback URL: http://localhost:5173/auth/github/callback</li>
                <li>✓ Restart backend after changing .env file</li>
              </ul>
              <p className="text-xs text-slate-500 mt-4 border-t border-slate-600 pt-3">
                📚 Full guide: docs/GITHUB_OAUTH_401_FIX.md
              </p>
            </div>
            <p className="text-slate-500 text-sm">
              Redirecting to login in {redirectCountdown} seconds...
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
