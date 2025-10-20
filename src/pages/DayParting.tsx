import { useState } from 'react';
import { DayPartingFilters } from '../components/DayParting/DayPartingFilters';
import { DayPartingSummaryCards } from '../components/DayParting/DayPartingSummaryCards';
import { HourlyTrendsChart } from '../components/DayParting/HourlyTrendsChart';
import { DailyTrendsChart } from '../components/DayParting/DailyTrendsChart';
import { CampaignTypeBreakdown } from '../components/DayParting/CampaignTypeBreakdown';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

interface DayPartingFilters {
    profileId: string;
    startDate: Date;
    endDate: Date;
    campaignType: string;
    marketplace: string;
    advertiserId: string;
}

interface DayPartingData {
    data: {
        summary: any;
        hourlyTrends: any;
        dailyTrends: any;
        campaignTypeBreakdown: any;
    };
}

export const DayParting = () => {
    const [filters, setFilters] = useState<DayPartingFilters>({
        profileId: '',
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date(),
        campaignType: '',
        marketplace: '',
        advertiserId: '',
    });

    const { data, isLoading, error } = useQuery<DayPartingData, Error>({
        queryKey: ['dayParting', filters],
        queryFn: () => apiService.getDayPartingAnalytics(filters),
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold">Day Parting Analytics</h1>

            <DayPartingFilters filters={filters} profiles={data?.data?.profiles || []} onFiltersChange={setFilters} />

            <DayPartingSummaryCards data={data?.data.summary} />
            <HourlyTrendsChart data={data?.data.hourlyTrends} />
            <DailyTrendsChart data={data?.data.dailyTrends} />
            <CampaignTypeBreakdown data={data?.data.campaignTypeBreakdown} />
        </div>
    );
};
