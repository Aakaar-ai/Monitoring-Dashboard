import React, { useCallback } from 'react';
import { useLogStore } from '../../stores/logStore';
import { useLogs } from '../../hooks/useLogs';
import { getLogLevelColor } from '../../utils/logUtils';

const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];

export const LevelFilter: React.FC = () => {
  const { filters } = useLogStore();
  const { applyFiltersAndReload } = useLogs();

  const toggleLevel = useCallback((level: string) => {
    const newLevels = filters.levels.includes(level)
      ? filters.levels.filter(l => l !== level)
      : [...filters.levels, level];
    
    // Only apply if levels actually changed
    if (JSON.stringify(newLevels) !== JSON.stringify(filters.levels)) {
      applyFiltersAndReload({ levels: newLevels });
    }
  }, [filters.levels, applyFiltersAndReload]);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Log Levels
      </label>
      <div className="space-y-2">
        {LOG_LEVELS.map((level) => (
          <label key={level} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.levels.includes(level)}
              onChange={() => toggleLevel(level)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
            />
            <span className={`px-2 py-1 rounded text-xs font-medium ${getLogLevelColor(level)}`}>
              {level.toUpperCase()}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};