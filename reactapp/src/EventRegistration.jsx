import React, { useState } from "react";
import "./CSS/EventRegistration.css";
import axios from "axios";

const EventRegistration = ({ show, handleClose, event }) => {
  if (!show || !event) return null;

  const handleRegistration = (_id) => {
    try {
      axios
        .post("http://localhost:3001/event-registration", { _id })
        .then((result) => {
          alert(result.data);
          handleClose();
        });
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={handleClose}>
          ✖
        </button>
        <img
          src={`http://localhost:3001/${event.picture}`}
          alt={event.name}
          className="modal-image"
        />
        <h2>{event.name}</h2>
        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
        <p>
          <strong>Description:</strong> {event.description}
        </p>
        <button
          onClick={() => handleRegistration(event._id)}
          className="register-button"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default EventRegistration;
