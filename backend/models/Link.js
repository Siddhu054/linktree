const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Link", linkSchema);
