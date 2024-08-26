import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./CSS/ResetPassword.css"; // Ensure this path matches where you place your ForgotPassword.css
import axios from "axios";

const ResetPassword = () => {
  const location = useLocation();
  const { email } = location.state || {};
  console.log(email);
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      alert("Passwords do not match.");
      return;
    }
    axios
      .post("http://localhost:3001/reset-password", { email, password })
      .then((result) => {
        alert("Password changed Successfully");
        navigate("/login");
      })
      .catch((err) => alert("An error occurred. Please try again."));
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>Reset Password</h2>
        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="full-width"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Confirm Password"
          value={cpassword}
          onChange={(e) => setCPassword(e.target.value)}
          className="full-width"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ResetPassword;
