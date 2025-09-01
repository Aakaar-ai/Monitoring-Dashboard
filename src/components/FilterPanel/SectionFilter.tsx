import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useLogStore } from '../../stores/logStore';
import { useLogs } from '../../hooks/useLogs';

export const SectionFilter: React.FC = () => {
  const { filters, filterOptions } = useLogStore();
  const { applyFiltersAndReload } = useLogs();

  const handleSectionChange = useCallback((section: string, checked: boolean) => {
    const newSections = checked
      ? [...filters.sections, section]
      : filters.sections.filter(s => s !== section);
    
    // Only apply if sections actually changed
    if (JSON.stringify(newSections) !== JSON.stringify(filters.sections)) {
      applyFiltersAndReload({ sections: newSections });
    }
  }, [filters.sections, applyFiltersAndReload]);

  if (!filterOptions?.sections) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Section</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filterOptions.sections.map((section) => (
            <label key={section} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.sections.includes(section)}
                onChange={(e) => handleSectionChange(section, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                {section}
              </span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
