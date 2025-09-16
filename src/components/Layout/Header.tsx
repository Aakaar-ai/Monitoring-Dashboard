import React from 'react';
import { Sun, Moon, Wifi, WifiOff, LogOut, User } from 'lucide-react';
import { useLogStore } from '../../stores/logStore';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { theme, toggleTheme, connectionStatus } = useLogStore();
  const { user, logout } = useAuth();

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
          {/* User Info */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4" />
            <span>{user?.email}</span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
              Superuser
            </span>
          </div>

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

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};