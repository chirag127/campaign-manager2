import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const Logo = ({ size = 100, textSize = 24 }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <View style={[styles.circle, { width: size, height: size }]}>
                <Ionicons name="megaphone" size={size * 0.5} color="#FFFFFF" />
            </View>
            {textSize > 0 && (
                <Text style={[styles.text, { fontSize: textSize }]}>
                    Campaign Manager
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    circle: {
        backgroundColor: "#4A6FFF",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        marginTop: 10,
        fontWeight: "bold",
        color: "#4A6FFF",
    },
});

export default Logo;
