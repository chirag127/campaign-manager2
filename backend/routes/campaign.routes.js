const express = require("express");
const {
    createCampaign,
    getCampaigns,
    getCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaignMetrics,
} = require("../controllers/campaign.controller");
const { getLeadsByCampaign } = require("../controllers/lead.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(protect, getCampaigns).post(protect, createCampaign);

router
    .route("/:id")
    .get(protect, getCampaign)
    .put(protect, updateCampaign)
    .delete(protect, deleteCampaign);

router.route("/:id/metrics").get(protect, getCampaignMetrics);

router.route("/:campaignId/leads").get(protect, getLeadsByCampaign);

module.exports = router;
