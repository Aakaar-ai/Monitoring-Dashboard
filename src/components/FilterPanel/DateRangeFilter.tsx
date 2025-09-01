import React, { useState, useEffect } from 'react';
import { useLogStore } from '../../stores/logStore';
import { useLogs } from '../../hooks/useLogs';
import { formatDateForInput, parseInputDate } from '../../utils/dateUtils';
import { Button } from '../ui/Button';
import { Calendar } from 'lucide-react';

export const DateRangeFilter: React.FC = () => {
  const { filters } = useLogStore();
  const { applyFiltersAndReload } = useLogs();
  const [localDateRange, setLocalDateRange] = useState(filters.dateRange);

  // Update local state when global filters change
  useEffect(() => {
    setLocalDateRange(filters.dateRange);
  }, [filters.dateRange]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? parseInputDate(e.target.value) : undefined;
    setLocalDateRange(prev => ({ ...prev, start: date }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? parseInputDate(e.target.value) : undefined;
    setLocalDateRange(prev => ({ ...prev, end: date }));
  };

  const handleApplyDateRange = () => {
    // Only apply if dates actually changed
    if (JSON.stringify(localDateRange) !== JSON.stringify(filters.dateRange)) {
      applyFiltersAndReload({ dateRange: localDateRange });
    }
  };

  const handleClearDateRange = () => {
    setLocalDateRange({});
    if (filters.dateRange.start || filters.dateRange.end) {
      applyFiltersAndReload({ dateRange: {} });
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Date Range
      </label>
      <div className="space-y-2">
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400">From</label>
          <input
            type="datetime-local"
            value={localDateRange.start ? formatDateForInput(localDateRange.start) : ''}
            onChange={handleStartDateChange}
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400">To</label>
          <input
            type="datetime-local"
            value={localDateRange.end ? formatDateForInput(localDateRange.end) : ''}
            onChange={handleEndDateChange}
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          onClick={handleApplyDateRange}
          size="sm"
          className="flex-1"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Apply
        </Button>
        <Button
          onClick={handleClearDateRange}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};