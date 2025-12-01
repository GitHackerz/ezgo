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

type UserRole = "PASSENGER" | "DRIVER";

interface ApiError {
	message?: string;
}

export default function RegisterScreen({
	navigation,
}: {
	navigation: { navigate: (route: string) => void; goBack: () => void };
}) {
	const { register, isLoading } = useAuth();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [role, setRole] = useState<UserRole>("PASSENGER");
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!firstName.trim()) {
			newErrors.firstName = "First name is required";
		}

		if (!lastName.trim()) {
			newErrors.lastName = "Last name is required";
		}

		if (!email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (phone && !/^\+?[0-9]{8,15}$/.test(phone.replace(/\s/g, ""))) {
			newErrors.phone = "Please enter a valid phone number";
		}

		if (!password) {
			newErrors.password = "Password is required";
		} else if (password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		}

		if (password !== confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleRegister = async () => {
		if (!validateForm()) return;

		try {
			await register({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim().toLowerCase(),
				phone: phone.trim() || undefined,
				password,
				role,
			});
		} catch (error: unknown) {
			let message = "Registration failed. Please try again.";
			if (error instanceof AxiosError && error.response?.data) {
				const data = error.response.data as ApiError;
				message = data.message || message;
			}
			Alert.alert("Registration Error", message);
		}
	};

	const clearError = (field: string) => {
		if (errors[field]) {
			setErrors({ ...errors, [field]: "" });
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
						<TouchableOpacity
							onPress={() => navigation.goBack()}
							style={styles.backButton}
						>
							<Feather name="arrow-left" size={24} color={colors.white} />
						</TouchableOpacity>
						<Text style={styles.headerTitle}>Create Account</Text>
						<Text style={styles.headerSubtitle}>
							Join EZGO and start traveling smarter
						</Text>
					</View>

					{/* Form Card */}
					<View style={styles.formCard}>
						{/* Role Selection */}
						<Text style={styles.sectionLabel}>I am a</Text>
						<View style={styles.roleContainer}>
							<TouchableOpacity
								style={[
									styles.roleButton,
									role === "PASSENGER" && styles.roleButtonActive,
								]}
								onPress={() => setRole("PASSENGER")}
							>
								<Feather
									name="user"
									size={20}
									color={
										role === "PASSENGER"
											? colors.background.DEFAULT
											: colors.text.secondary
									}
								/>
								<Text
									style={[
										styles.roleButtonText,
										role === "PASSENGER" && styles.roleButtonTextActive,
									]}
								>
									Passenger
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.roleButton,
									role === "DRIVER" && styles.roleButtonActive,
								]}
								onPress={() => setRole("DRIVER")}
							>
								<Feather
									name="truck"
									size={20}
									color={
										role === "DRIVER"
											? colors.background.DEFAULT
											: colors.text.secondary
									}
								/>
								<Text
									style={[
										styles.roleButtonText,
										role === "DRIVER" && styles.roleButtonTextActive,
									]}
								>
									Driver
								</Text>
							</TouchableOpacity>
						</View>

						{/* Name Row */}
						<View style={styles.nameRow}>
							<View style={styles.nameField}>
								<Text style={styles.inputLabel}>First Name</Text>
								<View
									style={[
										styles.inputContainer,
										errors.firstName && styles.inputError,
									]}
								>
									<TextInput
										style={styles.inputShort}
										placeholder="First name"
										value={firstName}
										onChangeText={(text) => {
											setFirstName(text);
											clearError("firstName");
										}}
										placeholderTextColor={colors.text.muted}
									/>
								</View>
								{errors.firstName && (
									<Text style={styles.errorText}>{errors.firstName}</Text>
								)}
							</View>
							<View style={styles.nameField}>
								<Text style={styles.inputLabel}>Last Name</Text>
								<View
									style={[
										styles.inputContainer,
										errors.lastName && styles.inputError,
									]}
								>
									<TextInput
										style={styles.inputShort}
										placeholder="Last name"
										value={lastName}
										onChangeText={(text) => {
											setLastName(text);
											clearError("lastName");
										}}
										placeholderTextColor={colors.text.muted}
									/>
								</View>
								{errors.lastName && (
									<Text style={styles.errorText}>{errors.lastName}</Text>
								)}
							</View>
						</View>

						{/* Email */}
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
										clearError("email");
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

						{/* Phone */}
						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Phone (Optional)</Text>
							<View
								style={[
									styles.inputContainer,
									errors.phone && styles.inputError,
								]}
							>
								<Feather name="phone" size={20} color={colors.text.muted} />
								<TextInput
									style={styles.input}
									placeholder="+216 XX XXX XXX"
									value={phone}
									onChangeText={(text) => {
										setPhone(text);
										clearError("phone");
									}}
									keyboardType="phone-pad"
									placeholderTextColor={colors.text.muted}
								/>
							</View>
							{errors.phone && (
								<Text style={styles.errorText}>{errors.phone}</Text>
							)}
						</View>

						{/* Password */}
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
									placeholder="Create a password"
									value={password}
									onChangeText={(text) => {
										setPassword(text);
										clearError("password");
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

						{/* Confirm Password */}
						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Confirm Password</Text>
							<View
								style={[
									styles.inputContainer,
									errors.confirmPassword && styles.inputError,
								]}
							>
								<Feather name="lock" size={20} color={colors.text.muted} />
								<TextInput
									style={styles.input}
									placeholder="Confirm your password"
									value={confirmPassword}
									onChangeText={(text) => {
										setConfirmPassword(text);
										clearError("confirmPassword");
									}}
									secureTextEntry={!showPassword}
									placeholderTextColor={colors.text.muted}
								/>
							</View>
							{errors.confirmPassword && (
								<Text style={styles.errorText}>{errors.confirmPassword}</Text>
							)}
						</View>

						{/* Terms */}
						<Text style={styles.termsText}>
							By signing up, you agree to our{" "}
							<Text style={styles.termsLink}>Terms of Service</Text> and{" "}
							<Text style={styles.termsLink}>Privacy Policy</Text>
						</Text>

						{/* Register Button */}
						<TouchableOpacity
							style={[
								styles.registerButton,
								isLoading && styles.registerButtonDisabled,
							]}
							onPress={handleRegister}
							disabled={isLoading}
						>
							{isLoading ? (
								<ActivityIndicator color={colors.background.DEFAULT} />
							) : (
								<>
									<Text style={styles.registerButtonText}>Create Account</Text>
									<Feather
										name="arrow-right"
										size={20}
										color={colors.background.DEFAULT}
									/>
								</>
							)}
						</TouchableOpacity>

						{/* Sign In Link */}
						<View style={styles.signInContainer}>
							<Text style={styles.signInText}>Already have an account? </Text>
							<TouchableOpacity onPress={() => navigation.navigate("Login")}>
								<Text style={styles.signInLink}>Sign In</Text>
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
		backgroundColor: "rgba(13, 13, 26, 0.92)",
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 50,
		paddingBottom: 40,
	},
	header: {
		marginBottom: 24,
	},
	backButton: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "700",
		color: colors.white,
	},
	headerSubtitle: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: 4,
	},
	formCard: {
		backgroundColor: colors.background.secondary,
		borderRadius: 24,
		padding: 20,
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
	},
	sectionLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.text.secondary,
		marginBottom: 12,
	},
	roleContainer: {
		flexDirection: "row",
		marginBottom: 20,
		gap: 12,
	},
	roleButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 14,
		borderRadius: 12,
		backgroundColor: colors.background.tertiary,
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
		gap: 8,
	},
	roleButtonActive: {
		backgroundColor: colors.primary.DEFAULT,
		borderColor: colors.primary.DEFAULT,
	},
	roleButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.text.secondary,
	},
	roleButtonTextActive: {
		color: colors.background.DEFAULT,
	},
	nameRow: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 16,
	},
	nameField: {
		flex: 1,
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
	inputShort: {
		flex: 1,
		fontSize: 16,
		color: colors.white,
	},
	errorText: {
		color: colors.error.DEFAULT,
		fontSize: 12,
		marginTop: 4,
	},
	termsText: {
		fontSize: 12,
		color: colors.text.muted,
		textAlign: "center",
		marginBottom: 20,
		lineHeight: 18,
	},
	termsLink: {
		color: colors.primary.DEFAULT,
	},
	registerButton: {
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
	registerButtonDisabled: {
		backgroundColor: colors.primary.dark,
		opacity: 0.7,
	},
	registerButtonText: {
		color: colors.background.DEFAULT,
		fontSize: 16,
		fontWeight: "700",
	},
	signInContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 20,
	},
	signInText: {
		color: colors.text.secondary,
		fontSize: 14,
	},
	signInLink: {
		color: colors.primary.DEFAULT,
		fontSize: 14,
		fontWeight: "700",
	},
});
