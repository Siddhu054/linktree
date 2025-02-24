const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const analyticsController = require("../controllers/analytics");

// Track page view
router.post("/pageview/:userId", analyticsController.trackPageView);

// Track link click
router.post("/click/:linkId", analyticsController.trackLinkClick);

// Get analytics data
router.get("/data/:userId", auth, analyticsController.getAnalyticsData);

module.exports = router;
