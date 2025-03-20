const Lead = require("../models/Lead");
const Campaign = require("../models/Campaign");

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res) => {
    try {
        // Add user to req.body
        req.body.owner = req.user.id;

        // Check if campaign exists
        const campaign = await Campaign.findById(req.body.source.campaign);

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
                error: "Not authorized to add leads to this campaign",
            });
        }

        const lead = await Lead.create(req.body);

        // Add lead to campaign
        campaign.leads.push(lead._id);
        await campaign.save();

        res.status(201).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
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
        query = Lead.find(JSON.parse(queryStr))
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
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Lead.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Populate campaign
        query = query.populate({
            path: "source.campaign",
            select: "name",
        });

        // Executing query
        const leads = await query;

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
            count: leads.length,
            pagination,
            data: leads,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id).populate({
            path: "source.campaign",
            select: "name",
        });

        if (!lead) {
            return res.status(404).json({
                success: false,
                error: "Lead not found",
            });
        }

        // Make sure user owns the lead
        if (
            lead.owner.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                error: "Not authorized to access this lead",
            });
        }

        res.status(200).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
    try {
        let lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                error: "Lead not found",
            });
        }

        // Make sure user owns the lead
        if (
            lead.owner.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                error: "Not authorized to update this lead",
            });
        }

        lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                error: "Lead not found",
            });
        }

        // Make sure user owns the lead
        if (
            lead.owner.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                error: "Not authorized to delete this lead",
            });
        }

        // Remove lead from campaign
        const campaign = await Campaign.findById(lead.source.campaign);
        if (campaign) {
            campaign.leads = campaign.leads.filter(
                (leadId) => leadId.toString() !== lead._id.toString()
            );
            await campaign.save();
        }

        await lead.deleteOne();

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

// @desc    Get leads by campaign
// @route   GET /api/campaigns/:campaignId/leads
// @access  Private
exports.getLeadsByCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.campaignId);

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
                error: "Not authorized to access leads for this campaign",
            });
        }

        const leads = await Lead.find({
            "source.campaign": req.params.campaignId,
        });

        res.status(200).json({
            success: true,
            count: leads.length,
            data: leads,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
