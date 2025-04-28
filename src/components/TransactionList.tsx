
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { transactions, Transaction, categoryColors, TransactionCategory } from '@/utils/dummyData';
import { cn } from '@/lib/utils';

const TransactionList: React.FC = () => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<TransactionCategory | 'all'>('all');
  
  // Format date from YYYY-MM-DD to more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      if (activeFilter === 'all') {
        setFilteredTransactions(transactions);
      } else {
        setFilteredTransactions(transactions.filter(t => t.category === activeFilter));
      }
      return;
    }
    
    // Filter by search term and active category filter
    const results = transactions.filter(transaction => 
      (activeFilter === 'all' || transaction.category === activeFilter) &&
      (transaction.merchant.toLowerCase().includes(term.toLowerCase()) || 
       transaction.description.toLowerCase().includes(term.toLowerCase()))
    );
    
    setFilteredTransactions(results);
  };
  
  // Handle category filter
  const handleFilterChange = (category: TransactionCategory | 'all') => {
    setActiveFilter(category);
    
    if (category === 'all') {
      if (searchTerm.trim() === '') {
        setFilteredTransactions(transactions);
      } else {
        // Apply current search term to all transactions
        handleSearch({ target: { value: searchTerm } } as React.ChangeEvent<HTMLInputElement>);
      }
      return;
    }
    
    // Filter by category and current search term
    const results = transactions.filter(transaction => 
      transaction.category === category &&
      (searchTerm.trim() === '' || 
       transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || 
       transaction.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredTransactions(results);
  };
  
  // Get the unique categories from transactions
  const categories = Array.from(
    new Set(transactions.map(t => t.category))
  );
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>A list of your recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === 'all' ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('all')}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeFilter === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(category as TransactionCategory)}
                  className={cn(
                    activeFilter === category ? "text-white" : categoryColors[category as TransactionCategory].text
                  )}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Transactions list */}
          <div className="rounded-md border">
            <div className="bg-muted/50 p-2 grid grid-cols-12 gap-4 text-xs font-medium">
              <div className="col-span-2 md:col-span-1">Date</div>
              <div className="col-span-4 md:col-span-4">Description</div>
              <div className="hidden md:block md:col-span-3">Category</div>
              <div className="col-span-3 md:col-span-2">Amount</div>
              <div className="col-span-3 md:col-span-2">Balance</div>
            </div>
            
            <div className="divide-y">
              {filteredTransactions.slice(0, 10).map((transaction) => {
                const { bg, text } = categoryColors[transaction.category];
                return (
                  <div 
                    key={transaction.id}
                    className="p-2 grid grid-cols-12 gap-4 items-center hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-2 md:col-span-1 text-xs">
                      {formatDate(transaction.date)}
                    </div>
                    <div className="col-span-4 md:col-span-4 truncate">
                      <div className="font-medium">{transaction.merchant}</div>
                      <div className="text-xs text-muted-foreground truncate">{transaction.description}</div>
                    </div>
                    <div className="hidden md:block md:col-span-3">
                      <span className={cn("category-badge", bg, text)}>
                        {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                      </span>
                    </div>
                    <div className={cn(
                      "col-span-3 md:col-span-2 font-medium",
                      transaction.amount > 0 ? "text-finance-green" : "text-finance-red"
                    )}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                    </div>
                    <div className="col-span-3 md:col-span-2 text-sm">
                      ${(3254.67 + transaction.amount).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredTransactions.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                No transactions found
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" className="w-full md:w-auto">
              View All Transactions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
