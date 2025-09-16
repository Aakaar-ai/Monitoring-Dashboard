import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { TrendingUp, AlertCircle, Info } from 'lucide-react';
import { LogEntry } from '../../types';

interface LogsStatsProps {
  logs: LogEntry[];
  totalLogs: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  textColor: string;
  iconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, gradient, textColor, iconBg }) => (
  <Card className={`bg-gradient-to-r ${gradient}`}>
    <CardContent className="p-4">
      <div className="flex items-center space-x-3">
        <div className={`p-2 ${iconBg} rounded-lg`}>
          {icon}
        </div>
        <div>
          <p className={`text-sm font-medium ${textColor}`}>{title}</p>
          <p className={`text-2xl font-bold ${textColor.replace('text-', 'text-').replace('-600', '-900').replace('-400', '-100')}`}>
            {value}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const LogsStats: React.FC<LogsStatsProps> = ({ logs, totalLogs }) => {
  const errorCount = logs.filter(log => log.level === 'error').length;
  const warnCount = logs.filter(log => log.level === 'warn').length;
  const infoCount = logs.filter(log => log.level === 'info').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Logs"
        value={totalLogs}
        icon={<TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
        gradient="from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
        textColor="text-blue-600 dark:text-blue-400"
        iconBg="bg-blue-100 dark:bg-blue-900/40"
      />
      
      <StatCard
        title="Errors"
        value={errorCount}
        icon={<AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
        gradient="from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
        textColor="text-red-600 dark:text-red-400"
        iconBg="bg-red-100 dark:bg-red-900/40"
      />
      
      <StatCard
        title="Warnings"
        value={warnCount}
        icon={<AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
        gradient="from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20"
        textColor="text-yellow-600 dark:text-yellow-400"
        iconBg="bg-yellow-100 dark:bg-yellow-900/40"
      />
      
      <StatCard
        title="Info"
        value={infoCount}
        icon={<Info className="w-5 h-5 text-green-600 dark:text-green-400" />}
        gradient="from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
        textColor="text-green-600 dark:text-green-400"
        iconBg="bg-green-100 dark:bg-green-900/40"
      />
    </div>
  );
};
