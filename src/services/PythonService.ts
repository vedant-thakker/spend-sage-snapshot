
import { ExpenseData, CategoryData } from "@/types/expense";

// This service simulates Python backend processing using JavaScript
// In a real application, this would make API calls to a Python backend
export const PythonService = {
  getExpenseSummary: async (expenses: ExpenseData[], categories: CategoryData[]) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Calculate total spent
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate category breakdown (similar to pandas groupby)
    const categoryBreakdown = categories.map(category => {
      const categoryExpenses = expenses.filter(expense => expense.categoryId === category.id);
      const totalAmount = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const percentage = totalSpent > 0 ? (totalAmount / totalSpent) * 100 : 0;
      
      return {
        categoryId: category.id,
        categoryName: category.name,
        totalAmount,
        percentage
      };
    }).filter(cat => cat.totalAmount > 0);
    
    // Calculate monthly trend (similar to pandas resample)
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
      const percentage = (spent / category.budget) * 100;
      
      return {
        categoryId: category.id,
        categoryName: category.name,
        spent,
        budget: category.budget,
        percentage,
        remaining: category.budget - spent
      };
    });
    
    // Simulate descriptive statistics (similar to pandas describe())
    const amounts = expenses.map(expense => expense.amount);
    const min = Math.min(...(amounts.length ? amounts : [0]));
    const max = Math.max(...(amounts.length ? amounts : [0]));
    const avg = amounts.length ? amounts.reduce((sum, val) => sum + val, 0) / amounts.length : 0;
    const median = amounts.length ? 
      (amounts.sort((a, b) => a - b)[Math.floor(amounts.length / 2)] || 0) : 
      0;
    
    return {
      totalSpent,
      categoryBreakdown,
      monthlyTrend,
      budgetStatus,
      stats: {
        count: expenses.length,
        min,
        max,
        avg,
        median
      }
    };
  }
};
