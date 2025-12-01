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
import type { RootStackParamList } from "../../navigation/types";
import tripService, { type Trip } from "../../services/tripService";

interface ApiError {
	message?: string;
}

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, "DriverTabs">;
};

export default function ScheduleScreen({ navigation }: Props) {
	const [trips, setTrips] = useState<Trip[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [startingTripId, setStartingTripId] = useState<string | null>(null);
	const [selectedDate, setSelectedDate] = useState(new Date());

	const fetchTrips = useCallback(async () => {
		try {
			const data = await tripService.getDriverTrips();
			setTrips(data);
		} catch (error) {
			console.error("Failed to fetch trips:", error);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchTrips();
	}, [fetchTrips]);

	const onRefresh = () => {
		setIsRefreshing(true);
		fetchTrips();
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
		return new Date(dateString).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};

	const getDateLabel = (dateString: string) => {
		const tripDate = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (tripDate.toDateString() === today.toDateString()) {
			return "Today";
		} else if (tripDate.toDateString() === tomorrow.toDateString()) {
			return "Tomorrow";
		} else {
			return tripDate.toLocaleDateString("en-US", {
				weekday: "short",
				month: "short",
				day: "numeric",
			});
		}
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

	// Group trips by date
	const groupedTrips = trips.reduce(
		(groups, trip) => {
			const dateLabel = getDateLabel(trip.departureTime);
			if (!groups[dateLabel]) {
				groups[dateLabel] = [];
			}
			groups[dateLabel].push(trip);
			return groups;
		},
		{} as Record<string, Trip[]>,
	);

	// Generate week dates for calendar strip
	const getWeekDates = () => {
		const dates = [];
		const today = new Date();
		for (let i = -3; i <= 3; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() + i);
			dates.push(date);
		}
		return dates;
	};

	const weekDates = getWeekDates();

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			{/* Header */}
			<LinearGradient
				colors={gradients.primary}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={styles.header}
			>
				<Text style={styles.headerTitle}>My Schedule</Text>
				<Text style={styles.headerSubtitle}>{formatDate(selectedDate)}</Text>
			</LinearGradient>

			{/* Calendar Strip */}
			<View style={styles.calendarStrip}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{weekDates.map((date) => {
						const isSelected =
							date.toDateString() === selectedDate.toDateString();
						const isToday = date.toDateString() === new Date().toDateString();
						return (
							<TouchableOpacity
								key={date.toISOString()}
								onPress={() => setSelectedDate(date)}
								style={[
									styles.calendarDay,
									isSelected && styles.calendarDaySelected,
									!isSelected && isToday && styles.calendarDayToday,
								]}
							>
								<Text
									style={[
										styles.calendarWeekday,
										isSelected && styles.calendarTextSelected,
									]}
								>
									{date.toLocaleDateString("en-US", { weekday: "short" })}
								</Text>
								<Text
									style={[
										styles.calendarDate,
										isSelected && styles.calendarTextSelectedBold,
									]}
								>
									{date.getDate()}
								</Text>
							</TouchableOpacity>
						);
					})}
				</ScrollView>
			</View>

			{isLoading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={colors.primary.DEFAULT} />
				</View>
			) : (
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={onRefresh}
							tintColor={colors.primary.DEFAULT}
						/>
					}
				>
					{Object.keys(groupedTrips).length > 0 ? (
						Object.entries(groupedTrips).map(([date, dateTrips]) => (
							<View key={date} style={styles.dateGroup}>
								<Text style={styles.dateLabel}>{date}</Text>
								{dateTrips.map((trip) => {
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
													navigation.navigate("ActiveTrip", {
														tripId: trip.id,
													});
												} else {
													navigation.navigate("TripPassengers", {
														tripId: trip.id,
													});
												}
											}}
										>
											<View style={styles.tripHeader}>
												<Text style={styles.tripRoute}>
													{trip.route?.originCity} →{" "}
													{trip.route?.destinationCity}
												</Text>
												<View
													style={[
														styles.statusBadge,
														{ backgroundColor: statusStyle.bg },
													]}
												>
													<Text
														style={[
															styles.statusText,
															{ color: statusStyle.text },
														]}
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
															<Text style={styles.startButtonText}>
																Start Trip
															</Text>
														)}
													</LinearGradient>
												</TouchableOpacity>
											)}

											{isActive && (
												<TouchableOpacity
													style={styles.continueButton}
													onPress={() =>
														navigation.navigate("ActiveTrip", {
															tripId: trip.id,
														})
													}
												>
													<Text style={styles.continueButtonText}>
														Continue Trip
													</Text>
												</TouchableOpacity>
											)}
										</TouchableOpacity>
									);
								})}
							</View>
						))
					) : (
						<View style={styles.emptyCard}>
							<View style={styles.emptyIconContainer}>
								<Feather name="calendar" size={48} color={colors.text.muted} />
							</View>
							<Text style={styles.emptyTitle}>No trips scheduled</Text>
							<Text style={styles.emptySubtitle}>
								Check back later for new assignments
							</Text>
						</View>
					)}
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
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 32,
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
	calendarStrip: {
		backgroundColor: colors.background.card,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.DEFAULT,
	},
	calendarDay: {
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginHorizontal: 4,
		borderRadius: borderRadius.xl,
		backgroundColor: colors.background.tertiary,
	},
	calendarDaySelected: {
		backgroundColor: colors.primary.DEFAULT,
	},
	calendarDayToday: {
		backgroundColor: colors.primary.DEFAULT + "30",
	},
	calendarWeekday: {
		fontSize: 12,
		color: colors.text.secondary,
	},
	calendarDate: {
		fontSize: 18,
		fontWeight: "bold",
		color: colors.text.primary,
		marginTop: 4,
	},
	calendarTextSelected: {
		color: colors.text.inverse,
		opacity: 0.8,
	},
	calendarTextSelectedBold: {
		color: colors.text.inverse,
	},
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 24,
		paddingTop: 24,
		paddingBottom: 32,
	},
	dateGroup: {
		marginBottom: 24,
	},
	dateLabel: {
		fontSize: 18,
		fontWeight: "bold",
		color: colors.text.primary,
		marginBottom: 12,
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
		marginTop: 24,
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
});
