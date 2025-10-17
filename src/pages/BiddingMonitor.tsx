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
          {stats && <SummaryCards stats={stats} />}

          {stats && (
            <TimeDistributionChart
              byHour={stats.timeDistribution.byHour}
              byDay={stats.timeDistribution.byDay}
            />
          )}

          {stats && <CustomerTable stats={stats} />}

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
