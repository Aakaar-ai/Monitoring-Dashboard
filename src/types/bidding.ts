export interface WorkflowMetrics {
    totalLLMCost: number;
    totalBidHolds: number;
    totalKeywords: number;
    totalBidPauses: number;
    totalCampaigns: number;
    totalBidDecreases: number;
    totalBidIncreases: number;
    totalPromptTokens: number;
    totalActionsFailed: number;
    totalActionsCreated: number;
    totalCampaignsFailed: number;
    totalKeywordsSkipped: number;
    totalCampaignsSkipped: number;
    totalCompletionTokens: number;
    totalKeywordsProcessed: number;
    totalCampaignsCompleted: number;
    totalKeywordsInCooldown: number;
    totalCampaignsInCooldown: number;
    averageProcessingTimePerCampaign: number;
}

export interface BidChange {
    kps: number | null;
    action: 'increase' | 'decrease' | 'hold' | 'pause';
    newBid: number;
    reason: string;
    keywordId: string;
    currentBid: number;
    keywordText: string;
    changePercent: number;
}

export interface WorkflowRun {
    id: number;
    workflow_name: string;
    start_time: string;
    end_time: string | null;
    scheduled: number;
    completed: number;
    failed: number;
    retries: number;
    total_runtime_sec: number;
    metrics: WorkflowMetrics;
    identifiers: {
        runDate: string;
        customerName: string;
        campaignId?: string;
    };
    extras: {
        finalResult?: {
            campaigns?: Array<{
                error: null | string;
                status: string;
                metrics: {
                    holdCount: number;
                    pauseCount: number;
                    decreaseCount: number;
                    increaseCount: number;
                    totalKeywords: number;
                };
                bidChanges: number;
                campaignId: string;
            }>;
            bidChanges?: BidChange[];
            totalCampaigns?: number;
            failedCampaigns?: number;
            successfulCampaigns?: number;
        };
    };
    parent_run_id: number | null;
    status: 'COMPLETED' | 'FAILED' | 'RUNNING';
    children?: WorkflowRun[];
}

export interface WorkflowStats {
    totalRuns: number;
    byStatus: {
        COMPLETED: number;
        FAILED: number;
        RUNNING: number;
    };
    byCustomer: {
        [key: string]: {
            runs: number;
            keywords: number;
            actions: number;
            cost: number;
        };
    };
    metrics: {
        totalKeywords: number;
        totalActionsCreated: number;
        totalLLMCost: number;
        averageRuntime: number;
    };
    timeDistribution: {
        byHour: Record<string, number>;
        byDay: Record<string, number>;
        byMonth: Record<string, number>;
    };
}

export interface FilterOptions {
    customers: string[];
    campaigns: string[];
    profiles: (string | number)[];
    statuses: string[];
    users: number[];
}

export interface WorkflowRunsResponse {
    runs: WorkflowRun[];
    summary: {
        totalRuns: number;
        completedRuns: number;
        failedRuns: number;
        totalKeywordsProcessed: number;
        totalActionsCreated: number;
        totalLLMCost: number;
        averageRuntime: number;
    };
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
