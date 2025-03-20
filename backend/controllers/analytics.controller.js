const Campaign = require("../models/Campaign");
const Lead = require("../models/Lead");

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardAnalytics = async (req, res) => {
    try {
        // Get active campaigns count
        const activeCampaignsCount = await Campaign.countDocuments({
            owner: req.user.id,
            status: "active",
        });

        // Get total campaigns count
        const totalCampaignsCount = await Campaign.countDocuments({
            owner: req.user.id,
        });

        // Get total leads count
        const totalLeadsCount = await Lead.countDocuments({
            owner: req.user.id,
        });

        // Get leads by status
        const leadsByStatus = await Lead.aggregate([
            {
                $match: {
                    owner: req.user._id,
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Get leads by platform
        const leadsByPlatform = await Lead.aggregate([
            {
                $match: {
                    owner: req.user._id,
                },
            },
            {
                $group: {
                    _id: "$source.platform",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Get total spend across all campaigns
        const campaigns = await Campaign.find({ owner: req.user.id });
        let totalSpend = 0;
        let totalImpressions = 0;
        let totalClicks = 0;
        let totalConversions = 0;

        campaigns.forEach((campaign) => {
            campaign.platforms.forEach((platform) => {
                totalSpend += platform.metrics.spend || 0;
                totalImpressions += platform.metrics.impressions || 0;
                totalClicks += platform.metrics.clicks || 0;
                totalConversions += platform.metrics.conversions || 0;
            });
        });

        // Calculate overall metrics
        const overallCTR =
            totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
        const overallCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;
        const overallCPM =
            totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0;
        const overallCPL =
            totalLeadsCount > 0 ? totalSpend / totalLeadsCount : 0;

        // Get recent campaigns
        const recentCampaigns = await Campaign.find({ owner: req.user.id })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name status startDate endDate budget.total totalMetrics");

        // Get recent leads
        const recentLeads = await Lead.find({ owner: req.user.id })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("firstName lastName email status source.platform createdAt")
            .populate({
                path: "source.campaign",
                select: "name",
            });

        res.status(200).json({
            success: true,
            data: {
                campaignStats: {
                    active: activeCampaignsCount,
                    total: totalCampaignsCount,
                },
                leadStats: {
                    total: totalLeadsCount,
                    byStatus: leadsByStatus,
                    byPlatform: leadsByPlatform,
                },
                performanceMetrics: {
                    totalSpend,
                    totalImpressions,
                    totalClicks,
                    totalConversions,
                    overallCTR,
                    overallCPC,
                    overallCPM,
                    overallCPL,
                },
                recentCampaigns,
                recentLeads,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get campaign performance over time
// @route   GET /api/analytics/campaigns/:id/performance
// @access  Private
exports.getCampaignPerformanceOverTime = async (req, res) => {
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

        // This would typically come from the ad platform's API with historical data
        // For now, we'll return a placeholder response
        const performanceData = {
            timeframes: [
                "Day 1",
                "Day 2",
                "Day 3",
                "Day 4",
                "Day 5",
                "Day 6",
                "Day 7",
            ],
            metrics: {
                impressions: [1200, 1500, 1800, 2100, 2400, 2700, 3000],
                clicks: [120, 150, 180, 210, 240, 270, 300],
                conversions: [12, 15, 18, 21, 24, 27, 30],
                spend: [50, 60, 70, 80, 90, 100, 110],
                ctr: [10, 10, 10, 10, 10, 10, 10],
                cpc: [0.42, 0.4, 0.39, 0.38, 0.38, 0.37, 0.37],
                cpm: [41.67, 40.0, 38.89, 38.1, 37.5, 37.04, 36.67],
            },
            platforms: {
                facebook: {
                    impressions: [600, 750, 900, 1050, 1200, 1350, 1500],
                    clicks: [60, 75, 90, 105, 120, 135, 150],
                    conversions: [6, 8, 9, 11, 12, 14, 15],
                    spend: [25, 30, 35, 40, 45, 50, 55],
                },
                google: {
                    impressions: [400, 500, 600, 700, 800, 900, 1000],
                    clicks: [40, 50, 60, 70, 80, 90, 100],
                    conversions: [4, 5, 6, 7, 8, 9, 10],
                    spend: [15, 20, 25, 30, 35, 40, 45],
                },
                linkedin: {
                    impressions: [200, 250, 300, 350, 400, 450, 500],
                    clicks: [20, 25, 30, 35, 40, 45, 50],
                    conversions: [2, 2, 3, 3, 4, 4, 5],
                    spend: [10, 10, 10, 10, 10, 10, 10],
                },
            },
        };

        res.status(200).json({
            success: true,
            data: performanceData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get lead generation analytics
// @route   GET /api/analytics/leads
// @access  Private
exports.getLeadAnalytics = async (req, res) => {
    try {
        // Get leads by campaign
        const leadsByCampaign = await Lead.aggregate([
            {
                $match: {
                    owner: req.user._id,
                },
            },
            {
                $lookup: {
                    from: "campaigns",
                    localField: "source.campaign",
                    foreignField: "_id",
                    as: "campaignData",
                },
            },
            {
                $unwind: "$campaignData",
            },
            {
                $group: {
                    _id: "$source.campaign",
                    campaignName: { $first: "$campaignData.name" },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
            {
                $limit: 10,
            },
        ]);

        // Get leads by date (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const leadsByDate = await Lead.aggregate([
            {
                $match: {
                    owner: req.user._id,
                    createdAt: { $gte: thirtyDaysAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
            },
        ]);

        // Format the date data
        const formattedLeadsByDate = leadsByDate.map((item) => {
            const date = new Date(
                item._id.year,
                item._id.month - 1,
                item._id.day
            );
            return {
                date: date.toISOString().split("T")[0],
                count: item.count,
            };
        });

        // Get conversion rates by platform
        const conversionRatesByPlatform = await Campaign.aggregate([
            {
                $match: {
                    owner: req.user._id,
                },
            },
            {
                $unwind: "$platforms",
            },
            {
                $group: {
                    _id: "$platforms.name",
                    totalImpressions: {
                        $sum: "$platforms.metrics.impressions",
                    },
                    totalClicks: { $sum: "$platforms.metrics.clicks" },
                    totalConversions: {
                        $sum: "$platforms.metrics.conversions",
                    },
                    totalSpend: { $sum: "$platforms.metrics.spend" },
                },
            },
            {
                $project: {
                    platform: "$_id",
                    impressions: "$totalImpressions",
                    clicks: "$totalClicks",
                    conversions: "$totalConversions",
                    spend: "$totalSpend",
                    ctr: {
                        $cond: [
                            { $gt: ["$totalImpressions", 0] },
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            "$totalClicks",
                                            "$totalImpressions",
                                        ],
                                    },
                                    100,
                                ],
                            },
                            0,
                        ],
                    },
                    conversionRate: {
                        $cond: [
                            { $gt: ["$totalClicks", 0] },
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            "$totalConversions",
                                            "$totalClicks",
                                        ],
                                    },
                                    100,
                                ],
                            },
                            0,
                        ],
                    },
                    costPerConversion: {
                        $cond: [
                            { $gt: ["$totalConversions", 0] },
                            { $divide: ["$totalSpend", "$totalConversions"] },
                            0,
                        ],
                    },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                leadsByCampaign,
                leadsByDate: formattedLeadsByDate,
                conversionRatesByPlatform,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
