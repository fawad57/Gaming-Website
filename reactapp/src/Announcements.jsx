import React, { useState, useEffect } from "react";
import "./CSS/Announcements.css";
import axios from "axios";
import Mainheader from "./Mainheader";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const fetchAnnouncements = async () => {
    try {
      const result = await axios.get("http://localhost:3001/announcements");
      setAnnouncements(result.data);
      console.log(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const fetchEmail = async () => {
    axios.get("http://localhost:3001/get-role").then((result) => {
      if (result.data !== "Invalid") {
        setEmail(result.data.email);
        setRole(result.data.role);
        setName(result.data.name);
      }
    });
  };

  useEffect(() => {
    fetchEmail();
    fetchAnnouncements();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/announcements", { title, message })
      .then((result) => {
        alert(result.data);
        fetchAnnouncements();
        setMessage("");
        setTitle("");
      });
  };

  return (
    <div className="announcement-page">
      <Mainheader />
      <div className="announcement-container">
        <h1>Announcements</h1>
        {(role === "president" || role === "Head") && (
          <form className="announcement-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message"
                required
                rows="4"
              />
            </div>
            <button type="submit" className="submit-button">
              Add Announcement
            </button>
          </form>
        )}
        <div className="announcements-list">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div key={announcement._id} className="announcement-item">
                <h3>{announcement.title}</h3>
                <p>{announcement.message}</p>
                <small>
                  By: {announcement.createdBy} on{" "}
                  {new Date(announcement.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          ) : (
            <p>No such announcement available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
