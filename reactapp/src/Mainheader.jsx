import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./CSS/Mainheader.css";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigate } from "react-router-dom";
import DefaultProfileIcon from "./assets/profile-icon.png"; // Default profile icon image

const Mainheader = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(DefaultProfileIcon);
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for profile dropdown
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); // Profile dropdown

  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Reference for dropdown
  const profileDropdownRef = useRef(null); // Reference for profile dropdown

  const fetchEmail = async () => {
    axios.get("http://localhost:3001/get-role").then((result) => {
      if (result.data !== "Invalid") {
        setEmail(result.data.email);
        setRole(result.data.role);
        // Update profile picture if available
        if (result.data.profilePicture) {
          setProfilePicture(result.data.profilePicture); // Set user profile picture
        }
      }
    });
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close dropdown
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false); // Close profile dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // Toggle menu dropdown state
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev); // Toggle profile dropdown state
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
            <div className="profile-container">
              <img
                src={profilePicture}
                alt="Profile"
                className="profile-icon"
                onClick={toggleProfileDropdown}
              />
              {profileDropdownOpen && (
                <div className="profile-dropdown" ref={profileDropdownRef}>
                  <ul>
                    <li>
                      <a href="./profilepage">Profile Update</a>
                    </li>
                    <li onClick={handleLogoutClick}>Logout</li>
                  </ul>
                </div>
              )}
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
        {/* Three-dots menu icon for smaller screens */}
        <div className="menu-icon" onClick={toggleDropdown}>
          &#x22EE;
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu" ref={dropdownRef}>
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
          </div>
        )}
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
