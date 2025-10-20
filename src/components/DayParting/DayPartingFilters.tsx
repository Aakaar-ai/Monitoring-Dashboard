import { Card } from '../ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DayPartingDateFilter } from './DayPartingDateFilter';

interface Profile {
    profile_id: string;
    user_id: number;
    account_id: string;
    marketplace: string;
    country_code: string;
    name: string;
}

interface DayPartingFiltersProps {
    filters: {
        profileId: string;
        startDate: Date;
        endDate: Date;
        campaignType: string;
        marketplace: string;
        advertiserId: string;
    };
    profiles: Profile[];
    onFiltersChange: (filters: DayPartingFiltersProps['filters']) => void;
}


export const DayPartingFilters = ({ filters, profiles, onFiltersChange }: DayPartingFiltersProps) => {
    console.log(profiles)
    return (
        <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-500">Profile</label>
                    <Select value={filters.profileId} onValueChange={(value) => onFiltersChange({ ...filters, profileId: value === "none" ? "" : value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Profile" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Select Profile</SelectItem>
                            {profiles.map((profile) => (
                                <SelectItem key={profile.profile_id} value={profile.profile_id.toString()}>
                                    {profile.name} ({profile.country_code})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-500">Campaign Type</label>
                    <Select value={filters.campaignType || "all"} onValueChange={(value) => onFiltersChange({ ...filters, campaignType: value === "all" ? "" : value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="sp">Sponsored Products (SP)</SelectItem>
                            <SelectItem value="sb">Sponsored Brands (SB)</SelectItem>
                            <SelectItem value="sd">Sponsored Display (SD)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DayPartingDateFilter
                    value={{
                        from: filters.startDate,
                        to: filters.endDate
                    }}
                    onChange={({ from, to }) => {
                        onFiltersChange({
                            ...filters,
                            startDate: from,
                            endDate: to
                        });
                    }}
                />
            </div>
        </Card>
    );
};
