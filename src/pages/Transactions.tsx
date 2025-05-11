
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Transaction, TransactionCategory, categoryColors } from '@/utils/dummyData';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Search, PlusCircle, Edit, Trash2, Filter } from 'lucide-react';
import { 
  getTransactions, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '@/services/financeService';
import TransactionForm, { TransactionFormValues } from '@/components/TransactionForm';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<TransactionCategory | 'all'>('all');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Load transactions
  useEffect(() => {
    const loadedTransactions = getTransactions();
    setTransactions(loadedTransactions);
    setFilteredTransactions(loadedTransactions);
  }, []);
  
  // Format date from YYYY-MM-DD to more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric',
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
  
  // Handle add transaction
  const handleAddTransaction = (formValues: TransactionFormValues) => {
    const newTransaction = addTransaction(
      formValues.merchant,
      formValues.description,
      formValues.amount,
      formValues.category,
      formValues.date
    );
    
    setTransactions(getTransactions());
    setFilteredTransactions(prevFiltered => [newTransaction, ...prevFiltered]);
    setIsAddDialogOpen(false);
  };
  
  // Handle edit transaction
  const handleEditTransaction = (formValues: TransactionFormValues) => {
    if (!selectedTransaction) return;
    
    const updated = updateTransaction(selectedTransaction.id, {
      merchant: formValues.merchant,
      description: formValues.description,
      amount: formValues.amount,
      category: formValues.category,
      date: formValues.date
    });
    
    if (updated) {
      const updatedTransactions = getTransactions();
      setTransactions(updatedTransactions);
      
      // Re-apply current filters
      if (activeFilter === 'all') {
        if (searchTerm.trim() === '') {
          setFilteredTransactions(updatedTransactions);
        } else {
          handleSearch({ target: { value: searchTerm } } as React.ChangeEvent<HTMLInputElement>);
        }
      } else {
        handleFilterChange(activeFilter);
      }
    }
    
    setIsEditDialogOpen(false);
    setSelectedTransaction(null);
  };
  
  // Handle delete transaction
  const handleDeleteTransaction = () => {
    if (!selectedTransaction) return;
    
    const success = deleteTransaction(selectedTransaction.id);
    
    if (success) {
      const updatedTransactions = getTransactions();
      setTransactions(updatedTransactions);
      
      // Re-apply current filters
      if (activeFilter === 'all') {
        if (searchTerm.trim() === '') {
          setFilteredTransactions(updatedTransactions);
        } else {
          handleSearch({ target: { value: searchTerm } } as React.ChangeEvent<HTMLInputElement>);
        }
      } else {
        handleFilterChange(activeFilter);
      }
    }
    
    setIsDeleteDialogOpen(false);
    setSelectedTransaction(null);
  };
  
  // Open edit dialog
  const openEditDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };
  
  // Open delete dialog
  const openDeleteDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };
  
  // Get the unique categories from transactions
  const categories = Array.from(
    new Set(transactions.map(t => t.category))
  );
  
  return (
    <Layout>
      <div className="space-y-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">Review and manage your transaction history</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>Your complete transaction history</CardDescription>
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
              
              {/* Transactions table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {formatDate(transaction.date)}
                        </TableCell>
                        <TableCell>{transaction.merchant}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs",
                            categoryColors[transaction.category].bg,
                            categoryColors[transaction.category].text
                          )}>
                            {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className={cn(
                          "font-medium",
                          transaction.amount > 0 ? "text-finance-green" : "text-finance-red"
                        )}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openEditDialog(transaction)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openDeleteDialog(transaction)}
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredTransactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Enter the details for your new transaction.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm 
            onSubmit={handleAddTransaction} 
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update the details of your transaction.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <TransactionForm 
              defaultValues={{
                merchant: selectedTransaction.merchant,
                description: selectedTransaction.description,
                amount: selectedTransaction.amount,
                category: selectedTransaction.category,
                date: selectedTransaction.date,
              }}
              onSubmit={handleEditTransaction}
              onCancel={() => setIsEditDialogOpen(false)}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Transaction Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Merchant</p>
                  <p>{selectedTransaction.merchant}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p className={selectedTransaction.amount > 0 ? "text-finance-green" : "text-finance-red"}>
                    {selectedTransaction.amount > 0 ? '+' : ''}{selectedTransaction.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{formatDate(selectedTransaction.date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p className="capitalize">{selectedTransaction.category}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p>{selectedTransaction.description}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteTransaction}>
                  Delete Transaction
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Transactions;
