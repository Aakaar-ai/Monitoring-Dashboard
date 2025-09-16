import React from 'react';
import { Badge } from '../ui/badge';

interface LogsHeaderProps {
  totalLogs: number;
  filteredLogs: number;
}

export const LogsHeader: React.FC<LogsHeaderProps> = ({ totalLogs, filteredLogs }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Logs</h2>
        <p className="text-gray-500 dark:text-gray-400">
          View and filter your application logs
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-sm">
          {filteredLogs} logs
        </Badge>
        <Badge variant="secondary" className="text-sm">
          {totalLogs} total
        </Badge>
      </div>
    </div>
  );
};
