import React, { useContext } from "react";
import { View, StyleSheet, Image } from "react-native";
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from "@react-navigation/drawer";
import { Text, Divider, Avatar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";

const CustomDrawerContent = (props) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}>
                <View style={styles.profileContainer}>
                    <Avatar.Text
                        size={60}
                        label={
                            user?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"
                        }
                        style={styles.avatar}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>{user?.name || "User"}</Text>
                        <Text style={styles.email}>
                            {user?.email || "user@example.com"}
                        </Text>
                        <Text style={styles.company}>
                            {user?.company || "Company"}
                        </Text>
                    </View>
                </View>

                <Divider style={styles.divider} />

                <DrawerItemList {...props} />

                <Divider style={styles.divider} />

                <DrawerItem
                    label="Profile"
                    icon={({ color, size }) => (
                        <Ionicons
                            name="person-outline"
                            color={color}
                            size={size}
                        />
                    )}
                    onPress={() =>
                        props.navigation.navigate("Settings", {
                            screen: "Profile",
                        })
                    }
                />

                <DrawerItem
                    label="Logout"
                    icon={({ color, size }) => (
                        <Ionicons
                            name="log-out-outline"
                            color={color}
                            size={size}
                        />
                    )}
                    onPress={logout}
                />
            </DrawerContentScrollView>

            <View style={styles.footerContainer}>
                <Text style={styles.version}>Version 1.0.0</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileContainer: {
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        backgroundColor: "#4A6FFF",
    },
    profileInfo: {
        marginLeft: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    email: {
        fontSize: 14,
        color: "#666",
    },
    company: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    divider: {
        marginVertical: 10,
    },
    footerContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
    version: {
        fontSize: 12,
        color: "#999",
        textAlign: "center",
    },
});

export default CustomDrawerContent;
