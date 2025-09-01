import React from 'react';
import { Activity, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { useLogStore } from '../../stores/logStore';

export const StatsCards: React.FC = () => {
  const { stats, isLoading } = useLogStore();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalLogs = stats.total || 0;
  const errorLogs = (stats.byLevel?.error || 0) + (stats.byLevel?.fatal || 0);
  const errorRate = totalLogs > 0 ? ((errorLogs / totalLogs) * 100).toFixed(1) : '0';
  
  // Calculate trend from daily data
  const dailyData = stats.byDay || {};
  const dailyValues = Object.values(dailyData).map(Number);
  const trend = dailyValues.length > 1 ? 
    ((dailyValues[dailyValues.length - 1] - dailyValues[0]) / dailyValues[0] * 100) : 0;
  const trendValue = Math.abs(trend).toFixed(1);
  const trendSign = trend >= 0 ? '+' : '-';

  // Get top service
  const topService = stats.byService ? 
    Object.entries(stats.byService).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A' : 'N/A';

  const statCards = [
    {
      title: 'Total Logs',
      value: totalLogs.toLocaleString(),
      icon: Activity,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Error Rate',
      value: `${errorRate}%`,
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
    {
      title: 'Top Service',
      value: topService,
      icon: Clock,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Trend',
      value: `${trendSign}${trendValue}%`,
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};