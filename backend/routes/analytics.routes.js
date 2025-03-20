const express = require("express");
const {
    getDashboardAnalytics,
    getCampaignPerformanceOverTime,
    getLeadAnalytics,
} = require("../controllers/analytics.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/dashboard").get(protect, getDashboardAnalytics);

router
    .route("/campaigns/:id/performance")
    .get(protect, getCampaignPerformanceOverTime);

router.route("/leads").get(protect, getLeadAnalytics);

module.exports = router;
