import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { 
  Database, 
  Server, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Play,
  Pause,
  Trash2,
  Edit,
  Eye,
  BarChart3,
  Zap,
  Globe,
  Shield,
  Users
} from 'lucide-react';

export const Services: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('all');

  const services = [
    {
      id: 1,
      name: 'API Gateway',
      status: 'healthy',
      version: 'v2.1.0',
      uptime: '99.98%',
      responseTime: '180ms',
      requests: '456K',
      errors: '0.2%',
      instances: 3,
      region: 'us-east-1',
      lastDeploy: '2 hours ago',
      health: 98
    },
    {
      id: 2,
      name: 'User Service',
      status: 'warning',
      version: 'v1.8.2',
      uptime: '99.92%',
      responseTime: '320ms',
      requests: '234K',
      errors: '1.1%',
      instances: 2,
      region: 'us-east-1',
      lastDeploy: '1 day ago',
      health: 87
    },
    {
      id: 3,
      name: 'Payment Service',
      status: 'healthy',
      version: 'v3.0.1',
      uptime: '99.99%',
      responseTime: '450ms',
      requests: '189K',
      errors: '0.8%',
      instances: 2,
      region: 'us-west-2',
      lastDeploy: '3 days ago',
      health: 95
    },
    {
      id: 4,
      name: 'Notification Service',
      status: 'healthy',
      version: 'v1.5.0',
      uptime: '99.95%',
      responseTime: '95ms',
      requests: '156K',
      errors: '0.5%',
      instances: 1,
      region: 'us-east-1',
      lastDeploy: '1 week ago',
      health: 99
    },
    {
      id: 5,
      name: 'Analytics Service',
      status: 'degraded',
      version: 'v2.3.0',
      uptime: '99.85%',
      responseTime: '280ms',
      requests: '98K',
      errors: '0.3%',
      instances: 1,
      region: 'us-west-2',
      lastDeploy: '2 weeks ago',
      health: 76
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'degraded':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'down':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'down':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedStatus === 'all' || service.status === selectedStatus)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Services</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Monitor and manage your microservices infrastructure
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {services.length} Services
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {services.filter(s => s.status === 'healthy').length} Healthy
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Healthy</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {services.filter(s => s.status === 'healthy').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Warning</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {services.filter(s => s.status === 'warning').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Degraded</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {services.filter(s => s.status === 'degraded').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Instances</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {services.reduce((sum, s) => sum + s.instances, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex space-x-1">
                {['all', 'healthy', 'warning', 'degraded', 'down'].map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                    className="px-3 py-1 capitalize"
                  >
                    {status}
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
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </Button>
              <Button size="sm" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {service.version}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={cn('text-xs', getStatusColor(service.status))}
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(service.status)}
                          <span className="capitalize">{service.status}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Details">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit Service">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Settings">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                    <span className="font-medium text-gray-900 dark:text-white">{service.uptime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                    <span className="font-medium text-gray-900 dark:text-white">{service.responseTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Requests</span>
                    <span className="font-medium text-gray-900 dark:text-white">{service.requests}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Errors</span>
                    <span className="font-medium text-red-600 dark:text-red-400">{service.errors}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Instances</span>
                    <span className="font-medium text-gray-900 dark:text-white">{service.instances}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Region</span>
                    <span className="font-medium text-gray-900 dark:text-white">{service.region}</span>
                  </div>
                </div>
              </div>

              {/* Health Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Health Score</span>
                  <span className="font-medium text-gray-900 dark:text-white">{service.health}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      service.health >= 90 ? 'bg-green-500' :
                      service.health >= 70 ? 'bg-yellow-500' :
                      service.health >= 50 ? 'bg-orange-500' : 'bg-red-500'
                    )}
                    style={{ width: `${service.health}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Last deployed: {service.lastDeploy}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Metrics
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    <Zap className="w-3 h-3 mr-1" />
                    Deploy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-purple-600" />
            <span>Service Architecture</span>
          </CardTitle>
          <CardDescription>
            Visual representation of your service dependencies and connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Server className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">Service Map</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Interactive service architecture diagram will be displayed here
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
