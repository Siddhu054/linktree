const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Get appearance settings
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("appearance");
    res.json(user.appearance);
  } catch (error) {
    console.error("Error fetching appearance:", error);
    res.status(500).json({ message: "Error fetching appearance settings" });
  }
});

// Update appearance settings
router.put("/", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { appearance: req.body },
      { new: true }
    ).select("appearance");

    res.json(user.appearance);
  } catch (error) {
    console.error("Error updating appearance:", error);
    res.status(500).json({ message: "Error updating appearance settings" });
  }
});

module.exports = router;
