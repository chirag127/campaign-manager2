import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../api/config";

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    // Initialize auth state
    useEffect(() => {
        // Load token from storage
        const loadToken = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");
                const userData = await AsyncStorage.getItem("userData");

                if (token) {
                    setUserToken(token);
                    setUser(JSON.parse(userData));

                    // Set axios default header
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;
                }
            } catch (error) {
                console.log("Error loading auth token:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadToken();
    }, []);

    // Login function
    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password,
            });

            const {
                token,
                _id,
                name,
                email: userEmail,
                role,
            } = response.data.data;

            // Store user data
            const userData = { _id, name, email: userEmail, role };

            // Save to storage
            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("userData", JSON.stringify(userData));

            // Update state
            setUserToken(token);
            setUser(userData);

            // Set axios default header
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.error ||
                "Login failed. Please try again.";
            setError(message);
            return { success: false, message };
        } finally {
            setIsLoading(false);
        }
    };

    // Register function
    const register = async (name, email, password, company) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, {
                name,
                email,
                password,
                company,
            });

            const {
                token,
                _id,
                name: userName,
                email: userEmail,
                role,
            } = response.data.data;

            // Store user data
            const userData = { _id, name: userName, email: userEmail, role };

            // Save to storage
            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("userData", JSON.stringify(userData));

            // Update state
            setUserToken(token);
            setUser(userData);

            // Set axios default header
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.error ||
                "Registration failed. Please try again.";
            setError(message);
            return { success: false, message };
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        setIsLoading(true);

        try {
            // Remove from storage
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userData");

            // Update state
            setUserToken(null);
            setUser(null);

            // Remove axios default header
            delete axios.defaults.headers.common["Authorization"];
        } catch (error) {
            console.log("Error during logout:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Update user profile
    const updateProfile = async (userData) => {
        setIsLoading(true);

        try {
            const response = await axios.put(
                `${API_URL}/api/users/profile`,
                userData
            );

            const updatedUser = response.data.data;

            // Update storage
            await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));

            // Update state
            setUser(updatedUser);

            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.error ||
                "Profile update failed. Please try again.";
            setError(message);
            return { success: false, message };
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userToken,
                user,
                error,
                login,
                register,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
