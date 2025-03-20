import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Card, Title, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const MetricCard = ({ title, value, icon, color, onPress }) => {
    const cardContent = (
        <>
            <Ionicons name={icon} size={28} color={color} style={styles.icon} />
            <Title style={styles.value}>{value}</Title>
            <Text style={styles.title}>{title}</Text>
        </>
    );

    if (onPress) {
        return (
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <Card style={styles.card}>
                    <Card.Content style={styles.content}>
                        {cardContent}
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    }

    return (
        <Card style={[styles.card, styles.container]}>
            <Card.Content style={styles.content}>{cardContent}</Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "48%",
    },
    card: {
        elevation: 2,
    },
    content: {
        alignItems: "center",
        padding: 16,
    },
    icon: {
        marginBottom: 10,
    },
    value: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
    },
    title: {
        fontSize: 14,
        color: "#666",
    },
});

export default MetricCard;
