import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Linking,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	borderRadius,
	colors,
	gradients,
	shadows,
} from "../../constants/theme";
import tripService, { Trip } from "../../services/tripService";

interface Passenger {
	id: string;
	bookingId: string;
	userId: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	seatNumbers: string[];
	status: "CONFIRMED" | "BOARDED" | "CANCELLED" | "NO_SHOW";
}

type PassengerFilter = "all" | "boarded" | "waiting" | "no-show";

export default function TripPassengersScreen({
	route,
	navigation,
}: {
	route: { params?: { tripId?: string } };
	navigation: { goBack: () => void };
}) {
	const { tripId } = route.params || {};

	const [trip, setTrip] = useState<Trip | null>(null);
	const [passengers, setPassengers] = useState<Passenger[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [filter, setFilter] = useState<PassengerFilter>("all");

	const fetchData = useCallback(async () => {
		if (!tripId) return;
		try {
			const [tripData, passengersData] = await Promise.all([
				tripService.getTripById(tripId),
				tripService.getTripPassengers(tripId),
			]);
			setTrip(tripData);
			setPassengers(passengersData);
		} catch (error) {
			console.error("Error fetching trip passengers:", error);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, [tripId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleRefresh = () => {
		setIsRefreshing(true);
		fetchData();
	};

	const handleMarkBoarded = async (bookingId: string) => {
		if (!tripId) return;
		try {
			await tripService.markPassengerBoarded(tripId, bookingId);
			setPassengers((prev) =>
				prev.map((p) =>
					p.bookingId === bookingId ? { ...p, status: "BOARDED" as const } : p,
				),
			);
		} catch (error) {
			console.error("Error marking passenger boarded:", error);
			Alert.alert("Error", "Failed to mark passenger as boarded");
		}
	};

	const handleCall = (phone: string) => {
		Linking.openURL(`tel:${phone}`);
	};

	const handleMarkAllBoarded = async () => {
		if (!tripId) return;
		try {
			const waitingPassengers = passengers.filter(
				(p) => p.status === "CONFIRMED",
			);
			await Promise.all(
				waitingPassengers.map((p) =>
					tripService.markPassengerBoarded(tripId, p.bookingId),
				),
			);
			setPassengers((prev) =>
				prev.map((p) =>
					p.status === "CONFIRMED" ? { ...p, status: "BOARDED" as const } : p,
				),
			);
		} catch (error) {
			console.error("Error marking all passengers boarded:", error);
			Alert.alert("Error", "Failed to mark all passengers as boarded");
		}
	};

	const getStatusStyle = (status: Passenger["status"]) => {
		switch (status) {
			case "BOARDED":
				return { bg: colors.success.background, text: colors.success.DEFAULT };
			case "CONFIRMED":
				return { bg: colors.warning.background, text: colors.warning.DEFAULT };
			case "NO_SHOW":
				return { bg: colors.error.background, text: colors.error.DEFAULT };
			case "CANCELLED":
				return { bg: colors.background.tertiary, text: colors.text.secondary };
			default:
				return { bg: colors.background.tertiary, text: colors.text.secondary };
		}
	};

	const getStatusLabel = (status: Passenger["status"]): string => {
		switch (status) {
			case "BOARDED":
				return "Boarded";
			case "CONFIRMED":
				return "Waiting";
			case "NO_SHOW":
				return "No-show";
			case "CANCELLED":
				return "Cancelled";
			default:
				return status;
		}
	};

	const filteredPassengers = passengers.filter((p) => {
		switch (filter) {
			case "boarded":
				return p.status === "BOARDED";
			case "waiting":
				return p.status === "CONFIRMED";
			case "no-show":
				return p.status === "NO_SHOW";
			default:
				return true;
		}
	});

	const stats = {
		total: passengers.length,
		boarded: passengers.filter((p) => p.status === "BOARDED").length,
		waiting: passengers.filter((p) => p.status === "CONFIRMED").length,
		noShow: passengers.filter((p) => p.status === "NO_SHOW").length,
	};

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={colors.primary.DEFAULT} />
			</View>
		);
	}

	const filterLabels: { key: PassengerFilter; label: string }[] = [
		{ key: "all", label: "All" },
		{ key: "boarded", label: "Boarded" },
		{ key: "waiting", label: "Waiting" },
		{ key: "no-show", label: "No-show" },
	];

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			{/* Header */}
			<LinearGradient
				colors={gradients.primary}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={styles.header}
			>
				<View style={styles.headerRow}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<Feather name="arrow-left" size={24} color={colors.text.inverse} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Passengers</Text>
					<TouchableOpacity style={styles.searchButton}>
						<Feather name="search" size={20} color={colors.text.inverse} />
					</TouchableOpacity>
				</View>
				<Text style={styles.headerSubtitle}>
					{trip?.route
						? `${trip.route.originCity} - ${trip.route.destinationCity}`
						: "Trip Details"}
				</Text>
			</LinearGradient>

			{/* Stats */}
			<View style={styles.statsSection}>
				<View style={styles.statsCard}>
					<View style={styles.statItem}>
						<Text style={styles.statValue}>{stats.total}</Text>
						<Text style={styles.statLabel}>Total</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statItem}>
						<Text style={[styles.statValue, { color: colors.success.DEFAULT }]}>
							{stats.boarded}
						</Text>
						<Text style={styles.statLabel}>Boarded</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statItem}>
						<Text style={[styles.statValue, { color: colors.warning.DEFAULT }]}>
							{stats.waiting}
						</Text>
						<Text style={styles.statLabel}>Waiting</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statItem}>
						<Text style={[styles.statValue, { color: colors.error.DEFAULT }]}>
							{stats.noShow}
						</Text>
						<Text style={styles.statLabel}>No-show</Text>
					</View>
				</View>
			</View>

			{/* Filter Tabs */}
			<View style={styles.filterSection}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{filterLabels.map(({ key, label }) => (
						<TouchableOpacity
							key={key}
							style={[
								styles.filterButton,
								filter === key && styles.filterButtonActive,
							]}
							onPress={() => setFilter(key)}
						>
							<Text
								style={[
									styles.filterButtonText,
									filter === key && styles.filterButtonTextActive,
								]}
							>
								{label}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			{/* Passenger List */}
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={handleRefresh}
						tintColor={colors.primary.DEFAULT}
					/>
				}
			>
				{filteredPassengers.length === 0 ? (
					<View style={styles.emptyContainer}>
						<View style={styles.emptyIconContainer}>
							<Feather name="users" size={48} color={colors.text.muted} />
						</View>
						<Text style={styles.emptyText}>No passengers found</Text>
					</View>
				) : (
					filteredPassengers.map((passenger) => {
						const statusStyle = getStatusStyle(passenger.status);
						return (
							<View key={passenger.id} style={styles.passengerCard}>
								<View style={styles.passengerHeader}>
									<View style={styles.passengerInfo}>
										<View style={styles.avatarContainer}>
											<Text style={styles.avatarText}>👤</Text>
										</View>
										<View style={styles.passengerDetails}>
											<Text style={styles.passengerName}>
												{passenger.firstName} {passenger.lastName}
											</Text>
											<Text style={styles.passengerSeat}>
												Seat{passenger.seatNumbers.length > 1 ? "s" : ""}{" "}
												{passenger.seatNumbers.join(", ")}
											</Text>
										</View>
									</View>
									<View
										style={[
											styles.statusBadge,
											{ backgroundColor: statusStyle.bg },
										]}
									>
										<Text
											style={[styles.statusText, { color: statusStyle.text }]}
										>
											{getStatusLabel(passenger.status)}
										</Text>
									</View>
								</View>

								<View style={styles.passengerActions}>
									{passenger.phone && (
										<TouchableOpacity
											style={styles.callButton}
											onPress={() => {
												if (passenger.phone) handleCall(passenger.phone);
											}}
										>
											<Feather
												name="phone"
												size={18}
												color={colors.text.secondary}
											/>
										</TouchableOpacity>
									)}
									{passenger.status === "CONFIRMED" && (
										<TouchableOpacity
											style={styles.boardButton}
											onPress={() => handleMarkBoarded(passenger.bookingId)}
										>
											<Feather
												name="check"
												size={16}
												color={colors.success.DEFAULT}
											/>
											<Text style={styles.boardButtonText}>Mark Boarded</Text>
										</TouchableOpacity>
									)}
								</View>
							</View>
						);
					})
				)}
			</ScrollView>

			{/* Quick Actions */}
			{stats.waiting > 0 && (
				<View style={styles.bottomAction}>
					<TouchableOpacity
						style={styles.markAllButton}
						onPress={handleMarkAllBoarded}
					>
						<LinearGradient
							colors={gradients.primary}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={styles.markAllButtonGradient}
						>
							<Feather
								name="check-circle"
								size={20}
								color={colors.text.inverse}
							/>
							<Text style={styles.markAllButtonText}>Mark All Boarded</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
		alignItems: "center",
		justifyContent: "center",
	},
	header: {
		paddingHorizontal: 24,
		paddingTop: 8,
		paddingBottom: 32,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	backButton: {
		marginRight: 16,
	},
	headerTitle: {
		flex: 1,
		fontSize: 22,
		fontWeight: "bold",
		color: colors.text.inverse,
	},
	searchButton: {
		width: 40,
		height: 40,
		borderRadius: borderRadius.lg,
		backgroundColor: "rgba(255,255,255,0.2)",
		alignItems: "center",
		justifyContent: "center",
	},
	headerSubtitle: {
		fontSize: 14,
		color: colors.text.inverse,
		opacity: 0.8,
	},
	statsSection: {
		paddingHorizontal: 24,
		marginTop: -20,
	},
	statsCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		flexDirection: "row",
		justifyContent: "space-around",
		...shadows.lg,
	},
	statItem: {
		alignItems: "center",
		flex: 1,
	},
	statDivider: {
		width: 1,
		backgroundColor: colors.border.DEFAULT,
	},
	statValue: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.text.primary,
	},
	statLabel: {
		fontSize: 12,
		color: colors.text.secondary,
		marginTop: 4,
	},
	filterSection: {
		paddingHorizontal: 24,
		marginTop: 16,
	},
	filterButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: borderRadius.full,
		backgroundColor: colors.background.card,
		marginRight: 8,
	},
	filterButtonActive: {
		backgroundColor: colors.primary.DEFAULT,
	},
	filterButtonText: {
		fontSize: 14,
		fontWeight: "500",
		color: colors.text.primary,
	},
	filterButtonTextActive: {
		color: colors.text.inverse,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 32,
	},
	emptyContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
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
	emptyText: {
		fontSize: 16,
		color: colors.text.secondary,
	},
	passengerCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		marginBottom: 12,
		...shadows.sm,
	},
	passengerHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	passengerInfo: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	avatarContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: colors.background.tertiary,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	avatarText: {
		fontSize: 24,
	},
	passengerDetails: {
		flex: 1,
	},
	passengerName: {
		fontSize: 16,
		fontWeight: "500",
		color: colors.text.primary,
	},
	passengerSeat: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: 2,
	},
	statusBadge: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: borderRadius.full,
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
	},
	passengerActions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 8,
	},
	callButton: {
		width: 40,
		height: 40,
		borderRadius: borderRadius.lg,
		backgroundColor: colors.background.tertiary,
		alignItems: "center",
		justifyContent: "center",
	},
	boardButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.success.background,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: borderRadius.lg,
		gap: 6,
	},
	boardButtonText: {
		fontSize: 14,
		fontWeight: "500",
		color: colors.success.DEFAULT,
	},
	bottomAction: {
		padding: 24,
		backgroundColor: colors.background.card,
		borderTopWidth: 1,
		borderTopColor: colors.border.DEFAULT,
	},
	markAllButton: {
		borderRadius: borderRadius.xl,
		overflow: "hidden",
	},
	markAllButtonGradient: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		gap: 8,
	},
	markAllButtonText: {
		fontSize: 16,
		fontWeight: "bold",
		color: colors.text.inverse,
	},
});
