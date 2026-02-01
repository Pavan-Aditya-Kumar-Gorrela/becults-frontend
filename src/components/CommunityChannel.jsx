import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader, AlertCircle, Users, Clock } from 'lucide-react';
import ChannelAdminPanel from './ChannelAdminPanel';
import { channelAPI } from '../services/api';
import socketService from '../services/socketService';

export default function CommunityChannel({ channelKey, cohortId, title = 'Community' }) {
  const [messages, setMessages] = useState([]);
  const [channelInfo, setChannelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Use channelKey if provided, otherwise construct from cohortId
  const actualChannelKey = channelKey || (cohortId ? `cohort-${cohortId}` : null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    socketService.connect();
  }, []);

  // Fetch channel info and messages
  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true);

        // Fetch channel info
        const infoData = await channelAPI.getChannelInfo(actualChannelKey);
        setChannelInfo(infoData.data);

        // Fetch messages
        const messagesData = await channelAPI.getChannelMessages(actualChannelKey, 50, 0);
        setMessages(messagesData.data || []);

        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching channel data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (actualChannelKey) {
      fetchChannelData();
      // Join channel via socket
      socketService.joinChannel(actualChannelKey, currentUser._id);
      setOnlineUsers(new Set([currentUser._id]));
    }

    return () => {
      if (actualChannelKey) {
        socketService.leaveChannel(actualChannelKey, currentUser._id);
      }
    };
  }, [actualChannelKey, currentUser._id]);

  // Socket listeners for real-time messaging
  useEffect(() => {
    socketService.onNewMessage((messageData) => {
      setMessages((prev) => [...prev, messageData]);
      scrollToBottom();
    });

    socketService.onUserJoined((data) => {
      setOnlineUsers((prev) => new Set([...prev, data.userId]));
    });

    socketService.onUserLeft((data) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    socketService.onUserTyping((data) => {
      setTypingUsers((prev) => new Set([...prev, data.userId]));
    });

    socketService.onUserStopTyping((data) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    return () => {
      socketService.removeListener('new-message');
      socketService.removeListener('user-joined');
      socketService.removeListener('user-left');
      socketService.removeListener('user-typing');
      socketService.removeListener('user-stop-typing');
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      setSending(true);

      const data = await channelAPI.sendMessage(actualChannelKey, newMessage);
      
      // Emit via socket for real-time delivery
      socketService.sendMessage(actualChannelKey, data.data);
      
      setMessages([...messages, data.data]);
      setNewMessage('');
      socketService.emitStopTyping(actualChannelKey, currentUser._id);
    } catch (err) {
      console.error('Error sending message:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    socketService.emitTyping(actualChannelKey, currentUser._id, currentUser.fullName);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emitStopTyping(actualChannelKey, currentUser._id);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-b from-slate-900/50 to-slate-950/50 rounded-lg border border-slate-700">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
          <Loader className="w-8 h-8 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    const isChannelNotFound = error.includes('not found') || error.includes('404');
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-lg p-6 flex items-start gap-4 border ${
          isChannelNotFound
            ? 'bg-blue-900/20 border-blue-800'
            : 'bg-red-900/20 border-red-800'
        }`}
      >
        <AlertCircle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
          isChannelNotFound ? 'text-blue-500' : 'text-red-500'
        }`} />
        <div>
          <p className={`font-semibold ${isChannelNotFound ? 'text-blue-300' : 'text-red-300'}`}>
            {isChannelNotFound ? 'Community Channel Not Yet Created' : 'Unable to Load Community Channel'}
          </p>
          <p className={`text-sm mt-1 ${isChannelNotFound ? 'text-blue-400' : 'text-red-400'}`}>
            {isChannelNotFound
              ? 'The community channel for this cohort hasn\'t been set up yet. Please ask an admin to create it.'
              : error}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-b from-slate-900/50 to-slate-950/50 rounded-lg border border-slate-700 overflow-hidden flex flex-col h-[600px]"
    >
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur border-b border-slate-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-xs text-slate-400">{onlineUsers.size} online</p>
          </div>
        </div>
        
        {currentUser.isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
              showAdminPanel
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Admin
          </motion.button>
        )}
      </div>

      {/* Admin Panel */}
      {showAdminPanel && currentUser.isAdmin && channelInfo && (
        <ChannelAdminPanel
          channelKey={actualChannelKey}
          members={channelInfo.members}
          onMemberUpdate={(updatedMembers) =>
            setChannelInfo({ ...channelInfo, members: updatedMembers })
          }
        />
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={msg._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${msg.sender._id === currentUser._id ? 'justify-end' : ''}`}
            >
              {msg.sender._id !== currentUser._id && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {msg.sender.fullName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              
              <div className={`max-w-xs ${msg.sender._id === currentUser._id ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold ${
                    msg.sender._id === currentUser._id ? 'text-blue-400' : 'text-slate-300'
                  }`}>
                    {msg.sender.fullName}
                  </span>
                  <span className="text-xs text-slate-500">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                <div className={`px-3 py-2 rounded-lg text-sm break-words ${
                  msg.sender._id === currentUser._id
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-700 text-slate-100 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>

              {msg.sender._id === currentUser._id && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {msg.sender.fullName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {typingUsers.size > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs text-slate-400"
            >
              <span className="font-medium">
                {Array.from(typingUsers)
                  .slice(0, 2)
                  .map((uid) => {
                    const user = messages.find((m) => m.sender._id === uid)?.sender;
                    return user?.fullName?.split(' ')[0] || 'User';
                  })
                  .join(', ')}
              </span>
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                is typing...
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-800/80 backdrop-blur border-t border-slate-700 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              rows="2"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send
          </motion.button>
        </form>

        {/* Online Users Info */}
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
          <Users className="w-3 h-3" />
          <span>{onlineUsers.size} {onlineUsers.size === 1 ? 'person' : 'people'} online</span>
        </div>
      </div>
    </motion.div>
  );
}
