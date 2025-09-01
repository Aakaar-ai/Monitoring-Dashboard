import React, { useCallback } from 'react';
import { DateRangeFilter } from './DateRangeFilter';
import { LevelFilter } from './LevelFilter';
import { ServiceFilter } from './ServiceFilter';
import { CategoryFilter } from './CategoryFilter';
import { SectionFilter } from './SectionFilter';
import { SearchFilter } from './SearchFilter';
import { Button } from '../ui/Button';
import { useLogStore } from '../../stores/logStore';
import { useLogs } from '../../hooks/useLogs';
import { RotateCcw } from 'lucide-react';

export const FilterPanel: React.FC = () => {
  const { clearFilters, filters } = useLogStore();
  const { applyFiltersAndReload } = useLogs();

  const handleClearFilters = useCallback(() => {
    // Only clear if there are actually filters to clear
    const hasActiveFilters = 
      filters.levels.length > 0 ||
      filters.services.length > 0 ||
      filters.categories.length > 0 ||
      filters.sections.length > 0 ||
      filters.searchQuery ||
      filters.requestId ||
      filters.userId ||
      filters.dateRange.start ||
      filters.dateRange.end;

    if (hasActiveFilters) {
      clearFilters();
      // Reload data with cleared filters
      applyFiltersAndReload({});
    }
  }, [clearFilters, applyFiltersAndReload, filters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Filter Logs
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="h-8 px-2"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      <SearchFilter />
      <DateRangeFilter />
      <LevelFilter />
      <ServiceFilter />
      <CategoryFilter />
      <SectionFilter />
    </div>
  );
};