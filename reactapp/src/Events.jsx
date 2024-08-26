import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/Events.css";
import EventForm from "./EventForm";
import RequestedEvents from "./RequestedEvents";
import Mainheader from "./Mainheader";
import EventRegistration from "./EventRegistration";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [RequestForm, setRF] = useState(false);
  const [showRequestedEvents, setShowRequestedEvents] = useState(false);

  const [name, setName] = useState("");
  const [location, setLoc] = useState("");
  const [description, setDes] = useState("");
  const [posted_by, setPost] = useState("");
  const [picture, setPicture] = useState(null);

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [previousEventIndex, setPreviousEventIndex] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [editEvent, setEditEvent] = useState(null); // Add this state

  const fetchEmail = async () => {
    axios.get("http://localhost:3001/get-role").then((result) => {
      if (result.data !== "Invalid") {
        setEmail(result.data.email);
        setRole(result.data.role);
        setPost(result.data.name);
      }
    });
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  const fetchEvents = async () => {
    try {
      const result = await axios.get("http://localhost:3001/api-events");
      setEvents(result.data);
      setFeaturedEvents(result.data); // Example: Take the first 5 events as featured
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPreviousEventIndex(currentEventIndex);
      setCurrentEventIndex(
        (prevIndex) => (prevIndex + 1) % featuredEvents.length
      );
    }, 8000); // Change featured event every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [featuredEvents.length, currentEventIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("posted_by", posted_by);
    formData.append("picture", picture);
    axios
      .post("http://localhost:3001/add-events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        console.log(result.data);
        alert("Event has been added.");
        fetchEvents(); // Fetch events after adding a new event
      })
      .catch((error) => {
        console.error("Error adding event:", error);
      });

    setShowForm(false);
    setLoc("");
    setName("");
    setDes("");
    setPicture(null);
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("posted_by", posted_by);
    formData.append("picture", picture);
    formData.append("email", email);

    axios
      .post("http://localhost:3001/requested-events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        console.log(result.data);
        alert("Your request has been recorded.");
        fetchEvents(); // Fetch events after adding a new event
      })
      .catch((error) => {
        console.error("Error adding event:", error);
      });

    setRF(false);
    setLoc("");
    setName("");
    setDes("");
    setPicture(null);
  };

  const handleDelete = async (eventId) => {
    axios
      .post("http://localhost:3001/delete-event", { _id: eventId })
      .then((result) => {
        alert(result.data);
        fetchEvents();
      });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleApproveForm = () => {
    fetchEvents();
    setShowRequestedEvents(false);
  };
  const handleEdit = (event) => {
    setEditEvent(event);
    setShowForm(true);
  };
  return (
    <div className="events-container">
      <Mainheader />
      {featuredEvents.length > 0 && (
        <div className="featured-events">
          <div className="featured-event">
            {previousEventIndex !== null && (
              <img
                src={`http://localhost:3001/${featuredEvents[previousEventIndex].picture}`}
                alt={featuredEvents[previousEventIndex].name}
                className="featured-image exit"
              />
            )}
            <img
              src={`http://localhost:3001/${featuredEvents[currentEventIndex].picture}`}
              alt={featuredEvents[currentEventIndex].name}
              className="featured-image"
            />
            <div className="featured-info">
              <h1>{featuredEvents[currentEventIndex].name}</h1>
              <p>{featuredEvents[currentEventIndex].description}</p>
              <div className="right-side">
                <p>📍 {featuredEvents[currentEventIndex].location}</p>
                <p>
                  🕛{" "}
                  {new Date(
                    featuredEvents[currentEventIndex].date
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="buttons-container">
        {(role === "president" || role === "Head") && (
          <button
            className="event-button left-button"
            onClick={() => setShowRequestedEvents(true)}
          >
            Requested Events
          </button>
        )}
        <div className="right-buttons">
          {(role === "user" || role === "Member") && (
            <button className="event-button" onClick={() => setRF(true)}>
              Request Event
            </button>
          )}
          {(role === "president" || role === "Head") && (
            <button onClick={() => setShowForm(true)} className="event-button">
              Add Event
            </button>
          )}
        </div>
      </div>

      <div className="event-grid">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <div className="event-card-image-container">
              <img
                src={`http://localhost:3001/${event.picture}`}
                alt={event.name}
                className="event-card-image"
              />
              {(role === "president" ||
                role === "Head" ||
                role === "Vice Head") && (
                <>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(event._id)}
                  >
                    ✖
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(event)}
                  >
                    ✎
                  </button>
                </>
              )}
              {(role === "user" || role === "Member") && (
                <div
                  className="plus-sign-overlay"
                  onClick={() => handleEventClick(event)}
                >
                  +
                </div>
              )}
            </div>
            <div className="event-card-info">
              <h3>{event.name}</h3>
              <p>
                🕛 Date:{" "}
                {new Date(
                  featuredEvents[currentEventIndex].date
                ).toLocaleString()}
              </p>
              <p>📍 Location: {event.location}</p>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <EventForm
          show={showForm}
          handleClose={() => setShowForm(false)}
          handleSubmit={handleSubmit}
          name={name}
          setName={setName}
          location={location}
          setLoc={setLoc}
          description={description}
          setDes={setDes}
          setPicture={setPicture}
        />
      )}

      {RequestForm && (
        <EventForm
          show={RequestForm}
          handleClose={() => setRF(false)}
          handleSubmit={handleRequestSubmit}
          name={name}
          setName={setName}
          location={location}
          setLoc={setLoc}
          description={description}
          setDes={setDes}
          setPicture={setPicture}
        />
      )}

      {showRequestedEvents && (
        <RequestedEvents
          show={showRequestedEvents}
          handleClose={handleApproveForm}
        />
      )}

      <EventRegistration
        show={showModal}
        handleClose={handleCloseModal}
        event={selectedEvent}
      />
    </div>
  );
};

export default Events;
