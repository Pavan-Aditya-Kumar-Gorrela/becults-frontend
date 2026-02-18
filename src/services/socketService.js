import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_API_BASE_URL;

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_SERVER_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✓ Socket connected:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('✗ Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  joinChannel(channelKey, userId) {
    if (this.socket?.connected) {
      this.socket.emit('join-channel', channelKey, userId);
    }
  }

  leaveChannel(channelKey, userId) {
    if (this.socket?.connected) {
      this.socket.emit('leave-channel', channelKey, userId);
    }
  }

  sendMessage(channelKey, messageData) {
    if (this.socket?.connected) {
      this.socket.emit('send-message', channelKey, messageData);
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user-joined', callback);
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on('user-left', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }

  onUserStopTyping(callback) {
    if (this.socket) {
      this.socket.on('user-stop-typing', callback);
    }
  }

  emitTyping(channelKey, userId, userName) {
    if (this.socket?.connected) {
      this.socket.emit('typing', channelKey, userId, userName);
    }
  }

  emitStopTyping(channelKey, userId) {
    if (this.socket?.connected) {
      this.socket.emit('stop-typing', channelKey, userId);
    }
  }

  removeListener(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export default new SocketService();
