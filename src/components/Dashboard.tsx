
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, DollarSign, TrendingUp, PlusCircle, PiggyBank } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { calculateSummaryData } from '@/services/financeService';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

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
  const { userProfile, isNewUser } = useUser();
  const summaryData = calculateSummaryData();
  const navigate = useNavigate();
  const { income, expenses, remaining, averageDailySpend } = summaryData;
  
  // Calculate budget progress
  const budget = parseFloat(income);
  const spent = parseFloat(expenses);
  const progress = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  
  // If there's no data, show welcome screen for new users
  const showWelcomeScreen = isNewUser && parseFloat(income) === 0 && parseFloat(expenses) === 0;

  if (showWelcomeScreen) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Welcome to BudgetWise, {userProfile.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Let's get started with setting up your finances</p>
        </div>
        
        <Card className="p-6">
          <div className="text-center space-y-6">
            <div className="mx-auto bg-finance-purple-light w-16 h-16 rounded-full flex items-center justify-center">
              <PiggyBank className="h-8 w-8 text-finance-purple" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold">No financial data yet</h2>
              <p className="text-muted-foreground">
                Start by adding your income, transactions, and setting up budgets
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => navigate('/transactions')}
                className="flex items-center justify-center"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Transactions
              </Button>
              <Button 
                onClick={() => navigate('/budgets')}
                className="flex items-center justify-center"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Set Budgets
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {userProfile.name.split(' ')[0]}</h1>
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
