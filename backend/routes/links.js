const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Link = require("../models/Link");

// Get all links for a user
router.get("/", auth, async (req, res) => {
  try {
    const links = await Link.find({ user: req.user._id }).sort({ order: 1 });
    res.json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ message: "Error fetching links" });
  }
});

// Create a new link
router.post("/", auth, async (req, res) => {
  try {
    const { title, url } = req.body;

    // Get the highest order number
    const lastLink = await Link.findOne({ user: req.user._id }).sort({
      order: -1,
    });
    const order = lastLink ? lastLink.order + 1 : 0;

    const link = new Link({
      user: req.user._id,
      title,
      url,
      order,
    });

    await link.save();
    res.status(201).json(link);
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(500).json({ message: "Error creating link" });
  }
});

// Update a link
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, url, isActive } = req.body;
    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, url, isActive },
      { new: true }
    );

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.json(link);
  } catch (error) {
    console.error("Error updating link:", error);
    res.status(500).json({ message: "Error updating link" });
  }
});

// Delete a link
router.delete("/:id", auth, async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Reorder remaining links
    await Link.updateMany(
      { user: req.user._id, order: { $gt: link.order } },
      { $inc: { order: -1 } }
    );

    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({ message: "Error deleting link" });
  }
});

// Update link order
router.put("/reorder", auth, async (req, res) => {
  try {
    const { links } = req.body;

    // Update each link's order
    await Promise.all(
      links.map((link, index) =>
        Link.findOneAndUpdate(
          { _id: link._id, user: req.user._id },
          { order: index }
        )
      )
    );

    res.json({ message: "Links reordered successfully" });
  } catch (error) {
    console.error("Error reordering links:", error);
    res.status(500).json({ message: "Error reordering links" });
  }
});

module.exports = router;
