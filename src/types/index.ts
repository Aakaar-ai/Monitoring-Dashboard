export interface LogEntry {
  id: number;
  level: 'error' | 'warn' | 'info' | 'debug' | 'verbose';
  message: string;
  service: string;
  category: string;
  section: string;
  request_id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  meta: { [key: string]: any };
  stack_trace: string | null;
  created_at: string;
  timestamp: string;
}

export interface LogEntryLegacy {
  id: number;
  level: 'error' | 'warn' | 'info' | 'debug' | 'verbose';
  message: string;
  service: string;
  category: string;
  section: string;
  requestId?: string;
  userId?: string;
  duration?: number;
  statusCode?: number;
  metadata?: { [key: string]: any };
  timestamp: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LogsResponse {
  logs: LogEntry[];
  pagination: PaginationInfo;
}

export interface FilterState {
  dateRange: {
    start?: Date;
    end?: Date;
  };
  levels: string[];
  services: string[];
  categories: string[];
  sections: string[];
  searchQuery: string;
  requestId: string;
  userId: string;
  isRegexSearch: boolean;
}

export interface LogStats {
  total: number;
  byLevel: Record<string, number>;
  byService: Record<string, number>;
  byCategory: Record<string, number>;
  byHour: Record<string, number>;
  byDay: Record<string, number>;
}

export interface ConnectionStatus {
  isConnected: boolean;
  clientCount: number;
  lastHeartbeat?: Date;
  reconnectAttempts: number;
}

export interface FilterOptions {
  levels: string[];
  services: string[];
  categories: string[];
  sections: string[];
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  includeMetadata: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: Partial<FilterState>;
}

export interface WebSocketEvent {
  type: 'log' | 'stats' | 'connection' | 'error';
  data: any;
  timestamp: string;
}