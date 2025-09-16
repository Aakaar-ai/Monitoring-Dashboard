import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { 
  Terminal, 
  Play, 
  Pause, 
  Download, 
  Search,
  Copy,
  Trash2,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Info,
  Clock,
  Activity,
  Zap
} from 'lucide-react';
import { formatLogTimestamp } from '../utils/dateUtils';
import { LogEntry as LogEntryType } from '../types';
import { useWebSocket } from '../hooks/useWebSocket';
import { useLogStore } from '../stores/logStore';

export const LiveTerminal: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTimestamp, setShowTimestamp] = useState(true);
  const [showLevel, setShowLevel] = useState(true);
  const [showService, setShowService] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedLevels, setSelectedLevels] = useState(['error', 'warn', 'info', 'debug']);
  const [maxLines, setMaxLines] = useState(1000);
  const [autoScroll, setAutoScroll] = useState(true);
  const [liveLogs, setLiveLogs] = useState<LogEntryType[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [expandedLogIndex, setExpandedLogIndex] = useState<number | null>(null);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const { isConnected } = useWebSocket();
  const { logs } = useLogStore();

  // Update connection status based on WebSocket state
  useEffect(() => {
    if (isConnected) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('disconnected');
    }
  }, [isConnected]);

  // Listen for new logs from the store
  useEffect(() => {
    if (isPlaying && logs.length > 0) {
      // Get the latest logs from the store
      const latestLogs = logs.slice(-maxLines);
      setLiveLogs(latestLogs);
    }
  }, [logs, isPlaying, maxLines]);

  // Listen for new logs being added to the store
  useEffect(() => {
    const unsubscribe = useLogStore.subscribe((state) => {
      if (isPlaying && state.logs.length > 0) {
        // Get the latest logs, keeping only the most recent ones
        const latestLogs = state.logs.slice(-maxLines);
        setLiveLogs(latestLogs);
      }
    });

    return unsubscribe;
  }, [isPlaying, maxLines]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [liveLogs, autoScroll]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
      if (event.key === 'f' && event.ctrlKey) {
        event.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
      if (event.key === ' ' && event.ctrlKey) {
        event.preventDefault();
        setIsPlaying(!isPlaying);
      }
      if (event.key === 'c' && event.ctrlKey) {
        event.preventDefault();
        clearTerminal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, isPlaying]);

  // Filter logs based on query and selected levels
  const filteredLogs = liveLogs.filter(log => {
    const matchesQuery = !filterQuery || 
      log.message.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (log.request_id && log.request_id.toLowerCase().includes(filterQuery.toLowerCase()));
    
    const matchesLevel = selectedLevels.includes(log.level.toLowerCase());
    
    return matchesQuery && matchesLevel;
  });

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case 'warn':
        return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case 'info':
        return <Info className="w-3 h-3 text-blue-500" />;
      case 'debug':
        return <Activity className="w-3 h-3 text-gray-500" />;
      default:
        return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'disconnected':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'connecting':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const clearTerminal = () => {
    setLiveLogs([]);
    // Also clear the logs in the store if needed
    // Note: This might affect other components, so we only clear local state
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportLogs = () => {
    const logText = filteredLogs.map(log => 
      `${formatLogTimestamp(log.timestamp)} [${log.level.toUpperCase()}] ${log.service}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `live-logs-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const toggleLogExpansion = (index: number) => {
    setExpandedLogIndex(expandedLogIndex === index ? null : index);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Live Terminal</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Real-time log streaming with terminal-style interface
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant="outline" 
            className={cn('text-sm', getConnectionStatusColor())}
          >
            {connectionStatus === 'connected' && <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />}
            {connectionStatus === 'connecting' && <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-spin" />}
            {connectionStatus === 'disconnected' && <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />}
            {connectionStatus}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {filteredLogs.length} logs
          </Badge>
        </div>
      </div>

      {/* Controls Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-2"
                title="Ctrl+Space to toggle play/pause"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </Button>

              {/* Clear */}
              <Button
                variant="outline"
                size="sm"
                onClick={clearTerminal}
                className="flex items-center space-x-2"
                title="Ctrl+C to clear terminal"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </Button>

              {/* Export */}
              <Button
                variant="outline"
                size="sm"
                onClick={exportLogs}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>

              {/* Fullscreen */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center space-x-2"
                title="Ctrl+F to toggle fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
                <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Level Filters */}
              <div className="flex space-x-2">
                {[
                  { level: 'error', color: 'bg-red-500 hover:bg-red-600 text-white', icon: AlertTriangle },
                  { level: 'warn', color: 'bg-yellow-500 hover:bg-yellow-600 text-white', icon: AlertTriangle },
                  { level: 'info', color: 'bg-blue-500 hover:bg-blue-600 text-white', icon: Info },
                  { level: 'debug', color: 'bg-gray-500 hover:bg-gray-600 text-white', icon: Activity }
                ].map(({ level, color, icon: Icon }) => (
                  <Button
                    key={level}
                    variant={selectedLevels.includes(level) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLevel(level)}
                    className={cn(
                      "px-3 py-2 capitalize font-medium transition-all duration-200",
                      selectedLevels.includes(level) 
                        ? color 
                        : "border-2 hover:scale-105"
                    )}
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terminal Display */}
      <Card className={cn(
        "transition-all duration-300",
        isFullscreen ? "terminal-fullscreen" : ""
      )}>
        <CardHeader className={cn("pb-3", isFullscreen ? "bg-gray-900 border-b border-gray-700" : "")}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-green-600" />
              <span>Live Log Stream</span>
              {isFullscreen && (
                <Badge variant="outline" className="ml-2 text-xs bg-green-900/20 text-green-400 border-green-600">
                  FULLSCREEN
                </Badge>
              )}
            </CardTitle>
                          <div className="flex items-center space-x-4">
                {/* Display Options */}
                <div className="flex items-center space-x-2 text-sm">
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={showTimestamp}
                      onChange={(e) => setShowTimestamp(e.target.checked)}
                      className="rounded"
                    />
                    <span>Timestamp</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={showLevel}
                      onChange={(e) => setShowLevel(e.target.checked)}
                      className="rounded"
                    />
                    <span>Level</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={showService}
                      onChange={(e) => setShowService(e.target.checked)}
                      className="rounded"
                    />
                    <span>Service</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={autoScroll}
                      onChange={(e) => setAutoScroll(e.target.checked)}
                      className="rounded"
                    />
                    <span>Auto-scroll</span>
                  </label>
                </div>

                {/* Max Lines */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Max Lines:</span>
                  <Input
                    type="number"
                    value={maxLines}
                    onChange={(e) => setMaxLines(parseInt(e.target.value) || 1000)}
                    className="w-20"
                    min="100"
                    max="10000"
                  />
                </div>

                {/* Close Fullscreen Button */}
                {isFullscreen && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(false)}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white border-red-600"
                  >
                    <Minimize2 className="w-4 h-4" />
                    <span>Exit Fullscreen</span>
                  </Button>
                )}
              </div>
          </div>
        </CardHeader>
        <CardContent className={cn("p-0", isFullscreen ? "h-full" : "")}>
          <div
            ref={terminalRef}
            className={cn(
              "terminal-bg terminal-text terminal-scrollbar text-sm p-4 overflow-y-auto",
              "border border-gray-200 dark:border-gray-700",
              isFullscreen ? "h-[calc(100vh-120px)] rounded-none" : "h-96 rounded-b-lg"
            )}
          >
            {!isPlaying && (
              <div className="text-yellow-400 mb-2">
                [PAUSED] Log streaming is paused
              </div>
            )}
            
            {connectionStatus === 'disconnected' && (
              <div className="text-red-400 mb-2">
                [DISCONNECTED] WebSocket connection lost
              </div>
            )}

            {filteredLogs.length === 0 ? (
              <div className="text-gray-500">
                {connectionStatus === 'connecting' ? 'Connecting to log stream...' : 'No logs to display'}
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div key={index} className="log-entry">
                  <div
                    className="log-line hover:bg-gray-900 transition-colors py-2 px-3 rounded cursor-pointer border border-transparent hover:border-gray-700"
                    onClick={() => toggleLogExpansion(index)}
                  >
                    <div className="flex items-start space-x-2">
                      {showTimestamp && (
                        <span className="text-gray-500 flex-shrink-0 text-xs font-mono">
                          {formatLogTimestamp(log.timestamp)}
                        </span>
                      )}
                      
                      {showLevel && (
                        <span className={cn(
                          'level-badge flex items-center space-x-1 flex-shrink-0 px-2 py-1 rounded text-xs font-bold',
                          log.level === 'error' ? 'bg-red-900/30 text-red-400 border border-red-600/30' :
                          log.level === 'warn' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-600/30' :
                          log.level === 'info' ? 'bg-blue-900/30 text-blue-400 border border-blue-600/30' :
                          'bg-gray-900/30 text-gray-400 border border-gray-600/30'
                        )}>
                          {getLevelIcon(log.level)}
                          <span>{log.level.toUpperCase()}</span>
                        </span>
                      )}
                      
                      {showService && (
                        <span className="text-blue-400 flex-shrink-0 font-medium">
                          [{log.service}]
                        </span>
                      )}
                      
                      <span className="text-white flex-1 break-words">
                        {expandedLogIndex === index ? log.message : (
                          log.message.length > 150 ? 
                            `${log.message.substring(0, 150)}...` : 
                            log.message
                        )}
                      </span>
                      
                      {log.request_id && (
                        <span className="text-purple-400 text-xs flex-shrink-0 font-mono">
                          req:{log.request_id.slice(0, 8)}
                        </span>
                      )}

                      {/* Expansion indicator */}
                      <span className="text-gray-500 text-xs flex-shrink-0">
                        {expandedLogIndex === index ? '▼' : '▶'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  {expandedLogIndex === index && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg mt-2 p-4 ml-4">
                      <div className="space-y-3">
                        {/* Full message */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Complete Message:</h4>
                          <div className="bg-gray-900 p-3 rounded border border-gray-600">
                            <pre className="text-sm text-white font-mono whitespace-pre-wrap break-words">
                              {log.message}
                            </pre>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <div className="text-xs text-gray-400">
                              <span className="font-semibold">Timestamp:</span>
                              <div className="text-gray-300 font-mono">{formatLogTimestamp(log.timestamp)}</div>
                            </div>
                            <div className="text-xs text-gray-400">
                              <span className="font-semibold">Service:</span>
                              <div className="text-blue-400 font-mono">{log.service}</div>
                            </div>
                            <div className="text-xs text-gray-400">
                              <span className="font-semibold">Level:</span>
                              <div className={cn(
                                'font-mono',
                                log.level === 'error' ? 'text-red-400' :
                                log.level === 'warn' ? 'text-yellow-400' :
                                log.level === 'info' ? 'text-blue-400' :
                                'text-gray-400'
                              )}>{log.level.toUpperCase()}</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {log.request_id && (
                              <div className="text-xs text-gray-400">
                                <span className="font-semibold">Request ID:</span>
                                <div className="text-purple-400 font-mono">{log.request_id}</div>
                              </div>
                            )}
                            {log.user_id && (
                              <div className="text-xs text-gray-400">
                                <span className="font-semibold">User ID:</span>
                                <div className="text-green-400 font-mono">{log.user_id}</div>
                              </div>
                            )}
                            {log.ip_address && (
                              <div className="text-xs text-gray-400">
                                <span className="font-semibold">IP Address:</span>
                                <div className="text-cyan-400 font-mono">{log.ip_address}</div>
                              </div>
                            )}
                            {log.category && (
                              <div className="text-xs text-gray-400">
                                <span className="font-semibold">Category:</span>
                                <div className="text-orange-400 font-mono">{log.category}</div>
                              </div>
                            )}
                            {log.section && (
                              <div className="text-xs text-gray-400">
                                <span className="font-semibold">Section:</span>
                                <div className="text-indigo-400 font-mono">{log.section}</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 pt-2 border-t border-gray-700">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(`${formatLogTimestamp(log.timestamp)} [${log.level.toUpperCase()}] ${log.service}: ${log.message}`);
                            }}
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded flex items-center space-x-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy Log</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(JSON.stringify(log, null, 2));
                            }}
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded flex items-center space-x-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy JSON</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isPlaying && connectionStatus === 'connected' && (
              <div className="text-green-400 animate-pulse flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live streaming from WebSocket...</span>
              </div>
            )}
            
            {isPlaying && connectionStatus === 'disconnected' && (
              <div className="text-red-400 flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>WebSocket disconnected - showing cached logs</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Logs:</span>
                <span className="font-mono text-sm font-bold">{logs.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Live Display:</span>
                <span className="font-mono text-sm font-bold">{liveLogs.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Filtered:</span>
                <span className="font-mono text-sm font-bold">{filteredLogs.length}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(filteredLogs.map(log => 
                  `${formatLogTimestamp(log.timestamp)} [${log.level.toUpperCase()}] ${log.service}: ${log.message}`
                ).join('\n'))}
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy All</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function for className concatenation
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
