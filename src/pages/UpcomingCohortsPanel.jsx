import { motion } from 'framer-motion';
import { Clock, Plus, AlertCircle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

export default function UpcomingCohortsPanel() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">Upcoming Cohorts</h1>
            <p className="text-slate-400">Schedule and manage upcoming cohorts</p>
          </motion.div>

          {/* Create Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-8 flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
          >
            <Plus className="w-5 h-5" />
            Schedule New Cohort
          </motion.button>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center"
          >
            <Clock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Upcoming Cohorts</h3>
            <p className="text-slate-400 mb-6">Schedule your first upcoming cohort to get started</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Schedule Cohort
            </motion.button>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 10 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-blue-900/20 border border-blue-800 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <p className="text-blue-200 text-sm">
              💡 Upcoming cohorts allow you to schedule new learning programs in advance and manage enrollment.
            </p>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
