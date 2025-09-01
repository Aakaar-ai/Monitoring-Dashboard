import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, ExternalLink } from 'lucide-react';
import { LogEntry as LogEntryType } from '../../types';
import { formatLogTimestamp, isValidTimestamp } from '../../utils/dateUtils';
import { getLogLevelColor, highlightSearchTerm } from '../../utils/logUtils';
import { useLogStore } from '../../stores/logStore';
import { Button } from '../ui/Button';

interface LogEntryProps {
  index: number;
  style: React.CSSProperties;
  data: LogEntryType[];
}

export const LogEntry: React.FC<LogEntryProps> = ({ index, style, data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { filters } = useLogStore();
  const log = data[index];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const highlightedMessage = highlightSearchTerm(
    log.message,
    filters.searchQuery,
    filters.isRegexSearch
  );

  // Safely format timestamps
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp || !isValidTimestamp(timestamp)) {
      return 'Invalid Date';
    }
    return formatLogTimestamp(timestamp);
  };

  return (
    <div style={style} className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="flex items-start space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-6 h-6 p-0 mt-1"
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {formatTimestamp(log.timestamp)}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
              {log.level.toUpperCase()}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {log.service}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {log.category}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {log.section}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <p 
              className="text-sm text-gray-900 dark:text-gray-100 flex-1 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightedMessage }}
            />
            <div className="flex items-center space-x-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(log.message)}
                className="w-6 h-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
              {log.request_id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0"
                  title={`Request ID: ${log.request_id}`}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {isExpanded && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="grid grid-cols-2 gap-4 text-xs">
                {log.request_id && (
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Request ID:</span>
                    <span className="ml-2 font-mono text-gray-900 dark:text-gray-100">{log.request_id}</span>
                  </div>
                )}
                {log.user_id && (
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">User ID:</span>
                    <span className="ml-2 font-mono text-gray-900 dark:text-gray-100">{log.user_id}</span>
                  </div>
                )}
                {log.ip_address && (
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">IP Address:</span>
                    <span className="ml-2 font-mono text-gray-900 dark:text-gray-100">{log.ip_address}</span>
                  </div>
                )}
                {log.user_agent && (
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">User Agent:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100 truncate">{log.user_agent}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Created:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {formatTimestamp(log.created_at)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Timestamp:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
              </div>
              
              {log.meta && Object.keys(log.meta).length > 0 && (
                <div className="mt-3">
                  <span className="font-medium text-gray-600 dark:text-gray-400 text-xs">Metadata:</span>
                  <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
                    {JSON.stringify(log.meta, null, 2)}
                  </pre>
                </div>
              )}
              
              {log.stack_trace && (
                <div className="mt-3">
                  <span className="font-medium text-gray-600 dark:text-gray-400 text-xs">Stack Trace:</span>
                  <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto text-red-600 dark:text-red-400">
                    {log.stack_trace}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};