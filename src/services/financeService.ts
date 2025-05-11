
import { Transaction, TransactionCategory, BudgetCategory, generateId } from '@/utils/dummyData';
import { toast } from "sonner";

export interface CategoryBudget {
  category: BudgetCategory;
  budgeted: number;
  spent: number;
}

// Get transactions from localStorage or return default
export const getTransactions = (): Transaction[] => {
  try {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }
    // Use the transactions from dummyData if none exist in localStorage
    const { transactions } = require('@/utils/dummyData');
    return transactions;
  } catch (error) {
    console.error('Error loading transactions:', error);
    const { transactions } = require('@/utils/dummyData');
    return transactions;
  }
};

// Get budgets from localStorage or return default
export const getBudgets = (): CategoryBudget[] => {
  try {
    const savedBudgets = localStorage.getItem('budgets');
    if (savedBudgets) {
      return JSON.parse(savedBudgets);
    }
    // Use the budgetData from dummyData if none exist in localStorage
    const { budgetData } = require('@/utils/dummyData');
    return budgetData;
  } catch (error) {
    console.error('Error loading budgets:', error);
    const { budgetData } = require('@/utils/dummyData');
    return budgetData;
  }
};

// Save transactions to localStorage
export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
    toast.error("Failed to save transactions");
  }
};

// Save budgets to localStorage
export const saveBudgets = (budgets: CategoryBudget[]): void => {
  try {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  } catch (error) {
    console.error('Error saving budgets:', error);
    toast.error("Failed to save budgets");
  }
};

// Add a new transaction
export const addTransaction = (
  merchant: string,
  description: string,
  amount: number,
  category: TransactionCategory,
  date: string
): Transaction => {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    id: generateId(),
    date,
    amount,
    merchant,
    category,
    description,
  };
  
  transactions.unshift(newTransaction); // Add to beginning of array (newest first)
  saveTransactions(transactions);
  
  // Update spent amounts for budgets
  updateBudgetSpent();
  
  return newTransaction;
};

// Update an existing transaction
export const updateTransaction = (
  id: string,
  updates: Partial<Omit<Transaction, 'id'>>
): Transaction | null => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) {
    toast.error("Transaction not found");
    return null;
  }
  
  const updatedTransaction = {
    ...transactions[index],
    ...updates
  };
  
  transactions[index] = updatedTransaction;
  saveTransactions(transactions);
  
  // Update spent amounts for budgets
  updateBudgetSpent();
  
  return updatedTransaction;
};

// Delete a transaction
export const deleteTransaction = (id: string): boolean => {
  const transactions = getTransactions();
  const filteredTransactions = transactions.filter(t => t.id !== id);
  
  if (filteredTransactions.length === transactions.length) {
    toast.error("Transaction not found");
    return false;
  }
  
  saveTransactions(filteredTransactions);
  
  // Update spent amounts for budgets
  updateBudgetSpent();
  
  return true;
};

// Add or update a budget
export const setCategory = (category: BudgetCategory, budgeted: number): CategoryBudget => {
  const budgets = getBudgets();
  const existingIndex = budgets.findIndex(b => b.category === category);
  
  if (existingIndex !== -1) {
    budgets[existingIndex].budgeted = budgeted;
  } else {
    budgets.push({
      category,
      budgeted,
      spent: 0
    });
  }
  
  // Calculate current spent amount
  updateBudgetSpent();
  
  return budgets.find(b => b.category === category)!;
};

// Delete a budget
export const deleteBudget = (category: BudgetCategory): boolean => {
  const budgets = getBudgets();
  const filteredBudgets = budgets.filter(b => b.category !== category);
  
  if (filteredBudgets.length === budgets.length) {
    toast.error("Budget not found");
    return false;
  }
  
  saveBudgets(filteredBudgets);
  return true;
};

// Update all budget spent amounts based on current transactions
export const updateBudgetSpent = (): void => {
  const transactions = getTransactions();
  const budgets = getBudgets();
  
  // Reset all spent values
  budgets.forEach(budget => {
    budget.spent = 0;
  });
  
  // Only consider expenses (negative amounts) for the budgets
  const expenses = transactions.filter(t => t.amount < 0);
  
  // Group transactions by category and sum amounts
  expenses.forEach(transaction => {
    // Skip "income" category which is not a budget category
    if (transaction.category === 'income') return;
    
    const budget = budgets.find(b => b.category === transaction.category);
    if (budget) {
      budget.spent += Math.abs(transaction.amount);
    }
  });
  
  saveBudgets(budgets);
};

// Recalculate summary statistics based on current transactions
export const calculateSummaryData = () => {
  const transactions = getTransactions();
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
