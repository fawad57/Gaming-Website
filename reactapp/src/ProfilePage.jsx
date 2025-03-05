import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/ProfilePage.css";
import profileImage from "./assets/profile-icon.png"; // Default profile image

const ProfilePage = () => {
  const [profilePic, setProfilePic] = useState(profileImage);
  const [name, setName] = useState("Fawad Humayun");
  const [username, setUsername] = useState("@fawad57");
  const [nemail, setNEmail] = useState("fawadhumayun96@gmail.com");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  const fetchEmail = async () => {
    axios.get("http://localhost:3001/get-role").then((result) => {
      if (result.data !== "Invalid") {
        setEmail(result.data.email);
        setRole(result.data.role);
        setProfilePic(result.data.picture); // Set user profile picture
      }
    });
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));

      // Prepare FormData to send the image to the server
      const formData = new FormData();
      formData.append("profilePic", file);
      formData.append("email", email);

      // Send image to the backend
      axios
        .post("http://localhost:3001/api/upload-profile-picture", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Image uploaded successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error uploading the image:", error);
        });
    }
  };

  const handleSaveChanges = () => {
    const updatedProfile = {
      name,
      username,
      email,
      password,
    };

    // Send updated profile info to the backend
    axios
      .post("/api/update-profile", updatedProfile)
      .then((response) => {
        alert("Profile updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div className="profile-container">
      {/* Profile Section */}
      <div className="profile-header">
        <div className="upload-section">
          <img
            src={
              profilePic ? `http://localhost:3001/${profilePic}` : profileImage
            }
            alt="Profile"
            className="profile-image"
          />
          <label htmlFor="profilePicInput" className="upload-label">
            Upload Picture
          </label>
          <input
            type="file"
            id="profilePicInput"
            onChange={handleProfilePicChange}
          />
        </div>
        <div className="profile-info">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="profile-name-input"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="profile-username-input"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="profile-email-input"
          />
        </div>
      </div>

      {/* Password Update Section */}
      <div className="password-section">
        <h2>Change Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
        />
      </div>

      {/* Save Changes Button */}
      <button className="save-profile-btn" onClick={handleSaveChanges}>
        Save Changes
      </button>
    </div>
  );
};

export default ProfilePage;
