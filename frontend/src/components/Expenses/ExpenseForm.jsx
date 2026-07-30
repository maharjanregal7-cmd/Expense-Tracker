import { useState, useEffect } from "react";
import { createExpense, updateExpense } from "../../services/api";
import "../Expenses/ExpenseForm.css";

const ExpenseForm = ({ expense, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "food",
    amount: "",
    date: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        description: expense.description || "",
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = { ...formData, amount: parseFloat(formData.amount) || 0 };
      if (expense) {
        await updateExpense(expense.id, submitData);
      } else {
        await createExpense(submitData);
      }

      onSuccess();
    } catch (error) {
      alert("Error saving expense: " + (error.response?.data?.detail || error.response?.data?.message || JSON.stringify(error.response?.data) || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-overlay">
      <form onSubmit={handleSubmit}>
        <h3 className="expense-title">
          {expense ? "Edit Expense" : "Add new expense"}
        </h3>

        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Amount *</label>

          <input
            type="number"
            name="amount"
            onChange={handleChange}
            value={formData.amount}
            className="form-input"
            placeholder="Enter your Amount"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="other">Other</option>
            <option value="entertainment">Entertainment</option>
            <option value="bills">Bills</option>
            <option value="shopping">Shopping</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Add notes"
            onChange={handleChange}
            className="form-textarea"
            rows="3"
            value={formData.description}
          ></textarea>
        </div>

        <div className="button-group">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "saving..." : expense ? "update" : "add"}
          </button>

          <button
            className="cancel-btn"
            onClick={onCancel}
            type="button"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
