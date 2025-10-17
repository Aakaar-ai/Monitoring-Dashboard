// src/components/BiddingMonitor/WorkflowRunCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/badge';
import { WorkflowRun } from '../../types/bidding';
import { BidChangesTable } from './BidChangesTable';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface WorkflowRunCardProps {
  run: WorkflowRun;
}

export const WorkflowRunCard: React.FC<WorkflowRunCardProps> = ({ run }) => {
  const bidChanges = run.children?.[0]?.extras?.finalResult?.bidChanges || [];
  
  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {run.identifiers.customerName} - Run #{run.id}
            </CardTitle>
            <CardDescription>
              Started {new Date(run.start_time).toLocaleString()}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                run.status === 'COMPLETED'
                  ? 'default'
                  : run.status === 'FAILED'
                  ? 'destructive'
                  : 'default'
              }
            >
              {run.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Basic metrics always visible */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Keywords</div>
            <div className="text-lg font-semibold">
              {run.metrics.totalKeywordsProcessed}/{run.metrics.totalKeywords}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Runtime</div>
            <div className="text-lg font-semibold">
              {run.total_runtime_sec?.toFixed(1)}s
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Cost</div>
            <div className="text-lg font-semibold">
              ${(run.metrics.totalLLMCost / 1000000).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Detailed information in accordion */}
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="details">
            <AccordionTrigger className="text-sm font-medium">
              View Details
            </AccordionTrigger>
            <AccordionContent>
              {/* Completion Details */}
              {run.end_time && (
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground">Completed</div>
                  <div className="font-medium">
                    {new Date(run.end_time).toLocaleString()}
                  </div>
                </div>
              )}

              {/* Campaign Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">Total Campaigns</div>
                  <div className="font-medium">{run.metrics.totalCampaigns}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Completed Campaigns</div>
                  <div className="font-medium">{run.metrics.totalCampaignsCompleted}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Skipped Keywords</div>
                  <div className="font-medium">{run.metrics.totalKeywordsSkipped}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">In Cooldown</div>
                  <div className="font-medium">{run.metrics.totalKeywordsInCooldown}</div>
                </div>
              </div>

              {/* Token Usage */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Token Usage</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Prompt Tokens</div>
                    <div className="font-medium">{run.metrics.totalPromptTokens.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Completion Tokens</div>
                    <div className="font-medium">{run.metrics.totalCompletionTokens.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Bid Changes */}
              {bidChanges.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Bid Changes ({bidChanges.length})</div>
                  <BidChangesTable bidChanges={bidChanges} />
                </div>
              )}

              {/* Child Runs Summary */}
              {run.children && run.children.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Campaign Runs</div>
                  <div className="space-y-2">
                    {run.children.map((child) => (
                      <div
                        key={child.id}
                        className="p-2 rounded-lg bg-muted/50 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">Campaign {child.identifiers.campaignId}</div>
                          <div className="text-sm text-muted-foreground">
                            {child.metrics.totalKeywords} keywords processed
                          </div>
                        </div>
                        <Badge
                          variant={
                            child.status === 'COMPLETED'
                              ? 'default'
                              : child.status === 'FAILED'
                              ? 'destructive'
                              : 'default'
                          }
                        >
                          {child.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
