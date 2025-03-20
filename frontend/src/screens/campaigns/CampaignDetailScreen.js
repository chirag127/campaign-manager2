import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Alert,
} from "react-native";
import {
    Text,
    Card,
    Title,
    Paragraph,
    Button,
    Chip,
    Divider,
    ActivityIndicator,
    Menu,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import {
    getCampaign,
    getCampaignMetrics,
    deleteCampaign,
    updateCampaign,
} from "../../api/campaignApi";
import { getLeadsByCampaign } from "../../api/leadApi";
import Header from "../../components/common/Header";
import LeadList from "../../components/leads/LeadList";
import PlatformMetricsCard from "../../components/campaigns/PlatformMetricsCard";

const CampaignDetailScreen = ({ route, navigation }) => {
    const { campaignId } = route.params;
    const [campaign, setCampaign] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [error, setError] = useState(null);

    const fetchCampaignData = async () => {
        try {
            setError(null);

            // Fetch campaign details
            const campaignResponse = await getCampaign(campaignId);
            setCampaign(campaignResponse.data);

            // Fetch campaign metrics
            const metricsResponse = await getCampaignMetrics(campaignId);
            setMetrics(metricsResponse.data);

            // Fetch campaign leads
            const leadsResponse = await getLeadsByCampaign(campaignId);
            setLeads(leadsResponse.data);
        } catch (error) {
            console.error("Error fetching campaign data:", error);
            setError("Failed to load campaign data. Pull down to refresh.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCampaignData();
    }, [campaignId]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCampaignData();
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await updateCampaign(campaignId, { status: newStatus });
            setCampaign({ ...campaign, status: newStatus });
        } catch (error) {
            console.error("Error updating campaign status:", error);
            Alert.alert("Error", "Failed to update campaign status");
        }
    };

    const handleDeleteCampaign = () => {
        Alert.alert(
            "Delete Campaign",
            "Are you sure you want to delete this campaign? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteCampaign(campaignId);
                            navigation.goBack();
                        } catch (error) {
                            console.error("Error deleting campaign:", error);
                            Alert.alert("Error", "Failed to delete campaign");
                        }
                    },
                },
            ]
        );
    };

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
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A6FFF" />
                <Text style={styles.loadingText}>
                    Loading campaign details...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Header title="Campaign Details" showBack />
                <View style={styles.errorContainer}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={48}
                        color="#FF5252"
                    />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title="Campaign Details"
                showBack
                rightComponent="more-vertical"
                onRightPress={() => setMenuVisible(true)}
            />

            <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={{ x: 0, y: 0 }}
                style={styles.menu}
            >
                <Menu.Item
                    onPress={() => {
                        setMenuVisible(false);
                        navigation.navigate("CampaignEdit", { campaignId });
                    }}
                    title="Edit Campaign"
                    icon="pencil"
                />
                <Menu.Item
                    onPress={() => {
                        setMenuVisible(false);
                        handleDeleteCampaign();
                    }}
                    title="Delete Campaign"
                    icon="delete"
                />
            </Menu>

            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.header}>
                            <Title style={styles.title}>{campaign.name}</Title>
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

                        <Paragraph style={styles.description}>
                            {campaign.description || "No description provided."}
                        </Paragraph>

                        <View style={styles.detailsContainer}>
                            <View style={styles.detailRow}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>
                                        Start Date
                                    </Text>
                                    <Text style={styles.detailValue}>
                                        {formatDate(campaign.startDate)}
                                    </Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>
                                        End Date
                                    </Text>
                                    <Text style={styles.detailValue}>
                                        {formatDate(campaign.endDate)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>
                                        Total Budget
                                    </Text>
                                    <Text style={styles.detailValue}>
                                        $
                                        {campaign.budget?.total?.toLocaleString() ||
                                            "0"}
                                    </Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>
                                        Daily Budget
                                    </Text>
                                    <Text style={styles.detailValue}>
                                        $
                                        {campaign.budget?.daily?.toLocaleString() ||
                                            "N/A"}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>
                                        Objective
                                    </Text>
                                    <Text style={styles.detailValue}>
                                        {campaign.objective
                                            .charAt(0)
                                            .toUpperCase() +
                                            campaign.objective
                                                .slice(1)
                                                .replace("_", " ")}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>
                            Performance Overview
                        </Title>

                        {metrics ? (
                            <View style={styles.metricsContainer}>
                                <View style={styles.metricRow}>
                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricValue}>
                                            {metrics.totalMetrics.impressions.toLocaleString()}
                                        </Text>
                                        <Text style={styles.metricLabel}>
                                            Impressions
                                        </Text>
                                    </View>
                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricValue}>
                                            {metrics.totalMetrics.clicks.toLocaleString()}
                                        </Text>
                                        <Text style={styles.metricLabel}>
                                            Clicks
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.metricRow}>
                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricValue}>
                                            {metrics.totalMetrics.conversions.toLocaleString()}
                                        </Text>
                                        <Text style={styles.metricLabel}>
                                            Conversions
                                        </Text>
                                    </View>
                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricValue}>
                                            $
                                            {metrics.totalMetrics.spend.toFixed(
                                                2
                                            )}
                                        </Text>
                                        <Text style={styles.metricLabel}>
                                            Spend
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.metricRow}>
                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricValue}>
                                            {metrics.totalMetrics.ctr.toFixed(
                                                2
                                            )}
                                            %
                                        </Text>
                                        <Text style={styles.metricLabel}>
                                            CTR
                                        </Text>
                                    </View>
                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricValue}>
                                            $
                                            {metrics.totalMetrics.cpc.toFixed(
                                                2
                                            )}
                                        </Text>
                                        <Text style={styles.metricLabel}>
                                            CPC
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.noMetricsContainer}>
                                <Ionicons
                                    name="analytics-outline"
                                    size={48}
                                    color="#9E9E9E"
                                />
                                <Text style={styles.noMetricsText}>
                                    No metrics available yet
                                </Text>
                            </View>
                        )}
                    </Card.Content>
                </Card>

                {campaign.platforms && campaign.platforms.length > 0 && (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.sectionTitle}>
                                Platform Performance
                            </Title>

                            {campaign.platforms.map((platform, index) => (
                                <PlatformMetricsCard
                                    key={index}
                                    platform={platform}
                                    style={
                                        index < campaign.platforms.length - 1
                                            ? styles.platformCard
                                            : null
                                    }
                                />
                            ))}
                        </Card.Content>
                    </Card>
                )}

                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.sectionHeader}>
                            <Title style={styles.sectionTitle}>
                                Leads ({leads.length})
                            </Title>
                            <Button
                                mode="text"
                                onPress={() => navigation.navigate("Leads")}
                                labelStyle={styles.viewAllButton}
                            >
                                View All
                            </Button>
                        </View>

                        <LeadList
                            leads={leads.slice(0, 5)}
                            navigation={navigation}
                            isLoading={false}
                        />

                        {leads.length === 0 && (
                            <View style={styles.noLeadsContainer}>
                                <Ionicons
                                    name="people-outline"
                                    size={48}
                                    color="#9E9E9E"
                                />
                                <Text style={styles.noLeadsText}>
                                    No leads generated yet
                                </Text>
                            </View>
                        )}
                    </Card.Content>
                </Card>

                <View style={styles.actionsContainer}>
                    <Text style={styles.actionsTitle}>Campaign Actions</Text>

                    <View style={styles.buttonRow}>
                        <Button
                            mode="contained"
                            icon="pencil"
                            onPress={() =>
                                navigation.navigate("CampaignEdit", {
                                    campaignId,
                                })
                            }
                            style={[styles.actionButton, styles.editButton]}
                        >
                            Edit
                        </Button>

                        {campaign.status === "active" ? (
                            <Button
                                mode="contained"
                                icon="pause"
                                onPress={() => handleStatusChange("paused")}
                                style={[
                                    styles.actionButton,
                                    styles.pauseButton,
                                ]}
                            >
                                Pause
                            </Button>
                        ) : campaign.status === "paused" ||
                          campaign.status === "draft" ? (
                            <Button
                                mode="contained"
                                icon="play"
                                onPress={() => handleStatusChange("active")}
                                style={[
                                    styles.actionButton,
                                    styles.activateButton,
                                ]}
                            >
                                Activate
                            </Button>
                        ) : null}
                    </View>

                    <Button
                        mode="outlined"
                        icon="delete"
                        onPress={handleDeleteCampaign}
                        style={styles.deleteButton}
                        textColor="#FF5252"
                    >
                        Delete Campaign
                    </Button>
                </View>
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
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        textAlign: "center",
        color: "#FF5252",
    },
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    title: {
        flex: 1,
        fontSize: 20,
    },
    statusChip: {
        height: 28,
    },
    statusText: {
        color: "#fff",
    },
    description: {
        marginBottom: 16,
        color: "#666",
    },
    detailsContainer: {
        marginTop: 8,
    },
    detailRow: {
        flexDirection: "row",
        marginBottom: 12,
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: "500",
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    viewAllButton: {
        color: "#4A6FFF",
    },
    metricsContainer: {
        marginBottom: 8,
    },
    metricRow: {
        flexDirection: "row",
        marginBottom: 16,
    },
    metricItem: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#F0F2F5",
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 4,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    metricLabel: {
        fontSize: 14,
        color: "#666",
    },
    noMetricsContainer: {
        alignItems: "center",
        padding: 20,
    },
    noMetricsText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    platformCard: {
        marginBottom: 12,
    },
    noLeadsContainer: {
        alignItems: "center",
        padding: 20,
    },
    noLeadsText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    actionsContainer: {
        marginTop: 8,
        marginBottom: 24,
    },
    actionsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: "row",
        marginBottom: 16,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 4,
    },
    editButton: {
        backgroundColor: "#4A6FFF",
    },
    pauseButton: {
        backgroundColor: "#FFC107",
    },
    activateButton: {
        backgroundColor: "#4CAF50",
    },
    deleteButton: {
        borderColor: "#FF5252",
    },
    menu: {
        position: "absolute",
        top: 60,
        right: 16,
    },
});

export default CampaignDetailScreen;
