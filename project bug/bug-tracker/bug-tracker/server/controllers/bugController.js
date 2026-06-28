const Bug = require("../models/Bug");

// POST /api/bugs
const createBug = async (req, res, next) => {
  try {
    const { title, description, project, priority, assignee } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: "Title and project are required" });
    }

    const bug = await Bug.create({
      title,
      description,
      project,
      priority,
      assignee: assignee || null,
      reporter: req.user._id,
    });

    const populated = await Bug.findById(bug._id)
      .populate("reporter", "name email")
      .populate("assignee", "name email");

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// GET /api/bugs?project=<id>&status=<status>&priority=<priority>&assignee=<id>
const getBugs = async (req, res, next) => {
  try {
    const { project, status, priority, assignee } = req.query;
    const filter = {};

    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;

    const bugs = await Bug.find(filter)
      .populate("reporter", "name email")
      .populate("assignee", "name email")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(bugs);
  } catch (err) {
    next(err);
  }
};

// GET /api/bugs/:id
const getBugById = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate("reporter", "name email")
      .populate("assignee", "name email")
      .populate("project", "name")
      .populate("comments.author", "name email");

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    res.json(bug);
  } catch (err) {
    next(err);
  }
};

// PUT /api/bugs/:id
const updateBug = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    const { title, description, priority, status, assignee } = req.body;

    bug.title = title ?? bug.title;
    bug.description = description ?? bug.description;
    bug.priority = priority ?? bug.priority;
    bug.status = status ?? bug.status;
    if (assignee !== undefined) bug.assignee = assignee;

    const updated = await bug.save();
    const populated = await Bug.findById(updated._id)
      .populate("reporter", "name email")
      .populate("assignee", "name email")
      .populate("project", "name");

    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/bugs/:id
const deleteBug = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    await bug.deleteOne();
    res.json({ message: "Bug deleted" });
  } catch (err) {
    next(err);
  }
};

// POST /api/bugs/:id/comments
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    bug.comments.push({ text, author: req.user._id });
    await bug.save();

    const populated = await Bug.findById(bug._id).populate("comments.author", "name email");
    res.status(201).json(populated.comments);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBug,
  getBugs,
  getBugById,
  updateBug,
  deleteBug,
  addComment,
};
