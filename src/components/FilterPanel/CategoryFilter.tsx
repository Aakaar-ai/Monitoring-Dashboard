import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useLogStore } from '../../stores/logStore';
import { useLogs } from '../../hooks/useLogs';

export const CategoryFilter: React.FC = () => {
  const { filters, filterOptions } = useLogStore();
  const { applyFiltersAndReload } = useLogs();

  const handleCategoryChange = useCallback((category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    // Only apply if categories actually changed
    if (JSON.stringify(newCategories) !== JSON.stringify(filters.categories)) {
      applyFiltersAndReload({ categories: newCategories });
    }
  }, [filters.categories, applyFiltersAndReload]);

  if (!filterOptions?.categories) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filterOptions.categories.map((category) => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                {category}
              </span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
