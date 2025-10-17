// src/components/BiddingMonitor/CustomerTable.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { WorkflowStats } from '@/types/bidding';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface CustomerTableProps {
  stats: WorkflowStats;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Performance</CardTitle>
        <CardDescription>Breakdown by customer campaigns and actions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Total Runs</TableHead>
              <TableHead className="text-right">Keywords</TableHead>
              <TableHead className="text-right">Actions</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Success Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(stats.byCustomer).map(([customer, data]) => {
              const successRate = ((data.runs > 0 ? data.actions / data.runs : 0) * 100).toFixed(1);
              return (
                <TableRow key={customer}>
                  <TableCell className="font-medium">{customer}</TableCell>
                  <TableCell className="text-right">{data.runs}</TableCell>
                  <TableCell className="text-right">{data.keywords.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{data.actions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    ${(data.cost / 1000000).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={Number(successRate) > 50 ? "default" : "secondary"}>
                      {successRate}%
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
            {/* Total Row */}
            <TableRow className="font-semibold bg-muted/50">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{stats.totalRuns}</TableCell>
              <TableCell className="text-right">{stats.metrics.totalKeywords.toLocaleString()}</TableCell>
              <TableCell className="text-right">{stats.metrics.totalActionsCreated.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                ${(stats.metrics.totalLLMCost / 1000000).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="outline">
                  {((stats.byStatus.COMPLETED / stats.totalRuns) * 100).toFixed(1)}%
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};