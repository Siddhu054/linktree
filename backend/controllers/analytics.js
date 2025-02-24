const Analytics = require("../models/Analytics");
const Link = require("../models/Link");
const geoip = require("geoip-lite");
const UAParser = require("ua-parser-js");

// Get analytics for a specific link
exports.getLinkAnalytics = async (req, res) => {
  try {
    const { linkId } = req.params;

    // Check if link belongs to user
    const link = await Link.findOne({ _id: linkId, user: req.user.id });
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    const analytics = await Analytics.find({ link: linkId });

    // Process analytics data
    const uniqueViews = analytics.length;
    const deviceTypes = {};
    const locations = {};
    const referrers = {};

    analytics.forEach((visit) => {
      // Count device types
      deviceTypes[visit.visitor.device] =
        (deviceTypes[visit.visitor.device] || 0) + 1;

      // Count locations
      const location = visit.visitor.location.country;
      locations[location] = (locations[location] || 0) + 1;

      // Count referrers
      const referrer = visit.visitor.referrer || "direct";
      referrers[referrer] = (referrers[referrer] || 0) + 1;
    });

    res.json({
      linkId,
      uniqueViews,
      deviceTypes,
      locations,
      referrers,
      clicks: link.clicks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Track a visit to a link
exports.trackVisit = async (req, res) => {
  try {
    const { linkId } = req.params;
    const { ip, userAgent, device, location, referrer } = req.body;

    // Update link clicks
    await Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } });

    // Try to create a new analytics entry
    try {
      await Analytics.create({
        link: linkId,
        visitor: {
          ip,
          userAgent,
          device,
          location,
          referrer,
        },
      });
    } catch (error) {
      // Ignore duplicate key errors (same IP visiting again)
      if (error.code !== 11000) {
        throw error;
      }
    }

    res.status(201).json({ message: "Visit tracked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get overall analytics for all user's links
exports.getOverallAnalytics = async (req, res) => {
  try {
    // Get all user's links
    const links = await Link.find({ user: req.user.id });
    const linkIds = links.map((link) => link._id);

    // Get analytics for all links
    const analytics = await Analytics.find({ link: { $in: linkIds } });

    // Process overall analytics
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    const uniqueViews = analytics.length;

    const deviceTypes = {};
    const locations = {};
    const referrers = {};
    const linkStats = {};

    analytics.forEach((visit) => {
      // Count device types
      deviceTypes[visit.visitor.device] =
        (deviceTypes[visit.visitor.device] || 0) + 1;

      // Count locations
      const location = visit.visitor.location.country;
      locations[location] = (locations[location] || 0) + 1;

      // Count referrers
      const referrer = visit.visitor.referrer || "direct";
      referrers[referrer] = (referrers[referrer] || 0) + 1;

      // Per link statistics
      if (!linkStats[visit.link]) {
        linkStats[visit.link] = 1;
      } else {
        linkStats[visit.link]++;
      }
    });

    res.json({
      totalClicks,
      uniqueViews,
      deviceTypes,
      locations,
      referrers,
      linkStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Track page view
exports.trackPageView = async (req, res) => {
  try {
    const { userId } = req.params;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const referrer = req.headers.referer || "direct";

    // Parse user agent
    const parser = new UAParser(userAgent);
    const deviceType = parser.getDevice().type || "desktop";
    const browserName = parser.getBrowser().name;

    // Get location from IP
    const geo = geoip.lookup(ip);
    const location = geo
      ? {
          country: geo.country,
          city: geo.city,
          region: geo.region,
        }
      : null;

    let analytics = await Analytics.findOne({ userId });

    if (!analytics) {
      analytics = new Analytics({ userId, pageViews: [] });
    }

    // Check if this IP has viewed in the last 24 hours
    const lastView = analytics.pageViews
      .filter((view) => view.ip === ip)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    const isNewView =
      !lastView ||
      Date.now() - new Date(lastView.timestamp).getTime() > 24 * 60 * 60 * 1000;

    if (isNewView) {
      analytics.pageViews.push({
        timestamp: new Date(),
        ip,
        device: deviceType,
        browser: browserName,
        location,
        referrer,
      });
    }

    await analytics.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error tracking page view:", error);
    res.status(500).json({ message: "Error tracking page view" });
  }
};

// Track link click
exports.trackLinkClick = async (req, res) => {
  try {
    const { linkId } = req.params;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const parser = new UAParser(userAgent);
    const deviceType = parser.getDevice().type || "desktop";
    const browserName = parser.getBrowser().name;

    const geo = geoip.lookup(ip);
    const location = geo
      ? {
          country: geo.country,
          city: geo.city,
          region: geo.region,
        }
      : null;

    // Update link clicks
    await Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } });

    // Record click in analytics
    const analytics = await Analytics.findOne({
      "clicks.linkId": linkId,
    });

    if (analytics) {
      analytics.clicks.push({
        linkId,
        timestamp: new Date(),
        ip,
        device: deviceType,
        browser: browserName,
        location,
      });
      await analytics.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error tracking link click:", error);
    res.status(500).json({ message: "Error tracking link click" });
  }
};

// Get analytics data
exports.getAnalyticsData = async (req, res) => {
  try {
    const { userId } = req.params;
    const { range = "7days" } = req.query;

    const rangeInDays =
      {
        "7days": 7,
        "30days": 30,
        "90days": 90,
      }[range] || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - rangeInDays);

    const analytics = await Analytics.findOne({ userId }).populate(
      "clicks.linkId"
    );

    if (!analytics) {
      return res.status(404).json({ message: "No analytics found" });
    }

    // Filter data by date range
    const filteredPageViews = analytics.pageViews.filter(
      (view) => new Date(view.timestamp) >= startDate
    );

    const filteredClicks = analytics.clicks.filter(
      (click) => new Date(click.timestamp) >= startDate
    );

    // Calculate summary
    const summary = {
      uniqueViews: new Set(filteredPageViews.map((view) => view.ip)).size,
      totalViews: filteredPageViews.length,
      totalClicks: filteredClicks.length,
      uniqueVisitors: new Set([
        ...filteredPageViews.map((view) => view.ip),
        ...filteredClicks.map((click) => click.ip),
      ]).size,
    };

    // Calculate device distribution
    const devices = filteredPageViews.reduce((acc, view) => {
      acc[view.device] = (acc[view.device] || 0) + 1;
      return acc;
    }, {});

    // Calculate location distribution
    const locations = filteredPageViews.reduce((acc, view) => {
      if (view.location) {
        const key = view.location.country;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {});

    // Calculate referrer distribution
    const referrers = filteredPageViews.reduce((acc, view) => {
      const key = view.referrer || "direct";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Prepare views over time
    const viewsOverTime = Array.from({ length: rangeInDays }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const views = filteredPageViews.filter((view) => {
        const viewDate = new Date(view.timestamp);
        viewDate.setHours(0, 0, 0, 0);
        return viewDate.getTime() === date.getTime();
      }).length;

      return {
        timestamp: date,
        count: views,
      };
    }).reverse();

    res.json({
      summary,
      viewsOverTime,
      devices,
      locations: Object.entries(locations).map(([country, count]) => ({
        country,
        count,
      })),
      referrers: Object.entries(referrers).map(([source, count]) => ({
        source,
        count,
      })),
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ message: "Error fetching analytics data" });
  }
};
