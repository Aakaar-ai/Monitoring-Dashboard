import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Calendar, 
  Clock, 
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock3,
  Zap,
  Database,
  Users,
  Globe,
  Server
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState('24h');
  const [selectedMetric, setSelectedMetric] = React.useState('all');

  const metrics = [
    { name: 'Total Requests', value: '2.4M', change: '+12.5%', trend: 'up', icon: Activity },
    { name: 'Error Rate', value: '0.8%', change: '-2.1%', trend: 'down', icon: AlertTriangle },
    { name: 'Response Time', value: '245ms', change: '-8.3%', trend: 'down', icon: Clock3 },
    { name: 'Success Rate', value: '99.2%', change: '+0.5%', trend: 'up', icon: CheckCircle },
    { name: 'Active Users', value: '12.8K', change: '+18.2%', trend: 'up', icon: Users },
    { name: 'Data Volume', value: '1.2TB', change: '+5.7%', trend: 'up', icon: Database }
  ];

  const topServices = [
    { name: 'API Gateway', requests: '456K', errors: '0.2%', responseTime: '180ms' },
    { name: 'User Service', requests: '234K', errors: '1.1%', responseTime: '320ms' },
    { name: 'Payment Service', requests: '189K', errors: '0.8%', responseTime: '450ms' },
    { name: 'Notification Service', requests: '156K', errors: '0.5%', responseTime: '95ms' },
    { name: 'Analytics Service', requests: '98K', errors: '0.3%', responseTime: '280ms' }
  ];

  const performanceMetrics = [
    { metric: 'CPU Usage', current: 65, previous: 58, unit: '%' },
    { metric: 'Memory Usage', current: 78, previous: 72, unit: '%' },
    { metric: 'Disk I/O', current: 45, previous: 52, unit: 'MB/s' },
    { metric: 'Network Latency', current: 12, previous: 18, unit: 'ms' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Analytics</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Deep insights into your system performance and user behavior
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
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
              </div>
              <div className="flex space-x-1">
                {['1h', '24h', '7d', '30d', '90d'].map((range) => (
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

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
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
                <div className={`
                  p-3 rounded-full
                  ${metric.trend === 'up' 
                    ? 'bg-green-100 dark:bg-green-900/20' 
                    : 'bg-red-100 dark:bg-red-900/20'
                  }
                `}>
                  <metric.icon className={`
                    w-6 h-6
                    ${metric.trend === 'up' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                    }
                  `} />
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

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span>System Performance</span>
            </CardTitle>
            <CardDescription>
              Real-time system resource utilization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((item) => (
                <div key={item.metric} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.metric}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.current}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-gray-900 dark:text-white w-12 text-right">
                      {item.current}{item.unit}
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
              <Server className="w-5 h-5 text-green-600" />
              <span>Top Services</span>
            </CardTitle>
            <CardDescription>
              Service performance overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {service.requests} requests
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-red-600 dark:text-red-400">
                        {service.errors} errors
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {service.responseTime}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Volume Trends</CardTitle>
            <CardDescription>
              Hourly request patterns over the selected time range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Chart Component</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Request volume visualization will be displayed here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Distribution</CardTitle>
            <CardDescription>
              Error types and frequency analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Chart Component</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Error distribution visualization will be displayed here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-purple-600" />
            <span>Geographic Distribution</span>
          </CardTitle>
          <CardDescription>
            User activity across different regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">Map Component</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Geographic visualization will be displayed here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
