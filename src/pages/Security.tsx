import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  Search,
  Filter,
  RefreshCw,
  Download,
  Settings,
  Users,
  Globe,
  Server,
  Activity,
  Clock,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Database,
  FileText,
  AlertCircle
} from 'lucide-react';

export const Security: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSeverity, setSelectedSeverity] = React.useState('all');

  const securityMetrics = [
    { name: 'Threats Blocked', value: '1,247', change: '+15.3%', trend: 'up', icon: Shield, color: 'text-green-600' },
    { name: 'Failed Logins', value: '89', change: '-8.7%', trend: 'down', icon: Lock, color: 'text-blue-600' },
    { name: 'Suspicious IPs', value: '23', change: '+12.1%', trend: 'up', icon: Globe, color: 'text-orange-600' },
    { name: 'Data Breaches', value: '0', change: '0%', trend: 'stable', icon: Database, color: 'text-green-600' },
    { name: 'Malware Detected', value: '3', change: '-25.0%', trend: 'down', icon: AlertTriangle, color: 'text-red-600' },
    { name: 'Security Score', value: '94/100', change: '+2.1%', trend: 'up', icon: CheckCircle, color: 'text-green-600' }
  ];

  const securityEvents = [
    {
      id: 1,
      type: 'Failed Login',
      severity: 'medium',
      description: 'Multiple failed login attempts from IP 192.168.1.100',
      timestamp: '2 minutes ago',
      source: '192.168.1.100',
      user: 'admin@example.com',
      status: 'investigating'
    },
    {
      id: 2,
      type: 'Suspicious Activity',
      severity: 'high',
      description: 'Unusual data access pattern detected',
      timestamp: '15 minutes ago',
      source: '10.0.0.50',
      user: 'user123@example.com',
      status: 'resolved'
    },
    {
      id: 3,
      type: 'Malware Detection',
      severity: 'critical',
      description: 'Potential malware signature detected in uploaded file',
      timestamp: '1 hour ago',
      source: '172.16.0.25',
      user: 'upload@example.com',
      status: 'investigating'
    },
    {
      id: 4,
      type: 'Data Export',
      severity: 'low',
      description: 'Large data export to external email address',
      timestamp: '3 hours ago',
      source: '192.168.1.150',
      user: 'analyst@example.com',
      status: 'resolved'
    },
    {
      id: 5,
      type: 'Access Violation',
      severity: 'high',
      description: 'Attempted access to restricted admin endpoint',
      timestamp: '5 hours ago',
      source: '203.0.113.45',
      user: 'unknown',
      status: 'investigating'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'investigating':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'escalated':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const filteredEvents = securityEvents.filter(event =>
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedSeverity === 'all' || event.severity === selectedSeverity)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Security</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Monitor security threats and protect your system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {securityEvents.length} Events
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {securityEvents.filter(e => e.severity === 'critical' || e.severity === 'high').length} Critical
          </Badge>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityMetrics.map((metric) => (
          <Card key={metric.name} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <div className={`
                  flex items-center space-x-1 text-sm font-medium
                  ${metric.trend === 'up' 
                    ? 'text-green-600 dark:text-green-400' 
                    : metric.trend === 'down'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                  }
                `}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : (
                    <Activity className="w-4 h-4" />
                  )}
                  <span>{metric.change}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  vs previous period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Security Status</span>
            </CardTitle>
            <CardDescription>
              Overall system security posture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Firewall</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                  </div>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">95%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Antivirus</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }} />
                  </div>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">98%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Encryption</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
                  </div>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">100%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Access Control</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '87%' }} />
                  </div>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">87%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span>Recent Threats</span>
            </CardTitle>
            <CardDescription>
              Latest security incidents and responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Malware Detected</span>
                </div>
                <span className="text-xs text-red-600 dark:text-red-400">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Failed Login</span>
                </div>
                <span className="text-xs text-yellow-600 dark:text-yellow-400">2 min ago</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Data Export</span>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400">3 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search security events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex space-x-1">
                {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
                  <Button
                    key={severity}
                    variant={selectedSeverity === severity ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSeverity(severity)}
                    className="px-3 py-1 capitalize"
                  >
                    {severity}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Security Events</CardTitle>
          <CardDescription>
            Recent security incidents and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No security events found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getSeverityIcon(event.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.type}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={cn('text-xs', getSeverityColor(event.severity))}
                          >
                            {event.severity}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={cn('text-xs', getStatusColor(event.status))}
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {event.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Source: {event.source}</span>
                          <span>User: {event.user}</span>
                          <span>{event.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Details">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Investigate">
                        <Search className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Settings">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Dashboard Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span>Security Dashboard</span>
          </CardTitle>
          <CardDescription>
            Comprehensive security metrics and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">Security Dashboard</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Interactive security visualization will be displayed here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function for className concatenation
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
