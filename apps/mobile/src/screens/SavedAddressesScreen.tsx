import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { borderRadius, colors, shadows } from "../constants/theme";

interface SavedAddress {
	id: string;
	name: string;
	address: string;
	city: string;
	type: "home" | "work" | "other";
	isDefault: boolean;
}

export default function SavedAddressesScreen() {
	const navigation = useNavigation();
	const [loading, setLoading] = useState(true);
	const [addresses, setAddresses] = useState<SavedAddress[]>([]);
	const [showAddForm, setShowAddForm] = useState(false);
	const [newAddress, setNewAddress] = useState({
		name: "",
		address: "",
		city: "",
		type: "home" as "home" | "work" | "other",
	});

	const loadAddresses = useCallback(async () => {
		setLoading(true);
		try {
			// Mock addresses for now - integrate with real API when available
			await new Promise((resolve) => setTimeout(resolve, 500));
			setAddresses([
				{
					id: "1",
					name: "Home",
					address: "123 Avenue Habib Bourguiba",
					city: "Tunis",
					type: "home",
					isDefault: true,
				},
				{
					id: "2",
					name: "Work",
					address: "45 Rue de la Liberté",
					city: "Sousse",
					type: "work",
					isDefault: false,
				},
			]);
		} catch {
			Alert.alert("Error", "Failed to load saved addresses");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadAddresses();
	}, [loadAddresses]);

	const handleSetDefault = (id: string) => {
		setAddresses((prev) =>
			prev.map((addr) => ({
				...addr,
				isDefault: addr.id === id,
			})),
		);
	};

	const handleDelete = (id: string) => {
		Alert.alert(
			"Delete Address",
			"Are you sure you want to delete this address?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => {
						setAddresses((prev) => prev.filter((a) => a.id !== id));
					},
				},
			],
		);
	};

	const handleAddAddress = () => {
		if (!newAddress.name || !newAddress.address || !newAddress.city) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

		const newAddr: SavedAddress = {
			id: Date.now().toString(),
			...newAddress,
			isDefault: addresses.length === 0,
		};

		setAddresses((prev) => [...prev, newAddr]);
		setNewAddress({ name: "", address: "", city: "", type: "home" });
		setShowAddForm(false);
	};

	const getIcon = (
		type: SavedAddress["type"],
	): keyof typeof Feather.glyphMap => {
		switch (type) {
			case "home":
				return "home";
			case "work":
				return "briefcase";
			default:
				return "map-pin";
		}
	};

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.backButton}
				>
					<Feather name="arrow-left" size={24} color={colors.text.primary} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Saved Addresses</Text>
				<View style={{ width: 40 }} />
			</View>

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={colors.primary.DEFAULT} />
				</View>
			) : (
				<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
					{/* Add Address Form */}
					{showAddForm && (
						<View style={styles.formCard}>
							<Text style={styles.formTitle}>Add New Address</Text>

							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Label</Text>
								<View style={styles.inputContainer}>
									<TextInput
										value={newAddress.name}
										onChangeText={(text) =>
											setNewAddress((prev) => ({ ...prev, name: text }))
										}
										placeholder="e.g., Home, Work, Gym"
										placeholderTextColor={colors.text.muted}
										style={styles.input}
									/>
								</View>
							</View>

							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Address</Text>
								<View style={styles.inputContainer}>
									<TextInput
										value={newAddress.address}
										onChangeText={(text) =>
											setNewAddress((prev) => ({ ...prev, address: text }))
										}
										placeholder="Street address"
										placeholderTextColor={colors.text.muted}
										style={styles.input}
									/>
								</View>
							</View>

							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>City</Text>
								<View style={styles.inputContainer}>
									<TextInput
										value={newAddress.city}
										onChangeText={(text) =>
											setNewAddress((prev) => ({ ...prev, city: text }))
										}
										placeholder="City"
										placeholderTextColor={colors.text.muted}
										style={styles.input}
									/>
								</View>
							</View>

							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Type</Text>
								<View style={styles.typeSelector}>
									{(["home", "work", "other"] as const).map((type) => (
										<TouchableOpacity
											key={type}
											onPress={() =>
												setNewAddress((prev) => ({ ...prev, type }))
											}
											style={[
												styles.typeOption,
												newAddress.type === type && styles.typeOptionSelected,
											]}
										>
											<Feather
												name={getIcon(type)}
												size={16}
												color={
													newAddress.type === type
														? colors.primary.DEFAULT
														: colors.text.secondary
												}
											/>
											<Text
												style={[
													styles.typeOptionText,
													newAddress.type === type &&
														styles.typeOptionTextSelected,
												]}
											>
												{type.charAt(0).toUpperCase() + type.slice(1)}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</View>

							<View style={styles.formButtons}>
								<TouchableOpacity
									onPress={() => setShowAddForm(false)}
									style={styles.cancelButton}
								>
									<Text style={styles.cancelButtonText}>Cancel</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={handleAddAddress}
									style={styles.saveFormButton}
								>
									<Text style={styles.saveFormButtonText}>Save</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}

					{addresses.length === 0 && !showAddForm ? (
						<View style={styles.emptyContainer}>
							<View style={styles.emptyIconContainer}>
								<Feather name="map-pin" size={48} color={colors.text.muted} />
							</View>
							<Text style={styles.emptyTitle}>No saved addresses</Text>
							<Text style={styles.emptySubtitle}>
								Save your frequent addresses for faster booking
							</Text>
						</View>
					) : (
						<View style={styles.addressList}>
							{addresses.map((addr) => (
								<View key={addr.id} style={styles.addressCard}>
									<View style={styles.addressHeader}>
										<View style={styles.addressInfo}>
											<View
												style={[
													styles.addressIcon,
													addr.isDefault && styles.addressIconDefault,
												]}
											>
												<Feather
													name={getIcon(addr.type)}
													size={24}
													color={
														addr.isDefault
															? colors.primary.DEFAULT
															: colors.text.secondary
													}
												/>
											</View>
											<View style={styles.addressDetails}>
												<View style={styles.addressNameRow}>
													<Text style={styles.addressName}>{addr.name}</Text>
													{addr.isDefault && (
														<View style={styles.defaultBadge}>
															<Text style={styles.defaultBadgeText}>
																Default
															</Text>
														</View>
													)}
												</View>
												<Text style={styles.addressText}>{addr.address}</Text>
												<Text style={styles.addressCity}>{addr.city}</Text>
											</View>
										</View>
									</View>

									<View style={styles.addressActions}>
										{!addr.isDefault && (
											<TouchableOpacity
												onPress={() => handleSetDefault(addr.id)}
												style={styles.actionButton}
											>
												<Feather
													name="check-circle"
													size={16}
													color={colors.primary.DEFAULT}
												/>
												<Text style={styles.actionTextPrimary}>
													Set as default
												</Text>
											</TouchableOpacity>
										)}
										<TouchableOpacity
											onPress={() => handleDelete(addr.id)}
											style={styles.actionButton}
										>
											<Feather
												name="trash-2"
												size={16}
												color={colors.error.DEFAULT}
											/>
											<Text style={styles.actionTextDanger}>Delete</Text>
										</TouchableOpacity>
									</View>
								</View>
							))}
						</View>
					)}

					{/* Add New Button */}
					{!showAddForm && (
						<TouchableOpacity
							onPress={() => setShowAddForm(true)}
							style={styles.addButton}
						>
							<LinearGradient
								colors={[colors.primary.light, colors.primary.DEFAULT]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								style={styles.addButtonGradient}
							>
								<Feather name="plus" size={20} color={colors.text.inverse} />
								<Text style={styles.addButtonText}>Add New Address</Text>
							</LinearGradient>
						</TouchableOpacity>
					)}

					{/* Info Card */}
					<View style={styles.infoCard}>
						<View style={styles.infoIconContainer}>
							<Feather name="zap" size={24} color={colors.success.DEFAULT} />
						</View>
						<View style={styles.infoContent}>
							<Text style={styles.infoTitle}>Quick Booking</Text>
							<Text style={styles.infoText}>
								Save your frequent addresses to quickly search for trips from
								the home screen.
							</Text>
						</View>
					</View>

					<View style={{ height: 32 }} />
				</ScrollView>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: colors.background.secondary,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.background.tertiary,
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: colors.text.primary,
	},
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	content: {
		flex: 1,
		padding: 20,
	},
	formCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 20,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: colors.primary.DEFAULT + "30",
		...shadows.md,
	},
	formTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.text.primary,
		marginBottom: 20,
	},
	inputGroup: {
		marginBottom: 16,
	},
	inputLabel: {
		fontSize: 14,
		color: colors.text.secondary,
		marginBottom: 8,
	},
	inputContainer: {
		backgroundColor: colors.background.tertiary,
		borderRadius: borderRadius.lg,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
	},
	input: {
		color: colors.text.primary,
		fontSize: 16,
	},
	typeSelector: {
		flexDirection: "row",
		gap: 8,
	},
	typeOption: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: borderRadius.lg,
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
		backgroundColor: colors.background.tertiary,
		alignItems: "center",
	},
	typeOptionSelected: {
		borderColor: colors.primary.DEFAULT,
		backgroundColor: colors.primary.DEFAULT + "20",
	},
	typeOptionText: {
		fontSize: 12,
		marginTop: 4,
		color: colors.text.secondary,
	},
	typeOptionTextSelected: {
		color: colors.primary.DEFAULT,
	},
	formButtons: {
		flexDirection: "row",
		gap: 12,
		marginTop: 8,
	},
	cancelButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: borderRadius.lg,
		borderWidth: 1,
		borderColor: colors.border.light,
		alignItems: "center",
	},
	cancelButtonText: {
		color: colors.text.secondary,
		fontWeight: "500",
	},
	saveFormButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: borderRadius.lg,
		backgroundColor: colors.primary.DEFAULT,
		alignItems: "center",
	},
	saveFormButtonText: {
		color: colors.text.inverse,
		fontWeight: "600",
	},
	emptyContainer: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 32,
		alignItems: "center",
		...shadows.md,
	},
	emptyIconContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: colors.background.tertiary,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.text.primary,
		marginBottom: 8,
	},
	emptySubtitle: {
		fontSize: 14,
		color: colors.text.secondary,
		textAlign: "center",
	},
	addressList: {
		gap: 12,
	},
	addressCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		...shadows.sm,
	},
	addressHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
	},
	addressInfo: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	addressIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: colors.background.tertiary,
		alignItems: "center",
		justifyContent: "center",
	},
	addressIconDefault: {
		backgroundColor: colors.primary.DEFAULT + "20",
	},
	addressDetails: {
		marginLeft: 12,
		flex: 1,
	},
	addressNameRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	addressName: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.text.primary,
	},
	defaultBadge: {
		marginLeft: 8,
		backgroundColor: colors.primary.DEFAULT + "20",
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: borderRadius.sm,
	},
	defaultBadgeText: {
		fontSize: 10,
		fontWeight: "600",
		color: colors.primary.DEFAULT,
	},
	addressText: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: 4,
	},
	addressCity: {
		fontSize: 14,
		color: colors.text.muted,
	},
	addressActions: {
		flexDirection: "row",
		marginTop: 16,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: colors.border.DEFAULT,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 16,
	},
	actionTextPrimary: {
		fontSize: 14,
		color: colors.primary.DEFAULT,
		marginLeft: 4,
	},
	actionTextDanger: {
		fontSize: 14,
		color: colors.error.DEFAULT,
		marginLeft: 4,
	},
	addButton: {
		marginTop: 24,
		borderRadius: borderRadius.xl,
		overflow: "hidden",
		...shadows.md,
	},
	addButtonGradient: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
	},
	addButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.text.inverse,
		marginLeft: 8,
	},
	infoCard: {
		marginTop: 24,
		backgroundColor: colors.success.background,
		borderRadius: borderRadius.xl,
		padding: 16,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	infoIconContainer: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: colors.success.DEFAULT + "20",
		alignItems: "center",
		justifyContent: "center",
	},
	infoContent: {
		flex: 1,
		marginLeft: 12,
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.success.DEFAULT,
		marginBottom: 4,
	},
	infoText: {
		fontSize: 14,
		color: colors.text.secondary,
		lineHeight: 20,
	},
});
