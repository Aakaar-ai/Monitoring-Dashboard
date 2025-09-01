import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { 
  Users as UsersIcon,
  UserPlus, 
  UserCheck, 
  UserX, 
  Search,
  Filter,
  RefreshCw,
  Download,
  Settings,
  Edit,
  Eye,
  Mail,
  Globe,
  Calendar,
  Clock,
  Activity,
  Shield,
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const Users: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [selectedRole, setSelectedRole] = React.useState('all');

  const userMetrics = [
    { name: 'Total Users', value: '2,847', change: '+12.5%', trend: 'up', icon: Users, color: 'text-blue-600' },
    { name: 'Active Users', value: '2,134', change: '+8.3%', trend: 'up', icon: UserCheck, color: 'text-green-600' },
    { name: 'New Users', value: '156', change: '+23.1%', trend: 'up', icon: UserPlus, color: 'text-purple-600' },
    { name: 'Suspended Users', value: '23', change: '-5.2%', trend: 'down', icon: UserX, color: 'text-red-600' },
    { name: 'Premium Users', value: '892', change: '+15.7%', trend: 'up', icon: Shield, color: 'text-yellow-600' },
    { name: 'User Growth', value: '18.2%', change: '+2.1%', trend: 'up', icon: TrendingUp, color: 'text-green-600' }
  ];

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2 hours ago',
      joinDate: '2023-01-15',
      avatar: 'JD',
      department: 'Engineering',
      location: 'New York',
      loginCount: 156,
      isVerified: true
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'user',
      status: 'active',
      lastLogin: '1 day ago',
      joinDate: '2023-03-22',
      avatar: 'JS',
      department: 'Marketing',
      location: 'San Francisco',
      loginCount: 89,
      isVerified: true
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'moderator',
      status: 'active',
      lastLogin: '3 hours ago',
      joinDate: '2023-02-10',
      avatar: 'MJ',
      department: 'Support',
      location: 'Chicago',
      loginCount: 234,
      isVerified: true
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      role: 'user',
      status: 'suspended',
      lastLogin: '1 week ago',
      joinDate: '2023-04-05',
      avatar: 'SW',
      department: 'Sales',
      location: 'Boston',
      loginCount: 45,
      isVerified: false
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@example.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '2 weeks ago',
      joinDate: '2023-01-30',
      avatar: 'DB',
      department: 'Finance',
      location: 'Austin',
      loginCount: 67,
      isVerified: true
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'moderator':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'user':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'inactive':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      case 'suspended':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive':
        return <Clock className="w-4 h-4 text-gray-600" />;
      case 'suspended':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredUsers = users.filter(user =>
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedStatus === 'all' || user.status === selectedStatus) &&
    (selectedRole === 'all' || user.role === selectedRole)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Users</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and monitor user accounts and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {users.length} Users
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {users.filter(u => u.status === 'active').length} Active
          </Badge>
        </div>
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userMetrics.map((metric) => (
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

      {/* User Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>User Distribution</span>
            </CardTitle>
            <CardDescription>
              Users by role and department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admins</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }} />
                  </div>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">5%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Moderators</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '12%' }} />
                  </div>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">12%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Regular Users</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '83%' }} />
                  </div>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">83%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-green-600" />
              <span>Geographic Distribution</span>
            </CardTitle>
            <CardDescription>
              Users by location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">New York</span>
                </div>
                <span className="text-sm text-blue-600 dark:text-blue-400">28%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">San Francisco</span>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400">22%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Chicago</span>
                </div>
                <span className="text-sm text-purple-600 dark:text-purple-400">18%</span>
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
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex space-x-1">
                {['all', 'active', 'inactive', 'suspended'].map((status) => (
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
              <div className="flex space-x-1">
                {['all', 'admin', 'moderator', 'user'].map((role) => (
                  <Button
                    key={role}
                    variant={selectedRole === role ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRole(role)}
                    className="px-3 py-1 capitalize"
                  >
                    {role}
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
              <Button size="sm" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {user.avatar}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={cn('text-xs', getRoleColor(user.role))}
                      >
                        {user.role}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={cn('text-xs', getStatusColor(user.status))}
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(user.status)}
                          <span className="capitalize">{user.status}</span>
                        </div>
                      </Badge>
                      {user.isVerified && (
                        <Badge variant="outline" className="text-xs text-green-600 bg-green-100 dark:bg-green-900/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Profile">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit User">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Settings">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">{user.department} • {user.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Joined: {user.joinDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Last login: {user.lastLogin}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Activity className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Login count: {user.loginCount}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  User ID: {user.id}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    <Mail className="w-3 h-3 mr-1" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    <Activity className="w-3 h-3 mr-1" />
                    Activity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Analytics Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span>User Analytics</span>
          </CardTitle>
          <CardDescription>
            User behavior and engagement metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">User Analytics</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Interactive user analytics visualization will be displayed here
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
