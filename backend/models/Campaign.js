const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a campaign name"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        objective: {
            type: String,
            enum: [
                "awareness",
                "consideration",
                "conversion",
                "traffic",
                "engagement",
                "app_installs",
                "video_views",
                "lead_generation",
                "messages",
                "sales",
            ],
            required: [true, "Please select a campaign objective"],
        },
        status: {
            type: String,
            enum: ["draft", "active", "paused", "completed", "archived"],
            default: "draft",
        },
        startDate: {
            type: Date,
            required: [true, "Please add a start date"],
        },
        endDate: {
            type: Date,
            required: [true, "Please add an end date"],
        },
        budget: {
            total: {
                type: Number,
                required: [true, "Please add a total budget"],
            },
            daily: {
                type: Number,
            },
            currency: {
                type: String,
                default: "USD",
            },
        },
        targetAudience: {
            ageRange: {
                min: {
                    type: Number,
                    min: 13,
                    max: 65,
                },
                max: {
                    type: Number,
                    min: 13,
                    max: 65,
                },
            },
            gender: {
                type: [String],
                enum: ["male", "female", "all"],
            },
            locations: [
                {
                    country: String,
                    state: String,
                    city: String,
                },
            ],
            interests: [String],
            languages: [String],
            customAudiences: [String],
        },
        platforms: [
            {
                name: {
                    type: String,
                    enum: [
                        "facebook",
                        "google",
                        "linkedin",
                        "twitter",
                        "snapchat",
                        "youtube",
                        "instagram",
                    ],
                    required: true,
                },
                status: {
                    type: String,
                    enum: ["pending", "active", "paused", "completed", "error"],
                    default: "pending",
                },
                platformCampaignId: {
                    type: String,
                },
                budget: {
                    type: Number,
                    required: true,
                },
                metrics: {
                    impressions: {
                        type: Number,
                        default: 0,
                    },
                    clicks: {
                        type: Number,
                        default: 0,
                    },
                    conversions: {
                        type: Number,
                        default: 0,
                    },
                    spend: {
                        type: Number,
                        default: 0,
                    },
                    ctr: {
                        type: Number,
                        default: 0,
                    },
                    cpc: {
                        type: Number,
                        default: 0,
                    },
                    cpm: {
                        type: Number,
                        default: 0,
                    },
                    costPerConversion: {
                        type: Number,
                        default: 0,
                    },
                },
                lastUpdated: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        adCreatives: [
            {
                name: {
                    type: String,
                    required: true,
                },
                type: {
                    type: String,
                    enum: ["image", "video", "carousel", "text"],
                    required: true,
                },
                headline: {
                    type: String,
                },
                description: {
                    type: String,
                },
                mediaUrl: {
                    type: String,
                },
                callToAction: {
                    type: String,
                },
                destinationUrl: {
                    type: String,
                },
                platforms: [
                    {
                        type: String,
                        enum: [
                            "facebook",
                            "google",
                            "linkedin",
                            "twitter",
                            "snapchat",
                            "youtube",
                            "instagram",
                        ],
                    },
                ],
            },
        ],
        leads: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Lead",
            },
        ],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        team: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        tags: [String],
        notes: String,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for total metrics across all platforms
CampaignSchema.virtual("totalMetrics").get(function () {
    if (!this.platforms || this.platforms.length === 0) {
        return {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            spend: 0,
            ctr: 0,
            cpc: 0,
            cpm: 0,
            costPerConversion: 0,
        };
    }

    const totalMetrics = this.platforms.reduce(
        (acc, platform) => {
            acc.impressions += platform.metrics.impressions || 0;
            acc.clicks += platform.metrics.clicks || 0;
            acc.conversions += platform.metrics.conversions || 0;
            acc.spend += platform.metrics.spend || 0;
            return acc;
        },
        {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            spend: 0,
        }
    );

    // Calculate derived metrics
    totalMetrics.ctr =
        totalMetrics.impressions > 0
            ? (totalMetrics.clicks / totalMetrics.impressions) * 100
            : 0;
    totalMetrics.cpc =
        totalMetrics.clicks > 0 ? totalMetrics.spend / totalMetrics.clicks : 0;
    totalMetrics.cpm =
        totalMetrics.impressions > 0
            ? (totalMetrics.spend / totalMetrics.impressions) * 1000
            : 0;
    totalMetrics.costPerConversion =
        totalMetrics.conversions > 0
            ? totalMetrics.spend / totalMetrics.conversions
            : 0;

    return totalMetrics;
});

module.exports = mongoose.model("Campaign", CampaignSchema);
