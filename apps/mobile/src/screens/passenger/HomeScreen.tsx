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
import { useAuth } from "../../context/AuthContext";
import type { RootStackParamList } from "../../navigation/types";
import bookingService, { type Booking } from "../../services/bookingService";
import routeService, { type PopularRoute } from "../../services/routeService";
import tripService, { type Trip } from "../../services/tripService";

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, "PassengerTabs">;
};

export default function PassengerHomeScreen({ navigation }: Props) {
	const { user } = useAuth();
	const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
	const [popularRoutes, setPopularRoutes] = useState<PopularRoute[]>([]);
	const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const fetchData = useCallback(async () => {
		try {
			const [tripsRes, routesRes, bookingsRes] = await Promise.all([
				tripService.getUpcomingTrips().catch(() => []),
				routeService.getPopularRoutes().catch(() => []),
				bookingService.getUpcomingBookings().catch(() => []),
			]);
			setUpcomingTrips(tripsRes.slice(0, 5));
			setPopularRoutes(routesRes.slice(0, 4));
			setUpcomingBookings(bookingsRes.slice(0, 3));
		} catch (error) {
			console.error("Error fetching home data:", error);
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

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatPrice = (price: number) => {
		return `${price.toFixed(2)} TND`;
	};

	return (
		<View style={styles.container}>
			<StatusBar style="light" />
			<SafeAreaView style={styles.safeArea} edges={["top"]}>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={onRefresh}
							tintColor={colors.primary.DEFAULT}
						/>
					}
					showsVerticalScrollIndicator={false}
				>
					{/* Header */}
					<View style={styles.header}>
						<View>
							<Text style={styles.greeting}>
								Hello{user?.firstName ? `, ${user.firstName}` : ""}! 👋
							</Text>
							<Text style={styles.subGreeting}>Where are you going today?</Text>
						</View>
						<TouchableOpacity
							onPress={() => navigation.navigate("Notifications")}
							style={styles.notificationButton}
						>
							<Feather name="bell" size={22} color={colors.white} />
							<View style={styles.notificationBadge} />
						</TouchableOpacity>
					</View>

					{/* Bus Card with Background */}
					<ImageBackground
						source={require("../../../assets/bg.png")}
						style={styles.busCard}
						imageStyle={styles.busCardImage}
					>
						<View style={styles.busCardOverlay}>
							<View style={styles.busCardContent}>
								<View style={styles.busCardHeader}>
									<View style={styles.logoCircleSmall}>
										<Text style={styles.logoIconSmall}>🚌</Text>
									</View>
									<Text style={styles.busCardTitle}>EZGO</Text>
								</View>
								<Text style={styles.busCardSubtitle}>
									Smart Mobility for Tunisia
								</Text>
								<TouchableOpacity
									style={styles.bookNowButton}
									onPress={() => navigation.navigate("Search" as never)}
								>
									<Text style={styles.bookNowText}>Book a Trip</Text>
									<Feather
										name="arrow-right"
										size={18}
										color={colors.background.DEFAULT}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</ImageBackground>

					{/* Search Section */}
					<TouchableOpacity
						style={styles.searchBar}
						onPress={() => navigation.navigate("Search" as never)}
					>
						<View style={styles.searchIconContainer}>
							<Feather name="search" size={20} color={colors.primary.DEFAULT} />
						</View>
						<Text style={styles.searchPlaceholder}>Search destinations...</Text>
						<Feather name="sliders" size={20} color={colors.text.muted} />
					</TouchableOpacity>

					{/* Quick Actions */}
					<View style={styles.quickActions}>
						<TouchableOpacity
							style={styles.quickActionItem}
							onPress={() => navigation.navigate("Search" as never)}
						>
							<View
								style={[
									styles.quickActionIcon,
									{ backgroundColor: colors.primary.DEFAULT + "20" },
								]}
							>
								<Feather
									name="map-pin"
									size={24}
									color={colors.primary.DEFAULT}
								/>
							</View>
							<Text style={styles.quickActionText}>Search</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.quickActionItem}
							onPress={() => navigation.navigate("MyTrips" as never)}
						>
							<View
								style={[
									styles.quickActionIcon,
									{ backgroundColor: colors.info.DEFAULT + "20" },
								]}
							>
								<Feather name="clock" size={24} color={colors.info.DEFAULT} />
							</View>
							<Text style={styles.quickActionText}>My Trips</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.quickActionItem}
							onPress={() => navigation.navigate("Notifications")}
						>
							<View
								style={[
									styles.quickActionIcon,
									{ backgroundColor: colors.success.DEFAULT + "20" },
								]}
							>
								<Feather name="bell" size={24} color={colors.success.DEFAULT} />
							</View>
							<Text style={styles.quickActionText}>Alerts</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.quickActionItem}
							onPress={() => navigation.navigate("Profile" as never)}
						>
							<View
								style={[
									styles.quickActionIcon,
									{ backgroundColor: colors.warning.DEFAULT + "20" },
								]}
							>
								<Feather name="user" size={24} color={colors.warning.DEFAULT} />
							</View>
							<Text style={styles.quickActionText}>Profile</Text>
						</TouchableOpacity>
					</View>

					{/* Upcoming Bookings */}
					{upcomingBookings.length > 0 && (
						<View style={styles.section}>
							<View style={styles.sectionHeader}>
								<Text style={styles.sectionTitle}>Your Upcoming Trips</Text>
								<TouchableOpacity
									onPress={() => navigation.navigate("MyTrips" as never)}
								>
									<Text style={styles.sectionLink}>View All</Text>
								</TouchableOpacity>
							</View>

							{upcomingBookings.map((booking) => (
								<TouchableOpacity
									key={booking.id}
									style={styles.bookingCard}
									onPress={() =>
										navigation.navigate("TicketDetails", {
											bookingId: booking.id,
										})
									}
								>
									<View style={styles.bookingCardLeft}>
										<View style={styles.bookingRoute}>
											<Text style={styles.routeCity}>
												{booking.trip?.route?.originCity}
											</Text>
											<View style={styles.routeArrow}>
												<View style={styles.routeDot} />
												<View style={styles.routeLine} />
												<Feather
													name="chevron-right"
													size={16}
													color={colors.primary.DEFAULT}
												/>
											</View>
											<Text style={styles.routeCity}>
												{booking.trip?.route?.destinationCity}
											</Text>
										</View>

										{booking.trip && (
											<View style={styles.bookingDetails}>
												<View style={styles.bookingDetailItem}>
													<Feather
														name="calendar"
														size={14}
														color={colors.text.muted}
													/>
													<Text style={styles.bookingDetailText}>
														{new Date(
															booking.trip.departureTime,
														).toLocaleDateString()}
													</Text>
												</View>
												<View style={styles.bookingDetailItem}>
													<Feather
														name="clock"
														size={14}
														color={colors.text.muted}
													/>
													<Text style={styles.bookingDetailText}>
														{formatTime(booking.trip.departureTime)}
													</Text>
												</View>
											</View>
										)}
									</View>

									<View
										style={[
											styles.bookingStatus,
											booking.status === "CONFIRMED"
												? styles.statusConfirmed
												: styles.statusPending,
										]}
									>
										<Text
											style={[
												styles.statusText,
												booking.status === "CONFIRMED"
													? styles.statusTextConfirmed
													: styles.statusTextPending,
											]}
										>
											{booking.status}
										</Text>
									</View>
								</TouchableOpacity>
							))}
						</View>
					)}

					{/* Popular Routes */}
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Popular Routes</Text>
						</View>

						{isLoading ? (
							<ActivityIndicator size="small" color={colors.primary.DEFAULT} />
						) : popularRoutes.length > 0 ? (
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={styles.popularRoutesScroll}
							>
								{popularRoutes.map((route) => (
									<TouchableOpacity
										key={`route-${route.originCity}-${route.destinationCity}`}
										style={styles.popularRouteCard}
										onPress={() => navigation.navigate("Search" as never)}
									>
										<View style={styles.popularRouteHeader}>
											<Feather
												name="navigation"
												size={18}
												color={colors.primary.DEFAULT}
											/>
										</View>
										<Text style={styles.popularRouteOrigin} numberOfLines={1}>
											{route.originCity}
										</Text>
										<View style={styles.popularRouteArrow}>
											<View style={styles.arrowLine} />
											<Feather
												name="chevron-down"
												size={14}
												color={colors.text.muted}
											/>
										</View>
										<Text style={styles.popularRouteDest} numberOfLines={1}>
											{route.destinationCity}
										</Text>
										<View style={styles.popularRouteFooter}>
											<Text style={styles.popularRoutePrice}>
												From {formatPrice(route.minPrice)}
											</Text>
											<Text style={styles.popularRouteCount}>
												{route.tripCount} trips
											</Text>
										</View>
									</TouchableOpacity>
								))}
							</ScrollView>
						) : (
							<View style={styles.emptyState}>
								<Feather name="map" size={32} color={colors.text.muted} />
								<Text style={styles.emptyStateText}>No popular routes</Text>
							</View>
						)}
					</View>

					{/* Available Trips */}
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Available Trips</Text>
							<TouchableOpacity
								onPress={() => navigation.navigate("Search" as never)}
							>
								<Text style={styles.sectionLink}>View All</Text>
							</TouchableOpacity>
						</View>

						{isLoading ? (
							<ActivityIndicator size="small" color={colors.primary.DEFAULT} />
						) : upcomingTrips.length > 0 ? (
							upcomingTrips.map((trip) => (
								<TouchableOpacity
									key={trip.id}
									style={styles.tripCard}
									onPress={() =>
										navigation.navigate("TripDetails", { tripId: trip.id })
									}
								>
									<View style={styles.tripCardHeader}>
										<View style={styles.tripRoute}>
											<Text style={styles.tripCities}>
												{trip.route?.originCity} → {trip.route?.destinationCity}
											</Text>
										</View>
										<View style={styles.seatsBadge}>
											<Text style={styles.seatsText}>
												{trip.availableSeats} seats
											</Text>
										</View>
									</View>

									<View style={styles.tripInfo}>
										<View style={styles.tripInfoItem}>
											<Feather
												name="clock"
												size={16}
												color={colors.text.muted}
											/>
											<Text style={styles.tripInfoText}>
												{formatTime(trip.departureTime)}
											</Text>
										</View>

										{trip.bus?.company && (
											<View style={styles.tripInfoItem}>
												<Feather
													name="truck"
													size={16}
													color={colors.text.muted}
												/>
												<Text style={styles.tripInfoText}>
													{trip.bus.company.name}
												</Text>
											</View>
										)}
									</View>

									<View style={styles.tripCardFooter}>
										<Text style={styles.tripPrice}>
											{formatPrice(trip.dynamicPrice || trip.basePrice)}
										</Text>
										<TouchableOpacity
											style={styles.bookButton}
											onPress={() =>
												navigation.navigate("Booking", { tripId: trip.id })
											}
										>
											<Text style={styles.bookButtonText}>Book Now</Text>
											<Feather
												name="arrow-right"
												size={16}
												color={colors.background.DEFAULT}
											/>
										</TouchableOpacity>
									</View>
								</TouchableOpacity>
							))
						) : (
							<View style={styles.emptyState}>
								<Feather name="calendar" size={32} color={colors.text.muted} />
								<Text style={styles.emptyStateText}>No trips available</Text>
								<TouchableOpacity
									style={styles.emptyStateButton}
									onPress={() => navigation.navigate("Search" as never)}
								>
									<Text style={styles.emptyStateButtonText}>Search Trips</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
	},
	safeArea: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 24,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 8,
		paddingBottom: 16,
	},
	greeting: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.white,
	},
	subGreeting: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: 4,
	},
	notificationButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: colors.background.secondary,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
	},
	notificationBadge: {
		position: "absolute",
		top: 10,
		right: 10,
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: colors.primary.DEFAULT,
	},
	busCard: {
		marginHorizontal: 20,
		height: 180,
		borderRadius: 20,
		overflow: "hidden",
		marginBottom: 20,
	},
	busCardImage: {
		borderRadius: 20,
	},
	busCardOverlay: {
		flex: 1,
		backgroundColor: "rgba(13, 13, 26, 0.7)",
		padding: 20,
		justifyContent: "center",
	},
	busCardContent: {
		gap: 8,
	},
	busCardHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	logoCircleSmall: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.primary.DEFAULT,
		justifyContent: "center",
		alignItems: "center",
	},
	logoIconSmall: {
		fontSize: 20,
	},
	busCardTitle: {
		fontSize: 28,
		fontWeight: "800",
		color: colors.white,
		letterSpacing: 2,
	},
	busCardSubtitle: {
		fontSize: 14,
		color: colors.text.secondary,
		marginBottom: 8,
	},
	bookNowButton: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
		backgroundColor: colors.primary.DEFAULT,
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 25,
		gap: 8,
	},
	bookNowText: {
		color: colors.background.DEFAULT,
		fontSize: 14,
		fontWeight: "700",
	},
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 20,
		backgroundColor: colors.background.secondary,
		borderRadius: 16,
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
		marginBottom: 20,
	},
	searchIconContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: colors.primary.DEFAULT + "20",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	searchPlaceholder: {
		flex: 1,
		color: colors.text.muted,
		fontSize: 16,
	},
	quickActions: {
		flexDirection: "row",
		paddingHorizontal: 20,
		marginBottom: 24,
		gap: 12,
	},
	quickActionItem: {
		flex: 1,
		alignItems: "center",
	},
	quickActionIcon: {
		width: 52,
		height: 52,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
	},
	quickActionText: {
		fontSize: 12,
		color: colors.text.secondary,
		fontWeight: "500",
	},
	section: {
		marginBottom: 24,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: colors.white,
	},
	sectionLink: {
		fontSize: 14,
		color: colors.primary.DEFAULT,
		fontWeight: "600",
	},
	bookingCard: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginHorizontal: 20,
		backgroundColor: colors.background.secondary,
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
		borderLeftWidth: 3,
		borderLeftColor: colors.primary.DEFAULT,
	},
	bookingCardLeft: {
		flex: 1,
	},
	bookingRoute: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 8,
	},
	routeCity: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.white,
	},
	routeArrow: {
		flexDirection: "row",
		alignItems: "center",
	},
	routeDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: colors.primary.DEFAULT,
	},
	routeLine: {
		width: 20,
		height: 2,
		backgroundColor: colors.primary.DEFAULT + "50",
	},
	bookingDetails: {
		flexDirection: "row",
		gap: 16,
	},
	bookingDetailItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	bookingDetailText: {
		fontSize: 13,
		color: colors.text.muted,
	},
	bookingStatus: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
	},
	statusConfirmed: {
		backgroundColor: colors.success.background,
	},
	statusPending: {
		backgroundColor: colors.warning.background,
	},
	statusText: {
		fontSize: 11,
		fontWeight: "600",
		textTransform: "uppercase",
	},
	statusTextConfirmed: {
		color: colors.success.DEFAULT,
	},
	statusTextPending: {
		color: colors.warning.DEFAULT,
	},
	popularRoutesScroll: {
		paddingLeft: 20,
		paddingRight: 8,
	},
	popularRouteCard: {
		width: 160,
		backgroundColor: colors.background.secondary,
		borderRadius: 16,
		padding: 16,
		marginRight: 12,
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
	},
	popularRouteHeader: {
		marginBottom: 12,
	},
	popularRouteOrigin: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.white,
	},
	popularRouteArrow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 4,
	},
	arrowLine: {
		width: 1,
		height: 16,
		backgroundColor: colors.border.light,
		marginRight: 8,
	},
	popularRouteDest: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.white,
	},
	popularRouteFooter: {
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: colors.border.DEFAULT,
	},
	popularRoutePrice: {
		fontSize: 14,
		fontWeight: "700",
		color: colors.primary.DEFAULT,
	},
	popularRouteCount: {
		fontSize: 12,
		color: colors.text.muted,
		marginTop: 2,
	},
	tripCard: {
		marginHorizontal: 20,
		backgroundColor: colors.background.secondary,
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
	},
	tripCardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	tripRoute: {},
	tripCities: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.white,
	},
	seatsBadge: {
		backgroundColor: colors.success.background,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
	},
	seatsText: {
		fontSize: 12,
		fontWeight: "600",
		color: colors.success.DEFAULT,
	},
	tripInfo: {
		flexDirection: "row",
		gap: 16,
		marginBottom: 16,
	},
	tripInfoItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	tripInfoText: {
		fontSize: 14,
		color: colors.text.muted,
	},
	tripCardFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: colors.border.DEFAULT,
	},
	tripPrice: {
		fontSize: 18,
		fontWeight: "700",
		color: colors.primary.DEFAULT,
	},
	bookButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.primary.DEFAULT,
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 12,
		gap: 6,
	},
	bookButtonText: {
		color: colors.background.DEFAULT,
		fontSize: 14,
		fontWeight: "600",
	},
	emptyState: {
		alignItems: "center",
		paddingVertical: 32,
		marginHorizontal: 20,
		backgroundColor: colors.background.secondary,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
	},
	emptyStateText: {
		color: colors.text.muted,
		marginTop: 12,
		fontSize: 14,
	},
	emptyStateButton: {
		marginTop: 16,
	},
	emptyStateButtonText: {
		color: colors.primary.DEFAULT,
		fontWeight: "600",
	},
});
