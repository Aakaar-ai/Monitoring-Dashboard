import React, { useMemo, useState } from 'react';
import { LogEntry as LogEntryComponent } from './LogEntry';
import { FullScreenLogViewer } from './FullScreenLogViewer';
import { useLogStore } from '../../stores/logStore';
import { useLogs } from '../../hooks/useLogs';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Maximize2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

export const LogTable: React.FC = () => {
  const { filteredLogs, isLoading, pagination } = useLogStore();
  const { changePage, changePageSize, refreshData } = useLogs();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const memoizedLogs = useMemo(() => filteredLogs, [filteredLogs]);

  const handlePageChange = (newPage: number) => {
    changePage(newPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value);
    changePageSize(newSize);
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading logs...</p>
        </div>
      </Card>
    );
  }

  if (memoizedLogs.length === 0) {
    return (
      <Card className="h-full">
        <div className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No logs found matching your filters.</p>
          <Button 
            onClick={refreshData}
            className="mt-4"
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </Card>
    );
  }

  if (isFullScreen) {
    return (
      <FullScreenLogViewer
        logs={memoizedLogs}
        onClose={() => setIsFullScreen(false)}
        filters={{}}
      />
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Log Entries
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {memoizedLogs.length} of {pagination.total} logs
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              className="text-gray-600 dark:text-gray-400"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullScreen(true)}
              className="text-gray-600 dark:text-gray-400"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Full Screen
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 overflow-y-auto">
        {memoizedLogs.map((log, index) => (
          <LogEntryComponent
            key={log.id || index}
            index={index}
            style={{}}
            data={memoizedLogs}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({pagination.total} total logs)
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={pagination.limit}
                onChange={handlePageSizeChange}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
                <option value={200}>200 per page</option>
                <option value={500}>500 per page</option>
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                {pagination.page}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};