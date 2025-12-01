import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ImageBackground,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";
import type { RootStackParamList } from "../../navigation/types";
import api from "../../services/api";

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, "ForgotPassword">;
};

export default function ForgotPasswordScreen({ navigation }: Props) {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isEmailSent, setIsEmailSent] = useState(false);

	const validateEmail = (emailValue: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(emailValue);
	};

	const handleResetPassword = async () => {
		if (!email.trim()) {
			Alert.alert("Error", "Please enter your email address");
			return;
		}

		if (!validateEmail(email)) {
			Alert.alert("Error", "Please enter a valid email address");
			return;
		}

		setIsLoading(true);

		try {
			await api.post("/auth/forgot-password", { email: email.trim() });
			setIsEmailSent(true);
		} catch {
			// Even if the email doesn't exist, we show success for security
			setIsEmailSent(true);
		} finally {
			setIsLoading(false);
		}
	};

	if (isEmailSent) {
		return (
			<ImageBackground
				source={require("../../../assets/bg.png")}
				style={styles.background}
				resizeMode="cover"
			>
				<View style={styles.overlay}>
					<SafeAreaView style={styles.container}>
						<View style={styles.successContainer}>
							<View style={styles.successIconContainer}>
								<Ionicons
									name="mail-outline"
									size={48}
									color={colors.primary.DEFAULT}
								/>
							</View>
							<Text style={styles.successTitle}>Check Your Email</Text>
							<Text style={styles.successText}>
								We've sent a password reset link to{" "}
								<Text style={styles.emailHighlight}>{email}</Text>. Please check
								your inbox and follow the instructions.
							</Text>
							<Text style={styles.spamNote}>
								Didn't receive the email? Check your spam folder or try again.
							</Text>
							<TouchableOpacity
								onPress={() => {
									setIsEmailSent(false);
									setEmail("");
								}}
								style={styles.tryAgainButton}
							>
								<Text style={styles.tryAgainText}>Try another email</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => navigation.navigate("Login")}
								style={styles.backToLoginRow}
							>
								<Ionicons
									name="arrow-back"
									size={20}
									color={colors.primary.DEFAULT}
								/>
								<Text style={styles.backToLoginText}>Back to Login</Text>
							</TouchableOpacity>
						</View>
					</SafeAreaView>
				</View>
			</ImageBackground>
		);
	}

	return (
		<ImageBackground
			source={require("../../../assets/bg.png")}
			style={styles.background}
			resizeMode="cover"
		>
			<View style={styles.overlay}>
				<SafeAreaView style={styles.container}>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={styles.keyboardView}
					>
						<ScrollView
							contentContainerStyle={styles.scrollContent}
							keyboardShouldPersistTaps="handled"
							showsVerticalScrollIndicator={false}
						>
							{/* Header */}
							<View style={styles.header}>
								<TouchableOpacity
									onPress={() => navigation.goBack()}
									style={styles.backButton}
								>
									<Ionicons
										name="arrow-back"
										size={24}
										color={colors.text.primary}
									/>
								</TouchableOpacity>
							</View>

							{/* Content */}
							<View style={styles.content}>
								{/* Icon */}
								<View style={styles.iconSection}>
									<View style={styles.iconContainer}>
										<Ionicons
											name="lock-closed-outline"
											size={48}
											color={colors.primary.DEFAULT}
										/>
									</View>
									<Text style={styles.title}>Forgot Password?</Text>
									<Text style={styles.subtitle}>
										No worries! Enter your email address and we'll send you a
										link to reset your password.
									</Text>
								</View>

								{/* Form */}
								<View style={styles.form}>
									{/* Email Input */}
									<View style={styles.inputGroup}>
										<Text style={styles.label}>Email Address</Text>
										<View style={styles.inputContainer}>
											<Ionicons
												name="mail-outline"
												size={20}
												color={colors.text.muted}
											/>
											<TextInput
												style={styles.input}
												placeholder="Enter your email"
												placeholderTextColor={colors.text.muted}
												value={email}
												onChangeText={setEmail}
												keyboardType="email-address"
												autoCapitalize="none"
												autoComplete="email"
											/>
										</View>
									</View>

									{/* Submit Button */}
									<TouchableOpacity
										onPress={handleResetPassword}
										disabled={isLoading}
										style={[
											styles.submitButton,
											isLoading && styles.submitButtonDisabled,
										]}
									>
										{isLoading ? (
											<ActivityIndicator color="#ffffff" />
										) : (
											<Text style={styles.submitButtonText}>
												Send Reset Link
											</Text>
										)}
									</TouchableOpacity>
								</View>

								{/* Back to Login */}
								<TouchableOpacity
									onPress={() => navigation.navigate("Login")}
									style={styles.backToLoginRow}
								>
									<Ionicons
										name="arrow-back"
										size={20}
										color={colors.primary.DEFAULT}
									/>
									<Text style={styles.backToLoginText}>Back to Login</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</KeyboardAvoidingView>
				</SafeAreaView>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(13, 13, 26, 0.92)",
	},
	container: {
		flex: 1,
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	header: {
		paddingHorizontal: 24,
		paddingTop: 16,
	},
	backButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: colors.background.secondary,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: colors.background.card,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 24,
		paddingBottom: 32,
	},
	iconSection: {
		alignItems: "center",
		marginBottom: 40,
	},
	iconContainer: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: colors.background.secondary,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 24,
		borderWidth: 2,
		borderColor: colors.primary.DEFAULT,
		shadowColor: colors.primary.DEFAULT,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.3,
		shadowRadius: 15,
		elevation: 10,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: colors.text.primary,
		textAlign: "center",
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 15,
		color: colors.text.secondary,
		textAlign: "center",
		paddingHorizontal: 16,
		lineHeight: 22,
	},
	form: {
		marginBottom: 24,
	},
	inputGroup: {
		marginBottom: 24,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.text.secondary,
		marginBottom: 8,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.background.secondary,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: colors.background.card,
		paddingHorizontal: 16,
	},
	input: {
		flex: 1,
		paddingVertical: 16,
		paddingHorizontal: 12,
		fontSize: 16,
		color: colors.text.primary,
	},
	submitButton: {
		backgroundColor: colors.primary.DEFAULT,
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: "center",
		shadowColor: colors.primary.DEFAULT,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	submitButtonDisabled: {
		opacity: 0.7,
	},
	submitButtonText: {
		color: colors.background.DEFAULT,
		fontSize: 16,
		fontWeight: "700",
	},
	backToLoginRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 24,
	},
	backToLoginText: {
		color: colors.primary.DEFAULT,
		fontWeight: "600",
		marginLeft: 6,
		fontSize: 15,
	},
	// Success state styles
	successContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	successIconContainer: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: colors.background.secondary,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 24,
		borderWidth: 2,
		borderColor: "#22c55e",
		shadowColor: "#22c55e",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.3,
		shadowRadius: 15,
		elevation: 10,
	},
	successTitle: {
		fontSize: 28,
		fontWeight: "700",
		color: colors.text.primary,
		textAlign: "center",
		marginBottom: 12,
	},
	successText: {
		fontSize: 15,
		color: colors.text.secondary,
		textAlign: "center",
		paddingHorizontal: 16,
		lineHeight: 22,
		marginBottom: 16,
	},
	emailHighlight: {
		color: colors.primary.DEFAULT,
		fontWeight: "600",
	},
	spamNote: {
		fontSize: 13,
		color: colors.text.muted,
		textAlign: "center",
		marginBottom: 24,
	},
	tryAgainButton: {
		marginBottom: 16,
	},
	tryAgainText: {
		color: colors.primary.DEFAULT,
		fontWeight: "600",
		fontSize: 15,
	},
});
