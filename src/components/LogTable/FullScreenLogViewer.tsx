import React, { useState, useRef, useEffect } from 'react';
import { X, Copy, Download, Search, Filter, RefreshCw } from 'lucide-react';
import { LogEntry } from '../../types';
import { formatLogTimestamp, isValidTimestamp } from '../../utils/dateUtils';
import { getLogLevelColor, highlightSearchTerm } from '../../utils/logUtils';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface FullScreenLogViewerProps {
  logs: LogEntry[];
  onClose: () => void;
  filters: any;
}

export const FullScreenLogViewer: React.FC<FullScreenLogViewerProps> = ({
  logs,
  onClose,
  filters,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(logs);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredLogs(logs);
  }, [logs]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = logs.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.request_id && log.request_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.user_id && log.user_id.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredLogs(filtered);
    } else {
      setFilteredLogs(logs);
    }
  }, [searchTerm, logs]);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportLogs = () => {
    const logText = filteredLogs.map(log => 
      `[${formatLogTimestamp(log.timestamp)}] ${log.level.toUpperCase()} ${log.service}/${log.category}/${log.section}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const highlightedMessage = (message: string) => {
    if (!searchTerm) return message;
    return highlightSearchTerm(message, searchTerm, false);
  };

  // Safely format timestamps
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp || !isValidTimestamp(timestamp)) {
      return 'Invalid Date';
    }
    return formatLogTimestamp(timestamp);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold">Full Screen Log Viewer</h2>
            <span className="text-sm text-gray-400">
              {filteredLogs.length} of {logs.length} logs
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-white placeholder-gray-400 outline-none min-w-[200px]"
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoScroll(!autoScroll)}
              className={`text-white hover:bg-gray-700 ${autoScroll ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={exportLogs}
              className="text-white hover:bg-gray-700"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Logs Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-gray-950 text-gray-100 p-4 font-mono text-sm"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            {searchTerm ? 'No logs match your search.' : 'No logs available.'}
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div
              key={`${log.id}-${index}`}
              className="mb-2 p-3 bg-gray-900 rounded border-l-4 border-gray-700 hover:bg-gray-800 transition-colors"
              style={{ borderLeftColor: getLogLevelColor(log.level).replace('bg-', '').replace('text-', '') === 'red-600' ? '#dc2626' : 
                       getLogLevelColor(log.level).replace('bg-', '').replace('text-', '') === 'yellow-600' ? '#d97706' : 
                       getLogLevelColor(log.level).replace('bg-', '').replace('text-', '') === 'blue-600' ? '#2563eb' : '#6b7280' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-gray-400 font-mono text-xs">
                      {formatTimestamp(log.timestamp)}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-blue-400 font-medium">
                      {log.service}
                    </span>
                    <span className="text-green-400">
                      {log.category}
                    </span>
                    <span className="text-purple-400">
                      {log.section}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <span 
                      className="text-white leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: highlightedMessage(log.message) }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-400">
                    {log.request_id && (
                      <div>
                        <span className="font-medium">Request ID:</span>
                        <span className="ml-2 font-mono text-gray-300">{log.request_id}</span>
                      </div>
                    )}
                    {log.user_id && (
                      <div>
                        <span className="font-medium">User ID:</span>
                        <span className="ml-2 font-mono text-gray-300">{log.user_id}</span>
                      </div>
                    )}
                    {log.ip_address && (
                      <div>
                        <span className="font-medium">IP:</span>
                        <span className="ml-2 font-mono text-gray-300">{log.ip_address}</span>
                      </div>
                    )}
                    {log.user_agent && (
                      <div>
                        <span className="font-medium">User Agent:</span>
                        <span className="ml-2 font-mono text-gray-300 truncate">{log.user_agent}</span>
                      </div>
                    )}
                  </div>
                  
                  {log.meta && Object.keys(log.meta).length > 0 && (
                    <div className="mt-3">
                      <span className="font-medium text-gray-400 text-xs">Metadata:</span>
                      <pre className="mt-1 text-xs bg-gray-800 p-2 rounded overflow-x-auto text-gray-300">
                        {JSON.stringify(log.meta, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {log.stack_trace && (
                    <div className="mt-3">
                      <span className="font-medium text-gray-400 text-xs">Stack Trace:</span>
                      <pre className="mt-1 text-xs bg-gray-800 p-2 rounded overflow-x-auto text-red-300">
                        {log.stack_trace}
                      </pre>
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(log.message)}
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
