
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { categoryColors, BudgetCategory } from '@/utils/dummyData';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { CategoryBudget, getBudgets, deleteBudget, setCategory } from '@/services/financeService';
import BudgetForm, { BudgetFormValues } from '@/components/BudgetForm';
import BudgetOverview from '@/components/BudgetOverview';

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<CategoryBudget | null>(null);
  const [availableCategories, setAvailableCategories] = useState<BudgetCategory[]>([]);
  
  // Load budgets
  useEffect(() => {
    const loadBudgets = () => {
      const loadedBudgets = getBudgets();
      setBudgets(loadedBudgets);
      updateAvailableCategories(loadedBudgets);
    };
    
    loadBudgets();
    // We need to refresh this whenever dialogs open/close
  }, [isAddDialogOpen, isEditDialogOpen, isDeleteDialogOpen]);
  
  // Update available categories
  const updateAvailableCategories = (currentBudgets: CategoryBudget[]) => {
    const allCategories: BudgetCategory[] = [
      'groceries', 'restaurants', 'transportation', 'utilities', 
      'entertainment', 'shopping', 'travel', 'health'
    ];
    
    const existingCategories = new Set(currentBudgets.map(b => b.category));
    const available = allCategories.filter(category => !existingCategories.has(category));
    setAvailableCategories(available);
  };
  
  // Handle add budget
  const handleAddBudget = (formValues: BudgetFormValues) => {
    setCategory(formValues.category, formValues.budgeted);
    const updatedBudgets = getBudgets();
    
    setBudgets(updatedBudgets);
    updateAvailableCategories(updatedBudgets);
    
    setIsAddDialogOpen(false);
  };
  
  // Handle edit budget
  const handleEditBudget = (formValues: BudgetFormValues) => {
    if (!selectedBudget) return;
    
    setCategory(formValues.category, formValues.budgeted);
    const updatedBudgets = getBudgets();
    
    setBudgets(updatedBudgets);
    updateAvailableCategories(updatedBudgets);
    
    setIsEditDialogOpen(false);
    setSelectedBudget(null);
  };
  
  // Handle delete budget
  const handleDeleteBudget = () => {
    if (!selectedBudget) return;
    
    const success = deleteBudget(selectedBudget.category);
    
    if (success) {
      const updatedBudgets = getBudgets();
      setBudgets(updatedBudgets);
      updateAvailableCategories(updatedBudgets);
    }
    
    setIsDeleteDialogOpen(false);
    setSelectedBudget(null);
  };
  
  // Open edit dialog
  const openEditDialog = (budget: CategoryBudget) => {
    setSelectedBudget(budget);
    setIsEditDialogOpen(true);
  };
  
  // Open delete dialog
  const openDeleteDialog = (budget: CategoryBudget) => {
    setSelectedBudget(budget);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <Layout>
      <div className="space-y-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Budget Management</h1>
            <p className="text-muted-foreground">Track and manage your spending categories</p>
          </div>
          {availableCategories.length > 0 && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Overview */}
          <BudgetOverview />
          
          {/* Budget Details */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Details</CardTitle>
              <CardDescription>Complete overview of your budget allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgets.map(budget => {
                    const { category, budgeted, spent } = budget;
                    const percentage = Math.round((spent / budgeted) * 100);
                    const { bg, text } = categoryColors[category];
                    const isOverBudget = spent > budgeted;
                    
                    return (
                      <TableRow key={category}>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={cn("w-3 h-3 rounded-full mr-2", bg)}></span>
                            <span className="font-medium capitalize">{category}</span>
                          </div>
                        </TableCell>
                        <TableCell>${budgeted.toFixed(2)}</TableCell>
                        <TableCell>${spent.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress 
                              value={Math.min(percentage, 100)} 
                              className={cn(
                                "h-2",
                                isOverBudget ? "bg-finance-red-light" : "bg-muted",
                                isOverBudget ? "data-[value]:bg-finance-red" : `data-[value]:${text.replace('text', 'bg')}`
                              )}
                            />
                            <div className="text-xs text-muted-foreground">
                              {percentage}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openEditDialog(budget)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openDeleteDialog(budget)}
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  {budgets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <p className="text-muted-foreground mb-4">You don't have any budgets set up yet.</p>
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create Your First Budget
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Budget Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
            <DialogDescription>
              Set a budget for a spending category.
            </DialogDescription>
          </DialogHeader>
          <BudgetForm 
            onSubmit={handleAddBudget} 
            onCancel={() => setIsAddDialogOpen(false)}
            availableCategories={availableCategories}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Budget Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>
              Update your budget for this category.
            </DialogDescription>
          </DialogHeader>
          {selectedBudget && (
            <BudgetForm 
              defaultValues={{
                category: selectedBudget.category,
                budgeted: selectedBudget.budgeted,
              }}
              onSubmit={handleEditBudget}
              onCancel={() => setIsEditDialogOpen(false)}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Budget Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this budget? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedBudget && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p className="capitalize">{selectedBudget.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget Amount</p>
                  <p>${selectedBudget.budgeted.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Spent Amount</p>
                  <p>${selectedBudget.spent.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className={selectedBudget.spent > selectedBudget.budgeted ? "text-finance-red" : "text-finance-green"}>
                    {selectedBudget.spent > selectedBudget.budgeted ? "Over Budget" : "Under Budget"}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteBudget}>
                  Delete Budget
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Budgets;
