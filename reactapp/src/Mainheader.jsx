import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/Mainheader.css";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigate } from "react-router-dom";
const Mainheader = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const fetchEmail = async () => {
    axios.get("http://localhost:3001/get-role").then((result) => {
      if (result.data !== "Invalid") {
        setEmail(result.data.email);
        setRole(result.data.role);
      }
    });
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await axios.post("http://localhost:3001/logout");
      setRole("");
      setEmail("");
      navigate("/dashboard");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setShowModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="header-container">
      <header className="header">
        <div className="logo">Gaming Society</div>
        <nav className="nav">
          <ul>
            <li>
              <a href="./dashboard">Home</a>
            </li>
            <li>
              <a href="./tasks">Tasks</a>
            </li>
            <li>
              <a href="./teams">Teams</a>
            </li>
            <li>
              <a href="./blog">Blogs</a>
            </li>
            <li>
              <a href="./gallery">Gallery</a>
            </li>
            {role && (
              <li>
                <a href="./apply">Apply</a>
              </li>
            )}
            <li>
              <a href="./events">Events</a>
            </li>

            {(role === "president" || role === "Head") && (
              <li>
                <a href="./history">History</a>
              </li>
            )}
            <li>
              <a href="./announcements">Announcements</a>
            </li>
          </ul>
          {role && (
            <div className="auth-buttons">
              <button className="login" onClick={handleLogoutClick}>
                LOGOUT
              </button>
            </div>
          )}
          {!role && (
            <div className="auth-buttons">
              <a href="./login">
                <button className="login">LOGIN</button>
              </a>
              <a href="./signup">
                <button className="signup">SIGN UP</button>
              </a>
            </div>
          )}
        </nav>
      </header>
      <ConfirmationModal
        isVisible={showModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </div>
  );
};

export default Mainheader;
