
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { monthlySpending } from '@/utils/dummyData';
import { generatePredictedSpending as predictSpending } from '@/utils/predictExpenses';

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const isPredicted = label.includes('(Pred)');
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-finance-purple">
          Amount: ${payload[0].value?.toFixed(2)}
        </p>
        {isPredicted && (
          <p className="text-xs text-muted-foreground mt-1">
            *Predicted value
          </p>
        )}
      </div>
    );
  }

  return null;
};

const PredictionChart: React.FC = () => {
  // Get the last 6 months of spending data
  const recentMonths = monthlySpending.slice(-6);
  // Get 3 months of predicted data
  const predictedMonths = predictSpending(monthlySpending);
  
  // Combine the data for the chart
  const chartData = [...recentMonths, ...predictedMonths];
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Spending Forecast</CardTitle>
        <CardDescription>
          Predicted spending based on your historical data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                name="Actual Spending"
                type="monotone"
                dataKey="amount"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
                animationDuration={1500}
              />
              <Line 
                name="Predicted Spending" 
                type="monotone" 
                dataKey="amount" 
                stroke="#10B981" 
                strokeWidth={3}
                strokeDasharray="5 5"
                activeDot={{ r: 6 }}
                dot={{ r: 4 }}
                isAnimationActive={true}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Predictions are based on your historical spending patterns
        </p>
      </CardContent>
    </Card>
  );
};

export default PredictionChart;
