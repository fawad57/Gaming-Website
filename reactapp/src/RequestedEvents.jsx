// RequestedEventsOverlay.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/RequestedEvents.css"; // Make sure to create a CSS file for styling

const RequestedEvents = ({ show, handleClose }) => {
  const [requestedEvents, setRequestedEvents] = useState([]);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/requested-events"
      );
      setRequestedEvents(response.data);
      setError(null); // Reset error state on successful fetch
    } catch (error) {
      setError(error.message);
      console.error("Error fetching requested events:", error);
    }
  };

  useEffect(() => {
    if (show) {
      fetchEvents();
    }
  }, [show]);

  const handleApprove = (eventId) => {
    axios
      .post("http://localhost:3001/approve-events", { _id: eventId }) // Use "eventid" as in the backend
      .then((response) => {
        if (response.data === "Event not found") {
          alert(response.data);
        } else {
          alert("Event has been approved.");
          fetchEvents(); // Refresh the events list after approval
        }
      })
      .catch((error) => {
        console.error("Error approving event:", error);
      });
    console.log("Approved event ID:", eventId);
  };

  const handleReject = (eventId) => {
    axios
      .post("http://localhost:3001/reject-events", { _id: eventId })
      .then((result) => {
        alert(result.data);
        fetchEvents();
      });
    console.log("Rejected event ID:", eventId);
  };

  if (!show) return null;

  return (
    <div className="overlay">
      <div className="overlay-content">
        <button className="close-button" onClick={handleClose}>
          ✕
        </button>
        <h2>Requested Events</h2>
        <div className="requested-events-list">
          {requestedEvents.length > 0 ? (
            requestedEvents.map((event) => (
              <div key={event._id} className="requested-event-card">
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <p>📍 {event.location}</p>
                <p>🕛 {event.date}</p>
                <div className="button-group">
                  <button
                    className="approve-button"
                    onClick={() => handleApprove(event._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => handleReject(event._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No requested events found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestedEvents;
