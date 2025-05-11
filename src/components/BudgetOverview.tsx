
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
import { CategoryBudget, getBudgets, setCategory, deleteBudget } from '@/services/financeService';
import BudgetForm, { BudgetFormValues } from './BudgetForm';

const BudgetOverview: React.FC = () => {
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<CategoryBudget | null>(null);
  
  // Load budgets
  useEffect(() => {
    const loadedBudgets = getBudgets();
    setBudgets(loadedBudgets);
  }, []);
  
  // Handle add budget
  const handleAddBudget = (formValues: BudgetFormValues) => {
    const newBudget = setCategory(formValues.category, formValues.budgeted);
    
    setBudgets(getBudgets());
    setIsAddDialogOpen(false);
  };
  
  // Handle edit budget
  const handleEditBudget = (formValues: BudgetFormValues) => {
    if (!selectedBudget) return;
    
    setCategory(formValues.category, formValues.budgeted);
    setBudgets(getBudgets());
    
    setIsEditDialogOpen(false);
    setSelectedBudget(null);
  };
  
  // Handle delete budget
  const handleDeleteBudget = () => {
    if (!selectedBudget) return;
    
    const success = deleteBudget(selectedBudget.category);
    
    if (success) {
      setBudgets(getBudgets());
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
  
  // Check if a category already has a budget
  const getAvailableCategories = (): BudgetCategory[] => {
    const allCategories: BudgetCategory[] = [
      'groceries', 'restaurants', 'transportation', 'utilities', 
      'entertainment', 'shopping', 'travel', 'health'
    ];
    
    const existingCategories = new Set(budgets.map(b => b.category));
    return allCategories.filter(category => !existingCategories.has(category));
  };
  
  const availableCategories = getAvailableCategories();
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Track your spending against your budget goals</CardDescription>
        </div>
        {availableCategories.length > 0 && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Budget
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgets.length === 0 ? (
            <div className="text-center p-6">
              <p className="text-muted-foreground mb-4">You don't have any budgets set up yet.</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Budget
              </Button>
            </div>
          ) : (
            budgets.map((budget) => {
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
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "text-sm font-medium",
                        isOverBudget ? "text-finance-red" : "text-finance-green"
                      )}>
                        ${spent.toFixed(2)} / ${budgeted.toFixed(2)}
                      </div>
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
                  </div>
                  <div className="space-y-1">
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className={cn(
                        "h-2",
                        isOverBudget ? "bg-finance-red-light" : "bg-muted",
                        isOverBudget ? "data-[value]:bg-finance-red" : `data-[value]:${text.replace('text', 'bg')}`
                      )}
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
            })
          )}
        </div>
      </CardContent>
      
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
    </Card>
  );
};

export default BudgetOverview;
