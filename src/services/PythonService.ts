
import { ExpenseData, CategoryData, ExpenseSummary } from "@/types/expense";

// This service makes API calls to a Python backend
export const PythonService = {
  getExpenseSummary: async (expenses: ExpenseData[], categories: CategoryData[]): Promise<ExpenseSummary> => {
    try {
      // Make API call to Python backend
      const response = await fetch('http://localhost:5000/analyze-expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expenses, categories }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data from Python backend:", error);
      
      // Fallback to client-side calculation in case the Python server is not running
      console.warn("Falling back to client-side calculation");
      return fallbackCalculation(expenses, categories);
    }
  }
};

// Fallback calculation in case Python backend is not available
const fallbackCalculation = (expenses: ExpenseData[], categories: CategoryData[]): ExpenseSummary => {
  // Calculate total spent
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate category breakdown
  const categoryBreakdown = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.categoryId === category.id);
    const totalAmount = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = totalSpent > 0 ? (totalAmount / totalSpent) * 100 : 0;
    
    return {
      categoryId: category.id,
      totalAmount,
      percentage
    };
  }).filter(cat => cat.totalAmount > 0);
  
  // Calculate monthly trend
  const monthlyData: Record<string, number> = {};
  
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = 0;
    }
    
    monthlyData[monthYear] += expense.amount;
  });
  
  const monthlyTrend = Object.entries(monthlyData)
    .map(([month, amount]) => {
      const [year, monthNum] = month.split('-');
      const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('default', { month: 'short' });
      
      return {
        month: `${monthName} ${year}`,
        amount
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });
  
  // Calculate budget status
  const budgetStatus = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.categoryId === category.id);
    const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = category.budget > 0 ? (spent / category.budget) * 100 : 0;
    
    return {
      categoryId: category.id,
      spent,
      budget: category.budget,
      percentage
    };
  });
  
  return {
    totalSpent,
    categoryBreakdown,
    monthlyTrend,
    budgetStatus
  };
};
