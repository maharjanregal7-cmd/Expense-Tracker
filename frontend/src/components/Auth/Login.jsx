import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import "./Login.css";
const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Login to Expense Tracker</h2>

        {error && <p className="login-error">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="enter your username"
          value={formData.username}
          onChange={handleChange}
          className="login-input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="login-input"
          required
        />

        <button type="submit" className="login-button">
          Login
        </button>

        <p className="login-footer">
          Don't have account?
          <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
