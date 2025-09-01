import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useLogStore } from '../../stores/logStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const LEVEL_COLORS = {
  debug: '#6B7280',
  info: '#2563EB',
  warn: '#F59E0B',
  error: '#DC2626',
  fatal: '#7C3AED',
};

export const LogLevelChart: React.FC = () => {
  const { filteredLogs } = useLogStore();

  const data = React.useMemo(() => {
    const levelCounts = filteredLogs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(levelCounts).map(([level, count]) => ({
      name: level.toUpperCase(),
      value: count,
      color: LEVEL_COLORS[level as keyof typeof LEVEL_COLORS],
    }));
  }, [filteredLogs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Log Levels Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};