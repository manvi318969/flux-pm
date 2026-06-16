const express = require("express");
const Project = require("../models/Project");
const Task = require("../models/Task");
const protect = require("../middleware/auth");

const router = express.Router();

// GET all projects of logged-in user (with task counts for progress)
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });

    // har project ke liye task stats nikaalo
    const withStats = await Promise.all(
      projects.map(async (proj) => {
        const total = await Task.countDocuments({ project: proj._id });
        const done = await Task.countDocuments({ project: proj._id, status: "done" });
        return {
          ...proj.toObject(),
          totalTasks: total,
          doneTasks: done,
          progress: total === 0 ? 0 : Math.round((done / total) * 100),
        };
      })
    );

    res.json(withStats);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET single project
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// CREATE project
router.post("/", protect, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    if (!name) return res.status(400).json({ message: "Project name zaroori hai" });
    const project = await Project.create({
      name,
      description,
      color,
      owner: req.user._id,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE project
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE project (aur uske saare tasks bhi)
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found" });
    await Task.deleteMany({ project: req.params.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
