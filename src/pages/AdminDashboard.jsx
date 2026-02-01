import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Clock, AlertCircle, BookOpen } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { adminAPI } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Fetch dashboard stats
        const response = await adminAPI.getDashboard();
        if (response.success) {
          setStats(response.stats);
        }
      } catch (err) {
        setError('Failed to load admin dashboard');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full"></div>
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-slate-400">Manage your platform and monitor statistics</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 mb-8 flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                {error}
              </motion.div>
            )}

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats && [
                {
                  title: 'Total Users',
                  value: stats.totalUsers,
                  icon: Users,
                  color: 'from-blue-600 to-cyan-600',
                },
                {
                  title: 'Total Admins',
                  value: stats.totalAdmins,
                  icon: AlertCircle,
                  color: 'from-purple-600 to-pink-600',
                },
                {
                  title: 'Active Logins',
                  value: stats.activeLogins,
                  icon: Activity,
                  color: 'from-green-600 to-emerald-600',
                },
                {
                  title: 'Pending Requests',
                  value: stats.pendingRequests,
                  icon: Clock,
                  color: 'from-yellow-600 to-orange-600',
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ translateY: -5 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm mb-2">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
              >
                <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold">User Activity {item}</p>
                          <p className="text-slate-400 text-sm">2 hours ago</p>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
              >
                <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/admin/cohorts')}
                    className="w-full px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg font-semibold transition-colors text-left flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Manage Cohorts
                  </button>
                  <button className="w-full px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg font-semibold transition-colors text-left">
                    View Reports
                  </button>
                  <button className="w-full px-4 py-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg font-semibold transition-colors text-left">
                    Settings
                  </button>
                  <button className="w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg font-semibold transition-colors text-left">
                    System Logs
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Admin Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-4">System Status</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Platform Status</p>
                  <p className="text-lg font-semibold text-green-400">Online</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">Database</p>
                  <p className="text-lg font-semibold text-green-400">Connected</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">API Status</p>
                  <p className="text-lg font-semibold text-green-400">Active</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      </AdminLayout>
    );
}
