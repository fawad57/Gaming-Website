import React from "react";
import "./CSS/ConfirmationModal.css"; // Create this CSS file for styling

const ConfirmationModal = ({ isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Are you sure you want to logout?</h2>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-button">
            Logout
          </button>
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
