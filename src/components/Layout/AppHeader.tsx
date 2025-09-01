import React from 'react';
import { useLocation } from 'react-router-dom';
import { Wifi, WifiOff, Bell, User } from 'lucide-react';
import { useLogStore } from '../../stores/logStore';
import { cn } from '../../utils/cn';

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const { connectionStatus } = useLogStore();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/logs':
        return 'Logs';
      case '/analytics':
        return 'Analytics';
      case '/services':
        return 'Services';
      case '/security':
        return 'Security';
      case '/users':
        return 'Users';
      case '/performance':
        return 'Performance';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          {connectionStatus.isConnected ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          <span className={cn(
            'text-sm font-medium',
            connectionStatus.isConnected ? 'text-green-600' : 'text-red-600'
          )}>
            {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {connectionStatus.clientCount && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({connectionStatus.clientCount} clients)
            </span>
          )}
        </div>

        {/* Notifications */}
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        {/* User Menu */}
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
