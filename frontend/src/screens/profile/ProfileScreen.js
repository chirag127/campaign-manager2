import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
    Text,
    TextInput,
    Button,
    Avatar,
    Divider,
    HelperText,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/common/Header";

const ProfileSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    company: Yup.string().required("Company name is required"),
});

const ProfileScreen = ({ navigation }) => {
    const { user, updateProfile } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleUpdateProfile = async (values) => {
        try {
            setLoading(true);
            setSuccess(false);

            const result = await updateProfile(values);

            if (result.success) {
                setSuccess(true);
                Alert.alert("Success", "Profile updated successfully");
            } else {
                Alert.alert(
                    "Error",
                    result.message || "Failed to update profile"
                );
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert("Error", "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Profile" showBack />

            <ScrollView style={styles.scrollView}>
                <View style={styles.avatarContainer}>
                    <Avatar.Text
                        size={80}
                        label={
                            user?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"
                        }
                        style={styles.avatar}
                    />
                </View>

                <Formik
                    initialValues={{
                        name: user?.name || "",
                        email: user?.email || "",
                        company: user?.company || "",
                    }}
                    validationSchema={ProfileSchema}
                    onSubmit={handleUpdateProfile}
                >
                    {({
                        handleChange,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                    }) => (
                        <View style={styles.formContainer}>
                            <TextInput
                                label="Full Name"
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
                                label="Email"
                                value={values.email}
                                onChangeText={handleChange("email")}
                                style={styles.input}
                                mode="outlined"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                error={touched.email && errors.email}
                            />
                            {touched.email && errors.email && (
                                <HelperText type="error">
                                    {errors.email}
                                </HelperText>
                            )}

                            <TextInput
                                label="Company"
                                value={values.company}
                                onChangeText={handleChange("company")}
                                style={styles.input}
                                mode="outlined"
                                error={touched.company && errors.company}
                            />
                            {touched.company && errors.company && (
                                <HelperText type="error">
                                    {errors.company}
                                </HelperText>
                            )}

                            <Button
                                mode="contained"
                                onPress={handleSubmit}
                                style={styles.button}
                                loading={loading}
                                disabled={loading}
                            >
                                Update Profile
                            </Button>

                            {success && (
                                <Text style={styles.successText}>
                                    Profile updated successfully!
                                </Text>
                            )}
                        </View>
                    )}
                </Formik>

                <Divider style={styles.divider} />

                <View style={styles.passwordSection}>
                    <Text style={styles.sectionTitle}>Change Password</Text>

                    <Button
                        mode="outlined"
                        onPress={() =>
                            Alert.alert(
                                "Coming Soon",
                                "Password change functionality will be available soon."
                            )
                        }
                        style={styles.passwordButton}
                    >
                        Change Password
                    </Button>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.dangerSection}>
                    <Text style={styles.sectionTitle}>Danger Zone</Text>

                    <Button
                        mode="outlined"
                        onPress={() =>
                            Alert.alert(
                                "Delete Account",
                                "Are you sure you want to delete your account? This action cannot be undone.",
                                [
                                    { text: "Cancel", style: "cancel" },
                                    {
                                        text: "Delete",
                                        style: "destructive",
                                        onPress: () =>
                                            Alert.alert(
                                                "Coming Soon",
                                                "Account deletion functionality will be available soon."
                                            ),
                                    },
                                ]
                            )
                        }
                        style={styles.deleteButton}
                        textColor="#FF5252"
                    >
                        Delete Account
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
    avatarContainer: {
        alignItems: "center",
        marginVertical: 24,
    },
    avatar: {
        backgroundColor: "#4A6FFF",
    },
    formContainer: {
        marginBottom: 24,
    },
    input: {
        marginBottom: 12,
        backgroundColor: "#fff",
    },
    button: {
        marginTop: 16,
        backgroundColor: "#4A6FFF",
    },
    successText: {
        marginTop: 16,
        color: "#4CAF50",
        textAlign: "center",
        fontSize: 16,
    },
    divider: {
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    passwordSection: {
        marginBottom: 24,
    },
    passwordButton: {
        borderColor: "#4A6FFF",
    },
    dangerSection: {
        marginBottom: 32,
    },
    deleteButton: {
        borderColor: "#FF5252",
    },
});

export default ProfileScreen;
