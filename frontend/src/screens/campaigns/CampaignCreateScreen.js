import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
    Text,
    TextInput,
    Button,
    Chip,
    HelperText,
    Divider,
    ActivityIndicator,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { createCampaign } from "../../api/campaignApi";
import { getPlatformConnections } from "../../api/platformApi";
import Header from "../../components/common/Header";

const CampaignSchema = Yup.object().shape({
    name: Yup.string().required("Campaign name is required"),
    objective: Yup.string().required("Campaign objective is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
        .required("End date is required")
        .min(Yup.ref("startDate"), "End date must be after start date"),
    budget: Yup.object().shape({
        total: Yup.number()
            .required("Total budget is required")
            .positive("Budget must be positive"),
        daily: Yup.number()
            .nullable()
            .transform((value) => (isNaN(value) ? null : value))
            .positive("Daily budget must be positive"),
        currency: Yup.string().required("Currency is required"),
    }),
    platforms: Yup.array()
        .min(1, "Select at least one platform")
        .required("At least one platform is required"),
});

const CampaignCreateScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [platformsLoading, setPlatformsLoading] = useState(true);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [availablePlatforms, setAvailablePlatforms] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAvailablePlatforms();
    }, []);

    const fetchAvailablePlatforms = async () => {
        try {
            setPlatformsLoading(true);
            const response = await getPlatformConnections();
            setAvailablePlatforms(
                response.data.filter((platform) => platform.connected)
            );
        } catch (error) {
            console.error("Error fetching platforms:", error);
            setError("Failed to load connected platforms");
        } finally {
            setPlatformsLoading(false);
        }
    };

    const handleCreateCampaign = async (values) => {
        try {
            setLoading(true);

            // Format platforms data
            const formattedPlatforms = values.platforms.map((platform) => ({
                name: platform,
                status: "pending",
                budget: values.budget.total / values.platforms.length, // Divide budget equally
            }));

            // Create campaign payload
            const campaignData = {
                ...values,
                status: "draft",
                platforms: formattedPlatforms,
            };

            const response = await createCampaign(campaignData);

            Alert.alert("Success", "Campaign created successfully", [
                {
                    text: "View Campaign",
                    onPress: () =>
                        navigation.replace("CampaignDetail", {
                            campaignId: response.data._id,
                        }),
                },
                {
                    text: "Create Another",
                    onPress: () => navigation.replace("CampaignCreate"),
                },
            ]);
        } catch (error) {
            console.error("Error creating campaign:", error);
            Alert.alert(
                "Error",
                "Failed to create campaign. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const objectives = [
        { value: "awareness", label: "Brand Awareness" },
        { value: "consideration", label: "Consideration" },
        { value: "conversion", label: "Conversion" },
        { value: "traffic", label: "Traffic" },
        { value: "engagement", label: "Engagement" },
        { value: "app_installs", label: "App Installs" },
        { value: "video_views", label: "Video Views" },
        { value: "lead_generation", label: "Lead Generation" },
        { value: "messages", label: "Messages" },
        { value: "sales", label: "Sales" },
    ];

    return (
        <View style={styles.container}>
            <Header title="Create Campaign" showBack />

            <Formik
                initialValues={{
                    name: "",
                    description: "",
                    objective: "",
                    startDate: new Date(),
                    endDate: new Date(
                        new Date().setDate(new Date().getDate() + 30)
                    ),
                    budget: {
                        total: "",
                        daily: "",
                        currency: "USD",
                    },
                    platforms: [],
                }}
                validationSchema={CampaignSchema}
                onSubmit={handleCreateCampaign}
            >
                {({
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    values,
                    errors,
                    touched,
                }) => (
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>
                                Campaign Information
                            </Text>

                            <TextInput
                                label="Campaign Name"
                                value={values.name}
                                onChangeText={handleChange("name")}
                                style={styles.input}
                                mode="outlined"
                                error={touched.name && errors.name}
                            />
                            {touched.name && errors.name && (
                                <HelperText type="error">
                                    {errors.name}
                                </HelperText>
                            )}

                            <TextInput
                                label="Description (Optional)"
                                value={values.description}
                                onChangeText={handleChange("description")}
                                style={styles.input}
                                mode="outlined"
                                multiline
                                numberOfLines={3}
                            />

                            <Text style={styles.inputLabel}>
                                Campaign Objective
                            </Text>
                            <View style={styles.objectivesContainer}>
                                {objectives.map((objective) => (
                                    <Chip
                                        key={objective.value}
                                        selected={
                                            values.objective === objective.value
                                        }
                                        onPress={() =>
                                            setFieldValue(
                                                "objective",
                                                objective.value
                                            )
                                        }
                                        style={styles.objectiveChip}
                                        selectedColor="#4A6FFF"
                                    >
                                        {objective.label}
                                    </Chip>
                                ))}
                            </View>
                            {touched.objective && errors.objective && (
                                <HelperText type="error">
                                    {errors.objective}
                                </HelperText>
                            )}
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>
                                Campaign Schedule
                            </Text>

                            <Text style={styles.inputLabel}>Start Date</Text>
                            <Button
                                mode="outlined"
                                onPress={() => setShowStartDatePicker(true)}
                                style={styles.dateButton}
                                icon="calendar"
                            >
                                {formatDate(values.startDate)}
                            </Button>
                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={values.startDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowStartDatePicker(false);
                                        if (selectedDate) {
                                            setFieldValue(
                                                "startDate",
                                                selectedDate
                                            );
                                        }
                                    }}
                                />
                            )}
                            {touched.startDate && errors.startDate && (
                                <HelperText type="error">
                                    {errors.startDate}
                                </HelperText>
                            )}

                            <Text style={styles.inputLabel}>End Date</Text>
                            <Button
                                mode="outlined"
                                onPress={() => setShowEndDatePicker(true)}
                                style={styles.dateButton}
                                icon="calendar"
                            >
                                {formatDate(values.endDate)}
                            </Button>
                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={values.endDate}
                                    mode="date"
                                    display="default"
                                    minimumDate={values.startDate}
                                    onChange={(event, selectedDate) => {
                                        setShowEndDatePicker(false);
                                        if (selectedDate) {
                                            setFieldValue(
                                                "endDate",
                                                selectedDate
                                            );
                                        }
                                    }}
                                />
                            )}
                            {touched.endDate && errors.endDate && (
                                <HelperText type="error">
                                    {errors.endDate}
                                </HelperText>
                            )}
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>Budget</Text>

                            <TextInput
                                label="Total Budget"
                                value={values.budget.total}
                                onChangeText={handleChange("budget.total")}
                                style={styles.input}
                                mode="outlined"
                                keyboardType="numeric"
                                left={<TextInput.Affix text="$" />}
                                error={
                                    touched.budget?.total &&
                                    errors.budget?.total
                                }
                            />
                            {touched.budget?.total && errors.budget?.total && (
                                <HelperText type="error">
                                    {errors.budget.total}
                                </HelperText>
                            )}

                            <TextInput
                                label="Daily Budget (Optional)"
                                value={values.budget.daily}
                                onChangeText={handleChange("budget.daily")}
                                style={styles.input}
                                mode="outlined"
                                keyboardType="numeric"
                                left={<TextInput.Affix text="$" />}
                                error={
                                    touched.budget?.daily &&
                                    errors.budget?.daily
                                }
                            />
                            {touched.budget?.daily && errors.budget?.daily && (
                                <HelperText type="error">
                                    {errors.budget.daily}
                                </HelperText>
                            )}
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>Platforms</Text>

                            {platformsLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator
                                        size="small"
                                        color="#4A6FFF"
                                    />
                                    <Text style={styles.loadingText}>
                                        Loading connected platforms...
                                    </Text>
                                </View>
                            ) : availablePlatforms.length === 0 ? (
                                <View style={styles.noPlatformsContainer}>
                                    <Ionicons
                                        name="alert-circle-outline"
                                        size={24}
                                        color="#FFC107"
                                    />
                                    <Text style={styles.noPlatformsText}>
                                        No platforms connected. Please connect
                                        to ad platforms in the Platforms tab.
                                    </Text>
                                    <Button
                                        mode="contained"
                                        onPress={() =>
                                            navigation.navigate("Platforms")
                                        }
                                        style={styles.connectButton}
                                    >
                                        Connect Platforms
                                    </Button>
                                </View>
                            ) : (
                                <>
                                    <Text style={styles.inputLabel}>
                                        Select Platforms
                                    </Text>
                                    <View style={styles.platformsContainer}>
                                        {availablePlatforms.map((platform) => (
                                            <Chip
                                                key={platform.platform}
                                                selected={values.platforms.includes(
                                                    platform.platform
                                                )}
                                                onPress={() => {
                                                    const platforms = [
                                                        ...values.platforms,
                                                    ];
                                                    if (
                                                        platforms.includes(
                                                            platform.platform
                                                        )
                                                    ) {
                                                        setFieldValue(
                                                            "platforms",
                                                            platforms.filter(
                                                                (p) =>
                                                                    p !==
                                                                    platform.platform
                                                            )
                                                        );
                                                    } else {
                                                        setFieldValue(
                                                            "platforms",
                                                            [
                                                                ...platforms,
                                                                platform.platform,
                                                            ]
                                                        );
                                                    }
                                                }}
                                                style={styles.platformChip}
                                                selectedColor="#4A6FFF"
                                                icon={() => (
                                                    <Ionicons
                                                        name={`logo-${platform.platform}`}
                                                        size={16}
                                                        color={
                                                            values.platforms.includes(
                                                                platform.platform
                                                            )
                                                                ? "#4A6FFF"
                                                                : "#666"
                                                        }
                                                    />
                                                )}
                                            >
                                                {platform.platform
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    platform.platform.slice(1)}
                                            </Chip>
                                        ))}
                                    </View>
                                    {touched.platforms && errors.platforms && (
                                        <HelperText type="error">
                                            {errors.platforms}
                                        </HelperText>
                                    )}
                                </>
                            )}
                        </View>

                        <View style={styles.buttonsContainer}>
                            <Button
                                mode="outlined"
                                onPress={() => navigation.goBack()}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleSubmit}
                                style={styles.submitButton}
                                loading={loading}
                                disabled={
                                    loading ||
                                    platformsLoading ||
                                    availablePlatforms.length === 0
                                }
                            >
                                Create Campaign
                            </Button>
                        </View>
                    </ScrollView>
                )}
            </Formik>
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
    formSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    input: {
        marginBottom: 8,
        backgroundColor: "#fff",
    },
    inputLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    objectivesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 8,
    },
    objectiveChip: {
        margin: 4,
    },
    dateButton: {
        marginBottom: 16,
        justifyContent: "flex-start",
    },
    platformsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 8,
    },
    platformChip: {
        margin: 4,
    },
    divider: {
        marginVertical: 16,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
        marginBottom: 32,
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
    },
    submitButton: {
        flex: 2,
        marginLeft: 8,
        backgroundColor: "#4A6FFF",
    },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#E3F2FD",
        borderRadius: 8,
    },
    loadingText: {
        marginLeft: 8,
        color: "#666",
    },
    noPlatformsContainer: {
        padding: 16,
        backgroundColor: "#FFF8E1",
        borderRadius: 8,
        alignItems: "center",
    },
    noPlatformsText: {
        marginTop: 8,
        marginBottom: 16,
        textAlign: "center",
        color: "#666",
    },
    connectButton: {
        backgroundColor: "#4A6FFF",
    },
});

export default CampaignCreateScreen;
