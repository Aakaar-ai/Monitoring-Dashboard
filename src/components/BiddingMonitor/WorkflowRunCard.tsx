import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { WorkflowRun } from '@/types/bidding';
import { Eye } from 'lucide-react';
import { RunDetailsModal } from './RunDetailsModal';

interface WorkflowRunCardProps {
  run: WorkflowRun;
}

export const WorkflowRunCard: React.FC<WorkflowRunCardProps> = ({ run }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Run #{run.id}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(run.start_time).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  run.status === 'COMPLETED'
                    ? 'default'
                    : run.status === 'FAILED'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {run.status}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(true)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Keywords: </span>
              {run.metrics.totalKeywordsProcessed}/{run.metrics.totalKeywords}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Runtime: </span>
              {run.total_runtime_sec?.toFixed(1)}s
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Cost: </span>
              ${((run.metrics.totalLLMTotalCostMicros || 0) / 1000000).toFixed(3)}
            </div>
          </div>
        </CardContent>
      </Card>
      <RunDetailsModal
        run={run}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
};