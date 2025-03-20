import axios from "axios";
import { API_URL } from "./config";

// Get dashboard analytics
export const getDashboardAnalytics = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/analytics/dashboard`);
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                error: "Failed to fetch dashboard analytics",
            }
        );
    }
};
