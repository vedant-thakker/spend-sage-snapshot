
import { useState, useEffect } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import Dashboard from "@/components/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ExpenseData, CategoryData } from "@/types/expense";
import { PythonService } from "@/services/PythonService";

const Index = () => {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([
    { id: "1", name: "Food", color: "#84cc16", budget: 500 },
    { id: "2", name: "Transport", color: "#06b6d4", budget: 300 },
    { id: "3", name: "Entertainment", color: "#f59e0b", budget: 200 },
    { id: "4", name: "Shopping", color: "#ec4899", budget: 400 },
    { id: "5", name: "Bills", color: "#8b5cf6", budget: 600 }
  ]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    if (expenses.length > 0) {
      updateSummary();
    }
  }, [expenses]);

  const handleAddExpense = (newExpense: ExpenseData) => {
    setExpenses([...expenses, { ...newExpense, id: Date.now().toString() }]);
    toast({
      title: "Expense added",
      description: `$${newExpense.amount} for ${newExpense.description}`,
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
    toast({
      title: "Expense deleted",
      variant: "destructive",
    });
    updateSummary();
  };

  const updateSummary = async () => {
    setIsLoading(true);
    try {
      const data = await PythonService.getExpenseSummary(expenses, categories);
      setSummary(data);
    } catch (error) {
      console.error("Error getting summary:", error);
      toast({
        title: "Error analyzing expenses",
        description: "Check console for details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-mint-50 p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="font-sans text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
          SpendSage
        </h1>
        <p className="text-slate-600 mt-2">Track your expenses with ease</p>
      </header>

      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="add">Add Expense</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <Dashboard 
              expenses={expenses} 
              categories={categories} 
              summary={summary}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="add">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <ExpenseForm 
                onAddExpense={handleAddExpense} 
                categories={categories}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
