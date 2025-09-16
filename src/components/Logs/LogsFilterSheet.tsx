import React, { useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { Filter, RotateCcw } from 'lucide-react';
import { DateRangeFilter } from '../FilterPanel/DateRangeFilter';
import { LevelFilter } from '../FilterPanel/LevelFilter';
import { ServiceFilter } from '../FilterPanel/ServiceFilter';
import { CategoryFilter } from '../FilterPanel/CategoryFilter';
import { SectionFilter } from '../FilterPanel/SectionFilter';
import { SearchFilter } from '../FilterPanel/SearchFilter';
import { useLogStore } from '../../stores/logStore';
import { useLogs } from '../../hooks/useLogs';

interface LogsFilterSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LogsFilterSheet: React.FC<LogsFilterSheetProps> = ({
  children,
  isOpen,
  onOpenChange
}) => {
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

  const activeFiltersCount = 
    filters.levels.length + 
    filters.services.length + 
    filters.categories.length + 
    filters.sections.length +
    (filters.searchQuery ? 1 : 0) +
    (filters.requestId ? 1 : 0) + 
    (filters.userId ? 1 : 0) + 
    (filters.dateRange.start ? 1 : 0) + 
    (filters.dateRange.end ? 1 : 0);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Log Filters
              </SheetTitle>
              <SheetDescription>
                Filter logs by level, service, category, and more
              </SheetDescription>
            </div>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <SearchFilter />
          <DateRangeFilter />
          <LevelFilter />
          <ServiceFilter />
          <CategoryFilter />
          <SectionFilter />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-1"
              disabled={activeFiltersCount === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
