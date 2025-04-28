
import { Transaction, MonthlySpending } from './dummyData';

// Simple linear regression for predictions
export const predictNextMonthExpense = (transactions: Transaction[]): number => {
  // Group transactions by month
  const monthlyData: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    if (transaction.amount < 0) { // Only consider expenses
      const month = transaction.date.substring(0, 7); // YYYY-MM format
      monthlyData[month] = (monthlyData[month] || 0) + Math.abs(transaction.amount);
    }
  });
  
  // Convert to array and sort by month
  const sortedMonths = Object.entries(monthlyData)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));
  
  // Need at least 2 months of data for a prediction
  if (sortedMonths.length < 2) {
    // Return average if we don't have enough data
    return sortedMonths.length === 1 
      ? sortedMonths[0].total 
      : 2500; // Default value if no data
  }
  
  // Simple linear regression
  const xValues = Array.from({ length: sortedMonths.length }, (_, i) => i + 1);
  const yValues = sortedMonths.map(item => item.total);
  
  const n = xValues.length;
  const sumX = xValues.reduce((sum, x) => sum + x, 0);
  const sumY = yValues.reduce((sum, y) => sum + y, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
  
  // Calculate slope (m) and y-intercept (b)
  const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const b = (sumY - m * sumX) / n;
  
  // Predict next month
  const nextX = n + 1;
  const prediction = m * nextX + b;
  
  // Add some randomness to make it more realistic
  const variance = prediction * 0.08; // 8% variance
  const randomFactor = ((Math.random() * 2) - 1) * variance;
  
  return Math.max(0, prediction + randomFactor);
};

// Generate predictions for each category
export const predictCategoryExpenses = (transactions: Transaction[]) => {
  // Group transactions by category
  const categoryTransactions: Record<string, Transaction[]> = {};
  
  transactions.forEach(transaction => {
    if (transaction.amount < 0) { // Only consider expenses
      const category = transaction.category;
      if (!categoryTransactions[category]) {
        categoryTransactions[category] = [];
      }
      categoryTransactions[category].push(transaction);
    }
  });
  
  // Predict for each category
  const predictions: Record<string, number> = {};
  
  for (const [category, txs] of Object.entries(categoryTransactions)) {
    predictions[category] = predictNextMonthExpense(txs);
  }
  
  return predictions;
};

// Generate predicted spending based on monthly history
export const generatePredictedSpending = (
  monthlySpending: MonthlySpending[]
): MonthlySpending[] => {
  // Get the last few months
  const recentMonths = monthlySpending.slice(-6);
  
  // Calculate the average growth rate
  let growthRate = 0;
  for (let i = 1; i < recentMonths.length; i++) {
    const prevAmount = recentMonths[i-1].amount;
    const currAmount = recentMonths[i].amount;
    growthRate += (currAmount - prevAmount) / prevAmount;
  }
  growthRate = growthRate / (recentMonths.length - 1);
  
  // Adjust for some random variation
  growthRate = growthRate + (Math.random() * 0.1 - 0.05);
  
  // Predict next three months
  const lastMonth = recentMonths[recentMonths.length - 1];
  const nextMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const lastMonthIndex = nextMonths.findIndex(m => m === lastMonth.month);
  
  const predictions: MonthlySpending[] = [];
  
  for (let i = 1; i <= 3; i++) {
    const monthIndex = (lastMonthIndex + i) % 12;
    const predictedAmount = lastMonth.amount * Math.pow(1 + growthRate, i);
    predictions.push({
      month: nextMonths[monthIndex] + ' (Pred)',
      amount: Number(predictedAmount.toFixed(2))
    });
  }
  
  return predictions;
};
