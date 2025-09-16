import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Download, RefreshCw, Search, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LogsControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onRefresh: () => void;
  onExport: () => void;
  isLoading: boolean;
}

export const LogsControls: React.FC<LogsControlsProps> = ({
  searchQuery,
  onSearchChange,
  onToggleFilters,
  onRefresh,
  onExport,
  isLoading
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search logs, request IDs, or user IDs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={onToggleFilters}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
            <span>Refresh</span>
          </Button>
          <Button
            onClick={onExport}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
