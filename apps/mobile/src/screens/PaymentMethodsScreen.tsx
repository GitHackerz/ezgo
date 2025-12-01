import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { borderRadius, colors, shadows } from "../constants/theme";

interface PaymentMethod {
	id: string;
	type: "CREDIT_CARD" | "MOBILE_MONEY";
	name: string;
	lastFourDigits?: string;
	expiryDate?: string;
	provider?: string;
	phoneNumber?: string;
	isDefault: boolean;
}

export default function PaymentMethodsScreen() {
	const navigation = useNavigation();
	const [loading, setLoading] = useState(true);
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

	useEffect(() => {
		loadPaymentMethods();
	}, []);

	const loadPaymentMethods = async () => {
		setLoading(true);
		try {
			// Mock payment methods for now - integrate with real API when available
			await new Promise((resolve) => setTimeout(resolve, 500));
			setPaymentMethods([
				{
					id: "1",
					type: "CREDIT_CARD",
					name: "Visa ending in 4242",
					lastFourDigits: "4242",
					expiryDate: "12/25",
					isDefault: true,
				},
				{
					id: "2",
					type: "MOBILE_MONEY",
					name: "Ooredoo Money",
					provider: "Ooredoo",
					phoneNumber: "+216 ** *** 456",
					isDefault: false,
				},
			]);
		} catch {
			Alert.alert("Error", "Failed to load payment methods");
		} finally {
			setLoading(false);
		}
	};

	const handleSetDefault = (id: string) => {
		setPaymentMethods((prev) =>
			prev.map((method) => ({
				...method,
				isDefault: method.id === id,
			})),
		);
	};

	const handleDelete = (id: string) => {
		Alert.alert(
			"Delete Payment Method",
			"Are you sure you want to delete this payment method?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => {
						setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
					},
				},
			],
		);
	};

	const handleAddNew = () => {
		Alert.alert(
			"Add Payment Method",
			"Payment method integration coming soon!",
			[{ text: "OK" }],
		);
	};

	const getIcon = (
		type: PaymentMethod["type"],
	): keyof typeof Feather.glyphMap => {
		switch (type) {
			case "CREDIT_CARD":
				return "credit-card";
			case "MOBILE_MONEY":
				return "smartphone";
			default:
				return "credit-card";
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
				<Text style={styles.headerTitle}>Payment Methods</Text>
				<View style={{ width: 40 }} />
			</View>

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={colors.primary.DEFAULT} />
				</View>
			) : (
				<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
					{paymentMethods.length === 0 ? (
						<View style={styles.emptyContainer}>
							<View style={styles.emptyIconContainer}>
								<Feather
									name="credit-card"
									size={48}
									color={colors.text.muted}
								/>
							</View>
							<Text style={styles.emptyTitle}>No payment methods saved</Text>
							<Text style={styles.emptySubtitle}>
								Add a payment method to make booking easier
							</Text>
						</View>
					) : (
						<View style={styles.methodsList}>
							{paymentMethods.map((method) => (
								<View key={method.id} style={styles.methodCard}>
									<View style={styles.methodHeader}>
										<View style={styles.methodInfo}>
											<View
												style={[
													styles.methodIcon,
													method.isDefault && styles.methodIconDefault,
												]}
											>
												<Feather
													name={getIcon(method.type)}
													size={24}
													color={
														method.isDefault
															? colors.primary.DEFAULT
															: colors.text.secondary
													}
												/>
											</View>
											<View style={styles.methodDetails}>
												<View style={styles.methodNameRow}>
													<Text style={styles.methodName}>{method.name}</Text>
													{method.isDefault && (
														<View style={styles.defaultBadge}>
															<Text style={styles.defaultBadgeText}>
																Default
															</Text>
														</View>
													)}
												</View>
												{method.type === "CREDIT_CARD" && method.expiryDate && (
													<Text style={styles.methodSubtext}>
														Expires {method.expiryDate}
													</Text>
												)}
												{method.type === "MOBILE_MONEY" &&
													method.phoneNumber && (
														<Text style={styles.methodSubtext}>
															{method.phoneNumber}
														</Text>
													)}
											</View>
										</View>
									</View>

									<View style={styles.methodActions}>
										{!method.isDefault && (
											<TouchableOpacity
												onPress={() => handleSetDefault(method.id)}
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
											onPress={() => handleDelete(method.id)}
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
					<TouchableOpacity onPress={handleAddNew} style={styles.addButton}>
						<LinearGradient
							colors={[colors.primary.light, colors.primary.DEFAULT]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={styles.addButtonGradient}
						>
							<Feather name="plus" size={20} color={colors.text.inverse} />
							<Text style={styles.addButtonText}>Add Payment Method</Text>
						</LinearGradient>
					</TouchableOpacity>

					{/* Info Card */}
					<View style={styles.infoCard}>
						<View style={styles.infoIconContainer}>
							<Feather name="shield" size={24} color={colors.primary.DEFAULT} />
						</View>
						<View style={styles.infoContent}>
							<Text style={styles.infoTitle}>Secure Payments</Text>
							<Text style={styles.infoText}>
								Your payment information is encrypted and securely stored. We
								never store your full card details.
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
	methodsList: {
		gap: 12,
	},
	methodCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		...shadows.sm,
	},
	methodHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
	},
	methodInfo: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	methodIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: colors.background.tertiary,
		alignItems: "center",
		justifyContent: "center",
	},
	methodIconDefault: {
		backgroundColor: colors.primary.DEFAULT + "20",
	},
	methodDetails: {
		marginLeft: 12,
		flex: 1,
	},
	methodNameRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	methodName: {
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
	methodSubtext: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: 4,
	},
	methodActions: {
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
		backgroundColor: colors.primary.DEFAULT + "15",
		borderRadius: borderRadius.xl,
		padding: 16,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	infoIconContainer: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: colors.primary.DEFAULT + "20",
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
		color: colors.primary.DEFAULT,
		marginBottom: 4,
	},
	infoText: {
		fontSize: 14,
		color: colors.text.secondary,
		lineHeight: 20,
	},
});
