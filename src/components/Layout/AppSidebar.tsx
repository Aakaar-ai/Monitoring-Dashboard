import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  Activity,
  Database,
  Shield,
  Users,
  Zap,
  Terminal
} from 'lucide-react';
import { cn } from '../../utils/cn';
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Logs', href: '/logs', icon: FileText },
  { name: 'Live Terminal', href: '/terminal', icon: Terminal },
  { name: 'Analytics', href: '/analytics', icon: Activity },
  { name: 'Services', href: '/services', icon: Database },
  { name: 'Security', href: '/security', icon: Shield },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Performance', href: '/performance', icon: Zap },
];

export const AppSidebar: React.FC = () => {
  return (
    <div className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-sidebar-foreground">Aakaarai</h1>
        </div>
        <p className="text-sm text-sidebar-foreground/70 mt-1">Logging Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
              )
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
