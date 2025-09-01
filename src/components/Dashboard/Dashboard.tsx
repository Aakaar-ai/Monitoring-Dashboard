import React from 'react';
import { StatsCards } from '../StatsCards/StatsCards';
import { LogLevelChart } from '../Charts/LogLevelChart';
import { LogTrendsChart } from '../Charts/LogTrendsChart';
import { ServiceBreakdownChart } from '../Charts/ServiceBreakdownChart';
import { LogTable } from '../LogTable/LogTable';
import { ErrorBoundary } from '../ErrorBoundary';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <ErrorBoundary>
        <StatsCards />
      </ErrorBoundary>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ErrorBoundary>
          <LogLevelChart />
        </ErrorBoundary>
        <ErrorBoundary>
          <ServiceBreakdownChart />
        </ErrorBoundary>
        <ErrorBoundary>
          <LogTrendsChart />
        </ErrorBoundary>
      </div>

      <ErrorBoundary>
        <LogTable />
      </ErrorBoundary>
    </div>
  );
};