import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Activity } from 'lucide-react';
import { WorkflowStats } from '@/types/bidding';

interface SummaryCardsProps {
  stats: WorkflowStats;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRuns}</div>
          <div className="text-xs text-muted-foreground">
            {stats.byStatus.COMPLETED} completed, {stats.byStatus.FAILED} failed
          </div>
        </CardContent>
      </Card>

      {/* Add other cards similar to the original */}
    </div>
  );
};
