import { create } from 'zustand';
import { LogEntry, FilterState, LogStats, ConnectionStatus, PaginationInfo, FilterOptions } from '../types';

interface LogStore {
  logs: LogEntry[];
  filteredLogs: LogEntry[];
  stats: LogStats | null;
  filterOptions: FilterOptions | null;
  connectionStatus: ConnectionStatus;
  filters: FilterState;
  pagination: PaginationInfo;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  
  // Actions
  setLogs: (logs: LogEntry[]) => void;
  addLog: (log: LogEntry) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  setStats: (stats: LogStats) => void;
  setFilterOptions: (options: FilterOptions) => void;
  setConnectionStatus: (status: Partial<ConnectionStatus>) => void;
  setPagination: (pagination: PaginationInfo) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setError: (error: string | null) => void;
  toggleTheme: () => void;
  applyFilters: () => void;
  clearFilters: () => void;
  resetStore: () => void;
}

const initialFilters: FilterState = {
  dateRange: {},
  levels: [],
  services: [],
  categories: [],
  sections: [],
  searchQuery: '',
  requestId: '',
  userId: '',
  isRegexSearch: false,
};

const initialConnectionStatus: ConnectionStatus = {
  isConnected: false,
  clientCount: 0,
  reconnectAttempts: 0,
};

const initialPagination: PaginationInfo = {
  page: 1,
  limit: 100,
  total: 0,
  totalPages: 0,
};

export const useLogStore = create<LogStore>((set, get) => ({
  logs: [],
  filteredLogs: [],
  stats: null,
  filterOptions: null,
  connectionStatus: initialConnectionStatus,
  filters: initialFilters,
  pagination: initialPagination,
  isLoading: false,
  isInitialized: false,
  error: null,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',

  setLogs: (logs) => {
    set({ logs });
    get().applyFilters();
  },

  addLog: (log) => {
    const { logs } = get();
    const newLogs = [log, ...logs].slice(0, 10000); // Keep only last 10k logs
    set({ logs: newLogs });
    get().applyFilters();
  },

  updateFilters: (newFilters) => {
    const currentFilters = get().filters;
    const updatedFilters = { ...currentFilters, ...newFilters };
    
    // Only update if filters actually changed
    if (JSON.stringify(currentFilters) !== JSON.stringify(updatedFilters)) {
      set({ filters: updatedFilters });
      get().applyFilters();
    }
  },

  setStats: (stats) => set({ stats }),

  setFilterOptions: (filterOptions) => set({ filterOptions }),

  setConnectionStatus: (status) =>
    set({ connectionStatus: { ...get().connectionStatus, ...status } }),

  setPagination: (pagination) => set({ pagination }),

  setLoading: (isLoading) => set({ isLoading }),

  setInitialized: (isInitialized) => set({ isInitialized }),

  setError: (error) => set({ error }),

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    set({ theme: newTheme });
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  applyFilters: () => {
    const { logs, filters } = get();
    let filtered = [...logs];

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.timestamp);
        if (filters.dateRange.start && logDate < filters.dateRange.start) return false;
        if (filters.dateRange.end && logDate > filters.dateRange.end) return false;
        return true;
      });
    }

    // Level filter
    if (filters.levels.length > 0) {
      filtered = filtered.filter((log) => filters.levels.includes(log.level));
    }

    // Service filter
    if (filters.services.length > 0) {
      filtered = filtered.filter((log) => filters.services.includes(log.service));
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((log) => filters.categories.includes(log.category));
    }

    // Section filter
    if (filters.sections.length > 0) {
      filtered = filtered.filter((log) => filters.sections.includes(log.section));
    }

    // Text search
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter((log) => {
        if (filters.isRegexSearch) {
          try {
            const regex = new RegExp(query, 'i');
            return regex.test(log.message) || 
                   (log.meta && regex.test(JSON.stringify(log.meta)));
          } catch {
            return false;
          }
        } else {
          return log.message.toLowerCase().includes(query) ||
                 (log.meta && JSON.stringify(log.meta).toLowerCase().includes(query));
        }
      });
    }

    // Request ID filter
    if (filters.requestId) {
      filtered = filtered.filter((log) => 
        log.request_id?.toLowerCase().includes(filters.requestId.toLowerCase())
      );
    }

    // User ID filter
    if (filters.userId) {
      filtered = filtered.filter((log) => 
        log.user_id?.toLowerCase().includes(filters.userId.toLowerCase())
      );
    }

    set({ filteredLogs: filtered });
  },

  clearFilters: () => {
    set({ filters: initialFilters });
    get().applyFilters();
  },

  resetStore: () => {
    set({
      logs: [],
      filteredLogs: [],
      stats: null,
      filterOptions: null,
      pagination: initialPagination,
      isLoading: false,
      isInitialized: false,
      error: null,
    });
  },
}));