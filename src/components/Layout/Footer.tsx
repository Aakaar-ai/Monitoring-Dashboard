import React, { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLogStore } from '../../stores/logStore';
import { ExportModal } from '../ExportModal/ExportModal';

export const Footer: React.FC = () => {
  const { filteredLogs } = useLogStore();
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <>
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredLogs.length.toLocaleString()} logs
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowExportModal(true)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </footer>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </>
  );
};