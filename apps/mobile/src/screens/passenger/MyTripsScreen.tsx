import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	ImageBackground,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";
import type { RootStackParamList } from "../../navigation/types";
import bookingService, { type Booking } from "../../services/bookingService";

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, "MyTrips">;
};

export default function MyTripsScreen({ navigation }: Props) {
	const [upcomingTrips, setUpcomingTrips] = useState<Booking[]>([]);
	const [pastTrips, setPastTrips] = useState<Booking[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchBookings = useCallback(async () => {
		try {
			const bookings = await bookingService.getMyBookings();
			const now = new Date();

			const upcoming: Booking[] = [];
			const past: Booking[] = [];

			bookings.forEach((booking) => {
				const tripDate = new Date(booking.trip?.departureTime || "");
				if (tripDate > now && booking.status !== "CANCELLED") {
					upcoming.push(booking);
				} else {
					past.push(booking);
				}
			});

			// Sort upcoming by departure time (soonest first)
			upcoming.sort(
				(a, b) =>
					new Date(a.trip?.departureTime || "").getTime() -
					new Date(b.trip?.departureTime || "").getTime(),
			);

			// Sort past by departure time (most recent first)
			past.sort(
				(a, b) =>
					new Date(b.trip?.departureTime || "").getTime() -
					new Date(a.trip?.departureTime || "").getTime(),
			);

			setUpcomingTrips(upcoming);
			setPastTrips(past);
			setError(null);
		} catch (err) {
			setError("Failed to load bookings");
			console.error(err);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchBookings();
	}, [fetchBookings]);

	const onRefresh = () => {
		setIsRefreshing(true);
		fetchBookings();
	};

	const formatDate = (dateString: string) => {
		const d = new Date(dateString);
		return d.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatTime = (dateString: string) => {
		const d = new Date(dateString);
		return d.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatPrice = (price: number) => {
		return `${price.toFixed(2)} TND`;
	};

	const getStatusStyle = (status: string) => {
		switch (status) {
			case "CONFIRMED":
				return { bg: "#22c55e20", text: "#22c55e" };
			case "PENDING":
				return { bg: "#f59e0b20", text: "#f59e0b" };
			case "CANCELLED":
				return { bg: "#ef444420", text: "#ef4444" };
			case "COMPLETED":
				return { bg: colors.background.card, text: colors.text.muted };
			default:
				return { bg: colors.background.card, text: colors.text.muted };
		}
	};

	if (isLoading) {
		return (
			<ImageBackground
				source={require("../../../assets/bg.png")}
				style={styles.background}
				resizeMode="cover"
			>
				<View style={styles.overlay}>
					<SafeAreaView style={styles.loadingContainer}>
						<ActivityIndicator size="large" color={colors.primary.DEFAULT} />
						<Text style={styles.loadingText}>Loading your trips...</Text>
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
				<StatusBar style="light" />
				<SafeAreaView style={styles.container} edges={["top"]}>
					<ScrollView
						style={styles.scrollView}
						refreshControl={
							<RefreshControl
								refreshing={isRefreshing}
								onRefresh={onRefresh}
								tintColor={colors.primary.DEFAULT}
							/>
						}
					>
						{/* Header */}
						<View style={styles.header}>
							<Text style={styles.headerTitle}>My Trips</Text>
							<Text style={styles.headerSubtitle}>View your bookings</Text>
						</View>

						{error ? (
							<View style={styles.errorContainer}>
								<View style={styles.errorIconContainer}>
									<Feather name="alert-circle" size={32} color="#ef4444" />
								</View>
								<Text style={styles.errorTitle}>{error}</Text>
								<TouchableOpacity
									style={styles.retryButton}
									onPress={fetchBookings}
								>
									<Text style={styles.retryButtonText}>Try Again</Text>
								</TouchableOpacity>
							</View>
						) : upcomingTrips.length === 0 && pastTrips.length === 0 ? (
							<View style={styles.emptyContainer}>
								<View style={styles.emptyIconContainer}>
									<Feather
										name="calendar"
										size={40}
										color={colors.primary.DEFAULT}
									/>
								</View>
								<Text style={styles.emptyTitle}>No trips yet</Text>
								<Text style={styles.emptySubtitle}>
									Book your first trip and it will appear here
								</Text>
								<TouchableOpacity
									style={styles.searchButton}
									onPress={() => navigation.navigate("Search")}
								>
									<Feather
										name="search"
										size={18}
										color={colors.background.DEFAULT}
									/>
									<Text style={styles.searchButtonText}>Search Trips</Text>
								</TouchableOpacity>
							</View>
						) : (
							<View style={styles.content}>
								{/* Upcoming Trips */}
								{upcomingTrips.length > 0 && (
									<View style={styles.section}>
										<Text style={styles.sectionTitle}>
											Upcoming Trips ({upcomingTrips.length})
										</Text>

										{upcomingTrips.map((booking) => {
											const statusStyle = getStatusStyle(booking.status);
											return (
												<TouchableOpacity
													key={booking.id}
													style={styles.tripCard}
													onPress={() =>
														navigation.navigate("TicketDetails", {
															bookingId: booking.id,
														})
													}
												>
													<View style={styles.tripHeader}>
														<Text style={styles.tripRoute} numberOfLines={1}>
															{booking.trip?.route?.originCity} →{" "}
															{booking.trip?.route?.destinationCity}
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
																{booking.status}
															</Text>
														</View>
													</View>

													<View style={styles.tripDetailRow}>
														<Feather
															name="clock"
															size={14}
															color={colors.text.muted}
														/>
														<Text style={styles.tripDetailText}>
															{formatDate(booking.trip?.departureTime || "")} at{" "}
															{formatTime(booking.trip?.departureTime || "")}
														</Text>
													</View>

													{booking.seatNumbers &&
														booking.seatNumbers.length > 0 && (
															<View style={styles.tripDetailRow}>
																<Feather
																	name="map-pin"
																	size={14}
																	color={colors.text.muted}
																/>
																<Text style={styles.tripDetailText}>
																	Seat
																	{booking.seatNumbers.length > 1 ? "s" : ""}:{" "}
																	{booking.seatNumbers.join(", ")}
																</Text>
															</View>
														)}

													<View style={styles.tripFooter}>
														<View style={styles.priceContainer}>
															<Feather
																name="dollar-sign"
																size={14}
																color={colors.primary.DEFAULT}
															/>
															<Text style={styles.priceText}>
																{formatPrice(booking.totalAmount)}
															</Text>
														</View>
														<View style={styles.viewTicketButton}>
															<Text style={styles.viewTicketText}>
																View Ticket
															</Text>
															<Feather
																name="chevron-right"
																size={16}
																color={colors.background.DEFAULT}
															/>
														</View>
													</View>
												</TouchableOpacity>
											);
										})}
									</View>
								)}

								{/* Past Trips */}
								{pastTrips.length > 0 && (
									<View style={styles.section}>
										<Text style={styles.sectionTitle}>
											Past Trips ({pastTrips.length})
										</Text>

										{pastTrips.map((booking) => {
											const statusStyle = getStatusStyle(booking.status);
											return (
												<TouchableOpacity
													key={booking.id}
													style={[styles.tripCard, styles.pastTripCard]}
													onPress={() =>
														navigation.navigate("TicketDetails", {
															bookingId: booking.id,
														})
													}
												>
													<View style={styles.tripHeader}>
														<Text style={styles.tripRoute} numberOfLines={1}>
															{booking.trip?.route?.originCity} →{" "}
															{booking.trip?.route?.destinationCity}
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
																{booking.status}
															</Text>
														</View>
													</View>

													<View style={styles.tripDetailRow}>
														<Feather
															name="clock"
															size={14}
															color={colors.text.muted}
														/>
														<Text style={styles.tripDetailText}>
															{formatDate(booking.trip?.departureTime || "")} at{" "}
															{formatTime(booking.trip?.departureTime || "")}
														</Text>
													</View>

													<View style={styles.tripFooter}>
														<View style={styles.priceContainer}>
															<Feather
																name="dollar-sign"
																size={14}
																color={colors.text.muted}
															/>
															<Text
																style={[
																	styles.priceText,
																	{ color: colors.text.muted },
																]}
															>
																{formatPrice(booking.totalAmount)}
															</Text>
														</View>
														{booking.status === "CONFIRMED" &&
															new Date(booking.trip?.arrivalTime || "") <
																new Date() && (
																<TouchableOpacity
																	style={styles.rateButton}
																	onPress={() =>
																		navigation.navigate("RateTrip", {
																			bookingId: booking.id,
																		})
																	}
																>
																	<Feather
																		name="star"
																		size={14}
																		color="#f59e0b"
																	/>
																	<Text style={styles.rateButtonText}>
																		Rate Trip
																	</Text>
																</TouchableOpacity>
															)}
													</View>
												</TouchableOpacity>
											);
										})}
									</View>
								)}
							</View>
						)}

						<View style={{ height: 32 }} />
					</ScrollView>
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
		backgroundColor: "rgba(13, 13, 26, 0.95)",
	},
	container: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		color: colors.text.muted,
		marginTop: 16,
		fontSize: 14,
	},
	scrollView: {
		flex: 1,
	},
	header: {
		backgroundColor: colors.background.secondary,
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 24,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
		borderWidth: 1,
		borderTopWidth: 0,
		borderColor: colors.background.card,
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "700",
		color: colors.text.primary,
	},
	headerSubtitle: {
		fontSize: 14,
		color: colors.text.muted,
		marginTop: 4,
	},
	content: {
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.text.primary,
		marginBottom: 16,
	},
	tripCard: {
		backgroundColor: colors.background.card,
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
	},
	pastTripCard: {
		opacity: 0.8,
	},
	tripHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	tripRoute: {
		flex: 1,
		fontSize: 16,
		fontWeight: "600",
		color: colors.text.primary,
		marginRight: 12,
	},
	statusBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 11,
		fontWeight: "600",
		textTransform: "uppercase",
	},
	tripDetailRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	tripDetailText: {
		fontSize: 13,
		color: colors.text.secondary,
		marginLeft: 8,
	},
	tripFooter: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "rgba(255, 255, 255, 0.1)",
	},
	priceContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	priceText: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.primary.DEFAULT,
		marginLeft: 4,
	},
	viewTicketButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.primary.DEFAULT,
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 10,
	},
	viewTicketText: {
		fontSize: 13,
		fontWeight: "600",
		color: colors.background.DEFAULT,
		marginRight: 4,
	},
	rateButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(245, 158, 11, 0.15)",
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 10,
	},
	rateButtonText: {
		fontSize: 13,
		fontWeight: "600",
		color: "#f59e0b",
		marginLeft: 6,
	},
	errorContainer: {
		alignItems: "center",
		paddingHorizontal: 24,
		paddingTop: 48,
	},
	errorIconContainer: {
		width: 72,
		height: 72,
		borderRadius: 36,
		backgroundColor: "rgba(239, 68, 68, 0.15)",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
	},
	errorTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.text.primary,
		marginBottom: 16,
	},
	retryButton: {
		backgroundColor: colors.primary.DEFAULT,
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 12,
	},
	retryButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.background.DEFAULT,
	},
	emptyContainer: {
		alignItems: "center",
		paddingHorizontal: 24,
		paddingTop: 64,
	},
	emptyIconContainer: {
		width: 88,
		height: 88,
		borderRadius: 44,
		backgroundColor: colors.background.secondary,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
		borderWidth: 2,
		borderColor: colors.primary.DEFAULT,
	},
	emptyTitle: {
		fontSize: 22,
		fontWeight: "700",
		color: colors.text.primary,
		marginBottom: 8,
	},
	emptySubtitle: {
		fontSize: 14,
		color: colors.text.muted,
		textAlign: "center",
		marginBottom: 24,
	},
	searchButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.primary.DEFAULT,
		paddingHorizontal: 24,
		paddingVertical: 14,
		borderRadius: 12,
		shadowColor: colors.primary.DEFAULT,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	searchButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.background.DEFAULT,
		marginLeft: 8,
	},
});
