const Link = require("../models/Link");
const { validationResult } = require("express-validator");

// Get all links for a user
exports.getLinks = async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.id }).sort({ order: 1 });
    res.json(links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new link
exports.createLink = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, url, icon } = req.body;

    // Get the highest order number
    const lastLink = await Link.findOne({ user: req.user.id })
      .sort({ order: -1 })
      .limit(1);
    const order = lastLink ? lastLink.order + 1 : 0;

    const link = new Link({
      user: req.user.id,
      title,
      url,
      icon,
      order,
    });

    await link.save();
    res.status(201).json(link);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a link
exports.updateLink = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, url, icon, isActive } = req.body;
    const linkId = req.params.id;

    let link = await Link.findById(linkId);

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Check if the link belongs to the user
    if (link.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    link = await Link.findByIdAndUpdate(
      linkId,
      { title, url, icon, isActive },
      { new: true }
    );

    res.json(link);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a link
exports.deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Check if the link belongs to the user
    if (link.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await link.deleteOne();
    res.json({ message: "Link removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reorder links
exports.reorderLinks = async (req, res) => {
  try {
    const { links } = req.body; // Array of { id, order }

    // Update each link's order
    const updatePromises = links.map(({ id, order }) =>
      Link.findOneAndUpdate(
        { _id: id, user: req.user.id },
        { order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);
    const updatedLinks = await Link.find({ user: req.user.id }).sort({
      order: 1,
    });

    res.json(updatedLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
