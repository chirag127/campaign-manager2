const mongoose = require("mongoose");

const PlatformConnectionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        platform: {
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
        accessToken: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
        expiresAt: {
            type: Date,
        },
        accountId: {
            type: String,
        },
        accountName: {
            type: String,
        },
        status: {
            type: String,
            enum: ["active", "expired", "revoked"],
            default: "active",
        },
        metadata: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure a user can only have one connection per platform
PlatformConnectionSchema.index({ user: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model("PlatformConnection", PlatformConnectionSchema);
