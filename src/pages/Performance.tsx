import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/Button';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Cpu, 
  HardDrive,
  MemoryStick,
  Network,
  Gauge,
  Filter,
  RefreshCw,
  Download,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Info,
  Server
} from 'lucide-react';
import { ComingSoonOverlay } from '../components/ComingSoonOverlay';

export const Performance: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState('1h');

  const performanceMetrics = [
    { name: 'CPU Usage', value: '65%', change: '+8.2%', trend: 'up', icon: Cpu, color: 'text-blue-600', status: 'normal' },
    { name: 'Memory Usage', value: '78%', change: '+5.1%', trend: 'up', icon: MemoryStick, color: 'text-yellow-600', status: 'warning' },
    { name: 'Disk I/O', value: '45 MB/s', change: '-12.3%', trend: 'down', icon: HardDrive, color: 'text-green-600', status: 'good' },
    { name: 'Network Latency', value: '12ms', change: '-8.7%', trend: 'down', icon: Network, color: 'text-green-600', status: 'good' },
    { name: 'Response Time', value: '245ms', change: '+15.2%', trend: 'up', icon: Clock, color: 'text-orange-600', status: 'warning' },
    { name: 'Throughput', value: '2.4K req/s', change: '+22.1%', trend: 'up', icon: Activity, color: 'text-green-600', status: 'good' }
  ];

  const systemResources = [
    { name: 'CPU Cores', total: 16, used: 10.4, unit: 'cores', percentage: 65, status: 'normal' },
    { name: 'RAM', total: 64, used: 50.2, unit: 'GB', percentage: 78, status: 'warning' },
    { name: 'Storage', total: 2000, used: 1250, unit: 'GB', percentage: 62, status: 'normal' },
    { name: 'Network', total: 1000, used: 450, unit: 'Mbps', percentage: 45, status: 'good' }
  ];

  const performanceAlerts = [
    {
      id: 1,
      type: 'High Memory Usage',
      severity: 'warning',
      description: 'Memory usage has exceeded 75% threshold',
      timestamp: '5 minutes ago',
      metric: 'Memory',
      current: '78%',
      threshold: '75%',
      status: 'active'
    },
    {
      id: 2,
      type: 'Slow Response Time',
      severity: 'warning',
      description: 'API response time increased by 15%',
      timestamp: '15 minutes ago',
      metric: 'Response Time',
      current: '245ms',
      threshold: '200ms',
      status: 'investigating'
    },
    {
      id: 3,
      type: 'High CPU Load',
      severity: 'info',
      description: 'CPU usage spike detected during peak hours',
      timestamp: '1 hour ago',
      metric: 'CPU',
      current: '65%',
      threshold: '80%',
      status: 'resolved'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'normal':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'info':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const performanceContent = (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Performance</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Monitor system performance and optimize resource utilization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            Real-time
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Live Updates
          </Badge>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
              </div>
              <div className="flex space-x-1">
                {['1h', '6h', '24h', '7d', '30d'].map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className="px-3 py-1"
                  >
                    {range}
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

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performanceMetrics.map((metric) => (
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
                <div className="flex flex-col items-end space-y-2">
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn('text-xs', getStatusColor(metric.status))}
                  >
                    {metric.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <div className={`
                  flex items-center space-x-1 text-sm font-medium
                  ${metric.trend === 'up' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                  }
                `}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
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

      {/* System Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-blue-600" />
              <span>System Resources</span>
            </CardTitle>
            <CardDescription>
              Real-time resource utilization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemResources.map((resource) => (
                <div key={resource.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {resource.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {resource.used.toFixed(1)} / {resource.total} {resource.unit}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={cn(
                          'h-2 rounded-full transition-all duration-300',
                          resource.percentage >= 80 ? 'bg-red-500' :
                          resource.percentage >= 60 ? 'bg-yellow-500' :
                          'bg-green-500'
                        )}
                        style={{ width: `${resource.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-gray-900 dark:text-white w-12 text-right">
                      {resource.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gauge className="w-5 h-5 text-green-600" />
              <span>Performance Alerts</span>
            </CardTitle>
            <CardDescription>
              Active performance warnings and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceAlerts.map((alert) => (
                <div key={alert.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {alert.type}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {alert.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{alert.metric}: {alert.current}</span>
                          <span>Threshold: {alert.threshold}</span>
                          <span>{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn('text-xs', getSeverityColor(alert.severity))}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CPU & Memory Trends</CardTitle>
            <CardDescription>
              Resource usage over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Chart Component</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  CPU and memory trends will be displayed here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Performance</CardTitle>
            <CardDescription>
              Network latency and throughput
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Network className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Chart Component</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Network performance visualization will be displayed here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span>Performance Optimization</span>
          </CardTitle>
          <CardDescription>
            Recommendations and optimization tips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Memory Optimization</h4>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Consider increasing RAM allocation or implementing memory caching strategies.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Response Time</h4>
                </div>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  API response time has increased. Review database queries and caching.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-900 dark:text-green-100">Disk Performance</h4>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Disk I/O performance is within optimal range. No action needed.
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <h4 className="font-medium text-purple-900 dark:text-purple-100">Throughput</h4>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  System throughput is excellent. Consider load balancing for scaling.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Dashboard Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span>Performance Dashboard</span>
          </CardTitle>
          <CardDescription>
            Comprehensive performance overview and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Zap className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">Performance Dashboard</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Interactive performance visualization will be displayed here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ComingSoonOverlay 
      title="Performance Monitoring Coming Soon"
      description="Advanced performance analytics with real-time metrics, resource optimization, and comprehensive system monitoring. Peak performance awaits!"
    >
      {performanceContent}
    </ComingSoonOverlay>
  );
};

// Helper function for className concatenation
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
