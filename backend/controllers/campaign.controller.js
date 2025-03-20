const Campaign = require("../models/Campaign");
const Lead = require("../models/Lead");

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private
exports.createCampaign = async (req, res) => {
    try {
        // Add user to req.body
        req.body.owner = req.user.id;

        const campaign = await Campaign.create(req.body);

        res.status(201).json({
            success: true,
            data: campaign,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private
exports.getCampaigns = async (req, res) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ["select", "sort", "page", "limit"];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach((param) => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(
            /\\b(gt|gte|lt|lte|in)\\b/g,
            (match) => `$${match}`
        );

        // Finding resource
        query = Campaign.find(JSON.parse(queryStr))
            .where("owner")
            .equals(req.user.id);

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(",").join(" ");
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Campaign.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const campaigns = await query;

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }

        res.status(200).json({
            success: true,
            count: campaigns.length,
            pagination,
            data: campaigns,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Private
exports.getCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                error: "Campaign not found",
            });
        }

        // Make sure user owns the campaign
        if (
            campaign.owner.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                error: "Not authorized to access this campaign",
            });
        }

        res.status(200).json({
            success: true,
            data: campaign,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private
exports.updateCampaign = async (req, res) => {
    try {
        let campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                error: "Campaign not found",
            });
        }

        // Make sure user owns the campaign
        if (
            campaign.owner.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                error: "Not authorized to update this campaign",
            });
        }

        campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: campaign,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private
exports.deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                error: "Campaign not found",
            });
        }

        // Make sure user owns the campaign
        if (
            campaign.owner.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                error: "Not authorized to delete this campaign",
            });
        }

        await campaign.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get campaign metrics
// @route   GET /api/campaigns/:id/metrics
// @access  Private
exports.getCampaignMetrics = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                error: "Campaign not found",
            });
        }

        // Make sure user owns the campaign
        if (
            campaign.owner.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                error: "Not authorized to access this campaign",
            });
        }

        // Get total metrics
        const totalMetrics = campaign.totalMetrics;

        // Get platform-specific metrics
        const platformMetrics = campaign.platforms.map((platform) => ({
            platform: platform.name,
            metrics: platform.metrics,
            status: platform.status,
            lastUpdated: platform.lastUpdated,
        }));

        // Get lead count
        const leadCount = await Lead.countDocuments({
            "source.campaign": campaign._id,
        });

        res.status(200).json({
            success: true,
            data: {
                totalMetrics,
                platformMetrics,
                leadCount,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
