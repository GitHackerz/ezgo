import { Feather } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
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
import { colors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

interface ApiError {
	message?: string;
}

export default function LoginScreen({
	navigation,
}: {
	navigation: { navigate: (route: string) => void };
}) {
	const { login, isLoading } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{},
	);

	const validateForm = (): boolean => {
		const newErrors: { email?: string; password?: string } = {};

		if (!email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!password) {
			newErrors.password = "Password is required";
		} else if (password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleLogin = async () => {
		if (!validateForm()) return;

		try {
			await login({ email: email.trim().toLowerCase(), password });
		} catch (error: unknown) {
			let message = "Login failed. Please try again.";
			if (error instanceof AxiosError && error.response?.data) {
				const data = error.response.data as ApiError;
				message = data.message || message;
			}
			Alert.alert("Login Error", message);
		}
	};

	return (
		<ImageBackground
			source={require("../../../assets/bg.png")}
			style={styles.container}
			resizeMode="cover"
		>
			<StatusBar style="light" />
			<View style={styles.overlay} />

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
						<View style={styles.logoContainer}>
							<View style={styles.logoCircle}>
								<Text style={styles.logoIcon}>🚌</Text>
							</View>
						</View>
						<Text style={styles.brandName}>EZGO</Text>
						<Text style={styles.brandTagline}>Smart Mobility for Tunisia</Text>
					</View>

					{/* Form Card */}
					<View style={styles.formCard}>
						<Text style={styles.welcomeTitle}>Welcome Back</Text>
						<Text style={styles.welcomeSubtitle}>
							Sign in to continue your journey
						</Text>

						{/* Email Input */}
						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Email</Text>
							<View
								style={[
									styles.inputContainer,
									errors.email && styles.inputError,
								]}
							>
								<Feather name="mail" size={20} color={colors.text.muted} />
								<TextInput
									style={styles.input}
									placeholder="Enter your email"
									value={email}
									onChangeText={(text) => {
										setEmail(text);
										if (errors.email)
											setErrors({ ...errors, email: undefined });
									}}
									keyboardType="email-address"
									autoCapitalize="none"
									autoCorrect={false}
									placeholderTextColor={colors.text.muted}
								/>
							</View>
							{errors.email && (
								<Text style={styles.errorText}>{errors.email}</Text>
							)}
						</View>

						{/* Password Input */}
						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Password</Text>
							<View
								style={[
									styles.inputContainer,
									errors.password && styles.inputError,
								]}
							>
								<Feather name="lock" size={20} color={colors.text.muted} />
								<TextInput
									style={styles.input}
									placeholder="Enter your password"
									value={password}
									onChangeText={(text) => {
										setPassword(text);
										if (errors.password)
											setErrors({ ...errors, password: undefined });
									}}
									secureTextEntry={!showPassword}
									placeholderTextColor={colors.text.muted}
								/>
								<TouchableOpacity
									onPress={() => setShowPassword(!showPassword)}
								>
									<Feather
										name={showPassword ? "eye" : "eye-off"}
										size={20}
										color={colors.text.muted}
									/>
								</TouchableOpacity>
							</View>
							{errors.password && (
								<Text style={styles.errorText}>{errors.password}</Text>
							)}
						</View>

						{/* Forgot Password */}
						<TouchableOpacity
							style={styles.forgotPassword}
							onPress={() => navigation.navigate("ForgotPassword")}
						>
							<Text style={styles.forgotPasswordText}>Forgot Password?</Text>
						</TouchableOpacity>

						{/* Login Button */}
						<TouchableOpacity
							style={[
								styles.loginButton,
								isLoading && styles.loginButtonDisabled,
							]}
							onPress={handleLogin}
							disabled={isLoading}
						>
							{isLoading ? (
								<ActivityIndicator color={colors.background.DEFAULT} />
							) : (
								<>
									<Text style={styles.loginButtonText}>Sign In</Text>
									<Feather
										name="arrow-right"
										size={20}
										color={colors.background.DEFAULT}
									/>
								</>
							)}
						</TouchableOpacity>

						{/* Divider */}
						<View style={styles.divider}>
							<View style={styles.dividerLine} />
							<Text style={styles.dividerText}>or</Text>
							<View style={styles.dividerLine} />
						</View>

						{/* Social Login */}
						<TouchableOpacity style={styles.socialButton}>
							<Feather
								name="smartphone"
								size={20}
								color={colors.text.primary}
							/>
							<Text style={styles.socialButtonText}>Continue with Phone</Text>
						</TouchableOpacity>

						{/* Sign Up Link */}
						<View style={styles.signUpContainer}>
							<Text style={styles.signUpText}>Don't have an account? </Text>
							<TouchableOpacity onPress={() => navigation.navigate("Register")}>
								<Text style={styles.signUpLink}>Sign Up</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(13, 13, 26, 0.9)",
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 60,
		paddingBottom: 40,
	},
	header: {
		alignItems: "center",
		marginBottom: 32,
	},
	logoContainer: {
		marginBottom: 16,
	},
	logoCircle: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: colors.primary.DEFAULT,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: colors.primary.DEFAULT,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.5,
		shadowRadius: 15,
		elevation: 8,
	},
	logoIcon: {
		fontSize: 36,
	},
	brandName: {
		fontSize: 32,
		fontWeight: "800",
		color: colors.white,
		letterSpacing: 4,
	},
	brandTagline: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: 4,
	},
	formCard: {
		backgroundColor: colors.background.secondary,
		borderRadius: 24,
		padding: 24,
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
	},
	welcomeTitle: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.white,
		marginBottom: 4,
	},
	welcomeSubtitle: {
		fontSize: 14,
		color: colors.text.secondary,
		marginBottom: 24,
	},
	inputGroup: {
		marginBottom: 16,
	},
	inputLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.text.secondary,
		marginBottom: 8,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.background.tertiary,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
	},
	inputError: {
		borderColor: colors.error.DEFAULT,
	},
	input: {
		flex: 1,
		marginLeft: 12,
		fontSize: 16,
		color: colors.white,
	},
	errorText: {
		color: colors.error.DEFAULT,
		fontSize: 12,
		marginTop: 4,
	},
	forgotPassword: {
		alignSelf: "flex-end",
		marginBottom: 24,
	},
	forgotPasswordText: {
		color: colors.primary.DEFAULT,
		fontWeight: "600",
	},
	loginButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.primary.DEFAULT,
		borderRadius: 12,
		paddingVertical: 16,
		gap: 8,
		shadowColor: colors.primary.DEFAULT,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.4,
		shadowRadius: 8,
		elevation: 6,
	},
	loginButtonDisabled: {
		backgroundColor: colors.primary.dark,
		opacity: 0.7,
	},
	loginButtonText: {
		color: colors.background.DEFAULT,
		fontSize: 16,
		fontWeight: "700",
	},
	divider: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 24,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: colors.border.DEFAULT,
	},
	dividerText: {
		color: colors.text.muted,
		marginHorizontal: 16,
	},
	socialButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.background.tertiary,
		borderRadius: 12,
		paddingVertical: 14,
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
		gap: 8,
	},
	socialButtonText: {
		color: colors.text.primary,
		fontSize: 14,
		fontWeight: "600",
	},
	signUpContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 24,
	},
	signUpText: {
		color: colors.text.secondary,
		fontSize: 14,
	},
	signUpLink: {
		color: colors.primary.DEFAULT,
		fontSize: 14,
		fontWeight: "700",
	},
});
