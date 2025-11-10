import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkflowRun } from '@/types/bidding';
import { BidChangesTable } from './BidChangesTable';

interface RunDetailsModalProps {
  run: WorkflowRun;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RunDetailsModal: React.FC<RunDetailsModalProps> = ({
  run,
  open,
  onOpenChange,
}) => {
  const bidChanges = run.children?.[0]?.extras?.finalResult?.bidChanges || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Run Details #{run.id} - {run.identifiers.customerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Timing Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Started</div>
              <div className="font-medium">
                {new Date(run.start_time).toLocaleString()}
              </div>
            </div>
            {run.end_time && (
              <div>
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="font-medium">
                  {new Date(run.end_time).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Keywords</div>
              <div className="font-medium">
                {run.metrics.totalKeywordsProcessed}/{run.metrics.totalKeywords}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Runtime</div>
              <div className="font-medium">{run.total_runtime_sec?.toFixed(1)}s</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Cost</div>
              <div className="font-medium">
                ${((run.metrics.totalLLMTotalCostMicros || 0) / 1000000).toFixed(3)}
              </div>
            </div>
          </div>

          {/* Token Usage */}
          <div>
            <h4 className="text-sm font-medium mb-2">Token Usage</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Prompt Tokens</div>
                <div className="font-medium">
                  {run.metrics.totalPromptTokens.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Completion Tokens</div>
                <div className="font-medium">
                  {run.metrics.totalCompletionTokens.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Bid Changes */}
          {bidChanges.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                Bid Changes ({bidChanges.length})
              </h4>
              <BidChangesTable bidChanges={bidChanges} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
