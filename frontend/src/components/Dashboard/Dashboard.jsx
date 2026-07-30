import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/api";
import ExpenseList from "../Expenses/ExpenseList";
import ExpenseChart from "../Charts/ExpenseChart";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("expenses");
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    }
  };

  return (
    <div className="dashboard container">
      <nav className="dashboard-nav">
        <h1 className="dashboard-logo">💰 Expense Tracker</h1>

        <div className="dashboard-nav-right">
          {user && (
            <span className="dashboard-username">👥 {user.username}</span>
          )}

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-tabs">
        <button
          onClick={() => setActiveTab("expenses")}
          className={
            activeTab === "expenses" ? "dashboard-active-tab" : "dashboard-tab"
          }
        >
          📜 Expenses
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={
            activeTab === "analytics" ? "dashboard-active-tab" : "dashboard-tab"
          }
        >
          {" "}
          📈 Analytics
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "expenses" ? <ExpenseList /> : <ExpenseChart />}
      </div>
    </div>
  );
};

export default Dashboard;
