import React, { useState, useEffect } from "react";
import "./CSS/Tasks.css";
import axios from "axios";
import Mainheader from "./Mainheader";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [members, setMembers] = useState([]);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const fetchTasks = async () => {
    try {
      const result = await axios.get("http://localhost:3001/tasks");
      setTasks(result.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      const result = await axios.get("http://localhost:3001/members");
      setMembers(result.data);
    } catch (error) {
      console.error("Error fetching members:", error);
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
    fetchTasks();
    fetchMembers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/tasks", {
        title,
        description,
        assignedTo,
        assignedBy: email,
      })
      .then((res) => {
        alert(res.data);
        fetchTasks();
      })
      .catch((err) => console.error(err));
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    axios
      .post("http://localhost:3001/tasks-completed", { _id: taskId })
      .then((result) => {
        alert(result.data);
        fetchTasks();
      });
  };

  return (
    <div className="tasks-page">
      <Mainheader />
      <div className="tasks-container">
        <h1>Tasks</h1>
        {(role === "president" || role === "Head") && (
          <form className="task-form" onSubmit={handleSubmit}>
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
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                required
                rows="4"
              />
            </div>
            <div className="form-group">
              <label htmlFor="assignedTo">Assign To</label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
              >
                <option value="">Select Member</option>
                {members.map((member) => (
                  <option key={member.email} value={member.email}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="submit-button">
              Assign Task
            </button>
          </form>
        )}
        {(role === "Member" || role === "Vice Head") && (
          <div className="tasks-list">
            <div className="pending-tasks">
              <h2>Pending Tasks</h2>
              {tasks.filter((task) => !task.completed).length > 0 ? (
                tasks
                  .filter((task) => !task.completed)
                  .map((task) => (
                    <div key={task._id} className="task-item">
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                      <small>
                        Assigned To: {task.assignedToName} <br />
                        By: {task.assignedBy} on{" "}
                        {new Date(task.createdAt).toLocaleString()}
                      </small>
                      <button
                        className={`complete-button ${
                          task.completed ? "completed" : ""
                        }`}
                        onClick={() => toggleTaskCompletion(task._id)}
                      >
                        {task.completed ? "✔" : ""}
                      </button>
                    </div>
                  ))
              ) : (
                <p>No pending tasks available</p>
              )}
            </div>
            <div className="completed-tasks">
              <h2>Completed Tasks</h2>
              {tasks.filter((task) => task.completed).length > 0 ? (
                tasks
                  .filter((task) => task.completed)
                  .map((task) => (
                    <div key={task._id} className="task-item">
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                      <small>
                        Assigned To: {task.assignedToName} <br />
                        By: {task.assignedBy} on{" "}
                        {new Date(task.createdAt).toLocaleString()}
                      </small>
                      <button
                        className={`complete-button ${
                          task.completed ? "completed" : ""
                        }`}
                      >
                        {task.completed ? "✔" : ""}
                      </button>
                    </div>
                  ))
              ) : (
                <p>No completed tasks available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
