import React, { useEffect, useState } from "react";
import "./CSS/Dashboard.css";
import axios from "axios";
import Mainheader from "./Mainheader";

const Dashboard = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  const fetchEmail = async () => {
    axios.get("http://localhost:3001/get-role").then((result) => {
      if (result.data === "Invalid") {
      } else {
        setEmail(result.data.email);
        setRole(result.data.role);
        console.log(role);
      }
    });
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  return (
    <div className="container">
      <Mainheader />
      <main className="main">
        <div className="main-content-box">
          <h1>FAST GAMING SOCIETY</h1>
          <p>
            Dive into a world where gaming isn't just a hobby, it's a lifestyle.
            At Fast Gaming Society, we bring together passionate gamers from all
            corners of the globe to experience the ultimate gaming community.
            Whether you're a casual player or a hardcore enthusiast, you'll find
            something to ignite your passion here.
          </p>
          <div className="buttons">
            <button className="about">ABOUT THE WEBSITE</button>
            <button className="news">NEWS</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
