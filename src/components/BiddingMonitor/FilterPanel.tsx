import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import { FilterOptions } from '@/types/bidding';

interface FilterPanelProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  selectedCustomer: string;
  selectedCampaign: string;
  selectedProfile: string;
  selectedStatus: string;
  filters: FilterOptions | null;
  onDateRangeChange: (range: { startDate: string; endDate: string }) => void;
  onCustomerChange: (value: string) => void;
  onCampaignChange: (value: string) => void;
  onProfileChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  dateRange,
  selectedCustomer,
  selectedCampaign,
  selectedProfile,
  selectedStatus,
  filters,
  onDateRangeChange,
  onCustomerChange,
  onCampaignChange,
  onProfileChange,
  onStatusChange,
  onRefresh,
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
              className="w-40"
            />
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
              className="w-40"
            />
          </div>

          {filters && (
            <>
              <Select value={selectedCustomer || "all"} onValueChange={onCustomerChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {filters.customers.map(customer => (
                    <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCampaign || "all"} onValueChange={onCampaignChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Campaigns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  {filters.campaigns.map(campaign => (
                    <SelectItem key={campaign} value={campaign}>{campaign}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedProfile || "all"} onValueChange={onProfileChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Profiles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Profiles</SelectItem>
                  {filters.profiles.map(profile => (
                    <SelectItem key={profile} value={profile.toString()}>{profile}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus || "all"} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {filters.statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          <Button onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
