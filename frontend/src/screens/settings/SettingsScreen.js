import React, { useContext } from "react";
import { View, StyleSheet, ScrollView, Alert, Linking } from "react-native";
import { List, Switch, Divider, Button, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/common/Header";

const SettingsScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);
    const [emailNotifications, setEmailNotifications] = React.useState(true);
    const [pushNotifications, setPushNotifications] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(false);

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                onPress: logout,
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Header title="Settings" />

            <ScrollView style={styles.scrollView}>
                <List.Section>
                    <List.Subheader>Account</List.Subheader>
                    <List.Item
                        title="Profile"
                        description="Edit your personal information"
                        left={(props) => (
                            <List.Icon {...props} icon="account-outline" />
                        )}
                        right={(props) => (
                            <List.Icon {...props} icon="chevron-right" />
                        )}
                        onPress={() => navigation.navigate("Profile")}
                    />
                    <Divider />
                    <List.Item
                        title="Platforms"
                        description="Manage your ad platform connections"
                        left={(props) => (
                            <List.Icon
                                {...props}
                                icon="share-variant-outline"
                            />
                        )}
                        right={(props) => (
                            <List.Icon {...props} icon="chevron-right" />
                        )}
                        onPress={() => navigation.navigate("Platforms")}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>Notifications</List.Subheader>
                    <List.Item
                        title="Email Notifications"
                        description="Receive campaign updates via email"
                        left={(props) => (
                            <List.Icon {...props} icon="email-outline" />
                        )}
                        right={() => (
                            <Switch
                                value={emailNotifications}
                                onValueChange={setEmailNotifications}
                                color="#4A6FFF"
                            />
                        )}
                    />
                    <Divider />
                    <List.Item
                        title="Push Notifications"
                        description="Receive alerts on your device"
                        left={(props) => (
                            <List.Icon {...props} icon="bell-outline" />
                        )}
                        right={() => (
                            <Switch
                                value={pushNotifications}
                                onValueChange={setPushNotifications}
                                color="#4A6FFF"
                            />
                        )}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>Appearance</List.Subheader>
                    <List.Item
                        title="Dark Mode"
                        description="Switch between light and dark themes"
                        left={(props) => (
                            <List.Icon {...props} icon="theme-light-dark" />
                        )}
                        right={() => (
                            <Switch
                                value={darkMode}
                                onValueChange={setDarkMode}
                                color="#4A6FFF"
                            />
                        )}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>Support</List.Subheader>
                    <List.Item
                        title="Help Center"
                        description="Get help with using the app"
                        left={(props) => (
                            <List.Icon {...props} icon="help-circle-outline" />
                        )}
                        right={(props) => (
                            <List.Icon {...props} icon="open-in-new" />
                        )}
                        onPress={() =>
                            Linking.openURL("https://support.example.com")
                        }
                    />
                    <Divider />
                    <List.Item
                        title="Contact Support"
                        description="Email our support team"
                        left={(props) => (
                            <List.Icon {...props} icon="email-outline" />
                        )}
                        right={(props) => (
                            <List.Icon {...props} icon="open-in-new" />
                        )}
                        onPress={() =>
                            Linking.openURL("mailto:support@example.com")
                        }
                    />
                    <Divider />
                    <List.Item
                        title="Report a Bug"
                        description="Let us know about any issues"
                        left={(props) => (
                            <List.Icon {...props} icon="bug-outline" />
                        )}
                        right={(props) => (
                            <List.Icon {...props} icon="open-in-new" />
                        )}
                        onPress={() =>
                            Linking.openURL("mailto:bugs@example.com")
                        }
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>About</List.Subheader>
                    <List.Item
                        title="Terms of Service"
                        left={(props) => (
                            <List.Icon
                                {...props}
                                icon="file-document-outline"
                            />
                        )}
                        right={(props) => (
                            <List.Icon {...props} icon="open-in-new" />
                        )}
                        onPress={() =>
                            Linking.openURL("https://example.com/terms")
                        }
                    />
                    <Divider />
                    <List.Item
                        title="Privacy Policy"
                        left={(props) => (
                            <List.Icon
                                {...props}
                                icon="shield-account-outline"
                            />
                        )}
                        right={(props) => (
                            <List.Icon {...props} icon="open-in-new" />
                        )}
                        onPress={() =>
                            Linking.openURL("https://example.com/privacy")
                        }
                    />
                    <Divider />
                    <List.Item
                        title="App Version"
                        description="1.0.0"
                        left={(props) => (
                            <List.Icon {...props} icon="information-outline" />
                        )}
                    />
                </List.Section>

                <View style={styles.logoutContainer}>
                    <Button
                        mode="outlined"
                        icon="logout"
                        onPress={handleLogout}
                        style={styles.logoutButton}
                        textColor="#FF5252"
                    >
                        Logout
                    </Button>
                </View>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Campaign Manager</Text>
                    <Text style={styles.copyrightText}>
                        © 2023 All Rights Reserved
                    </Text>
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
    },
    logoutContainer: {
        padding: 16,
        marginTop: 16,
    },
    logoutButton: {
        borderColor: "#FF5252",
    },
    footerContainer: {
        alignItems: "center",
        padding: 16,
        marginBottom: 16,
    },
    footerText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    copyrightText: {
        fontSize: 12,
        color: "#666",
    },
});

export default SettingsScreen;
