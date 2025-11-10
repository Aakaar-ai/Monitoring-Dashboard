// src/components/BiddingMonitor/CustomerTable.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { WorkflowStats } from '@/types/bidding';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
              <TableHead className="text-right">Total Campaigns</TableHead>
              <TableHead className="text-right">Keywords</TableHead>
              <TableHead className="text-right">Actions</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(stats.byCustomer).map(([customer, data]) => {
              return (
                <TableRow key={customer}>
                  <TableCell className="font-medium">{customer}</TableCell>
                  <TableCell className="text-right">{data.runs}</TableCell>
                  <TableCell className="text-right">{data.keywords.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{data.actions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    ${(data.cost / 1000000).toFixed(3)}
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
                ${((stats.metrics.totalLLMCost || 0) / 1000000).toFixed(3)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};