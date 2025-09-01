import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLogStore } from '../../stores/logStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export const ServiceBreakdownChart: React.FC = () => {
  const { filteredLogs } = useLogStore();

  const data = React.useMemo(() => {
    const serviceCounts = filteredLogs.reduce((acc, log) => {
      acc[log.service] = (acc[log.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(serviceCounts)
      .map(([service, count]) => ({
        service: service.replace('-service', ''),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 services
  }, [filteredLogs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                type="number" 
                className="text-gray-600 dark:text-gray-400"
                fontSize={12}
              />
              <YAxis 
                type="category" 
                dataKey="service" 
                className="text-gray-600 dark:text-gray-400"
                fontSize={12}
                width={80}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#10B981"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};