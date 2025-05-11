
// Types
export type TransactionCategory = 
  | 'groceries' 
  | 'restaurants' 
  | 'transportation' 
  | 'utilities' 
  | 'entertainment' 
  | 'shopping' 
  | 'travel'
  | 'health'
  | 'income';

// Separate type for budget categories (excludes 'income')
export type BudgetCategory =
  | 'groceries' 
  | 'restaurants' 
  | 'transportation' 
  | 'utilities' 
  | 'entertainment' 
  | 'shopping' 
  | 'travel'
  | 'health';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  merchant: string;
  category: TransactionCategory;
  description: string;
}

export interface CategoryBudget {
  category: BudgetCategory;
  budgeted: number;
  spent: number;
}

export interface MonthlySpending {
  month: string;
  amount: number;
}

// Helper functions
// Export the generateId function so it can be used in other files
export const generateId = () => Math.random().toString(36).substring(2, 10);

const getRandomAmount = (min: number, max: number) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Category colors mapping for consistent styling
export const categoryColors: Record<TransactionCategory, {bg: string, text: string}> = {
  groceries: {bg: 'bg-finance-green-light', text: 'text-finance-green'},
  restaurants: {bg: 'bg-finance-orange-light', text: 'text-finance-orange'},
  transportation: {bg: 'bg-finance-blue-light', text: 'text-finance-blue'},
  utilities: {bg: 'bg-finance-gray-light', text: 'text-finance-gray'},
  entertainment: {bg: 'bg-finance-purple-light', text: 'text-finance-purple'},
  shopping: {bg: 'bg-finance-yellow-light', text: 'text-finance-yellow'},
  travel: {bg: 'bg-finance-blue-light', text: 'text-finance-blue'},
  health: {bg: 'bg-finance-red-light', text: 'text-finance-red'},
  income: {bg: 'bg-finance-green-light', text: 'text-finance-green'},
};

// Sample merchants for each category
const merchants: Record<TransactionCategory, string[]> = {
  groceries: ['Whole Foods', 'Trader Joe\'s', 'Safeway', 'Kroger', 'Aldi'],
  restaurants: ['Chipotle', 'Starbucks', 'McDonald\'s', 'Local Bistro', 'Pizza Palace'],
  transportation: ['Uber', 'Lyft', 'Gas Station', 'Transit Authority', 'Car Repair'],
  utilities: ['Electric Company', 'Water Services', 'Internet Provider', 'Gas Company', 'Phone Bill'],
  entertainment: ['Netflix', 'Movie Theater', 'Concert Tickets', 'Spotify', 'Gaming Service'],
  shopping: ['Amazon', 'Target', 'Walmart', 'Best Buy', 'Macy\'s'],
  travel: ['Airlines', 'Hotel Booking', 'Airbnb', 'Car Rental', 'Travel Agency'],
  health: ['Pharmacy', 'Doctor\'s Office', 'Gym Membership', 'Health Insurance', 'Dental Care'],
  income: ['Employer', 'Freelance', 'Dividend', 'Interest', 'Side Business']
};

// Generate transactions from the last 3 months
export const generateTransactions = (count: number = 50): Transaction[] => {
  const transactions: Transaction[] = [];
  const categories: TransactionCategory[] = Object.keys(merchants) as TransactionCategory[];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * (categories.length - 1))]; // Exclude income most of the time
    const merchant = merchants[category][Math.floor(Math.random() * merchants[category].length)];
    const daysAgo = Math.floor(Math.random() * 90); // Last 3 months
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    
    const isIncome = category === 'income';
    const amount = isIncome 
      ? getRandomAmount(1000, 5000) 
      : -getRandomAmount(5, 200);
      
    transactions.push({
      id: generateId(),
      date: date.toISOString().split('T')[0],
      amount,
      merchant,
      category,
      description: `${merchant} payment`,
    });
  }
  
  // Add a few income transactions
  for (let i = 0; i < 3; i++) {
    const daysAgo = i * 30; // One per month
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    
    transactions.push({
      id: generateId(),
      date: date.toISOString().split('T')[0],
      amount: getRandomAmount(2000, 4000),
      merchant: merchants.income[0],
      category: 'income',
      description: 'Salary deposit',
    });
  }
  
  // Sort transactions by date (newest first)
  return transactions.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

// Generate monthly budget data
export const generateBudgetData = (): CategoryBudget[] => {
  const categories: BudgetCategory[] = [
    'groceries', 'restaurants', 'transportation', 'utilities', 
    'entertainment', 'shopping', 'travel', 'health'
  ];
  
  return categories.map(category => ({
    category,
    budgeted: getRandomAmount(300, 800),
    spent: getRandomAmount(200, 900)
  }));
};

// Generate spending history by month
export const generateMonthlySpending = (): MonthlySpending[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return months.map((month, index) => ({
    month,
    amount: getRandomAmount(2000, 4000)
  }));
};

// Export generated data
export const transactions = generateTransactions(70);
export const budgetData = generateBudgetData();
export const monthlySpending = generateMonthlySpending();

// Calculate summary statistics
export const calculateSummaryData = () => {
  const today = new Date();
  const thisMonth = today.toISOString().slice(0, 7); // YYYY-MM format
  
  // Filter transactions for this month
  const thisMonthTransactions = transactions.filter(t => t.date.startsWith(thisMonth));
  
  // Calculate total income
  const income = thisMonthTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate total expenses
  const expenses = thisMonthTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Calculate remaining budget
  const remaining = income - expenses;
  
  // Calculate daily average spending
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const averageDailySpend = expenses / daysInMonth;
  
  return {
    income: income.toFixed(2),
    expenses: expenses.toFixed(2),
    remaining: remaining.toFixed(2),
    averageDailySpend: averageDailySpend.toFixed(2)
  };
};

export const summaryData = calculateSummaryData();
