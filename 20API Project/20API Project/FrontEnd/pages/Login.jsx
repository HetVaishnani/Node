import React, { useState } from "react";
import "./Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8888/login", {
        email: emailOrUsername,
        password,
        role,
      });

      if (res.data.success) {
        setError("");
        if (res.data.role === "admin") {
          navigate(`/admin-dashboard?email=${emailOrUsername}`);
        } else if (res.data.role === "manager") {
          navigate(`/manager-dashboard?email=${emailOrUsername}`);
        } else if (res.data.role === "employee") {
          navigate(`/employee-dashboard?email=${emailOrUsername}`);
        } else {
          alert("Unknown role. Please contact admin.");
        }
      } else {
        setError(res.data.msg || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email or Username</label>
            <input
              type="text"
              className="form-control"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Enter email or username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Login As</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div className="d-grid mb-2">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="text-center">
            <p className="mb-1">
              Don't have an account?{" "}
              <Link to="/" className="text-decoration-none">
                Register
              </Link>
            </p>
            <p>
              <Link to="/forgot-password" className="text-decoration-none">
                Forgot Password?
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
