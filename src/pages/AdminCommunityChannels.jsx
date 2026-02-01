import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, Plus, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { channelAPI } from '../services/api';

export default function AdminCommunityChannels() {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch all cohorts with channel status
  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        setLoading(true);
        const data = await channelAPI.getAllCohortsForChannels();
        setCohorts(data.data || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch cohorts');
        console.error('Error fetching cohorts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCohorts();
  }, []);

  // Create channel for a cohort
  const handleCreateChannel = async (cohortId, cohortTitle) => {
    try {
      setCreating(cohortId);
      await channelAPI.createChannel(cohortId);

      // Refetch cohorts to get updated channel status from backend
      const data = await channelAPI.getAllCohortsForChannels();
      setCohorts(data.data || []);

      setSuccessMessage(`Community channel created for ${cohortTitle}`);
      setTimeout(() => setSuccessMessage(null), 3000);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to create channel');
      console.error('Error creating channel:', err);
    } finally {
      setCreating(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
            <Loader className="w-8 h-8 text-blue-500" />
          </motion.div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Community Channels</h1>
          </div>
          <p className="text-slate-400">Create and manage community channels for each cohort</p>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 bg-green-900/20 border border-green-800 rounded-lg p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-300">{successMessage}</p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Cohorts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cohorts.map((cohort) => (
            <motion.div
              key={cohort._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition"
            >
              {/* Card Header */}
              <div
                className={`p-4 border-b ${
                  cohort.hasChannel
                    ? 'border-green-800 bg-green-900/10'
                    : 'border-slate-700 bg-slate-900/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">{cohort.title}</h3>
                  {cohort.hasChannel && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-2">{cohort.category}</p>
                <p className="text-sm text-slate-300 line-clamp-2">{cohort.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                {/* Enrollment Count */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Members Enrolled:</span>
                  <span className="text-sm font-semibold text-white">
                    {cohort.enrolledUsers?.length || 0}
                  </span>
                </div>

                {/* Channel Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Channel Status:</span>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      cohort.hasChannel
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-slate-700/50 text-slate-400'
                    }`}
                  >
                    {cohort.hasChannel ? '✓ Created' : 'Not Created'}
                  </span>
                </div>

                {/* Created By */}
                {cohort.createdBy && (
                  <div className="text-xs text-slate-500">
                    Created by: {cohort.createdBy.fullName}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-4 border-t border-slate-700 bg-slate-900/30">
                {cohort.hasChannel ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled
                    className="w-full px-4 py-2 bg-green-600/20 text-green-300 rounded-lg font-semibold text-sm cursor-default opacity-75"
                  >
                    Channel Active
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCreateChannel(cohort._id, cohort.title)}
                    disabled={creating === cohort._id}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {creating === cohort._id ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Channel
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {cohorts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-lg">No cohorts found</p>
            <p className="text-slate-500">Create some cohorts first to set up community channels</p>
          </motion.div>
        )}

        {/* Summary Stats */}
        {cohorts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Total Cohorts */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">Total Cohorts</p>
              <p className="text-3xl font-bold text-white">{cohorts.length}</p>
            </div>

            {/* Active Channels */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">Active Channels</p>
              <p className="text-3xl font-bold text-green-400">
                {cohorts.filter((c) => c.hasChannel).length}
              </p>
            </div>

            {/* To Create */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">To Create</p>
              <p className="text-3xl font-bold text-blue-400">
                {cohorts.filter((c) => !c.hasChannel).length}
              </p>
            </div>
          </motion.div>
        )}
      </div>
      </div>
    </AdminLayout>
  );
}