
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExpenseData, CategoryData } from "@/types/expense";

interface ExpenseFormProps {
  onAddExpense: (expense: ExpenseData) => void;
  categories: CategoryData[];
}

const ExpenseForm = ({ onAddExpense, categories }: ExpenseFormProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !categoryId) {
      return;
    }

    const newExpense: ExpenseData = {
      id: "", // Will be set by parent component
      amount: parseFloat(amount),
      description,
      categoryId,
      date,
    };

    onAddExpense(newExpense);
    
    // Reset form
    setAmount("");
    setDescription("");
    setCategoryId("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount ($)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Coffee, Groceries, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
              >
                <SelectTrigger id="category" className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date" className="text-sm font-medium">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
          >
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
