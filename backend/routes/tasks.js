const express = require("express");
const Task = require("../models/Task");
const protect = require("../middleware/auth");

const router = express.Router();

// GET all tasks of a project
router.get("/project/:projectId", protect, async (req, res) => {
  try {
    const tasks = await Task.find({
      project: req.params.projectId,
      owner: req.user._id,
    }).sort({ order: 1, createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// CREATE task
router.post("/", protect, async (req, res) => {
  try {
    const { project, title, description, assignee, priority, status, deadline } = req.body;
    if (!project || !title)
      return res.status(400).json({ message: "Project aur title zaroori hai" });

    const task = await Task.create({
      project,
      owner: req.user._id,
      title,
      description,
      assignee,
      priority,
      status: status || "todo",
      deadline: deadline || null,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE task (edit fields OR change status via drag)
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE task
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
