import React, { useState } from 'react';
import { Download, X, FileText, Database, FileImage } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useLogStore } from '../../stores/logStore';
import { apiService } from '../../services/api';
import { downloadFile } from '../../utils/logUtils';
import { ExportOptions } from '../../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { filters } = useLogStore();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeMetadata: true,
  });
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await apiService.exportLogs({
        ...exportOptions,
        filters,
      });

      const filename = `logs_${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
      downloadFile(blob, filename);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileText, description: 'Comma-separated values' },
    { value: 'json', label: 'JSON', icon: Database, description: 'JavaScript Object Notation' },
    { value: 'pdf', label: 'PDF', icon: FileImage, description: 'Portable Document Format' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Export Logs
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Export Format
              </label>
              <div className="space-y-2">
                {formatOptions.map((option) => (
                  <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                    <input
                      type="radio"
                      name="format"
                      value={option.value}
                      checked={exportOptions.format === option.value}
                      onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value as any })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <option.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeMetadata}
                  onChange={(e) => setExportOptions({ ...exportOptions, includeMetadata: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Include metadata
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};