
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, DollarSign, TrendingUp } from 'lucide-react';
import { summaryData } from '@/utils/dummyData';

const StatCard: React.FC<{
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}> = ({ title, value, description, icon, trend, trendValue, className }) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-full bg-muted">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${value}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${
            trend === 'up' ? 'text-finance-green' : 
            trend === 'down' ? 'text-finance-red' : 
            'text-muted-foreground'
          }`}>
            {trend === 'up' && <ArrowUp className="h-3 w-3 mr-1" />}
            {trend === 'down' && <ArrowDown className="h-3 w-3 mr-1" />}
            <span>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const { income, expenses, remaining, averageDailySpend } = summaryData;
  
  // Calculate budget progress
  const budget = parseFloat(income);
  const spent = parseFloat(expenses);
  const progress = Math.round((spent / budget) * 100);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, John</h1>
        <p className="text-muted-foreground">Here's an overview of your finances</p>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Month Income" 
          value={income} 
          description="Total income this month" 
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
          trendValue="3.2% from last month"
        />
        <StatCard 
          title="Month Expenses" 
          value={expenses} 
          description="Total spent this month" 
          icon={<ArrowDown className="h-4 w-4" />}
          trend="down"
          trendValue="0.8% from last month"
        />
        <StatCard 
          title="Remaining Budget" 
          value={remaining} 
          description="Budget left for this month" 
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard 
          title="Daily Average" 
          value={averageDailySpend} 
          description="Average daily spending" 
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>
      
      {/* Budget progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Budget Progress</CardTitle>
          <CardDescription>Your spending vs. budget for this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Spent: ${expenses}</span>
              <span>Budget: ${income}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>{progress}% spent</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
