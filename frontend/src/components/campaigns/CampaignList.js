import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Card, Text, Chip, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const CampaignItem = ({ campaign, navigation, compact }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "#4CAF50";
            case "paused":
                return "#FFC107";
            case "completed":
                return "#2196F3";
            case "draft":
                return "#9E9E9E";
            case "archived":
                return "#757575";
            default:
                return "#9E9E9E";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate("CampaignDetail", {
                    campaignId: campaign._id,
                })
            }
        >
            <Card style={[styles.card, compact && styles.compactCard]}>
                <Card.Content>
                    <View style={styles.header}>
                        <Text style={styles.name}>{campaign.name}</Text>
                        <Chip
                            style={[
                                styles.statusChip,
                                {
                                    backgroundColor: getStatusColor(
                                        campaign.status
                                    ),
                                },
                            ]}
                            textStyle={styles.statusText}
                        >
                            {campaign.status.charAt(0).toUpperCase() +
                                campaign.status.slice(1)}
                        </Chip>
                    </View>

                    {!compact && (
                        <Text style={styles.description} numberOfLines={2}>
                            {campaign.description || "No description provided."}
                        </Text>
                    )}

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailItem}>
                            <Ionicons
                                name="calendar-outline"
                                size={16}
                                color="#666"
                            />
                            <Text style={styles.detailText}>
                                {formatDate(campaign.startDate)} -{" "}
                                {formatDate(campaign.endDate)}
                            </Text>
                        </View>

                        <View style={styles.detailItem}>
                            <Ionicons
                                name="cash-outline"
                                size={16}
                                color="#666"
                            />
                            <Text style={styles.detailText}>
                                $
                                {campaign.budget?.total?.toLocaleString() ||
                                    "0"}
                            </Text>
                        </View>

                        {!compact && campaign.platforms && (
                            <View style={styles.platformsContainer}>
                                {campaign.platforms.map((platform, index) => (
                                    <Chip
                                        key={index}
                                        style={styles.platformChip}
                                        textStyle={styles.platformText}
                                    >
                                        {platform.name.charAt(0).toUpperCase() +
                                            platform.name.slice(1)}
                                    </Chip>
                                ))}
                            </View>
                        )}
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

const CampaignList = ({
    campaigns,
    navigation,
    isLoading,
    compact = false,
}) => {
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A6FFF" />
                <Text style={styles.loadingText}>Loading campaigns...</Text>
            </View>
        );
    }

    if (!campaigns || campaigns.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons
                    name="document-text-outline"
                    size={48}
                    color="#9E9E9E"
                />
                <Text style={styles.emptyText}>No campaigns found</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={campaigns}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <CampaignItem
                    campaign={item}
                    navigation={navigation}
                    compact={compact}
                />
            )}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingBottom: 10,
    },
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    compactCard: {
        marginBottom: 8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        flex: 1,
    },
    statusChip: {
        height: 24,
    },
    statusText: {
        fontSize: 12,
        color: "#fff",
    },
    description: {
        fontSize: 14,
        color: "#666",
        marginBottom: 10,
    },
    detailsContainer: {
        marginTop: 8,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    detailText: {
        fontSize: 14,
        color: "#666",
        marginLeft: 6,
    },
    platformsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
    },
    platformChip: {
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: "#E0E0E0",
    },
    platformText: {
        fontSize: 12,
    },
    loadingContainer: {
        padding: 20,
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    emptyContainer: {
        padding: 20,
        alignItems: "center",
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
});

export default CampaignList;
