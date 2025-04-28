
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { budgetData, categoryColors } from '@/utils/dummyData';
import { cn } from '@/lib/utils';

const BudgetOverview: React.FC = () => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>Track your spending against your budget goals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgetData.map((budget) => {
            const { category, budgeted, spent } = budget;
            const percentage = Math.round((spent / budgeted) * 100);
            const { bg, text } = categoryColors[category];
            const isOverBudget = spent > budgeted;
            
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className={cn("w-3 h-3 rounded-full mr-2", bg)}></span>
                    <span className="font-medium capitalize">{category}</span>
                  </div>
                  <div className={cn(
                    "text-sm font-medium",
                    isOverBudget ? "text-finance-red" : "text-finance-green"
                  )}>
                    ${spent.toFixed(2)} / ${budgeted.toFixed(2)}
                  </div>
                </div>
                <div className="space-y-1">
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={cn(
                      "h-2",
                      isOverBudget ? "bg-finance-red-light" : "bg-muted"
                    )}
                    indicatorClassName={isOverBudget ? "bg-finance-red" : text.replace('text', 'bg')}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage}%</span>
                    {isOverBudget && (
                      <span className="text-finance-red">
                        Over by ${(spent - budgeted).toFixed(2)}
                      </span>
                    )}
                    {!isOverBudget && (
                      <span className="text-finance-green">
                        ${(budgeted - spent).toFixed(2)} remaining
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetOverview;
