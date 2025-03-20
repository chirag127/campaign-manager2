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
    Button,
    ActivityIndicator,
    Divider,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import {
    getPlatformConnections,
    disconnectPlatform,
} from "../../api/platformApi";
import { PLATFORM_ENDPOINTS } from "../../api/config";
import Header from "../../components/common/Header";

const PlatformConnectScreen = ({ navigation }) => {
    const [platforms, setPlatforms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchPlatforms = async () => {
        try {
            setError(null);
            const response = await getPlatformConnections();

            // Create a complete list of all platforms
            const allPlatforms = [
                {
                    platform: "facebook",
                    name: "Facebook",
                    icon: "logo-facebook",
                    color: "#1877F2",
                },
                {
                    platform: "google",
                    name: "Google",
                    icon: "logo-google",
                    color: "#DB4437",
                },
                {
                    platform: "linkedin",
                    name: "LinkedIn",
                    icon: "logo-linkedin",
                    color: "#0077B5",
                },
                {
                    platform: "twitter",
                    name: "Twitter (X)",
                    icon: "logo-twitter",
                    color: "#1DA1F2",
                },
                {
                    platform: "snapchat",
                    name: "Snapchat",
                    icon: "logo-snapchat",
                    color: "#FFFC00",
                },
                {
                    platform: "youtube",
                    name: "YouTube",
                    icon: "logo-youtube",
                    color: "#FF0000",
                },
                {
                    platform: "instagram",
                    name: "Instagram",
                    icon: "logo-instagram",
                    color: "#E1306C",
                },
            ];

            // Merge with connected platforms data
            const mergedPlatforms = allPlatforms.map((platform) => {
                const connectedPlatform = response.data.find(
                    (p) => p.platform === platform.platform
                );
                return {
                    ...platform,
                    connected: connectedPlatform ? true : false,
                    accountId: connectedPlatform?.accountId,
                    expiresAt: connectedPlatform?.expiresAt,
                };
            });

            setPlatforms(mergedPlatforms);
        } catch (error) {
            console.error("Error fetching platforms:", error);
            setError(
                "Failed to load platform connections. Pull down to refresh."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPlatforms();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPlatforms();
    };

    const handleConnect = async (platform) => {
        try {
            const platformConfig = PLATFORM_ENDPOINTS[platform.platform];

            if (!platformConfig) {
                Alert.alert(
                    "Error",
                    `Configuration for ${platform.name} is not available.`
                );
                return;
            }

            // Generate a random state parameter for security
            const state = Math.random().toString(36).substring(2, 15);

            // Build the authorization URL
            const authUrl =
                `${platformConfig.authUrl}?` +
                `client_id=${encodeURIComponent(platformConfig.clientId)}` +
                `&redirect_uri=${encodeURIComponent(
                    platformConfig.redirectUri
                )}` +
                `&scope=${encodeURIComponent(platformConfig.scope)}` +
                `&response_type=code` +
                `&state=${state}`;

            // Open the authorization URL in a browser
            const result = await WebBrowser.openAuthSessionAsync(authUrl);

            if (result.type === "success") {
                // Handle the redirect URL
                const { url } = result;

                // Extract the authorization code from the URL
                const code = url.match(/code=([^&]*)/)?.[1];

                if (code) {
                    // The backend will handle the token exchange
                    Alert.alert(
                        "Success",
                        `Connected to ${platform.name}. Please wait while we set up your account.`,
                        [
                            {
                                text: "OK",
                                onPress: () => fetchPlatforms(),
                            },
                        ]
                    );
                } else {
                    Alert.alert("Error", "Failed to get authorization code.");
                }
            }
        } catch (error) {
            console.error(`Error connecting to ${platform.name}:`, error);
            Alert.alert(
                "Error",
                `Failed to connect to ${platform.name}. Please try again.`
            );
        }
    };

    const handleDisconnect = async (platform) => {
        Alert.alert(
            "Disconnect Platform",
            `Are you sure you want to disconnect from ${platform.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Disconnect",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await disconnectPlatform(platform.platform);

                            // Update the local state
                            setPlatforms(
                                platforms.map((p) =>
                                    p.platform === platform.platform
                                        ? {
                                              ...p,
                                              connected: false,
                                              accountId: null,
                                              expiresAt: null,
                                          }
                                        : p
                                )
                            );

                            Alert.alert(
                                "Success",
                                `Disconnected from ${platform.name}.`
                            );
                        } catch (error) {
                            console.error(
                                `Error disconnecting from ${platform.name}:`,
                                error
                            );
                            Alert.alert(
                                "Error",
                                `Failed to disconnect from ${platform.name}. Please try again.`
                            );
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A6FFF" />
                <Text style={styles.loadingText}>Loading platforms...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header title="Ad Platforms" />

            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.infoCard}>
                    <Ionicons
                        name="information-circle-outline"
                        size={24}
                        color="#4A6FFF"
                        style={styles.infoIcon}
                    />
                    <Text style={styles.infoText}>
                        Connect your ad platform accounts to create and manage
                        campaigns across multiple platforms.
                    </Text>
                </View>

                {error && (
                    <View style={styles.errorCard}>
                        <Ionicons
                            name="alert-circle-outline"
                            size={24}
                            color="#FF5252"
                            style={styles.errorIcon}
                        />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {platforms.map((platform) => (
                    <Card key={platform.platform} style={styles.platformCard}>
                        <Card.Content>
                            <View style={styles.platformHeader}>
                                <View style={styles.platformInfo}>
                                    <Ionicons
                                        name={platform.icon}
                                        size={32}
                                        color={platform.color}
                                        style={styles.platformIcon}
                                    />
                                    <View>
                                        <Text style={styles.platformName}>
                                            {platform.name}
                                        </Text>
                                        {platform.connected &&
                                            platform.accountId && (
                                                <Text style={styles.accountId}>
                                                    Account:{" "}
                                                    {platform.accountId}
                                                </Text>
                                            )}
                                    </View>
                                </View>
                                <View
                                    style={[
                                        styles.statusIndicator,
                                        {
                                            backgroundColor: platform.connected
                                                ? "#4CAF50"
                                                : "#9E9E9E",
                                        },
                                    ]}
                                />
                            </View>

                            {platform.connected && (
                                <>
                                    <Divider style={styles.divider} />
                                    <View style={styles.connectionInfo}>
                                        <Text style={styles.connectionLabel}>
                                            Status:
                                        </Text>
                                        <Text style={styles.connectionValue}>
                                            Connected
                                        </Text>
                                    </View>
                                    {platform.expiresAt && (
                                        <View style={styles.connectionInfo}>
                                            <Text
                                                style={styles.connectionLabel}
                                            >
                                                Expires:
                                            </Text>
                                            <Text
                                                style={styles.connectionValue}
                                            >
                                                {formatDate(platform.expiresAt)}
                                            </Text>
                                        </View>
                                    )}
                                </>
                            )}

                            <View style={styles.buttonContainer}>
                                {platform.connected ? (
                                    <Button
                                        mode="outlined"
                                        onPress={() =>
                                            handleDisconnect(platform)
                                        }
                                        style={styles.disconnectButton}
                                        textColor="#FF5252"
                                    >
                                        Disconnect
                                    </Button>
                                ) : (
                                    <Button
                                        mode="contained"
                                        onPress={() => handleConnect(platform)}
                                        style={[
                                            styles.connectButton,
                                            { backgroundColor: platform.color },
                                        ]}
                                    >
                                        Connect
                                    </Button>
                                )}
                            </View>
                        </Card.Content>
                    </Card>
                ))}

                <View style={styles.helpSection}>
                    <Text style={styles.helpTitle}>Need Help?</Text>
                    <Text style={styles.helpText}>
                        To connect your ad accounts, you'll need to have admin
                        access to your advertising accounts on each platform.
                    </Text>
                    <Button
                        mode="text"
                        onPress={() =>
                            Linking.openURL(
                                "https://support.example.com/platform-connections"
                            )
                        }
                        style={styles.helpButton}
                    >
                        View Connection Guide
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
    infoCard: {
        flexDirection: "row",
        backgroundColor: "#E3F2FD",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    infoIcon: {
        marginRight: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: "#333",
        lineHeight: 20,
    },
    errorCard: {
        flexDirection: "row",
        backgroundColor: "#FFEBEE",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    errorIcon: {
        marginRight: 12,
    },
    errorText: {
        flex: 1,
        fontSize: 14,
        color: "#D32F2F",
        lineHeight: 20,
    },
    platformCard: {
        marginBottom: 16,
        elevation: 2,
    },
    platformHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    platformInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    platformIcon: {
        marginRight: 12,
    },
    platformName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    accountId: {
        fontSize: 14,
        color: "#666",
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    divider: {
        marginVertical: 12,
    },
    connectionInfo: {
        flexDirection: "row",
        marginBottom: 8,
    },
    connectionLabel: {
        fontSize: 14,
        color: "#666",
        width: 80,
    },
    connectionValue: {
        fontSize: 14,
        fontWeight: "500",
    },
    buttonContainer: {
        marginTop: 16,
    },
    connectButton: {
        borderRadius: 4,
    },
    disconnectButton: {
        borderColor: "#FF5252",
        borderRadius: 4,
    },
    helpSection: {
        marginTop: 16,
        marginBottom: 32,
        padding: 16,
        backgroundColor: "#FFF",
        borderRadius: 8,
        elevation: 1,
    },
    helpTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    helpText: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        marginBottom: 16,
    },
    helpButton: {
        alignSelf: "flex-start",
    },
});

export default PlatformConnectScreen;
