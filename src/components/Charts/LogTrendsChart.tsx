import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLogStore } from '../../stores/logStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { format, isValid } from 'date-fns';

export const LogTrendsChart: React.FC = () => {
  const { filteredLogs } = useLogStore();

  const data = React.useMemo(() => {
    try {
      const hourlyData = filteredLogs.reduce((acc, log) => {
        // Validate timestamp before processing
        if (!log.timestamp) return acc;
        
        const date = new Date(log.timestamp);
        if (!isValid(date)) {
          console.warn('Invalid timestamp in log:', log.timestamp);
          return acc;
        }
        
        const hour = format(date, 'HH:mm');
        const isError = log.level === 'error';
        
        if (!acc[hour]) {
          acc[hour] = { time: hour, total: 0, errors: 0 };
        }
        
        acc[hour].total += 1;
        if (isError) acc[hour].errors += 1;
        
        return acc;
      }, {} as Record<string, { time: string; total: number; errors: number }>);

      return Object.values(hourlyData)
        .sort((a, b) => a.time.localeCompare(b.time))
        .slice(-24); // Last 24 hours
    } catch (error) {
      console.error('Error processing chart data:', error);
      return [];
    }
  }, [filteredLogs]);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Log Trends (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No data available for chart
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Log Trends (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="time" 
                className="text-gray-600 dark:text-gray-400"
                fontSize={12}
              />
              <YAxis className="text-gray-600 dark:text-gray-400" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Total Logs"
              />
              <Line
                type="monotone"
                dataKey="errors"
                stroke="#DC2626"
                strokeWidth={2}
                dot={{ fill: '#DC2626', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Errors"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};