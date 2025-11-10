import React, { useState, useEffect } from 'react';
import { FilterPanel } from '../components/BiddingMonitor/FilterPanel';
import { SummaryCards } from '../components/BiddingMonitor/SummaryCards';
import { CustomerTable } from '../components/BiddingMonitor/CustomerTable';
import { TimeDistributionChart } from '../components/BiddingMonitor/TimeDistributionChart';
import { WorkflowRunCard } from '../components/BiddingMonitor/WorkflowRunCard';
import { apiService } from '../services/api';
import { WorkflowRun, WorkflowStats, FilterOptions } from '../types/bidding';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { CustomerRunsGroup } from '@/components/BiddingMonitor/CustomerRunsGroup';

export const BiddingMonitor: React.FC = () => {
  // State management
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [stats, setStats] = useState<WorkflowStats | null>(null);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const handleError = (error: any) => {
    console.error('Error:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: error?.message || 'An error occurred while fetching data',
    });
  };

  const fetchData = async (pageNumber = page) => {
    try {
      setLoading(true);

      const [runsData, statsData, filterOptions] = await Promise.allSettled([
        apiService.getWorkflowRuns(pageNumber, 10, {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          customerName: selectedCustomer === "all" ? undefined : selectedCustomer,
          campaignId: selectedCampaign === "all" ? undefined : selectedCampaign,
          profileId: selectedProfile === "all" ? undefined : selectedProfile,
          status: selectedStatus === "all" ? undefined : selectedStatus,
          isParentOnly: true,
          includeChildren: true,
          sortBy: 'start_time',
          sortOrder: 'desc'
        }),
        apiService.getWorkflowStats({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          customerName: selectedCustomer === "all" ? undefined : selectedCustomer
        }),
        apiService.getWorkflowFilters()
      ]);

      if (runsData.status === 'fulfilled') {
        setRuns(runsData.value.runs);
        setTotalPages(runsData.value.pagination.totalPages);
        setPage(runsData.value.pagination.page);
      } else {
        handleError(runsData.reason);
      }

      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
      } else {
        handleError(statsData.reason);
      }

      if (filterOptions.status === 'fulfilled') {
        setFilters(filterOptions.value as unknown as FilterOptions);
      } else {
        handleError(filterOptions.reason);
      }

    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter stats to only include parent runs
  const filteredStats = React.useMemo(() => {
    if (!stats) return null;

    // Create a copy of stats with filtered data
    const parentOnlyStats = { ...stats };
    
    // Recalculate counts based on parent runs only
    const parentRunsCount = runs.length;
    const completedRuns = runs.filter(run => run.status === 'COMPLETED').length;
    const failedRuns = runs.filter(run => run.status === 'FAILED').length;
    const runningRuns = runs.filter(run => run.status === 'RUNNING').length;

    parentOnlyStats.totalRuns = parentRunsCount;
    parentOnlyStats.byStatus = {
      COMPLETED: completedRuns,
      FAILED: failedRuns,
      RUNNING: runningRuns
    };

    // Recalculate time distribution based on parent runs only
    const byHour: Record<string, number> = {};
    const byDay: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    runs.forEach(run => {
      const startDate = new Date(run.start_time);
      const hour = startDate.getHours().toString();
      const day = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const month = startDate.toISOString().substring(0, 7); // YYYY-MM

      byHour[hour] = (byHour[hour] || 0) + 1;
      byDay[day] = (byDay[day] || 0) + 1;
      byMonth[month] = (byMonth[month] || 0) + 1;
    });

    parentOnlyStats.timeDistribution = {
      byHour,
      byDay,
      byMonth
    };

    // Recalculate byCustomer data based on parent runs only
    const byCustomer: Record<string, { runs: number; keywords: number; actions: number; cost: number }> = {};
    let totalKeywords = 0;
    let totalActions = 0;
    let totalCost = 0;
    
    runs.forEach(run => {
      const customer = run.identifiers.customerName;
      if (!byCustomer[customer]) {
        byCustomer[customer] = {
          runs: 0,
          keywords: 0,
          actions: 0,
          cost: 0
        };
      }
      
      const keywords = run.metrics.totalKeywords || 0;
      const actions = run.metrics.totalActionsCreated || 0;
      const cost = run.metrics.totalLLMTotalCostMicros || 0;
      
      byCustomer[customer].runs += 1;
      byCustomer[customer].keywords += keywords;
      byCustomer[customer].actions += actions;
      byCustomer[customer].cost += cost;
      
      // Add to totals
      totalKeywords += keywords;
      totalActions += actions;
      totalCost += cost;
    });

    parentOnlyStats.byCustomer = byCustomer;
    
    // Update metrics with recalculated totals
    parentOnlyStats.metrics = {
      ...parentOnlyStats.metrics,
      totalKeywords,
      totalActionsCreated: totalActions,
      totalLLMCost: totalCost
    };

    return parentOnlyStats;
  }, [stats, runs]);

  const groupedRuns = React.useMemo(() => {
    const groups: Record<string, WorkflowRun[]> = {};
    runs.forEach(run => {
      const customer = run.identifiers.customerName;
      if (!groups[customer]) {
        groups[customer] = [];
      }
      groups[customer].push(run);
    });
    return groups;
  }, [runs]);

  useEffect(() => {
    fetchData(1); // Reset to first page when filters change
  }, [dateRange, selectedCustomer, selectedCampaign, selectedProfile, selectedStatus]);

  // Loading skeletons
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[100px]" />
              <Skeleton className="h-4 w-[120px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bidding Agent Monitor</h2>
          <p className="text-muted-foreground">
            Track and analyze automated bidding performance across campaigns
          </p>
        </div>
      </div>

      <FilterPanel
        dateRange={dateRange}
        selectedCustomer={selectedCustomer}
        selectedCampaign={selectedCampaign}
        selectedProfile={selectedProfile}
        selectedStatus={selectedStatus}
        filters={filters}
        onDateRangeChange={setDateRange}
        onCustomerChange={setSelectedCustomer}
        onCampaignChange={setSelectedCampaign}
        onProfileChange={setSelectedProfile}
        onStatusChange={setSelectedStatus}
        onRefresh={() => fetchData(1)}
      />

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {filteredStats && <SummaryCards stats={filteredStats} />}

          {filteredStats && (
            <TimeDistributionChart
              byHour={filteredStats.timeDistribution.byHour}
              byDay={filteredStats.timeDistribution.byDay}
            />
          )}

          {filteredStats && <CustomerTable stats={filteredStats} />}
          {Object.entries(groupedRuns).map(([customer, customerRuns]) => (
            <CustomerRunsGroup
              key={customer}
              customerName={customer}
              runs={customerRuns}
            />
          ))}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {runs.map((run) => (
                  <WorkflowRunCard key={run.id} run={run} />
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => fetchData(page - 1)}
                    disabled={page === 1 || loading}
                  >
                    Previous
                  </Button>
                  <span className="py-2">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => fetchData(page + 1)}
                    disabled={page === totalPages || loading}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
