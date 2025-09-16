import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { RefreshCw, Eye, FileText, AlertCircle, Info, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatLogTimestamp } from '../../utils/dateUtils';
import { getLogLevelColor } from '../../utils/logUtils';
import { LogEntry } from '../../types';

interface LogsTableProps {
  logs: LogEntry[];
  isLoading: boolean;
  onViewDetails: (log: LogEntry) => void;
}

const getLevelIcon = (level: string) => {
  switch (level.toLowerCase()) {
    case 'error':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'warn':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case 'info':
      return <Info className="w-4 h-4 text-blue-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

export const LogsTable: React.FC<LogsTableProps> = ({
  logs,
  isLoading,
  onViewDetails
}) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CardTitle className="text-lg font-semibold">Recent Logs</CardTitle>
            <Badge variant="outline" className="text-xs">
              {logs.length} entries
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 w-[1086px] overflow-x-auto">
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No logs found</p>
            <p className="text-sm">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="border rounded-md">
            <div className="overflow-auto max-h-[600px]">
              <Table className="relative">
                <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10 border-b">
                  <TableRow>
                    <TableHead className="min-w-[140px] whitespace-nowrap">Timestamp</TableHead>
                    <TableHead className="min-w-[100px] whitespace-nowrap">Level</TableHead>
                    <TableHead className="min-w-[120px] whitespace-nowrap">Service</TableHead>
                    <TableHead className="min-w-[100px] whitespace-nowrap">Category</TableHead>
                    <TableHead className="min-w-[100px] whitespace-nowrap">Section</TableHead>
                    <TableHead className="min-w-[300px] whitespace-nowrap">Message</TableHead>
                    <TableHead className="min-w-[100px] whitespace-nowrap">User ID</TableHead>
                    <TableHead className="min-w-[80px] whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-mono text-xs whitespace-nowrap min-w-[140px]">
                        {formatLogTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        <div className="flex items-center space-x-2">
                          {getLevelIcon(log.level)}
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs font-medium whitespace-nowrap",
                              getLogLevelColor(log.level)
                            )}
                          >
                            {log.level.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium min-w-[120px]">
                        <Badge variant="secondary" className="text-xs whitespace-nowrap">
                          {log.service}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400 min-w-[100px]">
                        <div className="truncate max-w-[100px]" title={log.category}>
                          {log.category}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400 min-w-[100px]">
                        <div className="truncate max-w-[100px]" title={log.section}>
                          {log.section}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[300px]">
                        <div className="truncate max-w-[300px] text-sm" title={log.message}>
                          {log.message}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-500 min-w-[100px]">
                        <div className="truncate max-w-[100px]" title={log.user_id || '-'}>
                          {log.user_id || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[80px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(log)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
