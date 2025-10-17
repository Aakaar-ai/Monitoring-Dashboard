import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { WorkflowRun } from '@/types/bidding';
import { WorkflowRunCard } from './WorkflowRunCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CustomerRunsGroupProps {
  customerName: string;
  runs: WorkflowRun[];
}

export const CustomerRunsGroup: React.FC<CustomerRunsGroupProps> = ({
  customerName,
  runs,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{customerName}</span>
          <span className="text-sm text-muted-foreground">
            {runs.length} runs
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="runs">
            <AccordionTrigger>View Runs</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {runs.map((run) => (
                  <WorkflowRunCard key={run.id} run={run} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
