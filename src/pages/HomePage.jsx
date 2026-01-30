import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, Home } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { authAPI } from '../services/api';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await authAPI.getCurrentUser();
        if (response.success) {
          setUser(response.user);
          // Update localStorage with latest user data
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      setError('Logout failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            {/* Welcome Card */}
            <motion.div
              whileHover={{ translateY: -5 }}
              className="md:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome, {user?.fullName}!</h1>
                  <p className="text-slate-400">{user?.email}</p>
                </div>
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 mb-4">
                  {error}
                </div>
              )}
              <p className="text-slate-300 mb-6">
                You're now logged in to your BeCults account. Explore our amazing features and services.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/profile"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              whileHover={{ translateY: -5 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold mb-6">Account Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Auth Provider</p>
                  <p className="text-lg font-semibold capitalize">{user?.authProvider || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Member Since</p>
                  <p className="text-lg font-semibold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Account Type</p>
                  <p className="text-lg font-semibold">{user?.isAdmin ? 'Admin' : 'User'}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-8">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Edit Profile',
                  description: 'Update your personal information',
                  icon: User,
                  link: '/profile',
                  color: 'from-blue-600 to-cyan-600',
                },
                {
                  title: 'Dashboard',
                  description: 'View your statistics and activity',
                  icon: Home,
                  link: '/dashboard',
                  color: 'from-purple-600 to-pink-600',
                },
                {
                  title: 'Settings',
                  description: 'Manage your account preferences',
                  icon: Home,
                  link: '/settings',
                  color: 'from-indigo-600 to-blue-600',
                },
              ].map((action, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ translateY: -5 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{action.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{action.description}</p>
                  <Link
                    to={action.link}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm"
                  >
                    Go to {action.title} →
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
