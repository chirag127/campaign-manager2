import axios from "axios";
import { API_URL } from "./config";

// Get all leads
export const getLeads = async (page = 1, limit = 25) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/leads?page=${page}&limit=${limit}`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to fetch leads" };
    }
};

// Get single lead
export const getLead = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/leads/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to fetch lead" };
    }
};

// Create lead
export const createLead = async (leadData) => {
    try {
        const response = await axios.post(`${API_URL}/api/leads`, leadData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to create lead" };
    }
};

// Update lead
export const updateLead = async (id, leadData) => {
    try {
        const response = await axios.put(
            `${API_URL}/api/leads/${id}`,
            leadData
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to update lead" };
    }
};

// Delete lead
export const deleteLead = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/leads/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to delete lead" };
    }
};

// Get leads by campaign
export const getLeadsByCampaign = async (campaignId) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/campaigns/${campaignId}/leads`
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || { error: "Failed to fetch campaign leads" }
        );
    }
};

// Get lead analytics
export const getLeadAnalytics = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/analytics/leads`);
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || { error: "Failed to fetch lead analytics" }
        );
    }
};
