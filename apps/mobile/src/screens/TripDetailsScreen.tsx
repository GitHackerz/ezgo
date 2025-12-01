import { Feather } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { borderRadius, colors, shadows } from "../constants/theme";
import type { RootStackParamList } from "../navigation/types";
import tripService, { type Trip, type TripStop } from "../services/tripService";

type Props = {
	route: RouteProp<RootStackParamList, "TripDetails">;
	navigation: NativeStackNavigationProp<RootStackParamList, "TripDetails">;
};

export default function TripDetailsScreen({ route, navigation }: Props) {
	const { tripId } = route.params;
	const [trip, setTrip] = useState<Trip | null>(null);
	const [stops, setStops] = useState<TripStop[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchTripDetails = useCallback(async () => {
		try {
			const [tripData, stopsData] = await Promise.all([
				tripService.getTripById(tripId),
				tripService.getTripStops(tripId).catch(() => []),
			]);
			setTrip(tripData);
			setStops(stopsData);
		} catch (error) {
			console.error("Failed to fetch trip details:", error);
		} finally {
			setLoading(false);
		}
	}, [tripId]);

	useEffect(() => {
		fetchTripDetails();
	}, [fetchTripDetails]);

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={colors.primary.DEFAULT} />
			</SafeAreaView>
		);
	}

	if (!trip) {
		return (
			<SafeAreaView style={styles.errorContainer}>
				<Feather name="alert-circle" size={64} color={colors.error.DEFAULT} />
				<Text style={styles.errorText}>Trip not found</Text>
				<TouchableOpacity
					style={styles.errorButton}
					onPress={() => navigation.goBack()}
				>
					<Text style={styles.errorButtonText}>Go Back</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	const routeInfo = trip.route;
	const bus = trip.bus;
	const driver = trip.driver;
	const price = trip.dynamicPrice || trip.basePrice;

	// Generate stops from route if no specific stops
	const displayStops =
		stops.length > 0
			? stops.map((s) => ({
					name: s.stopName,
					time: formatTime(s.arrivalTime),
				}))
			: [
					{
						name: routeInfo?.originStation || routeInfo?.originCity || "Origin",
						time: formatTime(trip.departureTime),
					},
					{
						name:
							routeInfo?.destinationStation ||
							routeInfo?.destinationCity ||
							"Destination",
						time: formatTime(trip.arrivalTime),
					},
				];

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerContent}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<Feather name="arrow-left" size={24} color={colors.text.primary} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Trip Details</Text>
				</View>
				<View style={styles.routeInfo}>
					<Text style={styles.routeTitle}>
						{routeInfo?.originCity} → {routeInfo?.destinationCity}
					</Text>
					<Text style={styles.routeSubtitle}>
						{routeInfo?.originStation} → {routeInfo?.destinationStation}
					</Text>
				</View>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				{/* Time & Price Card */}
				<View style={styles.section}>
					<View style={styles.timeCard}>
						<View style={styles.timeRow}>
							<View>
								<Text style={styles.timeLabel}>Departure</Text>
								<Text style={styles.timeValue}>
									{formatTime(trip.departureTime)}
								</Text>
								<Text style={styles.dateValue}>
									{formatDate(trip.departureTime)}
								</Text>
							</View>
							<View style={styles.arrowContainer}>
								<Feather
									name="arrow-right"
									size={24}
									color={colors.primary.DEFAULT}
								/>
							</View>
							<View style={styles.alignEnd}>
								<Text style={styles.timeLabel}>Arrival</Text>
								<Text style={styles.timeValue}>
									{formatTime(trip.arrivalTime)}
								</Text>
								<Text style={styles.dateValue}>
									{formatDate(trip.arrivalTime)}
								</Text>
							</View>
						</View>
						<View style={styles.divider} />
						<View style={styles.bottomRow}>
							<View style={styles.seatsContainer}>
								<Feather
									name="users"
									size={20}
									color={colors.success.DEFAULT}
								/>
								<Text style={styles.seatsText}>
									{trip.availableSeats} seats available
								</Text>
							</View>
							<Text style={styles.priceText}>{price.toFixed(2)} TND</Text>
						</View>
					</View>
				</View>

				{/* Route Stops */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Route Stops</Text>
					<View style={styles.stopsCard}>
						{displayStops.map((stop, index) => (
							<View
								key={`stop-${stop.name}-${stop.time}`}
								style={styles.stopRow}
							>
								<View style={styles.stopIndicator}>
									<View
										style={[
											styles.stopDot,
											index === 0
												? styles.dotGreen
												: index === displayStops.length - 1
													? styles.dotRed
													: styles.dotOrange,
										]}
									/>
									{index < displayStops.length - 1 && (
										<View style={styles.stopLine} />
									)}
								</View>
								<View style={styles.stopContent}>
									<Text style={styles.stopName}>{stop.name}</Text>
									<Text style={styles.stopTime}>{stop.time}</Text>
								</View>
							</View>
						))}
					</View>
				</View>

				{/* Bus & Driver Info */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Bus & Driver Info</Text>
					<View style={styles.infoCard}>
						{bus && (
							<View style={styles.infoRow}>
								<View style={styles.iconContainerBlue}>
									<Feather
										name="truck"
										size={24}
										color={colors.primary.DEFAULT}
									/>
								</View>
								<View>
									<Text style={styles.infoTitle}>{bus.busType}</Text>
									<Text style={styles.infoSubtitle}>
										{bus.plateNumber} • {bus.capacity} seats
									</Text>
								</View>
							</View>
						)}
						{bus && driver && <View style={styles.infoDivider} />}
						{driver && (
							<View style={styles.infoRow}>
								<View style={styles.iconContainerGreen}>
									<Feather
										name="user"
										size={24}
										color={colors.success.DEFAULT}
									/>
								</View>
								<View style={styles.flex1}>
									<Text style={styles.infoTitle}>
										{driver.firstName} {driver.lastName}
									</Text>
									<View style={styles.verifiedRow}>
										<Feather
											name="star"
											size={14}
											color={colors.primary.DEFAULT}
										/>
										<Text style={styles.verifiedText}>Verified Driver</Text>
									</View>
								</View>
							</View>
						)}
					</View>
				</View>

				{/* Company Info */}
				{bus?.company && (
					<View style={styles.section}>
						<View style={styles.companyCard}>
							<View style={styles.iconContainerGray}>
								<Feather
									name="briefcase"
									size={24}
									color={colors.text.secondary}
								/>
							</View>
							<View>
								<Text style={styles.infoTitle}>{bus.company.name}</Text>
								<Text style={styles.infoSubtitle}>
									Licensed Transport Company
								</Text>
							</View>
						</View>
					</View>
				)}

				{/* Amenities */}
				{trip.amenities && trip.amenities.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Amenities</Text>
						<View style={styles.amenitiesCard}>
							<View style={styles.amenitiesWrapper}>
								{trip.amenities.map((amenity) => (
									<View key={amenity} style={styles.amenityBadge}>
										<Feather
											name="check"
											size={14}
											color={colors.success.DEFAULT}
										/>
										<Text style={styles.amenityText}>{amenity}</Text>
									</View>
								))}
							</View>
						</View>
					</View>
				)}

				<View style={styles.bottomSpacer} />
			</ScrollView>

			{/* Book Button */}
			<View style={styles.footer}>
				<TouchableOpacity
					style={styles.bookButton}
					onPress={() => navigation.navigate("Booking", { tripId: trip.id })}
				>
					<Text style={styles.bookButtonText}>
						Book This Trip - {price.toFixed(2)} TND
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
	},
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.background.DEFAULT,
	},
	errorContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.background.DEFAULT,
	},
	errorText: {
		color: colors.text.secondary,
		marginTop: 16,
		fontSize: 16,
	},
	errorButton: {
		marginTop: 16,
		backgroundColor: colors.primary.DEFAULT,
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: borderRadius.lg,
	},
	errorButtonText: {
		color: colors.text.inverse,
		fontWeight: "500",
	},
	header: {
		backgroundColor: colors.background.secondary,
		paddingHorizontal: 20,
		paddingTop: 48,
		paddingBottom: 20,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	backButton: {
		marginRight: 16,
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.background.tertiary,
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		color: colors.text.primary,
		fontSize: 20,
		fontWeight: "bold",
		flex: 1,
	},
	routeInfo: {
		marginTop: 8,
	},
	routeTitle: {
		color: colors.text.primary,
		fontSize: 24,
		fontWeight: "bold",
	},
	routeSubtitle: {
		color: colors.text.secondary,
		marginTop: 4,
		fontSize: 14,
	},
	scrollView: {
		flex: 1,
	},
	section: {
		paddingHorizontal: 20,
		marginTop: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: colors.text.primary,
		marginBottom: 12,
	},
	timeCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 20,
		...shadows.md,
	},
	timeRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	timeLabel: {
		color: colors.text.secondary,
		fontSize: 12,
		marginBottom: 4,
	},
	timeValue: {
		color: colors.text.primary,
		fontSize: 24,
		fontWeight: "bold",
	},
	dateValue: {
		color: colors.text.secondary,
		fontSize: 14,
		marginTop: 2,
	},
	arrowContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.primary.DEFAULT + "20",
		justifyContent: "center",
		alignItems: "center",
	},
	alignEnd: {
		alignItems: "flex-end",
	},
	divider: {
		height: 1,
		backgroundColor: colors.border.DEFAULT,
		marginVertical: 16,
	},
	bottomRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	seatsContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	seatsText: {
		color: colors.success.DEFAULT,
		marginLeft: 8,
		fontWeight: "500",
	},
	priceText: {
		color: colors.primary.DEFAULT,
		fontSize: 24,
		fontWeight: "bold",
	},
	stopsCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		...shadows.sm,
	},
	stopRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 16,
	},
	stopIndicator: {
		alignItems: "center",
		marginRight: 16,
	},
	stopDot: {
		width: 16,
		height: 16,
		borderRadius: 8,
	},
	dotGreen: {
		backgroundColor: colors.success.DEFAULT,
	},
	dotRed: {
		backgroundColor: colors.error.DEFAULT,
	},
	dotOrange: {
		backgroundColor: colors.primary.DEFAULT,
	},
	stopLine: {
		width: 2,
		height: 32,
		backgroundColor: colors.border.DEFAULT,
		marginTop: 4,
	},
	stopContent: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	stopName: {
		color: colors.text.primary,
		fontWeight: "500",
	},
	stopTime: {
		color: colors.text.secondary,
	},
	infoCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		...shadows.sm,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	iconContainerBlue: {
		backgroundColor: colors.primary.DEFAULT + "20",
		padding: 12,
		borderRadius: borderRadius.lg,
		marginRight: 16,
	},
	iconContainerGreen: {
		backgroundColor: colors.success.DEFAULT + "20",
		padding: 12,
		borderRadius: borderRadius.lg,
		marginRight: 16,
	},
	iconContainerGray: {
		backgroundColor: colors.background.tertiary,
		padding: 12,
		borderRadius: borderRadius.lg,
		marginRight: 16,
	},
	infoTitle: {
		color: colors.text.primary,
		fontWeight: "500",
		fontSize: 16,
	},
	infoSubtitle: {
		color: colors.text.secondary,
		fontSize: 14,
		marginTop: 2,
	},
	infoDivider: {
		height: 1,
		backgroundColor: colors.border.DEFAULT,
		marginVertical: 16,
	},
	flex1: {
		flex: 1,
	},
	verifiedRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 4,
	},
	verifiedText: {
		color: colors.text.secondary,
		fontSize: 14,
		marginLeft: 4,
	},
	companyCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
		...shadows.sm,
	},
	amenitiesCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		...shadows.sm,
	},
	amenitiesWrapper: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	amenityBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.success.DEFAULT + "20",
		borderRadius: borderRadius.full,
		paddingHorizontal: 12,
		paddingVertical: 6,
		marginRight: 8,
		marginBottom: 8,
	},
	amenityText: {
		color: colors.text.primary,
		marginLeft: 6,
		textTransform: "capitalize",
	},
	bottomSpacer: {
		height: 100,
	},
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: colors.background.secondary,
		borderTopWidth: 1,
		borderTopColor: colors.border.DEFAULT,
	},
	bookButton: {
		backgroundColor: colors.primary.DEFAULT,
		borderRadius: borderRadius.xl,
		paddingVertical: 16,
		alignItems: "center",
		...shadows.glow,
	},
	bookButtonText: {
		color: colors.text.inverse,
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 18,
	},
});
