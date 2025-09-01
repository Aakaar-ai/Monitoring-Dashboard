import React from 'react';
import { Sun, Moon, Wifi, WifiOff } from 'lucide-react';
import { useLogStore } from '../../stores/logStore';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { theme, toggleTheme, connectionStatus } = useLogStore();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Aakaarai Logging Dashboard
          </h1>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {connectionStatus.isConnected ? (
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Connected</span>
                {connectionStatus.clientCount > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({connectionStatus.clientCount} clients)
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Disconnected</span>
                {connectionStatus.reconnectAttempts > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    (Retrying... {connectionStatus.reconnectAttempts}/5)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};