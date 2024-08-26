const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Task schema
const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: String, // Assuming email is used to identify members
    required: true,
  },
  assignedBy: {
    type: String, // Assuming email is used to identify the creator
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// Create and export the Task model
const TaskModel = mongoose.model("Task", taskSchema);

module.exports = TaskModel;
