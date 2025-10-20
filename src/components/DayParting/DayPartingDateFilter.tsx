import React from 'react';
import { formatDateForInput, parseInputDate } from '@/utils/dateUtils';
import { Card } from '../ui/Card';

interface DayPartingDateFilterProps {
  value: {
    from: Date;
    to: Date;
  };
  onChange: (range: { from: Date; to: Date }) => void;
}

export const DayPartingDateFilter: React.FC<DayPartingDateFilterProps> = ({ value, onChange }) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? parseInputDate(e.target.value) : value.from;
    onChange({ from: date, to: value.to });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? parseInputDate(e.target.value) : value.to;
    onChange({ from: value.from, to: date });
  };

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400">From</label>
          <input
            type="datetime-local"
            value={formatDateForInput(value.from)}
            onChange={handleStartDateChange}
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400">To</label>
          <input
            type="datetime-local"
            value={formatDateForInput(value.to)}
            onChange={handleEndDateChange}
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>
    </Card>
  );
};
