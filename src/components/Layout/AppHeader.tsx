import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Wifi, WifiOff, Sun, Moon, User, LogOut, Settings } from 'lucide-react';
import { useLogStore } from '../../stores/logStore';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthContext';

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { connectionStatus } = useLogStore();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

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
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-card-foreground">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center space-x-2">
        {/* Connection Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
          {connectionStatus.isConnected ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-destructive" />
          )}
          <span className={cn(
            'text-sm font-medium',
            connectionStatus.isConnected ? 'text-green-600 dark:text-green-400' : 'text-destructive'
          )}>
            {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === 'dark' ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Moon className="mr-2 h-4 w-4" />
              )}
              <span>{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={async () => {
              await logout();
              navigate('/login');
            }}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
