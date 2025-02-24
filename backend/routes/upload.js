const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const uploadMiddleware = require("../middleware/upload");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");

// Upload profile or banner image
router.post("/:type", auth, uploadMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const type = req.params.type;
    if (!["profile", "banner"].includes(type)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Invalid image type" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    const updateField = type === "profile" ? "profileImage" : "bannerImage";

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { [updateField]: fileUrl },
      { new: true }
    );

    if (!user) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: `${type} image uploaded successfully`,
      url: fileUrl,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

module.exports = router;
