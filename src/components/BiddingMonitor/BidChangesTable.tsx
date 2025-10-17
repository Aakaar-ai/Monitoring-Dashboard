import React from 'react';
import { BidChange } from '../../types/bidding';
import { Badge } from '../ui/badge';

interface BidChangesTableProps {
  bidChanges: BidChange[];
}

export const BidChangesTable: React.FC<BidChangesTableProps> = ({ bidChanges }) => {
  return (
    <div className="space-y-2">
      {bidChanges.map((change) => (
        <div
          key={change.keywordId}
          className="p-3 rounded-lg bg-muted/50 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="font-medium">{change.keywordText}</div>
            <div className="flex items-center space-x-2">
              <div className="text-sm">
                ${change.currentBid.toFixed(2)} →{' '}
                <span className="font-semibold">${change.newBid.toFixed(2)}</span>
              </div>
              <Badge
                variant={
                  change.action === 'increase'
                    ? 'default'
                    : change.action === 'decrease'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {change.changePercent > 0 ? '+' : ''}
                {change.changePercent}%
              </Badge>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{change.reason}</div>
          {change.kps && (
            <div className="text-xs text-muted-foreground">
              KPS Score: {change.kps.toFixed(1)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
