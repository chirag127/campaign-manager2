const axios = require("axios");

/**
 * Google Ads API Service
 * This service handles interactions with the Google Ads API
 */
class GoogleAdsService {
    constructor(accessToken, refreshToken, clientId, clientSecret) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.baseUrl = "https://googleads.googleapis.com/v14";
    }

    /**
     * Refresh the access token
     * @returns {Promise<String>} - New access token
     */
    async refreshAccessToken() {
        try {
            const response = await axios.post(
                "https://oauth2.googleapis.com/token",
                {
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    refresh_token: this.refreshToken,
                    grant_type: "refresh_token",
                }
            );

            this.accessToken = response.data.access_token;
            return this.accessToken;
        } catch (error) {
            console.error(
                "Google token refresh error:",
                error.response?.data || error.message
            );
            throw new Error(
                `Failed to refresh Google access token: ${error.message}`
            );
        }
    }

    /**
     * Create a campaign on Google Ads
     * @param {Object} campaignData - Campaign data
     * @returns {Promise<Object>} - Created campaign data
     */
    async createCampaign(campaignData) {
        try {
            const {
                name,
                objective,
                status,
                budget,
                startDate,
                endDate,
                customerId,
            } = campaignData;

            // Convert objective to Google's format
            const objectiveMap = {
                awareness: "DISPLAY",
                consideration: "SEARCH",
                conversion: "PERFORMANCE_MAX",
                traffic: "SEARCH",
                engagement: "DISPLAY",
                app_installs: "APP",
                video_views: "VIDEO",
                lead_generation: "PERFORMANCE_MAX",
                messages: "DISPLAY",
                sales: "SHOPPING",
            };

            const googleCampaignType = objectiveMap[objective] || "SEARCH";

            // Convert status to Google's format
            const statusMap = {
                active: "ENABLED",
                paused: "PAUSED",
                draft: "PAUSED",
                completed: "PAUSED",
                archived: "REMOVED",
            };

            const googleStatus = statusMap[status] || "PAUSED";

            // Format dates for Google
            const googleStartDate = new Date(startDate)
                .toISOString()
                .split("T")[0];
            const googleEndDate = new Date(endDate).toISOString().split("T")[0];

            // Create campaign
            const response = await axios.post(
                `${this.baseUrl}/customers/${customerId}/campaigns`,
                {
                    name,
                    status: googleStatus,
                    advertisingChannelType: googleCampaignType,
                    campaignBudget: {
                        amountMicros: budget.daily
                            ? budget.daily * 1000000
                            : budget.total * 1000000, // Convert to micros
                        deliveryMethod: budget.daily
                            ? "STANDARD"
                            : "ACCELERATED",
                    },
                    startDate: googleStartDate.replace(/-/g, ""),
                    endDate: googleEndDate.replace(/-/g, ""),
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        "developer-token": process.env.GOOGLE_DEVELOPER_TOKEN,
                    },
                }
            );

            return {
                platformCampaignId: response.data.resourceName.split("/").pop(),
                status: "active",
            };
        } catch (error) {
            // If token expired, refresh and retry
            if (error.response?.status === 401) {
                await this.refreshAccessToken();
                return this.createCampaign(campaignData);
            }

            console.error(
                "Google campaign creation error:",
                error.response?.data || error.message
            );
            throw new Error(
                `Failed to create Google campaign: ${error.message}`
            );
        }
    }

    /**
     * Get campaign metrics from Google Ads
     * @param {String} customerId - Google Ads customer ID
     * @param {String} campaignId - Google campaign ID
     * @returns {Promise<Object>} - Campaign metrics
     */
    async getCampaignMetrics(customerId, campaignId) {
        try {
            const query = `
        SELECT
          campaign.id,
          metrics.impressions,
          metrics.clicks,
          metrics.conversions,
          metrics.cost_micros,
          metrics.ctr,
          metrics.average_cpc,
          metrics.average_cpm
        FROM campaign
        WHERE campaign.id = ${campaignId}
      `;

            const response = await axios.post(
                `${this.baseUrl}/customers/${customerId}/googleAds:search`,
                {
                    query,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        "developer-token": process.env.GOOGLE_DEVELOPER_TOKEN,
                    },
                }
            );

            const result = response.data.results[0] || {};
            const metrics = result.metrics || {};

            return {
                impressions: parseInt(metrics.impressions || 0, 10),
                clicks: parseInt(metrics.clicks || 0, 10),
                conversions: parseInt(metrics.conversions || 0, 10),
                spend: parseFloat(metrics.cost_micros || 0) / 1000000, // Convert from micros
                ctr: parseFloat(metrics.ctr || 0) * 100, // Convert to percentage
                cpc: parseFloat(metrics.average_cpc || 0) / 1000000, // Convert from micros
                cpm: parseFloat(metrics.average_cpm || 0) / 1000000, // Convert from micros
            };
        } catch (error) {
            // If token expired, refresh and retry
            if (error.response?.status === 401) {
                await this.refreshAccessToken();
                return this.getCampaignMetrics(customerId, campaignId);
            }

            console.error(
                "Google metrics retrieval error:",
                error.response?.data || error.message
            );
            throw new Error(
                `Failed to get Google campaign metrics: ${error.message}`
            );
        }
    }

    /**
     * Update campaign status on Google Ads
     * @param {String} customerId - Google Ads customer ID
     * @param {String} campaignId - Google campaign ID
     * @param {String} status - New status (active, paused, archived)
     * @returns {Promise<Object>} - Updated campaign data
     */
    async updateCampaignStatus(customerId, campaignId, status) {
        try {
            // Convert status to Google's format
            const statusMap = {
                active: "ENABLED",
                paused: "PAUSED",
                completed: "PAUSED",
                archived: "REMOVED",
            };

            const googleStatus = statusMap[status] || "PAUSED";

            const response = await axios.patch(
                `${this.baseUrl}/customers/${customerId}/campaigns/${campaignId}`,
                {
                    status: googleStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        "developer-token": process.env.GOOGLE_DEVELOPER_TOKEN,
                    },
                }
            );

            return {
                success: true,
                status,
            };
        } catch (error) {
            // If token expired, refresh and retry
            if (error.response?.status === 401) {
                await this.refreshAccessToken();
                return this.updateCampaignStatus(
                    customerId,
                    campaignId,
                    status
                );
            }

            console.error(
                "Google campaign update error:",
                error.response?.data || error.message
            );
            throw new Error(
                `Failed to update Google campaign status: ${error.message}`
            );
        }
    }
}

module.exports = GoogleAdsService;
