import React, { useState, useEffect } from "react";
import "./ExpenseList.css";
import { getExpenses, deleteExpense } from "../../services/api";
import ExpenseForm from "./ExpenseForm";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let filtered = expenses;

    if (filterCategory) {
      filtered = filtered.filter((exp) => exp.category === filterCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (exp.description &&
            exp.description.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    setFilteredExpenses(filtered);
  }, [expenses, searchTerm, filterCategory]);

  const fetchExpenses = async () => {
    setLoading(true);

    try {
      const response = await getExpenses();
      setExpenses(response.data);
      setFilteredExpenses(response.data);
    } catch (err) {
      alert("Error loading expenses: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      try {
        await deleteExpense(id);
        setExpenses(expenses.filter((exp) => exp.id !== id));
      } catch {
        alert("Error deleting expense");
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingExpense(null);
    fetchExpenses();
  };

  const totalAmount = filteredExpenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount),
    0,
  );

  const getCategoryEmoji = (category) => {
    const emojis = {
      food: "🍔",
      transport: "🚗",
      entertainment: "🎮",
      bills: "💡",
      shopping: "🛍️",
      other: "📦",
    };

    return emojis[category] || "📦";
  };

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  return (
    <div className="expense-container">
      <div className="expense-header">
        <h2>My Expenses</h2>

        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Add Expense
        </button>
      </div>

      <div className="summary">
        <div className="summary-item">
          <span className="summary-label">Total Expenses</span>
          <span className="summary-value">${totalAmount.toFixed(2)}</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Count</span>
          <span className="summary-value">{filteredExpenses.length}</span>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="food">🍔 Food</option>
          <option value="transport">🚗 Transport</option>
          <option value="entertainment">🎮 Entertainment</option>
          <option value="bills">💡 Bills</option>
          <option value="shopping">🛍️ Shopping</option>
          <option value="other">📦 Other</option>
        </select>

        {(searchTerm || filterCategory) && (
          <button
            className="clear-btn"
            onClick={() => {
              setSearchTerm("");
              setFilterCategory("");
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="expense-list">
        {filteredExpenses.length === 0 ? (
          <div className="empty">
            <p>No expenses found</p>

            <button className="add-btn" onClick={() => setShowForm(true)}>
              Add your first expense
            </button>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div className="expense-item" key={expense.id}>
              <div className="expense-icon">
                {getCategoryEmoji(expense.category)}
              </div>

              <div className="expense-info">
                <h4>{expense.title}</h4>

                <p>
                  {expense.category.charAt(0).toUpperCase() +
                    expense.category.slice(1)}
                </p>

                <p>{new Date(expense.date).toLocaleDateString()}</p>

                {expense.description && <p>{expense.description}</p>}
              </div>

              <div className="expense-actions">
                <span className="amount">${expense.amount}</span>

                <button
                  className="edit-btn"
                  onClick={() => handleEdit(expense)}
                >
                  ✏️ Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(expense.id, expense.title)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
        />
      )}
    </div>
  );
}

export default ExpenseList;
