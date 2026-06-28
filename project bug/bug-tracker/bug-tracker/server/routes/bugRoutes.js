const express = require("express");
const router = express.Router();
const {
  createBug,
  getBugs,
  getBugById,
  updateBug,
  deleteBug,
  addComment,
} = require("../controllers/bugController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // all bug routes require login

router.route("/").post(createBug).get(getBugs);
router.route("/:id").get(getBugById).put(updateBug).delete(deleteBug);
router.post("/:id/comments", addComment);

module.exports = router;
