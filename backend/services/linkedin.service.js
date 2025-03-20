const axios = require("axios");

/**
 * LinkedIn Ads API Service
 * This service handles interactions with the LinkedIn Marketing API
 */
class LinkedInAdsService {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.baseUrl = "https://api.linkedin.com/v2";
        this.adsUrl = "https://api.linkedin.com/v2/adAccounts";
    }

    /**
     * Create a campaign on LinkedIn Ads
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
                accountId,
            } = campaignData;

            // Convert objective to LinkedIn's format
            const objectiveMap = {
                awareness: "BRAND_AWARENESS",
                consideration: "WEBSITE_VISITS",
                conversion: "LEAD_GENERATION",
                traffic: "WEBSITE_VISITS",
                engagement: "ENGAGEMENT",
                video_views: "VIDEO_VIEWS",
                lead_generation: "LEAD_GENERATION",
                messages: "MESSAGE_AD",
                sales: "WEBSITE_CONVERSIONS",
            };

            const linkedinObjective =
                objectiveMap[objective] || "WEBSITE_VISITS";

            // Convert status to LinkedIn's format
            const statusMap = {
                active: "ACTIVE",
                paused: "PAUSED",
                draft: "DRAFT",
                completed: "COMPLETED",
                archived: "ARCHIVED",
            };

            const linkedinStatus = statusMap[status] || "DRAFT";

            // Format dates for LinkedIn
            const linkedinStartDate = new Date(startDate).getTime();
            const linkedinEndDate = new Date(endDate).getTime();

            // Create campaign
            const response = await axios.post(
                `${this.adsUrl}/${accountId}/campaigns`,
                {
                    account: `urn:li:sponsoredAccount:${accountId}`,
                    name,
                    status: linkedinStatus,
                    objectiveType: linkedinObjective,
                    costType: "CPC",
                    unitCost: {
                        amount: budget.daily
                            ? budget.daily * 100
                            : budget.total * 100, // Convert to cents
                        currencyCode: budget.currency || "USD",
                    },
                    dailyBudget: {
                        amount: budget.daily
                            ? budget.daily * 100
                            : (budget.total / 30) * 100, // Convert to cents
                        currencyCode: budget.currency || "USD",
                    },
                    totalBudget: {
                        amount: budget.total * 100, // Convert to cents
                        currencyCode: budget.currency || "USD",
                    },
                    startDate: linkedinStartDate,
                    endDate: linkedinEndDate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        "X-Restli-Protocol-Version": "2.0.0",
                        "Content-Type": "application/json",
                    },
                }
            );

            return {
                platformCampaignId: response.data.id,
                status: "active",
            };
        } catch (error) {
            console.error(
                "LinkedIn campaign creation error:",
                error.response?.data || error.message
            );
            throw new Error(
                `Failed to create LinkedIn campaign: ${error.message}`
            );
        }
    }

    /**
     * Get campaign metrics from LinkedIn Ads
     * @param {String} accountId - LinkedIn account ID
     * @param {String} campaignId - LinkedIn campaign ID
     * @returns {Promise<Object>} - Campaign metrics
     */
    async getCampaignMetrics(accountId, campaignId) {
        try {
            const response = await axios.get(
                `${this.adsUrl}/${accountId}/analytics`,
                {
                    params: {
                        q: "analytics",
                        dateRange: {
                            start: {
                                day: 1,
                                month: 1,
                                year: 2020,
                            },
                            end: {
                                day: 31,
                                month: 12,
                                year: 2030,
                            },
                        },
                        campaigns: [`urn:li:sponsoredCampaign:${campaignId}`],
                        fields: "impressions,clicks,conversions,costInUsd,clickThroughRate,costPerClick,costPer1000Impressions",
                    },
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        "X-Restli-Protocol-Version": "2.0.0",
                    },
                }
            );

            const data = response.data.elements[0] || {};

            return {
                impressions: parseInt(data.impressions || 0, 10),
                clicks: parseInt(data.clicks || 0, 10),
                conversions: parseInt(data.conversions || 0, 10),
                spend: parseFloat(data.costInUsd || 0),
                ctr: parseFloat(data.clickThroughRate || 0) * 100, // Convert to percentage
                cpc: parseFloat(data.costPerClick || 0),
                cpm: parseFloat(data.costPer1000Impressions || 0),
            };
        } catch (error) {
            console.error(
                "LinkedIn metrics retrieval error:",
                error.response?.data || error.message
            );
            throw new Error(
                `Failed to get LinkedIn campaign metrics: ${error.message}`
            );
        }
    }

    /**
     * Update campaign status on LinkedIn Ads
     * @param {String} accountId - LinkedIn account ID
     * @param {String} campaignId - LinkedIn campaign ID
     * @param {String} status - New status (active, paused, archived)
     * @returns {Promise<Object>} - Updated campaign data
     */
    async updateCampaignStatus(accountId, campaignId, status) {
        try {
            // Convert status to LinkedIn's format
            const statusMap = {
                active: "ACTIVE",
                paused: "PAUSED",
                completed: "COMPLETED",
                archived: "ARCHIVED",
            };

            const linkedinStatus = statusMap[status] || "PAUSED";

            const response = await axios.patch(
                `${this.adsUrl}/${accountId}/campaigns/${campaignId}`,
                {
                    status: linkedinStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        "X-Restli-Protocol-Version": "2.0.0",
                        "Content-Type": "application/json",
                    },
                }
            );

            return {
                success: true,
                status,
            };
        } catch (error) {
            console.error(
                "LinkedIn campaign update error:",
                error.response?.data || error.message
            );
            throw new Error(
                `Failed to update LinkedIn campaign status: ${error.message}`
            );
        }
    }

    /**
     * Get leads from LinkedIn Lead Gen Forms
     * @param {String} formId - LinkedIn form ID
     * @returns {Promise<Array>} - Array of leads
     */
    async getLeads(formId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/leadGenForms/${formId}/submissions`,
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        "X-Restli-Protocol-Version": "2.0.0",
                    },
                }
            );

            return response.data.elements.map((lead) => {
                const fields = {};
                lead.fields.forEach((field) => {
                    fields[field.name] = field.value;
                });

                return {
                    platformLeadId: lead.id,
                    firstName: fields.firstName || "",
                    lastName: fields.lastName || "",
                    email: fields.emailAddress || fields.email || "",
                    phone: fields.phoneNumber || fields.phone || "",
                    createdAt: lead.submittedAt,
                    campaignName: lead.campaignName,
                    platform: "linkedin",
                    additionalInfo: fields,
                };
            });
        } catch (error) {
            console.error(
                "LinkedIn leads retrieval error:",
                error.response?.data || error.message
            );
            throw new Error(`Failed to get LinkedIn leads: ${error.message}`);
        }
    }
}

module.exports = LinkedInAdsService;
