import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Activity, Users, DollarSign, Zap, ShoppingCart } from 'lucide-react';
import { WorkflowStats } from '@/types/bidding';

interface SummaryCardsProps {
  stats: WorkflowStats;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  const totalCustomers = Object.keys(stats.byCustomer).length;
  const totalLLMCalls = stats.metrics.totalLLMCalls || 0;
  const totalAmazonCalls = stats.metrics.totalAmazonApiCalls || 0;
  const totalCost = (stats.metrics.totalLLMCost || 0) / 1000000;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
          <div className="text-xs text-muted-foreground">
            Bidding Agent Ran
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRuns}</div>
          <div className="text-xs text-muted-foreground">
            {stats.byStatus.COMPLETED} completed, {stats.byStatus.FAILED} failed
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total LLM Calls</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLLMCalls.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">
            AI Calls
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Amazon Calls</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAmazonCalls.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">
            Calls to Amazon
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalCost.toFixed(3)}</div>
          <div className="text-xs text-muted-foreground">
            LLM processing cost
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
