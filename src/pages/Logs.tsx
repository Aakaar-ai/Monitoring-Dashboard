import React from 'react';
import { LogsHeader } from '../components/Logs/LogsHeader';
import { LogsStats } from '../components/Logs/LogsStats';
import { LogsControls } from '../components/Logs/LogsControls';
import { LogsTable } from '../components/Logs/LogsTable';
import { LogsPagination } from '../components/Logs/LogsPagination';
import { LogDetailModal } from '../components/LogTable/LogDetailModal';
import { LogsFilterSheet } from '../components/Logs/LogsFilterSheet';
import { useLogStore } from '../stores/logStore';
import { useLogs } from '../hooks/useLogs';
import { LogEntry as LogEntryType } from '../types';

export const Logs: React.FC = () => {
  const { filteredLogs, pagination, isLoading } = useLogStore();
  const { changePage, refreshData } = useLogs();
  const [showFilters, setShowFilters] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedLog, setSelectedLog] = React.useState<LogEntryType | null>(null);
  const [showDetailModal, setShowDetailModal] = React.useState(false);

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Service', 'Category', 'Section', 'Message', 'Request ID', 'User ID', 'IP Address'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.level,
        log.service,
        log.category,
        log.section,
        log.message,
        log.request_id || '',
        log.user_id || '',
        log.ip_address || ''
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleViewDetails = (log: LogEntryType) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const filteredLogsForDisplay = filteredLogs.filter(log =>
    log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.request_id && log.request_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (log.user_id && log.user_id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      <LogsHeader 
        totalLogs={pagination.total} 
        filteredLogs={filteredLogs.length} 
      />
      
      <LogsStats 
        logs={filteredLogs} 
        totalLogs={pagination.total} 
      />
      
      <LogsFilterSheet
        isOpen={showFilters}
        onOpenChange={setShowFilters}
      >
        <LogsControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRefresh={refreshData}
          onExport={handleExport}
          isLoading={isLoading}
        />
      </LogsFilterSheet>
      
      <LogsTable
        logs={filteredLogsForDisplay}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
      />
      
      <LogsPagination
        pagination={pagination}
        onPageChange={changePage}
      />

      <LogDetailModal
        log={selectedLog}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedLog(null);
        }}
      />
    </div>
  );
};
