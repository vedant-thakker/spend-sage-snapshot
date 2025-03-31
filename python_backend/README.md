
# Python Backend for SpendSage

This is the Python backend for the SpendSage expense tracking application. It uses Flask to create a simple API that processes expense data using pandas, numpy, and matplotlib.

## Setup Instructions

1. Make sure you have Python 3.8+ installed on your computer.

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```
   python app.py
   ```

The server will start at http://localhost:5000

## API Endpoints

### POST /analyze-expenses
Analyzes expense data and returns summary statistics.

Request body:
```json
{
  "expenses": [
    {
      "id": "1",
      "amount": 50,
      "description": "Groceries",
      "date": "2023-10-15",
      "categoryId": "1"
    }
  ],
  "categories": [
    {
      "id": "1",
      "name": "Food",
      "color": "#84cc16",
      "budget": 500
    }
  ]
}
```

Response:
```json
{
  "totalSpent": 50,
  "categoryBreakdown": [...],
  "monthlyTrend": [...],
  "budgetStatus": [...],
  "stats": {...}
}
```

## Visualization

The backend will generate visualizations in the `plots` directory.
