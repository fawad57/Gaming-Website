import React, { useState, useEffect } from "react";
import "./CSS/Teams.css";
import Mainheader from "./Mainheader";
import axios from "axios";

const Teams = () => {
  const [teams, setTeams] = useState([]);

  const fetchteams = async () => {
    try {
      const response = await axios.get("http://localhost:3001/teams");
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    fetchteams();
  }, []);

  return (
    <div className="teams-page">
      <Mainheader />
      <div className="teams-content">
        <h1 className="main-heading">Gaming Society Teams</h1>
        <div className="teams-container">
          {teams.map((team) => (
            <div key={team.name} className="outer-box">
              <div className="team-box">
                <h2>{team.name}</h2>
                <p>
                  <strong>Head:</strong> {team.head_name}
                </p>
                <p>
                  <strong>Vice Head:</strong> {team.vice_head}
                </p>
                <p>
                  <strong>Members:</strong> {team.no_of_members}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Teams;
