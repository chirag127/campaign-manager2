import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import CustomDrawerContent from "../components/navigation/CustomDrawerContent";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import CampaignListScreen from "../screens/campaigns/CampaignListScreen";
import CampaignDetailScreen from "../screens/campaigns/CampaignDetailScreen";
import CampaignCreateScreen from "../screens/campaigns/CampaignCreateScreen";
import CampaignEditScreen from "../screens/campaigns/CampaignEditScreen";
import LeadListScreen from "../screens/leads/LeadListScreen";
import LeadDetailScreen from "../screens/leads/LeadDetailScreen";
import PlatformConnectScreen from "../screens/platforms/PlatformConnectScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Dashboard Stack
const DashboardStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="DashboardMain"
                component={DashboardScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

// Campaign Stack
const CampaignStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CampaignList"
                component={CampaignListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CampaignDetail"
                component={CampaignDetailScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CampaignCreate"
                component={CampaignCreateScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CampaignEdit"
                component={CampaignEditScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

// Lead Stack
const LeadStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="LeadList"
                component={LeadListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LeadDetail"
                component={LeadDetailScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

// Platform Stack
const PlatformStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PlatformConnect"
                component={PlatformConnectScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

// Settings Stack
const SettingsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SettingsMain"
                component={SettingsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

// Bottom Tab Navigator
const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Dashboard") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Campaigns") {
                        iconName = focused ? "megaphone" : "megaphone-outline";
                    } else if (route.name === "Leads") {
                        iconName = focused ? "people" : "people-outline";
                    } else if (route.name === "Platforms") {
                        iconName = focused
                            ? "share-social"
                            : "share-social-outline";
                    }

                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                tabBarActiveTintColor: "#4A6FFF",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardStack} />
            <Tab.Screen name="Campaigns" component={CampaignStack} />
            <Tab.Screen name="Leads" component={LeadStack} />
            <Tab.Screen name="Platforms" component={PlatformStack} />
        </Tab.Navigator>
    );
};

// Main Drawer Navigator
const MainNavigator = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: "#4A6FFF",
                drawerActiveTintColor: "#fff",
                drawerInactiveTintColor: "#333",
                drawerLabelStyle: {
                    marginLeft: -25,
                    fontSize: 15,
                },
            }}
        >
            <Drawer.Screen
                name="Home"
                component={TabNavigator}
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={22} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsStack}
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons
                            name="settings-outline"
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};

export default MainNavigator;
