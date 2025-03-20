import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import {
    Text,
    Card,
    Title,
    Paragraph,
    Button,
    ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { getDashboardAnalytics } from "../../api/analyticsApi";
import Header from "../../components/common/Header";
import MetricCard from "../../components/dashboard/MetricCard";
import CampaignList from "../../components/campaigns/CampaignList";
import LeadList from "../../components/leads/LeadList";

const DashboardScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setError(null);
            const response = await getDashboardAnalytics();
            setDashboardData(response.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError("Failed to load dashboard data. Pull down to refresh.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A6FFF" />
                <Text style={styles.loadingText}>Loading dashboard...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header title="Dashboard" />

            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons
                            name="alert-circle-outline"
                            size={48}
                            color="#FF5252"
                        />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.metricsContainer}>
                            <MetricCard
                                title="Active Campaigns"
                                value={
                                    dashboardData?.campaignStats?.active || 0
                                }
                                icon="megaphone-outline"
                                color="#4A6FFF"
                                onPress={() => navigation.navigate("Campaigns")}
                            />
                            <MetricCard
                                title="Total Leads"
                                value={dashboardData?.leadStats?.total || 0}
                                icon="people-outline"
                                color="#FF6B6B"
                                onPress={() => navigation.navigate("Leads")}
                            />
                        </View>

                        <View style={styles.metricsContainer}>
                            <MetricCard
                                title="Total Spend"
                                value={`$${
                                    dashboardData?.performanceMetrics?.totalSpend?.toFixed(
                                        2
                                    ) || "0.00"
                                }`}
                                icon="cash-outline"
                                color="#4CAF50"
                            />
                            <MetricCard
                                title="Conversions"
                                value={
                                    dashboardData?.performanceMetrics
                                        ?.totalConversions || 0
                                }
                                icon="checkmark-circle-outline"
                                color="#FFC107"
                            />
                        </View>

                        <Card style={styles.card}>
                            <Card.Content>
                                <Title>Performance Overview</Title>
                                <View style={styles.performanceContainer}>
                                    <View style={styles.performanceItem}>
                                        <Text style={styles.performanceLabel}>
                                            Impressions
                                        </Text>
                                        <Text style={styles.performanceValue}>
                                            {dashboardData?.performanceMetrics?.totalImpressions?.toLocaleString() ||
                                                0}
                                        </Text>
                                    </View>
                                    <View style={styles.performanceItem}>
                                        <Text style={styles.performanceLabel}>
                                            Clicks
                                        </Text>
                                        <Text style={styles.performanceValue}>
                                            {dashboardData?.performanceMetrics?.totalClicks?.toLocaleString() ||
                                                0}
                                        </Text>
                                    </View>
                                    <View style={styles.performanceItem}>
                                        <Text style={styles.performanceLabel}>
                                            CTR
                                        </Text>
                                        <Text style={styles.performanceValue}>
                                            {dashboardData?.performanceMetrics?.overallCTR?.toFixed(
                                                2
                                            ) || 0}
                                            %
                                        </Text>
                                    </View>
                                    <View style={styles.performanceItem}>
                                        <Text style={styles.performanceLabel}>
                                            Cost/Conv.
                                        </Text>
                                        <Text style={styles.performanceValue}>
                                            $
                                            {dashboardData?.performanceMetrics?.overallCPL?.toFixed(
                                                2
                                            ) || 0}
                                        </Text>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>

                        <Card style={styles.card}>
                            <Card.Content>
                                <View style={styles.sectionHeader}>
                                    <Title>Recent Campaigns</Title>
                                    <Button
                                        mode="text"
                                        onPress={() =>
                                            navigation.navigate("Campaigns")
                                        }
                                        labelStyle={styles.viewAllButton}
                                    >
                                        View All
                                    </Button>
                                </View>
                                <CampaignList
                                    campaigns={
                                        dashboardData?.recentCampaigns || []
                                    }
                                    navigation={navigation}
                                    isLoading={false}
                                    compact={true}
                                />
                            </Card.Content>
                        </Card>

                        <Card style={styles.card}>
                            <Card.Content>
                                <View style={styles.sectionHeader}>
                                    <Title>Recent Leads</Title>
                                    <Button
                                        mode="text"
                                        onPress={() =>
                                            navigation.navigate("Leads")
                                        }
                                        labelStyle={styles.viewAllButton}
                                    >
                                        View All
                                    </Button>
                                </View>
                                <LeadList
                                    leads={dashboardData?.recentLeads || []}
                                    navigation={navigation}
                                    isLoading={false}
                                    compact={true}
                                />
                            </Card.Content>
                        </Card>

                        <View style={styles.actionContainer}>
                            <Button
                                mode="contained"
                                icon="plus"
                                onPress={() =>
                                    navigation.navigate("CampaignCreate")
                                }
                                style={styles.actionButton}
                            >
                                Create New Campaign
                            </Button>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F7FA",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        marginTop: 50,
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        textAlign: "center",
        color: "#FF5252",
    },
    metricsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    viewAllButton: {
        color: "#4A6FFF",
    },
    performanceContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 10,
    },
    performanceItem: {
        width: "48%",
        backgroundColor: "#F0F2F5",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    performanceLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
    },
    performanceValue: {
        fontSize: 18,
        fontWeight: "bold",
    },
    actionContainer: {
        marginVertical: 20,
    },
    actionButton: {
        backgroundColor: "#4A6FFF",
        paddingVertical: 8,
    },
});

export default DashboardScreen;
