
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/analyze-expenses', methods=['POST'])
def analyze_expenses():
    # Get data from request
    data = request.json
    expenses = data.get('expenses', [])
    categories = data.get('categories', [])
    
    # Convert to pandas DataFrames
    expenses_df = pd.DataFrame(expenses)
    categories_df = pd.DataFrame(categories)
    
    # Calculate total spent
    total_spent = expenses_df['amount'].sum()
    
    # Category breakdown using pandas
    category_breakdown = []
    for _, category in categories_df.iterrows():
        category_expenses = expenses_df[expenses_df['categoryId'] == category['id']]
        total_amount = category_expenses['amount'].sum()
        percentage = (total_amount / total_spent * 100) if total_spent > 0 else 0
        
        if total_amount > 0:
            category_breakdown.append({
                'categoryId': category['id'],
                'totalAmount': float(total_amount),
                'percentage': float(percentage)
            })
    
    # Monthly trend using pandas resample
    expenses_df['date'] = pd.to_datetime(expenses_df['date'])
    monthly_data = []
    
    # Group by month and sum the amounts
    monthly_sum = expenses_df.groupby(expenses_df['date'].dt.strftime('%Y-%m')).agg({'amount': 'sum'})
    
    for month, row in monthly_sum.iterrows():
        year, month_num = month.split('-')
        month_name = datetime(int(year), int(month_num), 1).strftime('%b')
        monthly_data.append({
            'month': f"{month_name} {year}",
            'amount': float(row['amount'])
        })
    
    # Sort monthly data by date
    monthly_data.sort(key=lambda x: datetime.strptime(x['month'], '%b %Y'))
    
    # Budget status
    budget_status = []
    for _, category in categories_df.iterrows():
        category_expenses = expenses_df[expenses_df['categoryId'] == category['id']]
        spent = category_expenses['amount'].sum()
        percentage = (spent / category['budget'] * 100) if category['budget'] > 0 else 0
        
        budget_status.append({
            'categoryId': category['id'],
            'spent': float(spent),
            'budget': float(category['budget']),
            'percentage': float(percentage)
        })
    
    # Calculate statistics using pandas describe()
    if not expenses_df.empty:
        stats = expenses_df['amount'].describe()
        statistics = {
            'count': int(stats['count']),
            'min': float(stats['min']),
            'max': float(stats['max']),
            'avg': float(stats['mean']),
            'median': float(stats['50%'])
        }
    else:
        statistics = {
            'count': 0,
            'min': 0,
            'max': 0,
            'avg': 0,
            'median': 0
        }
    
    # Save a visualization if needed
    if not expenses_df.empty and len(monthly_data) > 1:
        plt.figure(figsize=(10, 6))
        months = [item['month'] for item in monthly_data]
        amounts = [item['amount'] for item in monthly_data]
        plt.bar(months, amounts, color='skyblue')
        plt.xlabel('Month')
        plt.ylabel('Amount ($)')
        plt.title('Monthly Expenses')
        plt.xticks(rotation=45)
        plt.tight_layout()
        
        # Create plots directory if it doesn't exist
        os.makedirs('plots', exist_ok=True)
        plt.savefig('plots/monthly_expenses.png')
        plt.close()
    
    return jsonify({
        'totalSpent': float(total_spent),
        'categoryBreakdown': category_breakdown,
        'monthlyTrend': monthly_data,
        'budgetStatus': budget_status,
        'stats': statistics
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
