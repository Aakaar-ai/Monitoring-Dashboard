import React, { useState, useCallback } from 'react';
import { Search, Hash, User } from 'lucide-react';
import { useLogStore } from '../../stores/logStore';
import { useLogs } from '../../hooks/useLogs';
import { Button } from '../ui/Button';
import { useDebounce } from '../../hooks/useDebounce';

export const SearchFilter: React.FC = () => {
  const { filters } = useLogStore();
  const { applyFiltersAndReload } = useLogs();
  const [localFilters, setLocalFilters] = useState(filters);

  // Debounce the search to prevent rapid API calls
  const debouncedSearch = useDebounce(localFilters, 500);

  const handleSearch = useCallback(() => {
    applyFiltersAndReload(localFilters);
  }, [applyFiltersAndReload, localFilters]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Auto-apply search when debounced filters change
  React.useEffect(() => {
    if (debouncedSearch && Object.keys(debouncedSearch).length > 0) {
      applyFiltersAndReload(debouncedSearch);
    }
  }, [debouncedSearch, applyFiltersAndReload]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Search Messages
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search log messages..."
            value={localFilters.searchQuery}
            onChange={(e) => handleInputChange('searchQuery', e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={localFilters.isRegexSearch}
            onChange={(e) => handleInputChange('isRegexSearch', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Use regex search
          </span>
        </label>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Request ID
        </label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Filter by request ID..."
            value={localFilters.requestId}
            onChange={(e) => handleInputChange('requestId', e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          User ID
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Filter by user ID..."
            value={localFilters.userId}
            onChange={(e) => handleInputChange('userId', e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <Button
        onClick={handleSearch}
        className="w-full"
        size="sm"
      >
        <Search className="w-4 h-4 mr-2" />
        Apply Search
      </Button>
    </div>
  );
};