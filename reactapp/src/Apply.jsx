import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/Apply.css"; // Ensure this CSS file exists
import Mainheader from "./Mainheader";

const Apply = () => {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [qualification, setQualification] = useState("");
  const [role, setRole] = useState("");
  const [Prole, setProle] = useState("");
  const [category, setCategory] = useState("");
  const [reason, setReason] = useState("");
  const [roles] = useState(["Member", "Vice Head", "Head"]);
  const [categories] = useState([
    "Operation",
    "Finance",
    "Marketing",
    "Graphic Designing",
  ]);
  const [qualifications] = useState([
    { code: "BS", fullName: "Bachelor of Science" },
    { code: "MS", fullName: "Master of Science" },
  ]);

  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:3001/applications");
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchEmail = async () => {
    axios.get("http://localhost:3001/get-role").then((result) => {
      if (result.data === "Invalid") {
      } else {
        setUserData({
          name: result.data.name,
          email: result.data.email,
        });
        setProle(result.data.role);
      }
    });
  };

  useEffect(() => {
    fetchEmail();
    fetchApplications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/apply", {
        ...userData,
        qualification,
        role,
        category,
        reason,
      });
      alert(response.data);
      setCategory("");
      setQualification("");
      setRole("");
      setReason("");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleApprove = async (id) => {
    try {
      axios
        .post("http://localhost:3001/applications-approve", { _id: id })
        .then((result) => {
          alert(result.data);
          fetchApplications(); // Refresh the list
        });
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async (id) => {
    console.log(id);
    axios
      .post("http://localhost:3001/applications-rejects", {
        _id: id,
      })
      .then((result) => {
        alert(result.data);
        fetchApplications(); // Refresh the list
      });
  };

  return (
    <div className="apply-page">
      <Mainheader />
      <div className="form-container">
        {Prole !== "president" && Prole !== "Head" && (
          <form onSubmit={handleSubmit} className="apply-form">
            <h1>Apply to Join the Society</h1>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="qualification">Qualification</label>
              <select
                id="qualification"
                name="qualification"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                required
              >
                <option value="">Select a qualification</option>
                {qualifications.map((q) => (
                  <option key={q.code} value={q.code}>
                    {q.fullName} ({q.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select a role</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="reason">
                Why should we hire you for this role?
              </label>
              <textarea
                id="reason"
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Apply
            </button>
          </form>
        )}
        {(Prole === "president" || Prole === "Head") && (
          <div className="applications-container">
            <h2>Submitted Applications</h2>
            {applications.map((app) => (
              <div key={app._id} className="application">
                <p>
                  <strong>Name:</strong> {app.name}
                </p>
                <p>
                  <strong>Email:</strong> {app.email}
                </p>
                <p>
                  <strong>Qualification:</strong> {app.qualification}
                </p>
                <p>
                  <strong>Role:</strong> {app.role}
                </p>
                <p>
                  <strong>Category:</strong> {app.category}
                </p>
                <p>
                  <strong>Reason:</strong> {app.reason}
                </p>
                <button
                  onClick={() => handleApprove(app._id)}
                  className="approve-button"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(app._id)}
                  className="reject-button"
                >
                  Reject
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Apply;
