const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please add a first name"],
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please add an email"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please add a valid email",
            ],
        },
        phone: {
            type: String,
        },
        status: {
            type: String,
            enum: [
                "new",
                "contacted",
                "qualified",
                "converted",
                "disqualified",
            ],
            default: "new",
        },
        source: {
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
                    "other",
                ],
                required: true,
            },
            campaign: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Campaign",
                required: true,
            },
            adCreative: {
                type: String,
            },
            landingPage: {
                type: String,
            },
        },
        additionalInfo: {
            type: Map,
            of: String,
        },
        notes: {
            type: String,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        tags: [String],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Lead", LeadSchema);
