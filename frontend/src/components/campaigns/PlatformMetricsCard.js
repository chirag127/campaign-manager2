import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const PlatformMetricsCard = ({ platform, style }) => {
    const getPlatformIcon = (platformName) => {
        switch (platformName) {
            case "facebook":
                return "logo-facebook";
            case "google":
                return "logo-google";
            case "linkedin":
                return "logo-linkedin";
            case "twitter":
                return "logo-twitter";
            case "snapchat":
                return "logo-snapchat";
            case "youtube":
                return "logo-youtube";
            case "instagram":
                return "logo-instagram";
            default:
                return "globe-outline";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "#4CAF50";
            case "paused":
                return "#FFC107";
            case "pending":
                return "#2196F3";
            case "completed":
                return "#9E9E9E";
            case "error":
                return "#FF5252";
            default:
                return "#9E9E9E";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Card style={[styles.card, style]}>
            <Card.Content>
                <View style={styles.header}>
                    <View style={styles.platformInfo}>
                        <Ionicons
                            name={getPlatformIcon(platform.name)}
                            size={24}
                            color="#4A6FFF"
                            style={styles.icon}
                        />
                        <Text style={styles.platformName}>
                            {platform.name.charAt(0).toUpperCase() +
                                platform.name.slice(1)}
                        </Text>
                    </View>
                    <View style={styles.statusContainer}>
                        <View
                            style={[
                                styles.statusDot,
                                {
                                    backgroundColor: getStatusColor(
                                        platform.status
                                    ),
                                },
                            ]}
                        />
                        <Text style={styles.statusText}>
                            {platform.status.charAt(0).toUpperCase() +
                                platform.status.slice(1)}
                        </Text>
                    </View>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.metricsContainer}>
                    <View style={styles.metricRow}>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Impressions</Text>
                            <Text style={styles.metricValue}>
                                {platform.metrics?.impressions?.toLocaleString() ||
                                    "0"}
                            </Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Clicks</Text>
                            <Text style={styles.metricValue}>
                                {platform.metrics?.clicks?.toLocaleString() ||
                                    "0"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.metricRow}>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Conversions</Text>
                            <Text style={styles.metricValue}>
                                {platform.metrics?.conversions?.toLocaleString() ||
                                    "0"}
                            </Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Spend</Text>
                            <Text style={styles.metricValue}>
                                ${platform.metrics?.spend?.toFixed(2) || "0.00"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.metricRow}>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>CTR</Text>
                            <Text style={styles.metricValue}>
                                {platform.metrics?.ctr?.toFixed(2) || "0.00"}%
                            </Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>CPC</Text>
                            <Text style={styles.metricValue}>
                                ${platform.metrics?.cpc?.toFixed(2) || "0.00"}
                            </Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.lastUpdated}>
                    Last updated: {formatDate(platform.lastUpdated)}
                </Text>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    platformInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        marginRight: 8,
    },
    platformName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 14,
        color: "#666",
    },
    divider: {
        marginBottom: 12,
    },
    metricsContainer: {
        marginBottom: 12,
    },
    metricRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    metricItem: {
        flex: 1,
        padding: 8,
    },
    metricLabel: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 16,
        fontWeight: "500",
    },
    lastUpdated: {
        fontSize: 12,
        color: "#999",
        textAlign: "right",
        marginTop: 4,
    },
});

export default PlatformMetricsCard;
