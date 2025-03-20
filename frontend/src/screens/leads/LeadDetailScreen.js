import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Alert,
    Linking,
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
    List,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { getLead, updateLead, deleteLead } from "../../api/leadApi";
import Header from "../../components/common/Header";

const LeadDetailScreen = ({ route, navigation }) => {
    const { leadId } = route.params;
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [statusMenuVisible, setStatusMenuVisible] = useState(false);
    const [error, setError] = useState(null);

    const fetchLeadData = async () => {
        try {
            setError(null);
            const response = await getLead(leadId);
            setLead(response.data);
        } catch (error) {
            console.error("Error fetching lead data:", error);
            setError("Failed to load lead data. Pull down to refresh.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLeadData();
    }, [leadId]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchLeadData();
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await updateLead(leadId, { status: newStatus });
            setLead({ ...lead, status: newStatus });
            setStatusMenuVisible(false);
        } catch (error) {
            console.error("Error updating lead status:", error);
            Alert.alert("Error", "Failed to update lead status");
        }
    };

    const handleDeleteLead = () => {
        Alert.alert(
            "Delete Lead",
            "Are you sure you want to delete this lead? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteLead(leadId);
                            navigation.goBack();
                        } catch (error) {
                            console.error("Error deleting lead:", error);
                            Alert.alert("Error", "Failed to delete lead");
                        }
                    },
                },
            ]
        );
    };

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
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleCall = () => {
        if (lead.phone) {
            Linking.openURL(`tel:${lead.phone}`);
        }
    };

    const handleEmail = () => {
        if (lead.email) {
            Linking.openURL(`mailto:${lead.email}`);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A6FFF" />
                <Text style={styles.loadingText}>Loading lead details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Header title="Lead Details" showBack />
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
                title="Lead Details"
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
                        setStatusMenuVisible(true);
                    }}
                    title="Change Status"
                    icon="flag"
                />
                <Menu.Item
                    onPress={() => {
                        setMenuVisible(false);
                        handleDeleteLead();
                    }}
                    title="Delete Lead"
                    icon="delete"
                />
            </Menu>

            <Menu
                visible={statusMenuVisible}
                onDismiss={() => setStatusMenuVisible(false)}
                anchor={{ x: 0, y: 0 }}
                style={styles.statusMenu}
            >
                <Menu.Item
                    onPress={() => handleStatusChange("new")}
                    title="New"
                    titleStyle={{ color: getStatusColor("new") }}
                />
                <Menu.Item
                    onPress={() => handleStatusChange("contacted")}
                    title="Contacted"
                    titleStyle={{ color: getStatusColor("contacted") }}
                />
                <Menu.Item
                    onPress={() => handleStatusChange("qualified")}
                    title="Qualified"
                    titleStyle={{ color: getStatusColor("qualified") }}
                />
                <Menu.Item
                    onPress={() => handleStatusChange("converted")}
                    title="Converted"
                    titleStyle={{ color: getStatusColor("converted") }}
                />
                <Menu.Item
                    onPress={() => handleStatusChange("disqualified")}
                    title="Disqualified"
                    titleStyle={{ color: getStatusColor("disqualified") }}
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
                            <View style={styles.nameContainer}>
                                <Title style={styles.name}>
                                    {lead.firstName} {lead.lastName}
                                </Title>
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
                        </View>

                        <View style={styles.contactButtons}>
                            <Button
                                mode="contained"
                                icon="email"
                                onPress={handleEmail}
                                style={[
                                    styles.contactButton,
                                    styles.emailButton,
                                ]}
                                disabled={!lead.email}
                            >
                                Email
                            </Button>
                            <Button
                                mode="contained"
                                icon="phone"
                                onPress={handleCall}
                                style={[
                                    styles.contactButton,
                                    styles.callButton,
                                ]}
                                disabled={!lead.phone}
                            >
                                Call
                            </Button>
                        </View>

                        <Divider style={styles.divider} />

                        <List.Section>
                            <List.Item
                                title="Email"
                                description={lead.email}
                                left={() => <List.Icon icon="email-outline" />}
                            />
                            <List.Item
                                title="Phone"
                                description={lead.phone || "Not provided"}
                                left={() => <List.Icon icon="phone-outline" />}
                            />
                            <List.Item
                                title="Created"
                                description={formatDate(lead.createdAt)}
                                left={() => (
                                    <List.Icon icon="calendar-outline" />
                                )}
                            />
                        </List.Section>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>
                            Source Information
                        </Title>

                        <View style={styles.sourceItem}>
                            <Ionicons
                                name={getPlatformIcon(lead.source.platform)}
                                size={24}
                                color="#4A6FFF"
                                style={styles.sourceIcon}
                            />
                            <View style={styles.sourceInfo}>
                                <Text style={styles.sourceLabel}>Platform</Text>
                                <Text style={styles.sourceValue}>
                                    {lead.source.platform
                                        .charAt(0)
                                        .toUpperCase() +
                                        lead.source.platform.slice(1)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.sourceItem}>
                            <Ionicons
                                name="megaphone-outline"
                                size={24}
                                color="#4A6FFF"
                                style={styles.sourceIcon}
                            />
                            <View style={styles.sourceInfo}>
                                <Text style={styles.sourceLabel}>Campaign</Text>
                                <Text style={styles.sourceValue}>
                                    {typeof lead.source.campaign === "object"
                                        ? lead.source.campaign.name
                                        : "Unknown Campaign"}
                                </Text>
                            </View>
                        </View>

                        {lead.source.adCreative && (
                            <View style={styles.sourceItem}>
                                <Ionicons
                                    name="image-outline"
                                    size={24}
                                    color="#4A6FFF"
                                    style={styles.sourceIcon}
                                />
                                <View style={styles.sourceInfo}>
                                    <Text style={styles.sourceLabel}>
                                        Ad Creative
                                    </Text>
                                    <Text style={styles.sourceValue}>
                                        {lead.source.adCreative}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {lead.source.landingPage && (
                            <View style={styles.sourceItem}>
                                <Ionicons
                                    name="globe-outline"
                                    size={24}
                                    color="#4A6FFF"
                                    style={styles.sourceIcon}
                                />
                                <View style={styles.sourceInfo}>
                                    <Text style={styles.sourceLabel}>
                                        Landing Page
                                    </Text>
                                    <Text style={styles.sourceValue}>
                                        {lead.source.landingPage}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </Card.Content>
                </Card>

                {lead.additionalInfo &&
                    Object.keys(lead.additionalInfo).length > 0 && (
                        <Card style={styles.card}>
                            <Card.Content>
                                <Title style={styles.sectionTitle}>
                                    Additional Information
                                </Title>

                                {Object.entries(lead.additionalInfo).map(
                                    ([key, value]) => (
                                        <View
                                            key={key}
                                            style={styles.additionalItem}
                                        >
                                            <Text
                                                style={styles.additionalLabel}
                                            >
                                                {key.charAt(0).toUpperCase() +
                                                    key
                                                        .slice(1)
                                                        .replace(/_/g, " ")}
                                            </Text>
                                            <Text
                                                style={styles.additionalValue}
                                            >
                                                {value}
                                            </Text>
                                        </View>
                                    )
                                )}
                            </Card.Content>
                        </Card>
                    )}

                {lead.notes && (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.sectionTitle}>Notes</Title>
                            <Paragraph style={styles.notes}>
                                {lead.notes}
                            </Paragraph>
                        </Card.Content>
                    </Card>
                )}

                <View style={styles.actionsContainer}>
                    <Button
                        mode="outlined"
                        icon="delete"
                        onPress={handleDeleteLead}
                        style={styles.deleteButton}
                        textColor="#FF5252"
                    >
                        Delete Lead
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
        marginBottom: 16,
    },
    nameContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        fontSize: 20,
        flex: 1,
    },
    statusChip: {
        height: 28,
    },
    statusText: {
        color: "#fff",
    },
    contactButtons: {
        flexDirection: "row",
        marginBottom: 16,
    },
    contactButton: {
        flex: 1,
        marginHorizontal: 4,
    },
    emailButton: {
        backgroundColor: "#4A6FFF",
    },
    callButton: {
        backgroundColor: "#4CAF50",
    },
    divider: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 16,
    },
    sourceItem: {
        flexDirection: "row",
        marginBottom: 16,
    },
    sourceIcon: {
        marginRight: 16,
        marginTop: 2,
    },
    sourceInfo: {
        flex: 1,
    },
    sourceLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    sourceValue: {
        fontSize: 16,
        fontWeight: "500",
    },
    additionalItem: {
        marginBottom: 12,
    },
    additionalLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    additionalValue: {
        fontSize: 16,
    },
    notes: {
        fontSize: 16,
        lineHeight: 24,
    },
    actionsContainer: {
        marginTop: 8,
        marginBottom: 24,
    },
    deleteButton: {
        borderColor: "#FF5252",
    },
    menu: {
        position: "absolute",
        top: 60,
        right: 16,
    },
    statusMenu: {
        position: "absolute",
        top: 60,
        right: 16,
    },
});

export default LeadDetailScreen;
