import React, { useState } from "react";
import "./CSS/EventForm.css";

const EventForm = ({
  show,
  handleClose,
  handleSubmit,
  name,
  setName,
  location,
  setLocation,
  description,
  setDescription,
  setPicture,
}) => {
  const [picturePreview, setPicturePreview] = useState(null);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      setPicturePreview(URL.createObjectURL(file));
    }
  };

  return (
    show && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close-button" onClick={handleClose}>
            ×
          </button>
          <form onSubmit={handleSubmit} className="event-form">
            <h2 className="form-heading">Event Details</h2>
            <label className="form-label">
              Event Name:
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Location:
              <textarea
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="form-textarea"
              />
            </label>
            <label className="form-label">
              Description:
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="form-textarea"
              />
            </label>
            <label className="form-label">
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  name="picture"
                  onChange={handlePictureChange}
                  required
                  className="file-input"
                />
                <span className="file-upload-text">Choose a picture</span>
              </div>
            </label>
            {picturePreview && (
              <div className="picture-preview">
                <img
                  src={picturePreview}
                  alt="Selected Event"
                  className="picture-preview-image"
                />
              </div>
            )}
            <button type="submit" className="form-submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default EventForm;
