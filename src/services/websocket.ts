import { io, Socket } from 'socket.io-client';
import { LogEntry, LogStats, WebSocketEvent } from '../types';
import { useLogStore } from '../stores/logStore';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;

  connect() {
    try {
      // In development, connect to local server
      const wsUrl = import.meta.env.DEV ? 'ws://localhost:8081' : window.location.origin;
      
      this.socket = io(wsUrl, {
        transports: ['websocket'],
        timeout: 5000,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      useLogStore.getState().setConnectionStatus({
        isConnected: true,
        reconnectAttempts: 0,
        lastHeartbeat: new Date(),
      });
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      useLogStore.getState().setConnectionStatus({
        isConnected: false,
      });
      this.handleReconnect();
    });

    this.socket.on('log', (logEntry: LogEntry) => {
      useLogStore.getState().addLog(logEntry);
    });

    this.socket.on('stats', (stats: LogStats) => {
      useLogStore.getState().setStats(stats);
    });

    this.socket.on('clientCount', (count: number) => {
      useLogStore.getState().setConnectionStatus({ clientCount: count });
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      useLogStore.getState().setError('Failed to connect to log server');
      this.handleReconnect();
    });

    // Heartbeat
    this.socket.on('heartbeat', () => {
      useLogStore.getState().setConnectionStatus({
        lastHeartbeat: new Date(),
      });
    });
  }

  private handleReconnect() {
    const { connectionStatus } = useLogStore.getState();
    
    if (connectionStatus.reconnectAttempts >= this.maxReconnectAttempts) {
      useLogStore.getState().setError('Max reconnection attempts reached');
      return;
    }

    useLogStore.getState().setConnectionStatus({
      reconnectAttempts: connectionStatus.reconnectAttempts + 1,
    });

    this.reconnectTimeout = setTimeout(() => {
      console.log(`Attempting to reconnect... (${connectionStatus.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      this.connect();
    }, this.reconnectDelay * Math.pow(2, connectionStatus.reconnectAttempts)); // Exponential backoff
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService();