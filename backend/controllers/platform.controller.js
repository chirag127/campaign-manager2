const PlatformConnection = require("../models/PlatformConnection");
const User = require("../models/User");
const axios = require("axios");

// @desc    Connect to Facebook Ads
// @route   POST /api/platforms/facebook/connect
// @access  Private
exports.connectFacebook = async (req, res) => {
    try {
        const { accessToken, accountId } = req.body;

        if (!accessToken || !accountId) {
            return res.status(400).json({
                success: false,
                error: "Please provide access token and account ID",
            });
        }

        // Check if connection already exists
        let connection = await PlatformConnection.findOne({
            user: req.user.id,
            platform: "facebook",
        });

        if (connection) {
            // Update existing connection
            connection.accessToken = accessToken;
            connection.accountId = accountId;
            connection.status = "active";
            connection.expiresAt = new Date(
                Date.now() + 60 * 24 * 60 * 60 * 1000
            ); // 60 days
            await connection.save();
        } else {
            // Create new connection
            connection = await PlatformConnection.create({
                user: req.user.id,
                platform: "facebook",
                accessToken,
                accountId,
                status: "active",
                expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
            });
        }

        // Update user's platform connections
        const user = await User.findById(req.user.id);
        const platformIndex = user.platformConnections.findIndex(
            (p) => p.platform === "facebook"
        );

        if (platformIndex > -1) {
            user.platformConnections[platformIndex].accessToken = accessToken;
            user.platformConnections[platformIndex].accountId = accountId;
            user.platformConnections[platformIndex].connected = true;
            user.platformConnections[platformIndex].connectedAt = Date.now();
        } else {
            user.platformConnections.push({
                platform: "facebook",
                accessToken,
                accountId,
                connected: true,
                connectedAt: Date.now(),
            });
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                platform: "facebook",
                connected: true,
                accountId,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Connect to Google Ads
// @route   POST /api/platforms/google/connect
// @access  Private
exports.connectGoogle = async (req, res) => {
    try {
        const { accessToken, refreshToken, accountId } = req.body;

        if (!accessToken || !refreshToken || !accountId) {
            return res.status(400).json({
                success: false,
                error: "Please provide access token, refresh token, and account ID",
            });
        }

        // Check if connection already exists
        let connection = await PlatformConnection.findOne({
            user: req.user.id,
            platform: "google",
        });

        if (connection) {
            // Update existing connection
            connection.accessToken = accessToken;
            connection.refreshToken = refreshToken;
            connection.accountId = accountId;
            connection.status = "active";
            connection.expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
            await connection.save();
        } else {
            // Create new connection
            connection = await PlatformConnection.create({
                user: req.user.id,
                platform: "google",
                accessToken,
                refreshToken,
                accountId,
                status: "active",
                expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            });
        }

        // Update user's platform connections
        const user = await User.findById(req.user.id);
        const platformIndex = user.platformConnections.findIndex(
            (p) => p.platform === "google"
        );

        if (platformIndex > -1) {
            user.platformConnections[platformIndex].accessToken = accessToken;
            user.platformConnections[platformIndex].refreshToken = refreshToken;
            user.platformConnections[platformIndex].accountId = accountId;
            user.platformConnections[platformIndex].connected = true;
            user.platformConnections[platformIndex].connectedAt = Date.now();
        } else {
            user.platformConnections.push({
                platform: "google",
                accessToken,
                refreshToken,
                accountId,
                connected: true,
                connectedAt: Date.now(),
            });
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                platform: "google",
                connected: true,
                accountId,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Connect to LinkedIn Ads
// @route   POST /api/platforms/linkedin/connect
// @access  Private
exports.connectLinkedIn = async (req, res) => {
    try {
        const { accessToken, refreshToken, accountId } = req.body;

        if (!accessToken || !accountId) {
            return res.status(400).json({
                success: false,
                error: "Please provide access token and account ID",
            });
        }

        // Check if connection already exists
        let connection = await PlatformConnection.findOne({
            user: req.user.id,
            platform: "linkedin",
        });

        if (connection) {
            // Update existing connection
            connection.accessToken = accessToken;
            if (refreshToken) connection.refreshToken = refreshToken;
            connection.accountId = accountId;
            connection.status = "active";
            connection.expiresAt = new Date(
                Date.now() + 60 * 24 * 60 * 60 * 1000
            ); // 60 days
            await connection.save();
        } else {
            // Create new connection
            connection = await PlatformConnection.create({
                user: req.user.id,
                platform: "linkedin",
                accessToken,
                refreshToken,
                accountId,
                status: "active",
                expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
            });
        }

        // Update user's platform connections
        const user = await User.findById(req.user.id);
        const platformIndex = user.platformConnections.findIndex(
            (p) => p.platform === "linkedin"
        );

        if (platformIndex > -1) {
            user.platformConnections[platformIndex].accessToken = accessToken;
            if (refreshToken)
                user.platformConnections[platformIndex].refreshToken =
                    refreshToken;
            user.platformConnections[platformIndex].accountId = accountId;
            user.platformConnections[platformIndex].connected = true;
            user.platformConnections[platformIndex].connectedAt = Date.now();
        } else {
            user.platformConnections.push({
                platform: "linkedin",
                accessToken,
                refreshToken,
                accountId,
                connected: true,
                connectedAt: Date.now(),
            });
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                platform: "linkedin",
                connected: true,
                accountId,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get user's platform connections
// @route   GET /api/platforms/connections
// @access  Private
exports.getPlatformConnections = async (req, res) => {
    try {
        const connections = await PlatformConnection.find({
            user: req.user.id,
        });

        const formattedConnections = connections.map((conn) => ({
            platform: conn.platform,
            connected: conn.status === "active",
            accountId: conn.accountId,
            accountName: conn.accountName,
            expiresAt: conn.expiresAt,
        }));

        res.status(200).json({
            success: true,
            count: connections.length,
            data: formattedConnections,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Disconnect platform
// @route   DELETE /api/platforms/:platform/disconnect
// @access  Private
exports.disconnectPlatform = async (req, res) => {
    try {
        const { platform } = req.params;

        // Check if platform is valid
        const validPlatforms = [
            "facebook",
            "google",
            "linkedin",
            "twitter",
            "snapchat",
            "youtube",
            "instagram",
        ];
        if (!validPlatforms.includes(platform)) {
            return res.status(400).json({
                success: false,
                error: "Invalid platform",
            });
        }

        // Find and update connection
        const connection = await PlatformConnection.findOne({
            user: req.user.id,
            platform,
        });

        if (connection) {
            connection.status = "revoked";
            await connection.save();
        }

        // Update user's platform connections
        const user = await User.findById(req.user.id);
        const platformIndex = user.platformConnections.findIndex(
            (p) => p.platform === platform
        );

        if (platformIndex > -1) {
            user.platformConnections[platformIndex].connected = false;
            await user.save();
        }

        res.status(200).json({
            success: true,
            data: {
                platform,
                connected: false,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
