
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
import { useToast } from '@/hooks/use-toast';

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
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const { toast } = useToast();
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: defaultValues || {
      category: "groceries",
      budgeted: 500,
    }
  });

  const handleSubmit = (values: BudgetFormValues) => {
    onSubmit(values);
    form.reset();
    
    toast({
      title: isEditing ? "Budget Updated" : "Budget Added",
      description: isEditing 
        ? "Your budget has been updated successfully." 
        : "Your new budget has been added successfully."
    });
  };

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
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="restaurants">Restaurants</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
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
