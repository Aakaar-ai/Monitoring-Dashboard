import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { FilterPanel } from '../components/FilterPanel/FilterPanel';
import { LogDetailModal } from '../components/LogTable/LogDetailModal';
import { useLogStore } from '../stores/logStore';
import { useLogs } from '../hooks/useLogs';
import { Download, RefreshCw, Search, Filter, Eye, FileText, TrendingUp, AlertCircle, Info, Clock } from 'lucide-react';
import { cn } from '../utils/cn';
import { formatLogTimestamp } from '../utils/dateUtils';
import { getLogLevelColor } from '../utils/logUtils';
import { LogEntry as LogEntryType } from '../types';

export const Logs: React.FC = () => {
  const { filteredLogs, pagination, isLoading } = useLogStore();
  const { changePage, refreshData } = useLogs();
  const [showFilters, setShowFilters] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedLog, setSelectedLog] = React.useState<LogEntryType | null>(null);
  const [showDetailModal, setShowDetailModal] = React.useState(false);

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Service', 'Category', 'Section', 'Message', 'Request ID', 'User ID', 'IP Address'],
      ...filteredLogs.map(log => [
        formatLogTimestamp(log.timestamp),
        log.level,
        log.service,
        log.category,
        log.section,
        log.message,
        log.request_id || '',
        log.user_id || '',
        log.ip_address || ''
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleViewDetails = (log: LogEntryType) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const filteredLogsForDisplay = filteredLogs.filter(log =>
    log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.request_id && log.request_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (log.user_id && log.user_id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Logs</h2>
          <p className="text-gray-500 dark:text-gray-400">
            View and filter your application logs
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredLogs.length} logs
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {pagination.total} total
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Logs</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{pagination.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Errors</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {filteredLogs.filter(log => log.level === 'error').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Warnings</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {filteredLogs.filter(log => log.level === 'warn').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                <Info className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Info</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {filteredLogs.filter(log => log.level === 'info').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search logs, request IDs, or user IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
            <Button
              variant="outline"
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
              <span>Refresh</span>
            </Button>
            <Button
              onClick={handleExport}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </CardTitle>
            <CardDescription>
              Filter logs by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FilterPanel />
          </CardContent>
        </Card>
      )}

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Log Entries</CardTitle>
          <CardDescription>
            Showing {filteredLogsForDisplay.length} of {pagination.total} logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead className="font-semibold">Timestamp</TableHead>
                  <TableHead className="font-semibold">Level</TableHead>
                  <TableHead className="font-semibold">Service</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Section</TableHead>
                  <TableHead className="font-semibold">Message</TableHead>
                  <TableHead className="font-semibold">Request ID</TableHead>
                  <TableHead className="font-semibold">User ID</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogsForDisplay.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                          <FileText className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-medium text-gray-900 dark:text-white">No logs found</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Try adjusting your filters or search query
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogsForDisplay.map((log, index) => (
                    <TableRow 
                      key={index} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700"
                    >
                      <TableCell className="font-mono text-sm py-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{formatLogTimestamp(log.timestamp)}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center space-x-2">
                          {getLevelIcon(log.level)}
                          <Badge 
                            variant="outline" 
                            className={cn('text-xs font-medium', getLogLevelColor(log.level))}
                          >
                            {log.level.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="secondary" className="text-xs font-medium">
                          {log.service}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className="text-xs font-medium">
                          {log.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className="text-xs font-medium">
                          {log.section}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs py-3">
                        <div className="truncate" title={log.message}>
                          <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                            {log.message}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs py-3">
                        {log.request_id ? (
                          <div className="truncate max-w-32" title={log.request_id}>
                            <Badge variant="outline" className="text-xs font-mono">
                              {log.request_id.slice(0, 8)}...
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs py-3">
                        {log.user_id ? (
                          <Badge variant="outline" className="text-xs font-mono">
                            {log.user_id}
                          </Badge>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                          title="View Details"
                          onClick={() => handleViewDetails(log)}
                        >
                          <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changePage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-2"
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, pagination.page - 2)) + i;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === pagination.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => changePage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changePage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-2"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Detail Modal */}
      <LogDetailModal
        log={selectedLog}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedLog(null);
        }}
      />
    </div>
  );
};
