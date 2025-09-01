import React, { createContext, useContext, useEffect } from 'react';
import { useLogStore } from '../stores/logStore';
import { useWebSocket } from '../hooks/useWebSocket';

interface LogContextType {
  // Add any additional context methods if needed
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const useLogContext = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogContext must be used within a LogProvider');
  }
  return context;
};

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { error, setError } = useLogStore();
  
  // Initialize WebSocket connection
  useWebSocket();

  // Error notification
  useEffect(() => {
    if (error) {
      console.error('Application error:', error);
      // In a real app, you'd show a toast notification here
      setTimeout(() => setError(null), 5000);
    }
  }, [error, setError]);

  return (
    <LogContext.Provider value={{}}>
      {children}
    </LogContext.Provider>
  );
};
