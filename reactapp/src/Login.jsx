import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CSS/Login.css"; // Ensure this path matches where you place your Login.css
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    axios
      .post("http://localhost:3001/login", { email, password })
      .then((result) => {
        console.log(result);
        if (result.data === "Success") {
          navigate("/dashboard");
        } else {
          alert(result.data);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        {error && <p className="error-message">{error}</p>}
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="full-width"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="full-width"
          required
        />
        <button type="submit">Login</button>
        <p className="signup-prompt">
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>
          <br />
          <br />
          <Link to="/forget-password" className="signup-link">
            Forget Password?
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
