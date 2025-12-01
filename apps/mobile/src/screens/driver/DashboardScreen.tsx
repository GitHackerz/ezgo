import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AxiosError } from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
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
import { useAuth } from "../../context/AuthContext";
import type { RootStackParamList } from "../../navigation/types";
import tripService, { type Trip } from "../../services/tripService";
import userService, { type DriverStats } from "../../services/userService";

interface ApiError {
	message?: string;
}

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, "DriverTabs">;
};

export default function DriverDashboardScreen({ navigation }: Props) {
	const { user } = useAuth();
	const [todayTrips, setTodayTrips] = useState<Trip[]>([]);
	const [stats, setStats] = useState<DriverStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [startingTripId, setStartingTripId] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		try {
			const [tripsRes, statsRes] = await Promise.all([
				tripService.getDriverTodayTrips().catch(() => []),
				userService.getDriverStats().catch(() => null),
			]);
			setTodayTrips(tripsRes);
			setStats(statsRes);
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const onRefresh = () => {
		setIsRefreshing(true);
		fetchData();
	};

	const handleStartTrip = async (tripId: string) => {
		setStartingTripId(tripId);
		try {
			await tripService.startTrip(tripId);
			navigation.navigate("ActiveTrip", { tripId });
		} catch (error: unknown) {
			let message = "Failed to start trip";
			if (error instanceof AxiosError && error.response?.data) {
				const data = error.response.data as ApiError;
				message = data.message || message;
			}
			Alert.alert("Error", message);
		} finally {
			setStartingTripId(null);
		}
	};

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getStatusStyle = (status: string) => {
		switch (status) {
			case "SCHEDULED":
				return { bg: colors.info.background, text: colors.info.DEFAULT };
			case "BOARDING":
				return { bg: colors.warning.background, text: colors.warning.DEFAULT };
			case "IN_PROGRESS":
				return { bg: colors.success.background, text: colors.success.DEFAULT };
			case "COMPLETED":
				return { bg: colors.background.tertiary, text: colors.text.secondary };
			case "CANCELLED":
				return { bg: colors.error.background, text: colors.error.DEFAULT };
			default:
				return { bg: colors.background.tertiary, text: colors.text.secondary };
		}
	};

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={onRefresh}
						tintColor={colors.primary.DEFAULT}
					/>
				}
			>
				{/* Header */}
				<LinearGradient
					colors={gradients.primary}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={styles.header}
				>
					<View style={styles.headerContent}>
						<View>
							<Text style={styles.greeting}>
								Hello{user?.firstName ? `, ${user.firstName}` : ""}!
							</Text>
							<Text style={styles.subGreeting}>Today's Schedule</Text>
						</View>
						<TouchableOpacity
							onPress={() => navigation.navigate("Notifications")}
							style={styles.notificationButton}
						>
							<Feather name="bell" size={20} color={colors.text.inverse} />
						</TouchableOpacity>
					</View>
				</LinearGradient>

				{/* Stats Cards */}
				<View style={styles.statsContainer}>
					{isLoading ? (
						<View style={styles.loadingCard}>
							<ActivityIndicator size="small" color={colors.primary.DEFAULT} />
						</View>
					) : (
						<View style={styles.statsRow}>
							<View style={styles.statCard}>
								<View style={styles.statIconContainer}>
									<Feather
										name="calendar"
										size={24}
										color={colors.primary.DEFAULT}
									/>
								</View>
								<Text style={styles.statValue}>{todayTrips.length}</Text>
								<Text style={styles.statLabel}>Trips Today</Text>
							</View>

							<View style={styles.statCard}>
								<View
									style={[
										styles.statIconContainer,
										{ backgroundColor: colors.success.background },
									]}
								>
									<Feather
										name="dollar-sign"
										size={24}
										color={colors.success.DEFAULT}
									/>
								</View>
								<Text style={styles.statValue}>
									{stats?.currentMonthEarnings?.toFixed(0) || 0} TND
								</Text>
								<Text style={styles.statLabel}>This Month</Text>
							</View>
						</View>
					)}
				</View>

				{/* Monthly Stats */}
				{stats && (
					<View style={styles.section}>
						<View style={styles.performanceCard}>
							<Text style={styles.performanceTitle}>Performance Overview</Text>
							<View style={styles.performanceRow}>
								<View style={styles.performanceItem}>
									<Text style={styles.performanceValue}>
										{stats.totalTrips}
									</Text>
									<Text style={styles.performanceLabel}>Total Trips</Text>
								</View>
								<View style={styles.performanceDivider} />
								<View style={styles.performanceItem}>
									<Text style={styles.performanceValue}>
										{stats.totalPassengers}
									</Text>
									<Text style={styles.performanceLabel}>Passengers</Text>
								</View>
								<View style={styles.performanceDivider} />
								<View style={styles.performanceItem}>
									<View style={styles.ratingRow}>
										<Feather
											name="star"
											size={16}
											color={colors.warning.DEFAULT}
										/>
										<Text style={styles.performanceValue}>
											{stats.averageRating?.toFixed(1) || "N/A"}
										</Text>
									</View>
									<Text style={styles.performanceLabel}>Rating</Text>
								</View>
							</View>
						</View>
					</View>
				)}

				{/* Today's Trips */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Today's Trips</Text>
						<TouchableOpacity
							onPress={() => navigation.navigate("Schedule" as never)}
						>
							<Text style={styles.viewAllText}>View All</Text>
						</TouchableOpacity>
					</View>

					{isLoading ? (
						<ActivityIndicator size="small" color={colors.primary.DEFAULT} />
					) : todayTrips.length > 0 ? (
						todayTrips.map((trip) => {
							const statusStyle = getStatusStyle(trip.status);
							const isStartable =
								trip.status === "SCHEDULED" || trip.status === "BOARDING";
							const isActive = trip.status === "IN_PROGRESS";

							return (
								<TouchableOpacity
									key={trip.id}
									style={styles.tripCard}
									onPress={() => {
										if (isActive) {
											navigation.navigate("ActiveTrip", { tripId: trip.id });
										} else {
											navigation.navigate("TripPassengers", {
												tripId: trip.id,
											});
										}
									}}
								>
									<View style={styles.tripHeader}>
										<Text style={styles.tripRoute}>
											{trip.route?.originCity} → {trip.route?.destinationCity}
										</Text>
										<View
											style={[
												styles.statusBadge,
												{ backgroundColor: statusStyle.bg },
											]}
										>
											<Text
												style={[styles.statusText, { color: statusStyle.text }]}
											>
												{trip.status.replace("_", " ")}
											</Text>
										</View>
									</View>

									<View style={styles.tripDetails}>
										<View style={styles.tripDetailItem}>
											<Feather
												name="clock"
												size={16}
												color={colors.text.secondary}
											/>
											<Text style={styles.tripDetailText}>
												{formatTime(trip.departureTime)}
											</Text>
										</View>

										<View style={styles.tripDetailItem}>
											<Feather
												name="users"
												size={16}
												color={colors.text.secondary}
											/>
											<Text style={styles.tripDetailText}>
												{trip.bus?.capacity
													? trip.bus.capacity - trip.availableSeats
													: 0}{" "}
												passengers
											</Text>
										</View>
									</View>

									{trip.bus && (
										<View style={styles.tripDetailItem}>
											<Feather
												name="truck"
												size={16}
												color={colors.text.secondary}
											/>
											<Text style={styles.tripDetailText}>
												{trip.bus.plateNumber}
											</Text>
										</View>
									)}

									{isStartable && (
										<TouchableOpacity
											style={styles.startButton}
											onPress={() => handleStartTrip(trip.id)}
											disabled={startingTripId === trip.id}
										>
											<LinearGradient
												colors={gradients.primary}
												start={{ x: 0, y: 0 }}
												end={{ x: 1, y: 0 }}
												style={styles.startButtonGradient}
											>
												{startingTripId === trip.id ? (
													<ActivityIndicator color={colors.text.inverse} />
												) : (
													<Text style={styles.startButtonText}>Start Trip</Text>
												)}
											</LinearGradient>
										</TouchableOpacity>
									)}

									{isActive && (
										<TouchableOpacity
											style={styles.continueButton}
											onPress={() =>
												navigation.navigate("ActiveTrip", { tripId: trip.id })
											}
										>
											<Text style={styles.continueButtonText}>
												Continue Trip
											</Text>
										</TouchableOpacity>
									)}
								</TouchableOpacity>
							);
						})
					) : (
						<View style={styles.emptyCard}>
							<View style={styles.emptyIconContainer}>
								<Feather name="calendar" size={32} color={colors.text.muted} />
							</View>
							<Text style={styles.emptyText}>No trips scheduled today</Text>
							<TouchableOpacity
								onPress={() => navigation.navigate("Schedule" as never)}
							>
								<Text style={styles.viewScheduleText}>View Schedule</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>

				{/* Quick Actions */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Quick Actions</Text>
					<View style={styles.quickActionsRow}>
						<TouchableOpacity
							style={styles.quickActionCard}
							onPress={() => navigation.navigate("Schedule" as never)}
						>
							<View style={styles.quickActionIcon}>
								<Feather
									name="calendar"
									size={28}
									color={colors.primary.DEFAULT}
								/>
							</View>
							<Text style={styles.quickActionText}>Schedule</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.quickActionCard}
							onPress={() => navigation.navigate("Earnings" as never)}
						>
							<View
								style={[
									styles.quickActionIcon,
									{ backgroundColor: colors.success.background },
								]}
							>
								<Feather
									name="dollar-sign"
									size={28}
									color={colors.success.DEFAULT}
								/>
							</View>
							<Text style={styles.quickActionText}>Earnings</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.quickActionCard}
							onPress={() => navigation.navigate("Notifications")}
						>
							<View
								style={[
									styles.quickActionIcon,
									{ backgroundColor: colors.warning.background },
								]}
							>
								<Feather name="bell" size={28} color={colors.warning.DEFAULT} />
							</View>
							<Text style={styles.quickActionText}>Alerts</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={{ height: 32 }} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
	},
	scrollView: {
		flex: 1,
	},
	header: {
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 48,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	greeting: {
		fontSize: 28,
		fontWeight: "bold",
		color: colors.text.inverse,
	},
	subGreeting: {
		fontSize: 16,
		color: colors.text.inverse,
		opacity: 0.8,
		marginTop: 4,
	},
	notificationButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: "rgba(255,255,255,0.2)",
		alignItems: "center",
		justifyContent: "center",
	},
	statsContainer: {
		paddingHorizontal: 24,
		marginTop: -32,
	},
	loadingCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 24,
		alignItems: "center",
		...shadows.lg,
	},
	statsRow: {
		flexDirection: "row",
		gap: 12,
	},
	statCard: {
		flex: 1,
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		...shadows.lg,
	},
	statIconContainer: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: colors.primary.DEFAULT + "20",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 12,
	},
	statValue: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.text.primary,
	},
	statLabel: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: 4,
	},
	section: {
		paddingHorizontal: 24,
		marginTop: 24,
	},
	performanceCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		...shadows.sm,
	},
	performanceTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.text.primary,
		marginBottom: 16,
	},
	performanceRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	performanceItem: {
		flex: 1,
		alignItems: "center",
	},
	performanceDivider: {
		width: 1,
		backgroundColor: colors.border.DEFAULT,
	},
	performanceValue: {
		fontSize: 20,
		fontWeight: "bold",
		color: colors.text.primary,
	},
	performanceLabel: {
		fontSize: 12,
		color: colors.text.secondary,
		marginTop: 4,
	},
	ratingRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: colors.text.primary,
	},
	viewAllText: {
		fontSize: 14,
		color: colors.primary.DEFAULT,
		fontWeight: "500",
	},
	tripCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		marginBottom: 12,
		...shadows.sm,
	},
	tripHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	tripRoute: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.text.primary,
		flex: 1,
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
	tripDetails: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	tripDetailItem: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 8,
	},
	tripDetailText: {
		fontSize: 14,
		color: colors.text.secondary,
		marginLeft: 8,
	},
	startButton: {
		marginTop: 16,
		borderRadius: borderRadius.lg,
		overflow: "hidden",
	},
	startButtonGradient: {
		paddingVertical: 14,
		alignItems: "center",
	},
	startButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.text.inverse,
	},
	continueButton: {
		marginTop: 16,
		backgroundColor: colors.success.DEFAULT,
		borderRadius: borderRadius.lg,
		paddingVertical: 14,
		alignItems: "center",
	},
	continueButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.text.inverse,
	},
	emptyCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 32,
		alignItems: "center",
		...shadows.sm,
	},
	emptyIconContainer: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: colors.background.tertiary,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
	},
	emptyText: {
		fontSize: 16,
		color: colors.text.secondary,
	},
	viewScheduleText: {
		fontSize: 14,
		color: colors.primary.DEFAULT,
		fontWeight: "500",
		marginTop: 12,
	},
	quickActionsRow: {
		flexDirection: "row",
		gap: 12,
		marginTop: 16,
	},
	quickActionCard: {
		flex: 1,
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		alignItems: "center",
		...shadows.sm,
	},
	quickActionIcon: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.primary.DEFAULT + "20",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 12,
	},
	quickActionText: {
		fontSize: 14,
		fontWeight: "500",
		color: colors.text.primary,
		textAlign: "center",
	},
});
