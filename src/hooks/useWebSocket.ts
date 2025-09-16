import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useLogStore } from '../stores/logStore';
import { LogEntry, FilterState } from '../types';

const WEBSOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

export const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 1000;
  const isConnectingRef = useRef(false);
  const lastFiltersRef = useRef<Partial<FilterState>>({});

  const {
    addLog,
    setConnectionStatus,
    filters,
  } = useLogStore();

  const connect = useCallback(() => {
    if (socketRef.current?.connected || isConnectingRef.current) return;

    try {
      isConnectingRef.current = true;
      
      socketRef.current = io(WEBSOCKET_URL, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: false, // We'll handle reconnection manually
        forceNew: true,
      });

      socketRef.current.on('connect', () => {
        console.log('WebSocket connected');
        isConnectingRef.current = false;
        setConnectionStatus({
          isConnected: true,
          reconnectAttempts: 0,
        });
        reconnectAttemptsRef.current = 0;

        // Send current filters to server
        if (socketRef.current) {
          socketRef.current.emit('logs:filter', filters);
        }
      });

      socketRef.current.on('disconnect', () => {
        console.log('WebSocket disconnected');
        isConnectingRef.current = false;
        setConnectionStatus({ isConnected: false });
        scheduleReconnect();
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        isConnectingRef.current = false;
        setConnectionStatus({ isConnected: false });
        scheduleReconnect();
      });

      socketRef.current.on('logs:new', (log: LogEntry) => {
        console.log('New log received:', log);
        addLog(log);
      });

      socketRef.current.on('logs:recent', (logs: LogEntry[]) => {
        console.log('Recent logs received:', logs);
        // Don't replace all logs, just add new ones
        logs.forEach(log => addLog(log));
      });

      socketRef.current.on('logs:stats', (stats) => {
        console.log('Stats update received:', stats);
        // Update stats if needed
      });

      socketRef.current.on('connection:stats', (stats) => {
        setConnectionStatus({
          clientCount: stats.totalClients || 0,
        });
      });

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      isConnectingRef.current = false;
      scheduleReconnect();
    }
  }, [addLog, setConnectionStatus, filters]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    isConnectingRef.current = false;
    setConnectionStatus({ isConnected: false });
  }, [setConnectionStatus]);

  const scheduleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      setConnectionStatus({ isConnected: false });
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const delay = reconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
    reconnectAttemptsRef.current++;

    setConnectionStatus({ reconnectAttempts: reconnectAttemptsRef.current });

    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
      connect();
    }, delay);
  }, [connect, setConnectionStatus]);

  const sendFilter = useCallback((newFilters: Partial<FilterState>) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('logs:filter', newFilters);
    }
  }, []);

  // Update filters on WebSocket when local filters change
  useEffect(() => {
    // Only send filters if they actually changed
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(lastFiltersRef.current);
    
    if (filtersChanged && socketRef.current?.connected) {
      lastFiltersRef.current = filters;
      sendFilter(filters);
    }
  }, [filters, sendFilter]);

  // Connect on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected: socketRef.current?.connected || false,
    sendFilter,
    disconnect,
    connect,
  };
};