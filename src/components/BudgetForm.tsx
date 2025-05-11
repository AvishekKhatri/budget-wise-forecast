
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { BudgetCategory } from '@/utils/dummyData';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PiggyBank, Edit } from "lucide-react";
import { toast } from "sonner";

// Define schema for budget form
const budgetSchema = z.object({
  category: z.enum([
    'groceries', 
    'restaurants', 
    'transportation', 
    'utilities', 
    'entertainment', 
    'shopping', 
    'travel',
    'health',
  ] as const),
  budgeted: z.coerce.number()
    .positive({ message: "Budget must be a positive number" })
    .refine(val => !isNaN(val), {
      message: "Budget must be a valid number",
    }),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  defaultValues?: BudgetFormValues;
  onSubmit: (values: BudgetFormValues) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  availableCategories?: BudgetCategory[];
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isEditing = false,
  availableCategories
}) => {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: defaultValues || {
      category: availableCategories && availableCategories.length > 0 
        ? availableCategories[0] 
        : "groceries",
      budgeted: 500,
    }
  });

  const handleSubmit = (values: BudgetFormValues) => {
    onSubmit(values);
    
    toast(isEditing ? "Budget Updated" : "Budget Added", {
      description: isEditing 
        ? "Your budget has been updated successfully." 
        : "Your new budget has been added successfully.",
    });
    
    // Only reset the form if not editing
    if (!isEditing) {
      form.reset();
    }
  };

  // Determine which categories to show in the select
  const categoriesToShow = isEditing 
    ? [defaultValues?.category as BudgetCategory] 
    : availableCategories || [
        'groceries', 'restaurants', 'transportation', 'utilities', 
        'entertainment', 'shopping', 'travel', 'health'
      ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isEditing} // Disable category selection when editing
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoriesToShow.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="budgeted"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? '' : parseFloat(value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {isEditing ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Update Budget
              </>
            ) : (
              <>
                <PiggyBank className="mr-2 h-4 w-4" />
                Set Budget
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BudgetForm;
