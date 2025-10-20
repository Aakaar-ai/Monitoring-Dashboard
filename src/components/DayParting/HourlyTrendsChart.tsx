import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

interface Metrics {
  impressions: number;
  clicks: number;
  spend: number;
  sales14d: number;
  purchases14d: number;
  ctr: string;
  cpc: string;
  acos: string;
  roas: string;
}

interface HourlyTrendsChartProps {
  data: Record<string, Metrics> | undefined;
}

interface ChartDataPoint extends Metrics {
  hour: string;
}

export const HourlyTrendsChart = ({ data }: HourlyTrendsChartProps) => {
  const chartData: ChartDataPoint[] = Object.entries(data || {}).map(([hour, metrics]) => ({
    hour: `${hour}:00`,
    ...metrics,
  }));

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Hourly Performance Trends</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="hour" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#8884d8" />
            <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#82ca9d" />
            <Line yAxisId="right" type="monotone" dataKey="spend" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
