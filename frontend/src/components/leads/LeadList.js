import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import {
    Card,
    Text,
    Chip,
    Avatar,
    ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const LeadItem = ({ lead, navigation, compact }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "new":
                return "#4A6FFF";
            case "contacted":
                return "#FFC107";
            case "qualified":
                return "#4CAF50";
            case "converted":
                return "#2196F3";
            case "disqualified":
                return "#FF5252";
            default:
                return "#9E9E9E";
        }
    };

    const getPlatformIcon = (platform) => {
        switch (platform) {
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
                navigation.navigate("LeadDetail", { leadId: lead._id })
            }
        >
            <Card style={[styles.card, compact && styles.compactCard]}>
                <Card.Content>
                    <View style={styles.header}>
                        <View style={styles.leadInfo}>
                            <Avatar.Text
                                size={compact ? 36 : 40}
                                label={`${lead.firstName.charAt(0)}${
                                    lead.lastName ? lead.lastName.charAt(0) : ""
                                }`}
                                style={[
                                    styles.avatar,
                                    {
                                        backgroundColor: getStatusColor(
                                            lead.status
                                        ),
                                    },
                                ]}
                            />
                            <View style={styles.nameContainer}>
                                <Text style={styles.name}>
                                    {lead.firstName} {lead.lastName}
                                </Text>
                                {!compact && (
                                    <Text style={styles.email}>
                                        {lead.email}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <Chip
                            style={[
                                styles.statusChip,
                                {
                                    backgroundColor: getStatusColor(
                                        lead.status
                                    ),
                                },
                            ]}
                            textStyle={styles.statusText}
                        >
                            {lead.status.charAt(0).toUpperCase() +
                                lead.status.slice(1)}
                        </Chip>
                    </View>

                    {!compact && (
                        <View style={styles.detailsContainer}>
                            {lead.phone && (
                                <View style={styles.detailItem}>
                                    <Ionicons
                                        name="call-outline"
                                        size={16}
                                        color="#666"
                                    />
                                    <Text style={styles.detailText}>
                                        {lead.phone}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.detailItem}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={16}
                                    color="#666"
                                />
                                <Text style={styles.detailText}>
                                    {formatDate(lead.createdAt)}
                                </Text>
                            </View>

                            <View style={styles.detailItem}>
                                <Ionicons
                                    name={getPlatformIcon(lead.source.platform)}
                                    size={16}
                                    color="#666"
                                />
                                <Text style={styles.detailText}>
                                    {lead.source.platform
                                        .charAt(0)
                                        .toUpperCase() +
                                        lead.source.platform.slice(1)}
                                </Text>
                            </View>

                            {lead.source.campaign && (
                                <View style={styles.detailItem}>
                                    <Ionicons
                                        name="megaphone-outline"
                                        size={16}
                                        color="#666"
                                    />
                                    <Text style={styles.detailText}>
                                        {typeof lead.source.campaign ===
                                        "object"
                                            ? lead.source.campaign.name
                                            : "Campaign"}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

const LeadList = ({ leads, navigation, isLoading, compact = false }) => {
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A6FFF" />
                <Text style={styles.loadingText}>Loading leads...</Text>
            </View>
        );
    }

    if (!leads || leads.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={48} color="#9E9E9E" />
                <Text style={styles.emptyText}>No leads found</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={leads}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <LeadItem
                    lead={item}
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
    },
    leadInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    avatar: {
        marginRight: 12,
    },
    nameContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    email: {
        fontSize: 14,
        color: "#666",
    },
    statusChip: {
        height: 24,
    },
    statusText: {
        fontSize: 12,
        color: "#fff",
    },
    detailsContainer: {
        marginTop: 12,
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

export default LeadList;
