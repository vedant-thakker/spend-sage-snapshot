
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ExpenseData, CategoryData } from "@/types/expense";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, DollarSign, TrendingUp, Wallet } from "lucide-react";

interface DashboardProps {
  expenses: ExpenseData[];
  categories: CategoryData[];
  summary: any;
  isLoading: boolean;
}

const Dashboard = ({ expenses, categories, summary, isLoading }: DashboardProps) => {
  const getCategoryById = (id: string) => {
    return categories.find((category) => category.id === id);
  };

  const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);

  // Create data for pie chart
  const pieData = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.categoryId === category.id);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      name: category.name,
      value: total,
      color: category.color
    };
  }).filter(item => item.value > 0);

  // Create data for monthly bar chart
  const getMonthlyData = () => {
    const months: Record<string, number> = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!months[monthYear]) {
        months[monthYear] = 0;
      }
      
      months[monthYear] += expense.amount;
    });
    
    return Object.entries(months).map(([month, total]) => ({
      month,
      total
    })).slice(-6); // Last 6 months
  };

  const monthlyData = getMonthlyData();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="w-4 h-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1">
              From {expenses.length} expenses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <>
                <div className="text-2xl font-bold">{pieData.sort((a, b) => b.value - a.value)[0]?.name}</div>
                <p className="text-xs text-slate-500 mt-1">
                  ${pieData.sort((a, b) => b.value - a.value)[0]?.value.toFixed(2)}
                </p>
              </>
            ) : (
              <div className="text-slate-500">No data</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Latest Expense</CardTitle>
            <Calendar className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <>
                <div className="text-2xl font-bold truncate">
                  {expenses.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                  )[0]?.description}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  ${expenses.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                  )[0]?.amount.toFixed(2)}
                </p>
              </>
            ) : (
              <div className="text-slate-500">No expenses yet</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Trend</CardTitle>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            {monthlyData.length > 1 ? (
              <>
                <div className="text-2xl font-bold">
                  {monthlyData[monthlyData.length - 1]?.total > monthlyData[monthlyData.length - 2]?.total
                    ? "↑ Increasing"
                    : "↓ Decreasing"}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Compared to previous month
                </p>
              </>
            ) : (
              <div className="text-slate-500">Need more data</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                    labelLine={true}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                Add expenses to see your distribution
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']} />
                  <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                Add expenses to see your monthly trend
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map(category => {
              const categoryExpenses = expenses.filter(expense => expense.categoryId === category.id);
              const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
              const percentage = (spent / category.budget) * 100;
              
              return (
                <div key={category.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span>${spent.toFixed(2)} / ${category.budget.toFixed(2)}</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                    indicatorClassName={
                      percentage > 100 
                        ? "bg-red-500" 
                        : percentage > 80 
                          ? "bg-yellow-500" 
                          : "bg-emerald-500"
                    }
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
