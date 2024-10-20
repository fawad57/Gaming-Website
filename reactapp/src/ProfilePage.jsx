// ./src/components/ProfilePage.jsx
import React from "react";
import "./CSS/ProfilePage.css";
import profileImage from "./assets/profile-icon.png"; // Assume you have a profile image in the assets folder

const ProfilePage = () => {
  // Sample repositories
  const repositories = [
    { name: "Gaming Website", language: "JavaScript", stars: 1 },
    { name: "Health Care Center Mobile App", language: "JavaScript" },
    { name: "Portfolio", language: "HTML" },
    { name: "Cinemate", language: "TypeScript", stars: 1 },
    { name: "SQL Cafe Management System", language: "C#" },
    { name: "Console Base Car Game", language: "C++" },
  ];

  return (
    <div className="profile-container">
      {/* Profile Section */}
      <div className="profile-header">
        <img src={profileImage} alt="Profile" className="profile-image" />
        <div className="profile-info">
          <h1>Fawad Humayun</h1>
          <p>@fawad57</p>
          <a href="mailto:fawadhumayun96@gmail.com" className="email-link">
            fawadhumayun96@gmail.com
          </a>
          <button className="edit-profile">Edit Profile</button>
        </div>
      </div>

      {/* Repositories Section */}
      <div className="repos-section">
        <h2>Popular Repositories</h2>
        <div className="repos">
          {repositories.map((repo, index) => (
            <div className="repo-card" key={index}>
              <h3>{repo.name}</h3>
              <p>{repo.language}</p>
              {repo.stars && <p>⭐ {repo.stars}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Contribution Section */}
      <div className="contributions-section">
        <h2>Contributions</h2>
        <p>19 contributions in the last year</p>
        <div className="contribution-graph">
          {/* Simulated contribution graph (you can replace this with a real library like GitHub's API if needed) */}
          <div className="contribution-box"></div>
          <div className="contribution-box active"></div>
          <div className="contribution-box"></div>
          <div className="contribution-box"></div>
          {/* Add more boxes as needed */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
