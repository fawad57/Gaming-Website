import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CSS/ForgetPassword.css"; // Ensure this path matches where you place your ForgotPassword.css
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/forget-password", { email })
      .then((result) => {
        console.log(result.data);
        if (result.data !== "Incorrect email") {
          alert("OTP successfully sent to your Email");
          navigate("/verification", {
            state: { email: email },
          });
        }
      })
      .catch((err) => alert("An error occurred. Please try again."));
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>Forgot Password</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="full-width"
          required
        />
        <button type="submit">Submit</button>
        <p className="login-prompt">
          Remember your password?{" "}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
