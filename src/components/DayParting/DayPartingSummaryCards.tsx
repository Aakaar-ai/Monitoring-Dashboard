import { Card } from "../ui/Card";

interface SummaryData {
    totalImpressions: number;
    totalClicks: number;
    totalSpend: number;
    totalSales: number;
    averageCTR: string;
    averageCPC: string;
    averageACOS: string;
    averageROAS: string;
}

interface DayPartingSummaryCardsProps {
    data: SummaryData | undefined;
}

export const DayPartingSummaryCards = ({ data }: DayPartingSummaryCardsProps) => {
    const metrics = [
        { label: 'Total Impressions', value: data?.totalImpressions.toLocaleString() },
        { label: 'Total Clicks', value: data?.totalClicks.toLocaleString() },
        { label: 'Total Spend', value: `$${data?.totalSpend.toFixed(2)}` },
        { label: 'Total Sales', value: `$${data?.totalSales.toFixed(2)}` },
        { label: 'Avg. CTR', value: `${data?.averageCTR}%` },
        { label: 'Avg. CPC', value: `$${data?.averageCPC}` },
        { label: 'Avg. ACOS', value: `${data?.averageACOS}%` },
        { label: 'Avg. ROAS', value: data?.averageROAS },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric) => (
                <Card key={metric.label} className="p-4">
                    <div className="text-sm text-gray-500">{metric.label}</div>
                    <div className="text-2xl font-bold mt-1">{metric.value}</div>
                </Card>
            ))}
        </div>
    );
};
