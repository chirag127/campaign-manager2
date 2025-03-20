const axios = require("axios");

/**
 * Facebook Ads API Service
 * This service handles interactions with the Facebook Marketing API
 */
class FacebookAdsService {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.baseUrl = "https://graph.facebook.com/v18.0";
    }

    /**
     * Create a campaign on Facebook Ads
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
                adAccountId,
            } = campaignData;

            // Convert objective to Facebook's format
            const objectiveMap = {
                awareness: "BRAND_AWARENESS",
                consideration: "REACH",
                conversion: "CONVERSIONS",
                traffic: "TRAFFIC",
                engagement: "POST_ENGAGEMENT",
                app_installs: "APP_INSTALLS",
                video_views: "VIDEO_VIEWS",
                lead_generation: "LEAD_GENERATION",
                messages: "MESSAGES",
                sales: "SALES",
            };

            const fbObjective = objectiveMap[objective] || "REACH";

            // Convert status to Facebook's format
            const statusMap = {
                active: "ACTIVE",
                paused: "PAUSED",
                draft: "PAUSED",
                completed: "PAUSED",
                archived: "ARCHIVED",
            };

            const fbStatus = statusMap[status] || "PAUSED";

            // Format dates for Facebook
            const fbStartDate = new Date(startDate).toISOString().split("T")[0];
            const fbEndDate = new Date(endDate).toISOString().split("T")[0];

            // Create campaign
            const response = await axios.post(
                `${this.baseUrl}/act_${adAccountId}/campaigns`,
                {
                    name,
                    objective: fbObjective,
                    status: fbStatus,
                    special_ad_categories: [],
                    daily_budget: budget.daily ? budget.daily * 100 : undefined, // Convert to cents
                    lifetime_budget: !budget.daily
                        ? budget.total * 100
                        : undefined, // Convert to cents
                    start_time: fbStartDate,
                    end_time: fbEndDate,
                },
                {
                    params: {
                        access_token: this.accessToken,
                    },
                }
            );

            return {
                platformCampaignId: response.data.id,
                status: "active",
            };
        } catch (error) {
            console.error(
                "Facebook campaign creation error:",
                error.response?.data || error.message
            );
            throw new Error(
                `Failed to create Facebook campaign: ${error.message}`
            );
        }
    }

    /**
     * Get campaign metrics from Facebook Ads
     * @param {String} campaignId - Facebook campaign ID
     * @returns {Promise<Object>} - Campaign metrics
     */
    async getCampaignMetrics(campaignId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/${campaignId}/insights`,
                {
                    params: {
                        access_token: this.accessToken,
                        fields: "impressions,clicks,spend,ctr,cpc,actions",
                        date_preset: "lifetime",
                        level: "campaign",
                    },
                }
            );

            const data = response.data.data[0] || {};

            // Extract conversions from actions
            let conversions = 0;
            if (data.actions) {
                const conversionActions = data.actions.filter((action) =>
                    ["offsite_conversion", "lead", "purchase"].includes(
                        action.action_type
                    )
                );
                conversions = conversionActions.reduce(
                    (sum, action) => sum + parseInt(action.value, 10),
                    0
                );
            }

            return {
                impressions: parseInt(data.impressions || 0, 10),
                clicks: parseInt(data.clicks || 0, 10),
                conversions,
                spend: parseFloat(data.spend || 0),
                ctr: parseFloat(data.ctr || 0) * 100, // Convert to percentage
                cpc: parseFloat(data.cpc || 0),
                cpm: parseFloat(data.cpm || 0),
            };
        } catch (error) {
            console.error(
                "Facebook metrics retrieval error:",
                error.response?.data || error.message
            );
            throw new Error(
                `Failed to get Facebook campaign metrics: ${error.message}`
            );
        }
    }

    /**
     * Update campaign status on Facebook Ads
     * @param {String} campaignId - Facebook campaign ID
     * @param {String} status - New status (active, paused, archived)
     * @returns {Promise<Object>} - Updated campaign data
     */
    async updateCampaignStatus(campaignId, status) {
        try {
            // Convert status to Facebook's format
            const statusMap = {
                active: "ACTIVE",
                paused: "PAUSED",
                completed: "PAUSED",
                archived: "ARCHIVED",
            };

            const fbStatus = statusMap[status] || "PAUSED";

            const response = await axios.post(
                `${this.baseUrl}/${campaignId}`,
                {
                    status: fbStatus,
                },
                {
                    params: {
                        access_token: this.accessToken,
                    },
                }
            );

            return {
                success: response.data.success,
                status,
            };
        } catch (error) {
            console.error(
                "Facebook campaign update error:",
                error.response?.data || error.message
            );
            throw new Error(
                `Failed to update Facebook campaign status: ${error.message}`
            );
        }
    }

    /**
     * Get leads from a Facebook lead form
     * @param {String} formId - Facebook form ID
     * @returns {Promise<Array>} - Array of leads
     */
    async getLeads(formId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/${formId}/leads`,
                {
                    params: {
                        access_token: this.accessToken,
                        fields: "created_time,field_data,campaign_name,platform,ad_name",
                    },
                }
            );

            return response.data.data.map((lead) => {
                // Extract lead fields
                const fields = {};
                lead.field_data.forEach((field) => {
                    fields[field.name] = field.values[0];
                });

                return {
                    platformLeadId: lead.id,
                    firstName: fields.first_name || fields.firstname || "",
                    lastName: fields.last_name || fields.lastname || "",
                    email: fields.email || "",
                    phone: fields.phone_number || fields.phone || "",
                    createdAt: lead.created_time,
                    campaignName: lead.campaign_name,
                    adName: lead.ad_name,
                    platform: "facebook",
                    additionalInfo: fields,
                };
            });
        } catch (error) {
            console.error(
                "Facebook leads retrieval error:",
                error.response?.data || error.message
            );
            throw new Error(`Failed to get Facebook leads: ${error.message}`);
        }
    }
}

module.exports = FacebookAdsService;
