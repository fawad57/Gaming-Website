import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CSS/Verification.css";
import axios from "axios";

const Verification = () => {
  const location = useLocation();
  const { email } = location.state || {};

  const [code, setCode] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/verify-otp", { email, code })
      .then((result) => {
        navigate("/resetpassword", { state: { email: email } });
      })
      .catch((err) => {
        alert("Incorrect OTP code. Please try again!");
      });
  };

  const ResendCode = (e) => {
    axios
      .post("http://localhost:3001/forget-password", { email })
      .then((result) => {
        alert("OTP resent successfully!");
      })
      .catch((err) => alert("An error occurred. Please try again."));
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>Verification</h2>
        <p className="text-color">Enter the code received on your email</p>
        <input
          type="text"
          name="verify"
          placeholder="Verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="full-width"
          required
        />
        <button type="submit">Verify</button>
        <p className="login-prompt">
          Didn't receive the code?{" "}
          <u onClick={ResendCode} className="login-link">
            Resend Code
          </u>
        </p>
      </form>
    </div>
  );
};

export default Verification;
