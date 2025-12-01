import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
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
import userService, { DriverStats } from "../../services/userService";

interface WeeklyData {
	day: string;
	amount: number;
}

export default function EarningsScreen({
	navigation,
}: {
	navigation: { navigate: (route: string) => void };
}) {
	const [stats, setStats] = useState<DriverStats | null>(null);
	const [completedTrips, setCompletedTrips] = useState<Trip[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Calculate weekly data from completed trips
	const calculateWeeklyData = useCallback((trips: Trip[]): WeeklyData[] => {
		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const weekData: { [key: string]: number } = {};
		for (const day of days) {
			weekData[day] = 0;
		}

		const now = new Date();
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

		trips.forEach((trip) => {
			const tripDate = new Date(trip.departureTime);
			if (tripDate >= weekAgo && tripDate <= now) {
				const dayName = days[tripDate.getDay()];
				weekData[dayName] += trip.dynamicPrice || trip.basePrice || 0;
			}
		});

		// Return in order starting from Monday
		return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
			day,
			amount: weekData[day],
		}));
	}, []);

	const fetchData = useCallback(async () => {
		try {
			setError(null);
			const [statsData, tripsData] = await Promise.all([
				userService.getDriverStats(),
				tripService.getDriverTrips("COMPLETED"),
			]);
			setStats(statsData);
			setCompletedTrips(tripsData);
		} catch (err: unknown) {
			console.error("Error fetching earnings data:", err);
			setError("Failed to load earnings data");
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleRefresh = () => {
		setIsRefreshing(true);
		fetchData();
	};

	const weeklyData = calculateWeeklyData(completedTrips);
	const maxAmount = Math.max(...weeklyData.map((d) => d.amount), 1);

	// Get recent 5 completed trips
	const recentTrips = completedTrips
		.sort(
			(a, b) =>
				new Date(b.departureTime).getTime() -
				new Date(a.departureTime).getTime(),
		)
		.slice(0, 5);

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		const now = new Date();
		const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

		const time = date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});

		if (date.toDateString() === now.toDateString()) {
			return `Today, ${time}`;
		} else if (date.toDateString() === yesterday.toDateString()) {
			return `Yesterday, ${time}`;
		}
		return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
	};

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={colors.primary.DEFAULT} />
				<Text style={styles.loadingText}>Loading earnings...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Feather name="alert-circle" size={48} color={colors.error.DEFAULT} />
				<Text style={styles.errorText}>{error}</Text>
				<TouchableOpacity style={styles.retryButton} onPress={fetchData}>
					<LinearGradient
						colors={gradients.primary}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={styles.retryButtonGradient}
					>
						<Text style={styles.retryButtonText}>Retry</Text>
					</LinearGradient>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			{/* Header */}
			<LinearGradient
				colors={gradients.primary}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={styles.header}
			>
				<Text style={styles.headerTitle}>Earnings</Text>
				<Text style={styles.headerSubtitle}>Track your income</Text>
			</LinearGradient>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={handleRefresh}
						tintColor={colors.primary.DEFAULT}
					/>
				}
			>
				{/* Earnings Cards */}
				<View style={styles.earningsSection}>
					<View style={styles.earningsCard}>
						<View style={styles.earningsMain}>
							<Text style={styles.earningsLabel}>This Month</Text>
							<Text style={styles.earningsAmount}>
								{(stats?.currentMonthEarnings ?? 0).toFixed(2)} TND
							</Text>
						</View>

						<View style={styles.earningsDivider} />

						<View style={styles.earningsRow}>
							<View style={styles.earningsItem}>
								<Text style={styles.earningsItemLabel}>Total Earnings</Text>
								<Text
									style={[
										styles.earningsItemValue,
										{ color: colors.success.DEFAULT },
									]}
								>
									{(stats?.totalEarnings ?? 0).toFixed(2)} TND
								</Text>
							</View>
							<View style={styles.earningsVerticalDivider} />
							<View style={styles.earningsItem}>
								<Text style={styles.earningsItemLabel}>This Week</Text>
								<Text
									style={[
										styles.earningsItemValue,
										{ color: colors.primary.DEFAULT },
									]}
								>
									{weeklyData.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}{" "}
									TND
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Stats */}
				<View style={styles.statsSection}>
					<View style={styles.statsRow}>
						<View style={styles.statCard}>
							<View style={styles.statIconContainer}>
								<Feather
									name="calendar"
									size={24}
									color={colors.primary.DEFAULT}
								/>
							</View>
							<Text style={styles.statValue}>
								{stats?.currentMonthTrips ?? 0}
							</Text>
							<Text style={styles.statLabel}>Trips This Month</Text>
						</View>
						<View style={styles.statCard}>
							<View
								style={[
									styles.statIconContainer,
									{ backgroundColor: colors.success.background },
								]}
							>
								<Feather
									name="users"
									size={24}
									color={colors.success.DEFAULT}
								/>
							</View>
							<Text style={styles.statValue}>
								{stats?.totalPassengers ?? 0}
							</Text>
							<Text style={styles.statLabel}>Total Passengers</Text>
						</View>
						<View style={styles.statCard}>
							<View
								style={[
									styles.statIconContainer,
									{ backgroundColor: colors.warning.background },
								]}
							>
								<Feather name="star" size={24} color={colors.warning.DEFAULT} />
							</View>
							<Text style={styles.statValue}>
								{stats?.averageRating?.toFixed(1) ?? "N/A"}
							</Text>
							<Text style={styles.statLabel}>Avg Rating</Text>
						</View>
					</View>
				</View>

				{/* Weekly Chart */}
				<View style={styles.chartSection}>
					<Text style={styles.sectionTitle}>Weekly Overview</Text>
					<View style={styles.chartCard}>
						<View style={styles.chartContainer}>
							{weeklyData.map((data) => (
								<View key={data.day} style={styles.chartBar}>
									<View
										style={[
											styles.chartBarFill,
											{ height: Math.max((data.amount / maxAmount) * 100, 4) },
										]}
									/>
									<Text style={styles.chartBarLabel}>{data.day}</Text>
									<Text style={styles.chartBarValue}>
										{data.amount.toFixed(0)}
									</Text>
								</View>
							))}
						</View>
					</View>
				</View>

				{/* Recent Trips */}
				<View style={styles.recentSection}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Recent Trips</Text>
						<TouchableOpacity onPress={() => navigation.navigate("Schedule")}>
							<Text style={styles.viewAllText}>View All</Text>
						</TouchableOpacity>
					</View>

					{recentTrips.length === 0 ? (
						<View style={styles.emptyCard}>
							<View style={styles.emptyIconContainer}>
								<Feather name="calendar" size={48} color={colors.text.muted} />
							</View>
							<Text style={styles.emptyText}>No completed trips yet</Text>
						</View>
					) : (
						recentTrips.map((trip) => (
							<View key={trip.id} style={styles.tripCard}>
								<View style={styles.tripRow}>
									<View style={styles.tripIconContainer}>
										<Feather
											name="navigation"
											size={20}
											color={colors.primary.DEFAULT}
										/>
									</View>
									<View style={styles.tripInfo}>
										<Text style={styles.tripRoute}>
											{trip.route
												? `${trip.route.originCity} - ${trip.route.destinationCity}`
												: "Unknown Route"}
										</Text>
										<Text style={styles.tripDate}>
											{formatDate(trip.departureTime)}
										</Text>
										<Text style={styles.tripPassengers}>
											{trip.bus?.capacity
												? `${trip.bus.capacity - trip.availableSeats} passengers`
												: ""}
										</Text>
									</View>
								</View>
								<Text style={styles.tripEarnings}>
									+{(trip.dynamicPrice || trip.basePrice).toFixed(2)} TND
								</Text>
							</View>
						))
					)}
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
	loadingContainer: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
		alignItems: "center",
		justifyContent: "center",
	},
	loadingText: {
		fontSize: 16,
		color: colors.text.secondary,
		marginTop: 16,
	},
	errorContainer: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	errorText: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.text.primary,
		marginTop: 16,
	},
	retryButton: {
		marginTop: 16,
		borderRadius: borderRadius.lg,
		overflow: "hidden",
	},
	retryButtonGradient: {
		paddingHorizontal: 24,
		paddingVertical: 12,
	},
	retryButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.text.inverse,
	},
	header: {
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 48,
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "bold",
		color: colors.text.inverse,
	},
	headerSubtitle: {
		fontSize: 14,
		color: colors.text.inverse,
		opacity: 0.8,
		marginTop: 4,
	},
	scrollView: {
		flex: 1,
	},
	earningsSection: {
		paddingHorizontal: 24,
		marginTop: -32,
	},
	earningsCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 24,
		...shadows.lg,
	},
	earningsMain: {
		alignItems: "center",
		marginBottom: 20,
	},
	earningsLabel: {
		fontSize: 14,
		color: colors.text.secondary,
	},
	earningsAmount: {
		fontSize: 36,
		fontWeight: "bold",
		color: colors.text.primary,
		marginTop: 4,
	},
	earningsDivider: {
		height: 1,
		backgroundColor: colors.border.DEFAULT,
		marginBottom: 20,
	},
	earningsRow: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	earningsItem: {
		alignItems: "center",
		flex: 1,
	},
	earningsVerticalDivider: {
		width: 1,
		backgroundColor: colors.border.DEFAULT,
	},
	earningsItemLabel: {
		fontSize: 12,
		color: colors.text.secondary,
	},
	earningsItemValue: {
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 4,
	},
	statsSection: {
		paddingHorizontal: 24,
		marginTop: 24,
	},
	statsRow: {
		flexDirection: "row",
		gap: 8,
	},
	statCard: {
		flex: 1,
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 12,
		alignItems: "center",
		...shadows.sm,
	},
	statIconContainer: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: colors.primary.DEFAULT + "20",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 8,
	},
	statValue: {
		fontSize: 20,
		fontWeight: "bold",
		color: colors.text.primary,
	},
	statLabel: {
		fontSize: 11,
		color: colors.text.secondary,
		textAlign: "center",
		marginTop: 2,
	},
	chartSection: {
		paddingHorizontal: 24,
		marginTop: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: colors.text.primary,
		marginBottom: 16,
	},
	chartCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		...shadows.sm,
	},
	chartContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
		height: 160,
	},
	chartBar: {
		alignItems: "center",
		flex: 1,
	},
	chartBarFill: {
		backgroundColor: colors.primary.DEFAULT,
		borderTopLeftRadius: borderRadius.md,
		borderTopRightRadius: borderRadius.md,
		width: 24,
	},
	chartBarLabel: {
		fontSize: 12,
		color: colors.text.secondary,
		marginTop: 8,
	},
	chartBarValue: {
		fontSize: 12,
		fontWeight: "600",
		color: colors.text.primary,
	},
	recentSection: {
		paddingHorizontal: 24,
		marginTop: 24,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 16,
	},
	viewAllText: {
		fontSize: 14,
		color: colors.primary.DEFAULT,
		fontWeight: "500",
	},
	emptyCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 32,
		alignItems: "center",
		...shadows.sm,
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
	tripCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		marginBottom: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		...shadows.sm,
	},
	tripRow: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	tripIconContainer: {
		width: 48,
		height: 48,
		borderRadius: borderRadius.lg,
		backgroundColor: colors.primary.DEFAULT + "20",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 16,
	},
	tripInfo: {
		flex: 1,
	},
	tripRoute: {
		fontSize: 16,
		fontWeight: "500",
		color: colors.text.primary,
	},
	tripDate: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: 2,
	},
	tripPassengers: {
		fontSize: 14,
		color: colors.text.secondary,
	},
	tripEarnings: {
		fontSize: 16,
		fontWeight: "bold",
		color: colors.success.DEFAULT,
	},
});
