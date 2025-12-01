import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
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
import { borderRadius, colors, shadows } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import type { RootStackParamList } from "../navigation/types";
import userService from "../services/userService";

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, "EditProfile">;
};

export default function EditProfileScreen({ navigation }: Props) {
	const { user, refreshUser } = useAuth();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phone, setPhone] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	useEffect(() => {
		if (user) {
			setFirstName(user.firstName || "");
			setLastName(user.lastName || "");
			setPhone(user.phone || "");
		}
	}, [user]);

	useEffect(() => {
		const changed =
			firstName !== (user?.firstName || "") ||
			lastName !== (user?.lastName || "") ||
			phone !== (user?.phone || "");
		setHasChanges(changed);
	}, [firstName, lastName, phone, user]);

	const handleSave = async () => {
		if (!hasChanges) {
			navigation.goBack();
			return;
		}

		try {
			setIsSaving(true);
			await userService.updateProfile({
				firstName,
				lastName,
				phone: phone || undefined,
			});

			if (refreshUser) {
				await refreshUser();
			}

			Alert.alert("Success", "Profile updated successfully", [
				{
					text: "OK",
					onPress: () => navigation.goBack(),
				},
			]);
		} catch (error) {
			console.error("Failed to update profile:", error);
			Alert.alert("Error", "Failed to update profile. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const getUserInitials = () => {
		const first = firstName?.[0] || user?.firstName?.[0] || "";
		const last = lastName?.[0] || user?.lastName?.[0] || "";
		return `${first}${last}`.toUpperCase() || "?";
	};

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardView}
			>
				<ScrollView
					style={styles.scrollView}
					showsVerticalScrollIndicator={false}
				>
					{/* Header */}
					<View style={styles.header}>
						<View style={styles.headerActions}>
							<TouchableOpacity
								onPress={() => navigation.goBack()}
								style={styles.cancelButton}
							>
								<Feather
									name="arrow-left"
									size={24}
									color={colors.text.primary}
								/>
								<Text style={styles.cancelText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handleSave}
								disabled={isSaving || !hasChanges}
								style={[
									styles.saveButton,
									!hasChanges && styles.saveButtonDisabled,
								]}
							>
								{isSaving ? (
									<ActivityIndicator size="small" color={colors.text.inverse} />
								) : (
									<Text
										style={[
											styles.saveText,
											!hasChanges && styles.saveTextDisabled,
										]}
									>
										Save
									</Text>
								)}
							</TouchableOpacity>
						</View>

						{/* Avatar */}
						<View style={styles.avatarContainer}>
							{user?.avatar ? (
								<Image source={{ uri: user.avatar }} style={styles.avatar} />
							) : (
								<View style={styles.avatarPlaceholder}>
									<Text style={styles.avatarInitials}>{getUserInitials()}</Text>
								</View>
							)}
							<TouchableOpacity style={styles.changePhotoButton}>
								<Feather
									name="camera"
									size={16}
									color={colors.primary.DEFAULT}
								/>
								<Text style={styles.changePhotoText}>Change Photo</Text>
							</TouchableOpacity>
						</View>
					</View>

					{/* Form */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Personal Information</Text>

						{/* First Name */}
						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>First Name</Text>
							<View style={styles.inputContainer}>
								<Feather name="user" size={20} color={colors.text.secondary} />
								<TextInput
									style={styles.input}
									placeholder="Enter first name"
									value={firstName}
									onChangeText={setFirstName}
									placeholderTextColor={colors.text.muted}
								/>
							</View>
						</View>

						{/* Last Name */}
						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Last Name</Text>
							<View style={styles.inputContainer}>
								<Feather name="user" size={20} color={colors.text.secondary} />
								<TextInput
									style={styles.input}
									placeholder="Enter last name"
									value={lastName}
									onChangeText={setLastName}
									placeholderTextColor={colors.text.muted}
								/>
							</View>
						</View>

						{/* Email (read-only) */}
						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Email</Text>
							<View style={styles.inputContainerDisabled}>
								<Feather name="mail" size={20} color={colors.text.muted} />
								<Text style={styles.inputDisabled}>{user?.email}</Text>
								<Feather name="lock" size={16} color={colors.text.muted} />
							</View>
							<Text style={styles.inputHint}>Email cannot be changed</Text>
						</View>

						{/* Phone */}
						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Phone Number</Text>
							<View style={styles.inputContainer}>
								<Feather name="phone" size={20} color={colors.text.secondary} />
								<TextInput
									style={styles.input}
									placeholder="+216 XX XXX XXX"
									value={phone}
									onChangeText={setPhone}
									keyboardType="phone-pad"
									placeholderTextColor={colors.text.muted}
								/>
							</View>
						</View>
					</View>

					{/* Account Actions */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Account</Text>

						<TouchableOpacity
							style={styles.accountOption}
							onPress={() => navigation.navigate("Settings")}
						>
							<View style={styles.accountOptionContent}>
								<View style={styles.accountOptionIcon}>
									<Feather
										name="lock"
										size={20}
										color={colors.primary.DEFAULT}
									/>
								</View>
								<Text style={styles.accountOptionText}>Change Password</Text>
							</View>
							<Feather
								name="chevron-right"
								size={20}
								color={colors.text.muted}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.deleteButton}
							onPress={() =>
								Alert.alert(
									"Delete Account",
									"Are you sure you want to delete your account? This action cannot be undone.",
									[
										{ text: "Cancel", style: "cancel" },
										{
											text: "Delete",
											style: "destructive",
											onPress: () => {
												// Handle account deletion
											},
										},
									],
								)
							}
						>
							<Feather name="trash-2" size={20} color={colors.error.DEFAULT} />
							<Text style={styles.deleteButtonText}>Delete Account</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.bottomSpacer} />
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
	},
	keyboardView: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	header: {
		backgroundColor: colors.background.secondary,
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 32,
	},
	headerActions: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 24,
	},
	cancelButton: {
		flexDirection: "row",
		alignItems: "center",
	},
	cancelText: {
		color: colors.text.primary,
		fontSize: 16,
		marginLeft: 8,
	},
	saveButton: {
		backgroundColor: colors.primary.DEFAULT,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: borderRadius.lg,
	},
	saveButtonDisabled: {
		backgroundColor: colors.background.tertiary,
	},
	saveText: {
		color: colors.text.inverse,
		fontWeight: "600",
	},
	saveTextDisabled: {
		color: colors.text.muted,
	},
	avatarContainer: {
		alignItems: "center",
	},
	avatar: {
		width: 96,
		height: 96,
		borderRadius: 48,
	},
	avatarPlaceholder: {
		backgroundColor: colors.primary.DEFAULT,
		borderRadius: 48,
		width: 96,
		height: 96,
		alignItems: "center",
		justifyContent: "center",
	},
	avatarInitials: {
		fontSize: 36,
		fontWeight: "bold",
		color: colors.text.inverse,
	},
	changePhotoButton: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 12,
		backgroundColor: colors.primary.DEFAULT + "20",
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: borderRadius.full,
	},
	changePhotoText: {
		color: colors.primary.DEFAULT,
		fontWeight: "500",
		marginLeft: 8,
	},
	section: {
		paddingHorizontal: 20,
		marginTop: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: colors.text.primary,
		marginBottom: 16,
	},
	inputGroup: {
		marginBottom: 16,
	},
	inputLabel: {
		color: colors.text.secondary,
		fontSize: 14,
		marginBottom: 8,
	},
	inputContainer: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
	},
	input: {
		flex: 1,
		marginLeft: 12,
		color: colors.text.primary,
		fontSize: 16,
	},
	inputContainerDisabled: {
		backgroundColor: colors.background.tertiary,
		borderRadius: borderRadius.xl,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
	},
	inputDisabled: {
		flex: 1,
		marginLeft: 12,
		color: colors.text.muted,
		fontSize: 16,
	},
	inputHint: {
		color: colors.text.muted,
		fontSize: 12,
		marginTop: 4,
	},
	accountOption: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
		...shadows.sm,
	},
	accountOptionContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	accountOptionIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.primary.DEFAULT + "20",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	accountOptionText: {
		color: colors.text.primary,
		fontSize: 16,
	},
	deleteButton: {
		backgroundColor: colors.error.background,
		borderRadius: borderRadius.xl,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	deleteButtonText: {
		color: colors.error.DEFAULT,
		fontWeight: "500",
		marginLeft: 8,
	},
	bottomSpacer: {
		height: 32,
	},
});
