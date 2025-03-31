
import { useState } from "react";
import { ExpenseData, CategoryData } from "@/types/expense";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExpenseListProps {
  expenses: ExpenseData[];
  categories: CategoryData[];
  onDeleteExpense: (id: string) => void;
}

const ExpenseList = ({ expenses, categories, onDeleteExpense }: ExpenseListProps) => {
  const [filterCategory, setFilterCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getCategoryById = (id: string) => {
    return categories.find((category) => category.id === id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const filteredExpenses = expenses
    .filter((expense) => 
      (filterCategory ? expense.categoryId === filterCategory : true) &&
      (searchTerm ? 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) : 
        true
      )
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="md:w-1/4">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
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
        <div className="md:w-1/6">
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          >
            {sortOrder === "desc" ? "Newest" : "Oldest"}
          </Button>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No expenses found.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => {
            const category = getCategoryById(expense.categoryId);
            return (
              <Card 
                key={expense.id} 
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4 text-white font-bold"
                      style={{ backgroundColor: category?.color || "#D3D3D3" }}
                    >
                      {category?.name.charAt(0) || "?"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{expense.description}</h3>
                      <div className="text-sm text-slate-500 flex items-center space-x-2">
                        <span>{category?.name || "Uncategorized"}</span>
                        <span>•</span>
                        <span>{formatDate(expense.date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-semibold">
                        ${expense.amount.toFixed(2)}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDeleteExpense(expense.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
