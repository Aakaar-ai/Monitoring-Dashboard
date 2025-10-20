import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

interface CampaignMetrics {
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

interface CampaignTypeBreakdownProps {
    data: Record<string, CampaignMetrics> | undefined;
}

export const CampaignTypeBreakdown = ({ data }: CampaignTypeBreakdownProps) => {
    const chartData = Object.entries(data || {}).map(([type, metrics]) => ({
        name: type.toUpperCase(),
        value: metrics.spend,
    }));

    return (
        <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Campaign Type Breakdown</h3>
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
