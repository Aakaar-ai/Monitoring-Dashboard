import React from 'react';
import { X, Copy, ExternalLink, Calendar, Clock, User, Globe, AlertTriangle, Info, FileText } from 'lucide-react';
import { LogEntry as LogEntryType } from '../../types';
import { formatLogTimestamp } from '../../utils/dateUtils';
import { getLogLevelColor } from '../../utils/logUtils';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface LogDetailModalProps {
  log: LogEntryType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LogDetailModal: React.FC<LogDetailModalProps> = ({ log, isOpen, onClose }) => {
  if (!isOpen || !log) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warn':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {getLevelIcon(log.level)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Log Entry Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatLogTimestamp(log.timestamp)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              {/* Level and Service */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Log Level & Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="outline" 
                      className={cn('text-sm', getLogLevelColor(log.level))}
                    >
                      {log.level.toUpperCase()}
                    </Badge>
                    <Badge variant="secondary" className="text-sm">
                      {log.service}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-sm">
                      {log.category}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      {log.section}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Message */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                    {log.message}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(log.message)}
                    className="mt-3 flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Message</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Timestamps */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Timestamps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                    <span className="font-mono text-gray-900 dark:text-gray-100">
                      {formatLogTimestamp(log.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Timestamp:</span>
                    <span className="font-mono text-gray-900 dark:text-gray-100">
                      {formatLogTimestamp(log.timestamp)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-4">
              {/* Request & User Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Request & User Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {log.request_id && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Request ID:</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                          {log.request_id}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(log.request_id)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {log.user_id && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">User ID:</span>
                      </div>
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                        {log.user_id}
                      </span>
                    </div>
                  )}
                  {log.ip_address && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">IP Address:</span>
                      </div>
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                        {log.ip_address}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* User Agent */}
              {log.user_agent && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">User Agent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-900 dark:text-gray-100 font-mono break-all">
                      {log.user_agent}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              {log.meta && Object.keys(log.meta).length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Metadata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto text-gray-900 dark:text-gray-100">
                      {JSON.stringify(log.meta, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {/* Stack Trace */}
              {log.stack_trace && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
                      Stack Trace
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-3 rounded overflow-x-auto text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                      {log.stack_trace}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for className concatenation
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
