import { useState, useEffect } from "react";
import { getExpenses } from "../../services/api";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ExpenseChart = () => {
  const [expenses, setExpenses] = useState([]);
  const [chartType, setChartType] = useState("pie");

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses();
      setExpenses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const getCategoryData = () => {
    const categoryTotals = {};

    expenses.forEach((expense) => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += parseFloat(expense.amount);
      } else {
        categoryTotals[expense.category] = parseFloat(expense.amount);
      }
    });

    return Object.keys(categoryTotals).map((category) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount: categoryTotals[category],
      count: expenses.filter((e) => e.category === category).length,
    }));
  };

  const getMonthlyData = () => {
    const monthlyTotals = {};

    expenses.forEach((expense) => {
      const month = expense.date.substring(0, 7);

      if (monthlyTotals[month]) {
        monthlyTotals[month] += parseFloat(expense.amount);
      } else {
        monthlyTotals[month] = parseFloat(expense.amount);
      }
    });

    return Object.keys(monthlyTotals)
      .sort()
      .map((month) => ({
        month,
        amount: monthlyTotals[month],
      }));
  };

  const categoryData = getCategoryData();
  const monthlyData = getMonthlyData();

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2>📊 Expense Analytics</h2>

        <div className="chart-buttons">
          <button
            className={
              chartType === "pie" ? "chart-btn active-btn" : "chart-btn"
            }
            onClick={() => setChartType("pie")}
          >
            Pie Chart
          </button>

          <button
            className={
              chartType === "bar" ? "chart-btn active-btn" : "chart-btn"
            }
            onClick={() => setChartType("bar")}
          >
            Bar Chart
          </button>

          <button
            className={
              chartType === "line" ? "chart-btn active-btn" : "chart-btn"
            }
            onClick={() => setChartType("line")}
          >
            Line Trend
          </button>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-box">
          <p>No data to display.Add some expenses first</p>
        </div>
      ) : (
        <div className="charts-container">
          {chartType === "pie" && (
            <div className="chart-box">
              <h3>Expenses by Category</h3>

              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={(entry) => `${entry.category}: $${entry.amount.toFixed(2)}`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {chartType === "bar" && (
            <div className="chart-box">
              <h3>Expenses by Category</h3>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {chartType === "line" && (
            <div className="chart-box">
              <h3>Monthly Spending Trend</h3>

              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="stats-box">
            <h3>Category Breakdown</h3>

            <table className="stats-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Count</th>
                </tr>
              </thead>

              <tbody>
                {categoryData.map((cat, index) => (
                  <tr key={index}>
                    <td>{cat.category}</td>

                    <td className="amount-cell">${cat.amount.toFixed(2)}</td>

                    <td>{cat.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;
