import axios from "axios";
import { API_URL } from "./config";

// Get platform connections
export const getPlatformConnections = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/api/platforms/connections`
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                error: "Failed to fetch platform connections",
            }
        );
    }
};

// Connect to Facebook
export const connectFacebook = async (accessToken, accountId) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/platforms/facebook/connect`,
            {
                accessToken,
                accountId,
            }
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || { error: "Failed to connect to Facebook" }
        );
    }
};

// Connect to Google
export const connectGoogle = async (accessToken, refreshToken, accountId) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/platforms/google/connect`,
            {
                accessToken,
                refreshToken,
                accountId,
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Failed to connect to Google" };
    }
};

// Connect to LinkedIn
export const connectLinkedIn = async (accessToken, refreshToken, accountId) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/platforms/linkedin/connect`,
            {
                accessToken,
                refreshToken,
                accountId,
            }
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || { error: "Failed to connect to LinkedIn" }
        );
    }
};

// Disconnect platform
export const disconnectPlatform = async (platform) => {
    try {
        const response = await axios.delete(
            `${API_URL}/api/platforms/${platform}/disconnect`
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                error: `Failed to disconnect from ${platform}`,
            }
        );
    }
};
