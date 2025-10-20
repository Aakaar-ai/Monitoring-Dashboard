import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

interface DailyMetrics {
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

interface DailyTrendsChartProps {
    data: Record<string, DailyMetrics> | undefined;
}

export const DailyTrendsChart = ({ data }: DailyTrendsChartProps) => {
    const chartData = Object.entries(data || {}).map(([date, metrics]) => ({
        date,
        ...metrics,
    }));

    return (
        <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Daily Performance Trends</h3>
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="impressions" fill="#8884d8" />
                        <Bar yAxisId="left" dataKey="clicks" fill="#82ca9d" />
                        <Bar yAxisId="right" dataKey="spend" fill="#ffc658" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};