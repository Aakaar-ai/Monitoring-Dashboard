import { WorkflowRunsResponse, WorkflowStats } from '@/types/bidding';
import { LogEntry, LogStats, FilterState, FilterOptions, ExportOptions } from '../types';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/logs`;
const WORKFLOW_RUNS_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/workflow-runs`;

interface DayPartingAnalyticsFilters {
  profileId?: string;
  startDate?: Date;
  endDate?: Date;
  campaignType?: string;
  marketplace?: string;
  advertiserId?: string;
}

interface DayPartingData {
  data: {
    summary: any;
    hourlyTrends: any;
    dailyTrends: any;
    campaignTypeBreakdown: any;
  };
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async getLogs(
    page = 1,
    limit = 100,
    filters?: Partial<FilterState>
  ): Promise<{ logs: LogEntry[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      if (filters.levels?.length) {
        params.append('level', filters.levels.join(','));
      }
      if (filters.services?.length) {
        params.append('service', filters.services.join(','));
      }
      if (filters.categories?.length) {
        params.append('category', filters.categories.join(','));
      }
      if (filters.sections?.length) {
        params.append('section', filters.sections.join(','));
      }
      if (filters.searchQuery) {
        params.append('search', filters.searchQuery);
      }
      if (filters.requestId) {
        params.append('requestId', filters.requestId);
      }
      if (filters.userId) {
        params.append('userId', filters.userId);
      }
      if (filters.dateRange?.start) {
        params.append('startDate', filters.dateRange.start.toISOString());
      }
      if (filters.dateRange?.end) {
        params.append('endDate', filters.dateRange.end.toISOString());
      }
    }

    return this.request(`/?${params}`);
  }

  async getStats(filters?: Partial<FilterState>): Promise<LogStats> {
    const params = new URLSearchParams();

    if (filters?.dateRange?.start) {
      params.append('startDate', filters.dateRange.start.toISOString());
    }
    if (filters?.dateRange?.end) {
      params.append('endDate', filters.dateRange.end.toISOString());
    }
    if (filters?.services?.length) {
      params.append('service', filters.services.join(','));
    }
    if (filters?.categories?.length) {
      params.append('category', filters.categories.join(','));
    }

    return this.request(`/stats?${params}`);
  }

  async getFilterOptions(): Promise<FilterOptions> {
    return this.request('/filters');
  }

  async exportLogs(options: ExportOptions): Promise<Blob> {
    const params = new URLSearchParams({
      format: options.format,
      includeMetadata: options.includeMetadata.toString(),
    });

    if (options.dateRange) {
      params.append('startDate', options.dateRange.start.toISOString());
      params.append('endDate', options.dateRange.end.toISOString());
    }

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          if (Array.isArray(value) && value.length > 0) {
            params.append(key, value.join(','));
          } else if (!Array.isArray(value)) {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/logs/export?${params}`);

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  private async workflowRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${WORKFLOW_RUNS_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Workflow API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async getWorkflowRuns(
    page = 1,
    limit = 100,
    filters?: {
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      status?: string;
      workflowName?: string;
      startDate?: string;
      endDate?: string;
      runId?: string;
      customerName?: string;
      campaignId?: string;
      profileId?: string;
      userId?: string;
      minKeywords?: number;
      maxKeywords?: number;
      minCost?: number;
      maxCost?: number;
      parentRunId?: string;
      isParentOnly?: boolean;
      includeChildren?: boolean;
      minDuration?: number;
      maxDuration?: number;
      hasErrors?: boolean;
      inCooldown?: boolean;
      hasCosts?: boolean;
      minTotalCost?: number;
      maxTotalCost?: number;
    }
  ): Promise<WorkflowRunsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      workflowName: 'biddingAgent', // Default workflow name
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    return this.workflowRequest('?' + params.toString());
  }

  async getWorkflowStats(
    filters?: {
      startDate?: string;
      endDate?: string;
      customerName?: string;
      workflowName?: string;
    }
  ): Promise<WorkflowStats> {
    const params = new URLSearchParams({
      workflowName: filters?.workflowName || 'biddingAgent',
    });

    if (filters) {
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.customerName) params.append('customerName', filters.customerName);
    }

    return this.workflowRequest('/stats?' + params.toString());
  }

  async getWorkflowFilters(workflowName = 'biddingAgent'): Promise<FilterOptions> {
    return this.workflowRequest('/filters?workflowName=' + workflowName);
  }

  async getDayPartingAnalytics(filters: DayPartingAnalyticsFilters): Promise<DayPartingData> {
    const params = new URLSearchParams();

    if (filters.profileId) params.append('profileId', filters.profileId);
    if (filters.startDate) params.append('startDate', filters.startDate.toISOString().split('T')[0]);
    if (filters.endDate) params.append('endDate', filters.endDate.toISOString().split('T')[0]);
    if (filters.campaignType) params.append('campaignType', filters.campaignType);
    if (filters.marketplace) params.append('marketplace', filters.marketplace);
    if (filters.advertiserId) params.append('advertiserId', filters.advertiserId);

    return this.request('/day-parting?' + params.toString());
  }

}

export const apiService = new ApiService();