import React, { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/AuthContext";

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

const LoginScreen = ({ navigation }) => {
    const { login } = useContext(AuthContext);
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (values) => {
        const result = await login(values.email, values.password);
        if (!result.success) {
            setErrorMessage(result.message);
            setVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Campaign Manager</Text>
                <Text style={styles.subtitle}>
                    Manage all your ad campaigns in one place
                </Text>
            </View>

            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
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

                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("ForgotPassword")
                            }
                            style={styles.forgotPassword}
                        >
                            <Text style={styles.forgotPasswordText}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>

                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            style={styles.button}
                            labelStyle={styles.buttonText}
                        >
                            Login
                        </Button>

                        <View style={styles.registerContainer}>
                            <Text>Don't have an account? </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Register")}
                            >
                                <Text style={styles.registerText}>
                                    Register
                                </Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
        padding: 20,
    },
    logoContainer: {
        alignItems: "center",
        marginTop: 60,
        marginBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
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
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: "#4A6FFF",
    },
    button: {
        marginBottom: 20,
        paddingVertical: 8,
        backgroundColor: "#4A6FFF",
    },
    buttonText: {
        fontSize: 16,
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    registerText: {
        color: "#4A6FFF",
        fontWeight: "bold",
    },
});

export default LoginScreen;
