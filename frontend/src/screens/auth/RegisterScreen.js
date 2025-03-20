import React, { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/AuthContext";

const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    company: Yup.string().required("Company name is required"),
});

const RegisterScreen = ({ navigation }) => {
    const { register } = useContext(AuthContext);
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleRegister = async (values) => {
        const result = await register(
            values.name,
            values.email,
            values.password,
            values.company
        );
        if (!result.success) {
            setErrorMessage(result.message);
            setVisible(true);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>
                    Sign up to start managing your campaigns
                </Text>
            </View>

            <Formik
                initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    company: "",
                }}
                validationSchema={RegisterSchema}
                onSubmit={handleRegister}
            >
                {({ handleChange, handleSubmit, values, errors, touched }) => (
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
                            <Text style={styles.errorText}>{errors.name}</Text>
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
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}

                        <TextInput
                            label="Password"
                            value={values.password}
                            onChangeText={handleChange("password")}
                            style={styles.input}
                            mode="outlined"
                            secureTextEntry
                            error={touched.password && errors.password}
                        />
                        {touched.password && errors.password && (
                            <Text style={styles.errorText}>
                                {errors.password}
                            </Text>
                        )}

                        <TextInput
                            label="Confirm Password"
                            value={values.confirmPassword}
                            onChangeText={handleChange("confirmPassword")}
                            style={styles.input}
                            mode="outlined"
                            secureTextEntry
                            error={
                                touched.confirmPassword &&
                                errors.confirmPassword
                            }
                        />
                        {touched.confirmPassword && errors.confirmPassword && (
                            <Text style={styles.errorText}>
                                {errors.confirmPassword}
                            </Text>
                        )}

                        <TextInput
                            label="Company Name"
                            value={values.company}
                            onChangeText={handleChange("company")}
                            style={styles.input}
                            mode="outlined"
                            error={touched.company && errors.company}
                        />
                        {touched.company && errors.company && (
                            <Text style={styles.errorText}>
                                {errors.company}
                            </Text>
                        )}

                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            style={styles.button}
                            labelStyle={styles.buttonText}
                        >
                            Register
                        </Button>

                        <View style={styles.loginContainer}>
                            <Text>Already have an account? </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Login")}
                            >
                                <Text style={styles.loginText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>

            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                duration={3000}
                action={{
                    label: "Close",
                    onPress: () => setVisible(false),
                }}
            >
                {errorMessage}
            </Snackbar>
        </ScrollView>
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
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
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
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 30,
    },
    loginText: {
        color: "#4A6FFF",
        fontWeight: "bold",
    },
});

export default RegisterScreen;
