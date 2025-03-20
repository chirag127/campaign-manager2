import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Header = ({ title, showBack = false, rightComponent, onRightPress }) => {
    const navigation = useNavigation();

    return (
        <Appbar.Header style={styles.header}>
            {showBack ? (
                <Appbar.BackAction
                    onPress={() => navigation.goBack()}
                    color="#fff"
                />
            ) : (
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu-outline" size={24} color="#fff" />
                </TouchableOpacity>
            )}

            <Appbar.Content title={title} titleStyle={styles.title} />

            {rightComponent && (
                <Appbar.Action
                    icon={rightComponent}
                    onPress={onRightPress}
                    color="#fff"
                />
            )}
        </Appbar.Header>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#4A6FFF",
        elevation: 4,
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default Header;
