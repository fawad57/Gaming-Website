import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/History.css"; // Ensure this CSS file exists
import Mainheader from "./Mainheader";

const History = () => {
  const [applicationsHistory, setApplicationsHistory] = useState([]);
  const [eventsHistory, setEventsHistory] = useState([]);

  const fetchApplicationsHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/applications-history"
      );
      setApplicationsHistory(response.data);
    } catch (error) {
      console.error("Error fetching applications history:", error);
    }
  };

  const fetchEventsHistory = async () => {
    try {
      const response = await axios.get("http://localhost:3001/events-history");
      setEventsHistory(response.data);
    } catch (error) {
      console.error("Error fetching events history:", error);
    }
  };

  useEffect(() => {
    fetchApplicationsHistory();
    fetchEventsHistory();
  }, []);

  return (
    <div className="history-page">
      <Mainheader />
      <div className="main-box">
        <h1>History</h1>
        <div className="history-container">
          <div className="application-box">
            <h2>Application History</h2>
            {applicationsHistory.length > 0 ? (
              applicationsHistory.map((item) => (
                <div key={item._id} className="history-item">
                  <p>
                    <strong>Name:</strong> {item.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {item.email}
                  </p>
                  <p>
                    <strong>Qualification:</strong> {item.qualification}
                  </p>
                  <p>
                    <strong>Role:</strong> {item.role}
                  </p>
                  <p>
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p>
                    <strong>Reason:</strong> {item.reason}
                  </p>
                  <p>
                    <strong>Status:</strong> {item.status}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(item.date).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No application history available</p>
            )}
          </div>

          <div className="Event-box">
            <h2>Events History</h2>
            {eventsHistory.length > 0 ? (
              eventsHistory.map((event) => (
                <div key={event._id} className="history-item">
                  <p>
                    <strong>Name:</strong> {event.name}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(event.date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p>
                    <strong>Description:</strong> {event.description}
                  </p>
                  <p>
                    <strong>Status:</strong> {event.status}
                  </p>
                  <p>
                    <strong>Approved/Rejected By:</strong> {event.approve_by}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(event.date).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No event history available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
