import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Activity, Clock, AlertCircle, BookOpen, GraduationCap, TrendingUp, Settings, BarChart3 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { adminAPI } from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [systemStatus, setSystemStatus] = useState({
    platform: 'checking',
    database: 'checking',
    api: 'checking',
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Fetch dashboard stats
        const response = await adminAPI.getDashboard();
        if (response.success) {
          setDashboardData(response);
          // Update system status based on successful API call
          setSystemStatus({
            platform: 'online',
            database: 'connected',
            api: 'active',
          });
        }
      } catch (err) {
        setError('Failed to load admin dashboard');
        console.error(err);
        setSystemStatus({
          platform: 'offline',
          database: 'disconnected',
          api: 'inactive',
        });
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
              <p className="text-slate-400">
                Welcome back, {dashboardData?.admin?.name || 'Admin'} • Manage your platform and monitor statistics
              </p>
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
              {dashboardData?.stats && [
                {
                  title: 'Total Users',
                  value: dashboardData.stats.totalUsers || 0,
                  icon: Users,
                  color: 'from-blue-600 to-cyan-600',
                },
                {
                  title: 'Total Admins',
                  value: dashboardData.stats.totalAdmins || 0,
                  icon: AlertCircle,
                  color: 'from-purple-600 to-pink-600',
                },
                {
                  title: 'Total Cohorts',
                  value: dashboardData.stats.totalCohorts || 0,
                  icon: GraduationCap,
                  color: 'from-green-600 to-emerald-600',
                },
                {
                  title: 'Total Enrollments',
                  value: dashboardData.stats.totalEnrollments || 0,
                  icon: TrendingUp,
                  color: 'from-yellow-600 to-orange-600',
                },
                {
                  title: 'Active Cohorts',
                  value: dashboardData.stats.activeCohorts || 0,
                  icon: Activity,
                  color: 'from-indigo-600 to-purple-600',
                },
                {
                  title: 'Upcoming Cohorts',
                  value: dashboardData.stats.upcomingCohorts || 0,
                  icon: Clock,
                  color: 'from-pink-600 to-rose-600',
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
                  {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
                    dashboardData.recentActivity.map((activity, idx) => {
                      const getActivityIcon = () => {
                        if (activity.type === 'cohort') return GraduationCap;
                        if (activity.type === 'user') return Users;
                        return Activity;
                      };
                      const getActivityColor = () => {
                        if (activity.type === 'cohort') return 'from-indigo-600 to-purple-600';
                        if (activity.type === 'user') return 'from-blue-600 to-cyan-600';
                        return 'from-green-600 to-emerald-600';
                      };
                      const Icon = getActivityIcon();
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-10 h-10 bg-gradient-to-br ${getActivityColor()} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate">{activity.title}</p>
                              <p className="text-slate-400 text-sm truncate">{activity.description}</p>
                              <p className="text-slate-500 text-xs mt-1">{activity.timeAgo}</p>
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 ml-2"></div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No recent activity</p>
                    </div>
                  )}
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
                  <button
                    onClick={() => navigate('/admin/upcoming-cohorts')}
                    className="w-full px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg font-semibold transition-colors text-left flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Upcoming Cohorts
                  </button>
                  <button
                    onClick={() => navigate('/admin/cohorts')}
                    className="w-full px-4 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg font-semibold transition-colors text-left flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Reports
                  </button>
                  <button
                    onClick={() => navigate('/admin/cohorts')}
                    className="w-full px-4 py-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg font-semibold transition-colors text-left flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </div>
              </motion.div>
            </div>

            {/* System Status */}
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
                  <p className={`text-lg font-semibold ${
                    systemStatus.platform === 'online' ? 'text-green-400' : 
                    systemStatus.platform === 'checking' ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {systemStatus.platform === 'online' ? 'Online' : 
                     systemStatus.platform === 'checking' ? 'Checking...' : 
                     'Offline'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">Database</p>
                  <p className={`text-lg font-semibold ${
                    systemStatus.database === 'connected' ? 'text-green-400' : 
                    systemStatus.database === 'checking' ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {systemStatus.database === 'connected' ? 'Connected' : 
                     systemStatus.database === 'checking' ? 'Checking...' : 
                     'Disconnected'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">API Status</p>
                  <p className={`text-lg font-semibold ${
                    systemStatus.api === 'active' ? 'text-green-400' : 
                    systemStatus.api === 'checking' ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {systemStatus.api === 'active' ? 'Active' : 
                     systemStatus.api === 'checking' ? 'Checking...' : 
                     'Inactive'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      </AdminLayout>
    );
}
