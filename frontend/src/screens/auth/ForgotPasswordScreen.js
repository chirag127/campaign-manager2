import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";

const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPasswordScreen = ({ navigation }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleForgotPassword = async (values) => {
        try {
            // This would be replaced with an actual API call
            // For now, we'll just simulate a successful response
            setMessage(
                "Password reset instructions have been sent to your email."
            );
            setIsSuccess(true);
            setVisible(true);
        } catch (error) {
            setMessage("Failed to send reset instructions. Please try again.");
            setIsSuccess(false);
            setVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>
                    Enter your email address and we'll send you instructions to
                    reset your password.
                </Text>
            </View>

            <Formik
                initialValues={{ email: "" }}
                validationSchema={ForgotPasswordSchema}
                onSubmit={handleForgotPassword}
            >
                {({ handleChange, handleSubmit, values, errors, touched }) => (
                    <View style={styles.formContainer}>
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
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}

                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            style={styles.button}
                            labelStyle={styles.buttonText}
                        >
                            Send Instructions
                        </Button>

                        <TouchableOpacity
                            onPress={() => navigation.navigate("Login")}
                            style={styles.backToLogin}
                        >
                            <Text style={styles.backToLoginText}>
                                Back to Login
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>

            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                duration={3000}
                style={
                    isSuccess ? styles.successSnackbar : styles.errorSnackbar
                }
                action={{
                    label: "Close",
                    onPress: () => setVisible(false),
                }}
            >
                {message}
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
        padding: 20,
    },
    headerContainer: {
        marginTop: 60,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        lineHeight: 22,
    },
    formContainer: {
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    errorText: {
        color: "#FF5252",
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 5,
    },
    button: {
        marginTop: 10,
        marginBottom: 20,
        paddingVertical: 8,
        backgroundColor: "#4A6FFF",
    },
    buttonText: {
        fontSize: 16,
    },
    backToLogin: {
        alignItems: "center",
        marginTop: 10,
    },
    backToLoginText: {
        color: "#4A6FFF",
        fontSize: 16,
    },
    successSnackbar: {
        backgroundColor: "#4CAF50",
    },
    errorSnackbar: {
        backgroundColor: "#FF5252",
    },
});

export default ForgotPasswordScreen;
