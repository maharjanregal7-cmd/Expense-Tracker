import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import "../Auth/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
      await register(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Register</h2>

        {error && <p className="register-error">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          className="register-input"
          required
        />

        <input
          type="text"
          name="email"
          value={formData.email}
          placeholder="Enter email"
          onChange={handleChange}
          className="register-input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
          className="register-input"
          required
        />

        <button type="submit" className="register-button">
          Register
        </button>
        <p className="register-footer">
          Already have an account
          <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
