const mongoose = require("mongoose");

const pageViewSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: String,
  device: String,
  browser: String,
  location: {
    country: String,
    city: String,
    region: String,
  },
  referrer: String,
});

const clickSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Link",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: String,
  device: String,
  browser: String,
  location: {
    country: String,
    city: String,
    region: String,
  },
});

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pageViews: [pageViewSchema],
    clicks: [clickSchema],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
analyticsSchema.index({ userId: 1 });
analyticsSchema.index({ "clicks.linkId": 1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
