import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader, AlertCircle, Users, MessageSquare, Shield } from 'lucide-react';
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
  const actualChannelKey = channelKey || (cohortId ? `cohort-${cohortId}` : null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => { socketService.connect(); }, []);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true);
        const [infoData, messagesData] = await Promise.all([
          channelAPI.getChannelInfo(actualChannelKey),
          channelAPI.getChannelMessages(actualChannelKey, 50, 0),
        ]);
        setChannelInfo(infoData.data);
        setMessages(messagesData.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (actualChannelKey) {
      fetchChannelData();
      socketService.joinChannel(actualChannelKey, currentUser._id);
      setOnlineUsers(new Set([currentUser._id]));
    }
    return () => { if (actualChannelKey) socketService.leaveChannel(actualChannelKey, currentUser._id); };
  }, [actualChannelKey, currentUser._id]);

  useEffect(() => {
    socketService.onNewMessage((msg) => { setMessages((p) => [...p, msg]); scrollToBottom(); });
    socketService.onUserJoined((d) => setOnlineUsers((p) => new Set([...p, d.userId])));
    socketService.onUserLeft((d) => setOnlineUsers((p) => { const s = new Set(p); s.delete(d.userId); return s; }));
    socketService.onUserTyping((d) => setTypingUsers((p) => new Set([...p, d.userId])));
    socketService.onUserStopTyping((d) => setTypingUsers((p) => { const s = new Set(p); s.delete(d.userId); return s; }));
    return () => ['new-message','user-joined','user-left','user-typing','user-stop-typing'].forEach(e => socketService.removeListener(e));
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      setSending(true);
      const data = await channelAPI.sendMessage(actualChannelKey, newMessage);
      socketService.sendMessage(actualChannelKey, data.data);
      setMessages([...messages, data.data]);
      setNewMessage('');
      socketService.emitStopTyping(actualChannelKey, currentUser._id);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    socketService.emitTyping(actualChannelKey, currentUser._id, currentUser.fullName);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => socketService.emitStopTyping(actualChannelKey, currentUser._id), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }
  };

  /* ── Avatar ── */
  function Avatar({ name, isSelf }) {
    const initials = name?.[0]?.toUpperCase() || 'U';
    return (
      <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold font-mono
        ${isSelf ? 'bg-[#1f6feb]/20 border border-[#1f6feb]/30 text-[#58a6ff]' : 'bg-[#21262d] border border-[#30363d] text-[#7d8590]'}`}>
        {initials}
      </div>
    );
  }

  /* ── Loading ── */
  if (loading) return (
    <div className="flex items-center justify-center h-96 bg-[#0d1117] border border-[#21262d] rounded-2xl">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-2 border-[#1f6feb]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#58a6ff] animate-spin" />
        </div>
        <p className="text-[#7d8590] text-xs font-mono uppercase tracking-widest">Loading channel...</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) {
    const isNotFound = error.includes('not found') || error.includes('404');
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className={`flex items-start gap-4 p-5 rounded-2xl border ${
          isNotFound
            ? 'bg-[#58a6ff]/5 border-[#58a6ff]/15'
            : 'bg-[#f85149]/5 border-[#f85149]/15'
        }`}>
        <div className={`p-2 rounded-xl shrink-0 ${isNotFound ? 'bg-[#58a6ff]/10' : 'bg-[#f85149]/10'}`}>
          <AlertCircle className={`w-5 h-5 ${isNotFound ? 'text-[#58a6ff]' : 'text-[#f85149]'}`} />
        </div>
        <div>
          <p className={`text-sm font-semibold mb-1 ${isNotFound ? 'text-[#79c0ff]' : 'text-[#f85149]'}`}>
            {isNotFound ? 'Channel not set up yet' : 'Unable to load channel'}
          </p>
          <p className="text-xs font-mono text-[#7d8590] leading-relaxed">
            {isNotFound
              ? "The community channel for this cohort hasn't been created yet. Ask an admin to set it up."
              : error}
          </p>
        </div>
      </motion.div>
    );
  }

  /* ── Main ── */
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="bg-[#0d1117] border border-[#21262d] rounded-2xl overflow-hidden flex flex-col h-[600px]">

      {/* ── Channel header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#21262d] bg-[#0d1117] shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 bg-[#3fb950]/10 border border-[#3fb950]/20 rounded-xl">
              <MessageSquare className="w-4 h-4 text-[#3fb950]" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#3fb950] border-2 border-[#0d1117]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#e6edf3]">{title}</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]" />
              <p className="text-[10px] font-mono text-[#7d8590]">
                {onlineUsers.size} online
              </p>
            </div>
          </div>
        </div>

        {currentUser.isAdmin && (
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              showAdminPanel
                ? 'bg-[#d29922]/10 border-[#d29922]/30 text-[#d29922]'
                : 'bg-[#0d1117] border-[#21262d] text-[#7d8590] hover:text-[#e6edf3] hover:border-[#30363d]'
            }`}>
            <Shield className="w-3.5 h-3.5" />
            admin
          </button>
        )}
      </div>

      {/* Admin panel */}
      {showAdminPanel && currentUser.isAdmin && channelInfo && (
        <ChannelAdminPanel
          channelKey={actualChannelKey}
          members={channelInfo.members}
          onMemberUpdate={(updatedMembers) => setChannelInfo({ ...channelInfo, members: updatedMembers })}
        />
      )}

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
            <MessageSquare className="w-10 h-10 text-[#30363d]" />
            <p className="text-xs font-mono text-[#7d8590]">No messages yet — be the first!</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isSelf = msg.sender._id === currentUser._id;
            const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const showAvatar = index === 0 || messages[index - 1]?.sender._id !== msg.sender._id;

            return (
              <motion.div
                key={msg._id || index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-end gap-2 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar spacer or avatar */}
                <div className="w-7 shrink-0">
                  {showAvatar ? <Avatar name={msg.sender.fullName} isSelf={isSelf} /> : null}
                </div>

                <div className={`flex flex-col max-w-[70%] gap-1 ${isSelf ? 'items-end' : 'items-start'}`}>
                  {showAvatar && (
                    <div className={`flex items-center gap-2 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className={`text-[11px] font-mono font-semibold ${isSelf ? 'text-[#58a6ff]' : 'text-[#7d8590]'}`}>
                        {isSelf ? 'You' : msg.sender.fullName}
                      </span>
                      <span className="text-[10px] font-mono text-[#484f58]">{time}</span>
                    </div>
                  )}

                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                    isSelf
                      ? 'bg-[#1f6feb]/15 border border-[#1f6feb]/25 text-[#e6edf3] rounded-br-sm'
                      : 'bg-[#161b22] border border-[#21262d] text-[#c9d1d9] rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {typingUsers.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="flex items-center gap-2 pl-9"
            >
              <div className="flex gap-1 px-3 py-2 bg-[#161b22] border border-[#21262d] rounded-2xl rounded-bl-sm">
                {[0, 0.2, 0.4].map((delay) => (
                  <motion.span key={delay}
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay }}
                    className="w-1.5 h-1.5 rounded-full bg-[#7d8590] block" />
                ))}
              </div>
              <span className="text-[10px] font-mono text-[#484f58]">
                {Array.from(typingUsers).slice(0, 2)
                  .map(uid => messages.find(m => m.sender._id === uid)?.sender?.fullName?.split(' ')[0] || 'Someone')
                  .join(', ')} typing...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="px-4 py-4 border-t border-[#21262d] bg-[#0d1117] shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
              onKeyDown={handleKeyDown}
              placeholder="Send a message... (Enter to send, Shift+Enter for newline)"
              rows="2"
              className="w-full bg-[#010409] border border-[#21262d] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/20 rounded-xl px-4 py-3 text-sm text-[#e6edf3] placeholder-[#484f58] font-mono resize-none outline-none transition-all duration-200 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="flex items-center justify-center w-10 h-10 bg-[#1f6feb] hover:bg-[#388bfd] disabled:bg-[#1f6feb]/30 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shrink-0 shadow-lg shadow-[#1f6feb]/10 hover:shadow-[#1f6feb]/20 active:scale-95"
          >
            {sending
              ? <Loader className="w-4 h-4 text-white animate-spin" />
              : <Send className="w-4 h-4 text-white" />}
          </button>
        </form>

        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-[#484f58]">
          <Users className="w-3 h-3" />
          <span>{onlineUsers.size} {onlineUsers.size === 1 ? 'person' : 'people'} online</span>
          <span className="mx-1 text-[#30363d]">·</span>
          <span>Enter to send</span>
        </div>
      </div>
    </motion.div>
  );
}