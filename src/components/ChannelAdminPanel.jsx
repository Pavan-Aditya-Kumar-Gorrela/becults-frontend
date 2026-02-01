import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader, Trash2, Volume2, VolumeX } from 'lucide-react';
import { channelAPI } from '../services/api';

export default function ChannelAdminPanel({ channelKey, members, onMemberUpdate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMuteUser = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      await channelAPI.muteUser(channelKey, userId);

      // Update local state
      const updatedMembers = members.map((m) =>
        m.user._id === userId ? { ...m, canChat: false, mutedAt: new Date() } : m
      );
      onMemberUpdate(updatedMembers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnmuteUser = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      await channelAPI.unmuteUser(channelKey, userId);

      // Update local state
      const updatedMembers = members.map((m) =>
        m.user._id === userId ? { ...m, canChat: true, mutedAt: null } : m
      );
      onMemberUpdate(updatedMembers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!confirm('Are you sure you want to remove this user from the channel?')) return;

    try {
      setLoading(true);
      setError(null);

      await channelAPI.removeUserFromChannel(channelKey, userId);

      // Update local state
      const updatedMembers = members.filter((m) => m.user._id !== userId);
      onMemberUpdate(updatedMembers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-purple-900/20 border border-purple-800 rounded-lg p-4 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-purple-200">Channel Management</h3>
        <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-1 rounded">
          {members.length} members
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* Members List */}
      <div className="max-h-48 overflow-y-auto space-y-2">
        {members.map((member) => (
          <motion.div
            key={member.user._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 rounded-lg p-3 flex items-center justify-between"
          >
            {/* User Info */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <img
                src={member.user.profileImage || 'https://via.placeholder.com/32'}
                alt={member.user.fullName}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {member.user.fullName}
                </p>
                <p className="text-xs text-slate-400 truncate">{member.user.email}</p>
              </div>
              {!member.canChat && (
                <span className="text-xs bg-red-600/30 text-red-300 px-2 py-1 rounded flex-shrink-0">
                  Muted
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-1 ml-2 flex-shrink-0">
              {/* Mute/Unmute Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  member.canChat
                    ? handleMuteUser(member.user._id)
                    : handleUnmuteUser(member.user._id)
                }
                disabled={loading}
                title={member.canChat ? 'Mute user' : 'Unmute user'}
                className={`p-1.5 rounded transition ${
                  member.canChat
                    ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                    : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                } disabled:opacity-50`}
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : member.canChat ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </motion.button>

              {/* Remove Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRemoveUser(member.user._id)}
                disabled={loading}
                title="Remove user from channel"
                className="p-1.5 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {members.length === 0 && (
        <div className="text-center py-4">
          <p className="text-xs text-slate-400">No members in this channel yet</p>
        </div>
      )}
    </motion.div>
  );
}
