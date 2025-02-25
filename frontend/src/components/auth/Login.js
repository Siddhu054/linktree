import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import styles from "./Login.module.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await api.post("/auth/login", formData);
  

    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // ✅ Store token
      
      if (success) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        throw new Error("Failed to load user profile");
      }
    } else {
      throw new Error("No token received");
    }
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    const message = error.response?.data?.message || "Login failed";
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h1>Welcome Back</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <Link to="/forgot-password" className={styles.forgotPassword}>
          Forgot Password?
        </Link>
        <div className={styles.register}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.registerLink}>
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
