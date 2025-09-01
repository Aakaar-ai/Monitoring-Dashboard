import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FilterPanel } from '../FilterPanel/FilterPanel';
import { Button } from '../ui/Button';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Filters
          </h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      {!isCollapsed && (
        <div className="p-4 h-full overflow-y-auto">
          <FilterPanel />
        </div>
      )}
    </aside>
  );
};