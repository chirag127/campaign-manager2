import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";

import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";

// Define theme
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#4A6FFF",
        accent: "#FF6B6B",
        background: "#F5F7FA",
        surface: "#FFFFFF",
        text: "#1A1A1A",
        error: "#FF5252",
        success: "#4CAF50",
        warning: "#FFC107",
        info: "#2196F3",
    },
};

export default function App() {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <AuthProvider>
                    <NavigationContainer>
                        <AppNavigator />
                        <StatusBar style="auto" />
                    </NavigationContainer>
                </AuthProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
