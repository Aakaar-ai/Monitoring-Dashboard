import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/badge';
import { LogLevelChart } from '../components/Charts/LogLevelChart';
import { ServiceBreakdownChart } from '../components/Charts/ServiceBreakdownChart';
import { LogTrendsChart } from '../components/Charts/LogTrendsChart';
import { useLogStore } from '../stores/logStore';
import { useLogs } from '../hooks/useLogs';
import { Activity, AlertTriangle, CheckCircle, Clock, Database } from 'lucide-react';
import { cn } from '../utils/cn';

export const Dashboard: React.FC = () => {
  const { stats, isLoading } = useLogStore();
  const { initializeData } = useLogs();

  React.useEffect(() => {
    initializeData();
  }, [initializeData]);

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'total':
        return <Database className="w-5 h-5" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5" />;
      case 'warning':
        return <Clock className="w-5 h-5" />;
      case 'info':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'total':
        return 'text-chart-1 bg-chart-1/10';
      case 'error':
        return 'text-destructive bg-destructive/10';
      case 'warning':
        return 'text-chart-4 bg-chart-4/10';
      case 'info':
        return 'text-chart-2 bg-chart-2/10';
      default:
        return 'text-muted-foreground bg-muted/20';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor your logging system performance and metrics
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <div className={cn('p-2 rounded-full', getMetricColor('total'))}>
              {getMetricIcon('total')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time log entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Logs</CardTitle>
            <div className={cn('p-2 rounded-full', getMetricColor('error'))}>
              {getMetricIcon('error')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.byLevel?.error || 0}</div>
            <p className="text-xs text-muted-foreground">
              Critical issues detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning Logs</CardTitle>
            <div className={cn('p-2 rounded-full', getMetricColor('warning'))}>
              {getMetricIcon('warning')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.byLevel?.warn || 0}</div>
            <p className="text-xs text-muted-foreground">
              Potential issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Info Logs</CardTitle>
            <div className={cn('p-2 rounded-full', getMetricColor('info'))}>
              {getMetricIcon('info')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.byLevel?.info || 0}</div>
            <p className="text-xs text-muted-foreground">
              General information
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Log Levels Distribution</CardTitle>
            <CardDescription>
              Breakdown of logs by severity level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LogLevelChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Breakdown</CardTitle>
            <CardDescription>
              Logs distributed across different services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ServiceBreakdownChart />
          </CardContent>
        </Card>
      </div>

      {/* Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Log Trends Over Time</CardTitle>
          <CardDescription>
            Log volume patterns and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LogTrendsChart />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.byService ? Object.keys(stats.byService).length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently monitored services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.byCategory ? Object.keys(stats.byCategory).length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Log categories in use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.byHour ? Object.values(stats.byHour).reduce((a: number, b: number) => a + b, 0) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Logs in the last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
