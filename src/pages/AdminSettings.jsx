import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, AlertCircle, UserPlus, Mail, Lock, User, CheckCircle, X } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { adminAPI } from '../services/api';

export default function AdminSettings() {
  const [inviteForm, setInviteForm] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [isInviting, setIsInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState({ type: '', text: '' });

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    
    if (!inviteForm.email || !inviteForm.password) {
      setInviteMessage({
        type: 'error',
        text: 'Please provide email and password',
      });
      return;
    }

    if (inviteForm.password.length < 6) {
      setInviteMessage({
        type: 'error',
        text: 'Password must be at least 6 characters long',
      });
      return;
    }

    setIsInviting(true);
    setInviteMessage({ type: '', text: '' });

    try {
      const response = await adminAPI.inviteAdmin(
        inviteForm.email,
        inviteForm.password,
        inviteForm.fullName || undefined
      );

      if (response.success) {
        setInviteMessage({
          type: 'success',
          text: `Admin invitation sent successfully to ${inviteForm.email}`,
        });
        setInviteForm({ email: '', password: '', fullName: '' });
      }
    } catch (error) {
      setInviteMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Failed to send admin invitation',
      });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-slate-400">Configure system settings and manage administrators</p>
          </motion.div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Admin Invitation Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-blue-400" />
                Invite New Admin
              </h2>
              <p className="text-slate-400 mb-6">
                Send an invitation email to a new administrator. They will receive their login credentials via email.
              </p>

              {/* Success/Error Messages */}
              {inviteMessage.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                    inviteMessage.type === 'success'
                      ? 'bg-green-900/20 border border-green-800 text-green-400'
                      : 'bg-red-900/20 border border-red-800 text-red-400'
                  }`}
                >
                  {inviteMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 flex-shrink-0" />
                  )}
                  <p className="text-sm">{inviteMessage.text}</p>
                </motion.div>
              )}

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      placeholder="admin@example.com"
                      required
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={inviteForm.fullName}
                      onChange={(e) => setInviteForm({ ...inviteForm, fullName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password *
                  </label>
                  <input
                    type="password"
                    value={inviteForm.password}
                    onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    required
                    minLength={6}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <p className="text-xs text-slate-400 mt-1">This password will be sent to the admin via email</p>
                </div>
                <motion.button
                  type="submit"
                  disabled={isInviting}
                  whileHover={{ scale: isInviting ? 1 : 1.02 }}
                  whileTap={{ scale: isInviting ? 1 : 0.98 }}
                  className={`w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    isInviting ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-purple-700'
                  }`}
                >
                  {isInviting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Invitation...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Send Admin Invitation
                    </>
                  )}
                </motion.button>
              </form>

              {/* Info Box */}
              <div className="mt-6 bg-blue-900/20 border border-blue-800 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-200">
                  <p className="font-semibold mb-1">Important Notes:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-300/80">
                    <li>The invitation email will contain the login credentials</li>
                    <li>The new admin should change their password after first login</li>
                    <li>Make sure the email address is correct and accessible</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* General Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6" />
                General Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Platform Name</label>
                  <input
                    type="text"
                    defaultValue="Becults"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Admin Email</label>
                  <input
                    type="email"
                    defaultValue="admin@becults.com"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Support Email</label>
                  <input
                    type="email"
                    defaultValue="support@becults.com"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* API Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-6">API Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">API URL</label>
                  <input
                    type="text"
                    defaultValue="http://localhost:5000/api"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">API Key</label>
                  <input
                    type="password"
                    defaultValue="••••••••••••"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition"
            >
              <Save className="w-5 h-5" />
              Save Settings
            </motion.button>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 10 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-200 text-sm">
              ⚠️ Changes to settings may affect system performance. Please review carefully before saving.
            </p>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
