import axios from "axios";
import { API_URL } from "./config";

// Get all campaigns
export const getCampaigns = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/campaigns?page=${page}&limit=${limit}`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to fetch campaigns" };
    }
};

// Get single campaign
export const getCampaign = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/campaigns/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to fetch campaign" };
    }
};

// Create campaign
export const createCampaign = async (campaignData) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/campaigns`,
            campaignData
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to create campaign" };
    }
};

// Update campaign
export const updateCampaign = async (id, campaignData) => {
    try {
        const response = await axios.put(
            `${API_URL}/api/campaigns/${id}`,
            campaignData
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to update campaign" };
    }
};

// Delete campaign
export const deleteCampaign = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/campaigns/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to delete campaign" };
    }
};

// Get campaign metrics
export const getCampaignMetrics = async (id) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/campaigns/${id}/metrics`
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                error: "Failed to fetch campaign metrics",
            }
        );
    }
};

// Get campaign performance over time
export const getCampaignPerformance = async (id) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/analytics/campaigns/${id}/performance`
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                error: "Failed to fetch campaign performance",
            }
        );
    }
};
