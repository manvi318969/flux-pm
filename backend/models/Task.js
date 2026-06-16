const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    assignee: { type: String, default: "" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["todo", "in_progress", "done"], default: "todo" },
    deadline: { type: Date },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
