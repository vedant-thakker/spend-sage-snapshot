
export interface ExpenseData {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
}

export interface CategoryData {
  id: string;
  name: string;
  color: string;
  budget: number;
}

export interface ExpenseSummary {
  totalSpent: number;
  categoryBreakdown: {
    categoryId: string;
    totalAmount: number;
    percentage: number;
  }[];
  monthlyTrend: {
    month: string;
    amount: number;
  }[];
  budgetStatus: {
    categoryId: string;
    spent: number;
    budget: number;
    percentage: number;
  }[];
}
