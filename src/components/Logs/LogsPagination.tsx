import React from 'react';
import { Button } from '../ui/Button';

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LogsPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export const LogsPagination: React.FC<LogsPaginationProps> = ({ pagination, onPageChange }) => {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
        {pagination.total} results
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="px-3 py-2"
        >
          Previous
        </Button>
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, pagination.page - 2)) + i;
            return (
              <Button
                key={pageNum}
                variant={pageNum === pagination.page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className="w-8 h-8 p-0"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
          className="px-3 py-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
