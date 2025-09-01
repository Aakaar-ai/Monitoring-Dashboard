import React, { useCallback } from 'react';
import { useLogStore } from '../../stores/logStore';
import { useLogs } from '../../hooks/useLogs';

export const ServiceFilter: React.FC = () => {
  const { filters, filterOptions } = useLogStore();
  const { applyFiltersAndReload } = useLogs();

  const toggleService = useCallback((service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    
    // Only apply if services actually changed
    if (JSON.stringify(newServices) !== JSON.stringify(filters.services)) {
      applyFiltersAndReload({ services: newServices });
    }
  }, [filters.services, applyFiltersAndReload]);

  const services = filterOptions?.services || [];

  if (services.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Services
      </label>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {services.map((service) => (
          <label key={service} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.services.includes(service)}
              onChange={() => toggleService(service)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {service}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};