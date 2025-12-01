import { Feather } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ImageBackground,
	Linking,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { borderRadius, colors } from "../../constants/theme";
import type { RootStackParamList } from "../../navigation/types";
import tripService, { type Trip } from "../../services/tripService";

type Props = {
	route: RouteProp<RootStackParamList, "ActiveTrip">;
	navigation: NativeStackNavigationProp<RootStackParamList, "ActiveTrip">;
};

interface Stop {
	name: string;
	time: string;
	status: "completed" | "next" | "upcoming";
	coordinates?: { lat: number; lng: number };
}

export default function ActiveTripScreen({ route, navigation }: Props) {
	const { tripId } = route.params;
	const [trip, setTrip] = useState<Trip | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [stops, setStops] = useState<Stop[]>([]);
	const [currentStopIndex, setCurrentStopIndex] = useState(0);

	const fetchTrip = useCallback(async () => {
		try {
			const tripData = await tripService.getTripById(tripId);
			setTrip(tripData);

			// Build stops from route data
			if (tripData.route) {
				const routeStops = tripData.route.stops || [];
				const departureTime = new Date(tripData.departureTime);
				const arrivalTime = new Date(tripData.arrivalTime);

				const generatedStops: Stop[] = [
					{
						name: tripData.route.originCity,
						time: departureTime.toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
						}),
						status: "completed",
					},
					...(routeStops.map((stop: string, index: number) => ({
						name: stop,
						time: new Date(
							departureTime.getTime() +
								((arrivalTime.getTime() - departureTime.getTime()) *
									(index + 1)) /
									(routeStops.length + 1),
						).toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
						}),
						status:
							index < currentStopIndex
								? "completed"
								: index === currentStopIndex
									? "next"
									: "upcoming",
					})) as Stop[]),
					{
						name: tripData.route.destinationCity,
						time: arrivalTime.toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
						}),
						status: "upcoming",
					},
				];

				setStops(generatedStops);
			}
		} catch (error) {
			console.error("Failed to fetch trip:", error);
			Alert.alert("Error", "Failed to load trip details");
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, [tripId, currentStopIndex]);

	useEffect(() => {
		fetchTrip();
	}, [fetchTrip]);

	const onRefresh = () => {
		setIsRefreshing(true);
		fetchTrip();
	};

	const handleArriveAtStop = () => {
		if (currentStopIndex < stops.length - 1) {
			setCurrentStopIndex((prev) => prev + 1);
			// Update stops status
			setStops((prevStops) =>
				prevStops.map((stop, index) => ({
					...stop,
					status:
						index < currentStopIndex + 1
							? "completed"
							: index === currentStopIndex + 1
								? "next"
								: "upcoming",
				})),
			);
		}
	};

	const handleOpenNavigation = () => {
		const nextStop = stops.find((s) => s.status === "next");
		if (nextStop?.coordinates) {
			const url = `https://www.google.com/maps/dir/?api=1&destination=${nextStop.coordinates.lat},${nextStop.coordinates.lng}&travelmode=driving`;
			Linking.openURL(url);
		} else {
			// If no coordinates, just open Google Maps
			Linking.openURL("https://www.google.com/maps");
		}
	};

	const handleCompleteTrip = () => {
		Alert.alert(
			"Complete Trip",
			"Are you sure you want to mark this trip as completed?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Complete",
					style: "default",
					onPress: async () => {
						try {
							setIsUpdating(true);
							await tripService.updateTripStatus(tripId, "COMPLETED");
							Alert.alert(
								"Trip Completed",
								"The trip has been marked as completed.",
								[
									{
										text: "OK",
										onPress: () => navigation.goBack(),
									},
								],
							);
						} catch (error) {
							console.error("Failed to complete trip:", error);
							Alert.alert("Error", "Failed to complete trip");
						} finally {
							setIsUpdating(false);
						}
					},
				},
			],
		);
	};

	const getNextStop = () => {
		return stops.find((s) => s.status === "next") || null;
	};

	const calculateETA = () => {
		const nextStop = getNextStop();
		if (!nextStop) return "N/A";

		const now = new Date();
		const [hours, minutes] = nextStop.time.split(/[:\s]/);
		const isPM = nextStop.time.includes("PM");
		let hour = parseInt(hours);
		if (isPM && hour !== 12) hour += 12;
		if (!isPM && hour === 12) hour = 0;

		const stopTime = new Date();
		stopTime.setHours(hour, parseInt(minutes), 0, 0);

		const diffMs = stopTime.getTime() - now.getTime();
		const diffMins = Math.max(0, Math.round(diffMs / 60000));

		if (diffMins < 60) return `${diffMins} mins`;
		return `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
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
						<Text style={styles.loadingText}>Loading trip...</Text>
					</SafeAreaView>
				</View>
			</ImageBackground>
		);
	}

	if (!trip) {
		return (
			<ImageBackground
				source={require("../../../assets/bg.png")}
				style={styles.background}
				resizeMode="cover"
			>
				<View style={styles.overlay}>
					<SafeAreaView style={styles.errorContainer}>
						<View style={styles.errorIconContainer}>
							<Feather name="alert-circle" size={48} color="#EF4444" />
						</View>
						<Text style={styles.errorTitle}>Trip not found</Text>
						<TouchableOpacity
							style={styles.errorButton}
							onPress={() => navigation.goBack()}
						>
							<Text style={styles.errorButtonText}>Go Back</Text>
						</TouchableOpacity>
					</SafeAreaView>
				</View>
			</ImageBackground>
		);
	}

	const nextStop = getNextStop();
	const bookedPassengers = trip.bus?.capacity
		? trip.bus.capacity - trip.availableSeats
		: 0;

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
							<View style={styles.headerTop}>
								<TouchableOpacity
									style={styles.backButton}
									onPress={() => navigation.goBack()}
								>
									<Feather
										name="arrow-left"
										size={24}
										color={colors.text.primary}
									/>
								</TouchableOpacity>
								<Text style={styles.headerTitle}>Active Trip</Text>
								<View style={styles.headerSpacer} />
							</View>
							<Text style={styles.headerSubtitle}>
								{trip.route?.originCity} → {trip.route?.destinationCity}
							</Text>
						</View>

						{/* Trip Status Card */}
						<View style={styles.statusCardContainer}>
							<View style={styles.statusCard}>
								<View style={styles.statusCardHeader}>
									<View>
										<Text style={styles.statusLabel}>Next Stop</Text>
										<Text style={styles.statusValue}>
											{nextStop?.name || trip.route?.destinationCity}
										</Text>
									</View>
									<View style={styles.etaBadge}>
										<Feather
											name="clock"
											size={14}
											color={colors.success.DEFAULT}
										/>
										<Text style={styles.etaText}>{calculateETA()}</Text>
									</View>
								</View>

								<View style={styles.statusCardDivider} />

								<View style={styles.statusCardFooter}>
									<View style={styles.statusItem}>
										<Feather name="users" size={18} color={colors.text.muted} />
										<Text style={styles.statusItemText}>
											{bookedPassengers}/{trip.bus?.capacity || 0} passengers
										</Text>
									</View>
									<View style={styles.statusItem}>
										<View style={styles.statusDot} />
										<Text style={styles.statusItemText}>
											{trip.status === "IN_PROGRESS"
												? "In Progress"
												: trip.status}
										</Text>
									</View>
								</View>
							</View>
						</View>

						{/* Quick Actions */}
						<View style={styles.quickActionsContainer}>
							<TouchableOpacity
								style={styles.quickActionCard}
								onPress={handleOpenNavigation}
							>
								<View style={styles.quickActionIconContainer}>
									<Feather
										name="navigation"
										size={28}
										color={colors.primary.DEFAULT}
									/>
								</View>
								<Text style={styles.quickActionText}>Navigation</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.quickActionCard}
								onPress={() =>
									navigation.navigate("TripPassengers", { tripId: trip.id })
								}
							>
								<View style={styles.quickActionIconContainer}>
									<Feather name="users" size={28} color={colors.info.DEFAULT} />
								</View>
								<Text style={styles.quickActionText}>Passengers</Text>
							</TouchableOpacity>
						</View>

						{/* Arrive at Stop Button */}
						{nextStop && currentStopIndex < stops.length - 1 && (
							<View style={styles.arriveButtonContainer}>
								<TouchableOpacity
									style={styles.arriveButton}
									onPress={handleArriveAtStop}
								>
									<Feather
										name="check-circle"
										size={20}
										color={colors.background.DEFAULT}
									/>
									<Text style={styles.arriveButtonText}>
										Arrived at {nextStop.name}
									</Text>
								</TouchableOpacity>
							</View>
						)}

						{/* Stops Timeline */}
						<View style={styles.timelineContainer}>
							<Text style={styles.timelineTitle}>Route Progress</Text>

							{stops.map((stop, index) => (
								<View key={`${stop.name}-${index}`} style={styles.timelineItem}>
									<View style={styles.timelineLeft}>
										{stop.status === "completed" ? (
											<View style={styles.timelineNodeCompleted}>
												<Feather name="check" size={14} color={colors.white} />
											</View>
										) : stop.status === "next" ? (
											<View style={styles.timelineNodeNext}>
												<View style={styles.timelineNodeNextInner} />
											</View>
										) : (
											<View style={styles.timelineNodeUpcoming} />
										)}
										{index < stops.length - 1 && (
											<View
												style={[
													styles.timelineLine,
													stop.status === "completed"
														? styles.timelineLineCompleted
														: styles.timelineLineUpcoming,
												]}
											/>
										)}
									</View>

									<View style={styles.timelineContent}>
										<Text
											style={[
												styles.timelineStopName,
												stop.status === "next" && styles.timelineStopNameNext,
												stop.status === "completed" &&
													styles.timelineStopNameCompleted,
											]}
										>
											{stop.name}
										</Text>
										<Text style={styles.timelineStopTime}>{stop.time}</Text>
									</View>

									{stop.status === "next" && (
										<View style={styles.nextBadge}>
											<Text style={styles.nextBadgeText}>NEXT</Text>
										</View>
									)}
								</View>
							))}
						</View>

						{/* Complete Trip Button */}
						<View style={styles.completeButtonContainer}>
							<TouchableOpacity
								style={[
									styles.completeButton,
									isUpdating && styles.completeButtonDisabled,
								]}
								onPress={handleCompleteTrip}
								disabled={isUpdating}
							>
								{isUpdating ? (
									<ActivityIndicator color={colors.white} />
								) : (
									<>
										<Feather name="flag" size={20} color={colors.white} />
										<Text style={styles.completeButtonText}>Complete Trip</Text>
									</>
								)}
							</TouchableOpacity>
						</View>

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
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	errorIconContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "rgba(239, 68, 68, 0.15)",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	errorTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.text.primary,
		marginBottom: 20,
	},
	errorButton: {
		backgroundColor: colors.primary.DEFAULT,
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: borderRadius.lg,
	},
	errorButtonText: {
		color: colors.background.DEFAULT,
		fontSize: 14,
		fontWeight: "600",
	},
	scrollView: {
		flex: 1,
	},
	header: {
		backgroundColor: colors.background.secondary,
		paddingHorizontal: 20,
		paddingTop: 8,
		paddingBottom: 24,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
		borderWidth: 1,
		borderTopWidth: 0,
		borderColor: colors.background.card,
	},
	headerTop: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.background.card,
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: colors.text.primary,
	},
	headerSpacer: {
		width: 40,
	},
	headerSubtitle: {
		fontSize: 14,
		color: colors.text.muted,
		textAlign: "center",
	},
	statusCardContainer: {
		paddingHorizontal: 20,
		marginTop: -12,
	},
	statusCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 20,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
	},
	statusCardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	statusLabel: {
		fontSize: 12,
		color: colors.text.muted,
		marginBottom: 4,
	},
	statusValue: {
		fontSize: 22,
		fontWeight: "700",
		color: colors.text.primary,
	},
	etaBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(34, 197, 94, 0.15)",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 20,
		gap: 6,
	},
	etaText: {
		fontSize: 14,
		fontWeight: "700",
		color: colors.success.DEFAULT,
	},
	statusCardDivider: {
		height: 1,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		marginVertical: 16,
	},
	statusCardFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	statusItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	statusItemText: {
		fontSize: 14,
		color: colors.text.secondary,
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: colors.success.DEFAULT,
	},
	quickActionsContainer: {
		flexDirection: "row",
		paddingHorizontal: 20,
		marginTop: 20,
		gap: 12,
	},
	quickActionCard: {
		flex: 1,
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 20,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
	},
	quickActionIconContainer: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.background.secondary,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 12,
	},
	quickActionText: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.text.primary,
	},
	arriveButtonContainer: {
		paddingHorizontal: 20,
		marginTop: 16,
	},
	arriveButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.primary.DEFAULT,
		borderRadius: borderRadius.xl,
		paddingVertical: 16,
		gap: 8,
		shadowColor: colors.primary.DEFAULT,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	arriveButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: colors.background.DEFAULT,
	},
	timelineContainer: {
		paddingHorizontal: 20,
		marginTop: 24,
	},
	timelineTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: colors.text.primary,
		marginBottom: 20,
	},
	timelineItem: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 4,
	},
	timelineLeft: {
		alignItems: "center",
		marginRight: 16,
	},
	timelineNodeCompleted: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: colors.success.DEFAULT,
		alignItems: "center",
		justifyContent: "center",
	},
	timelineNodeNext: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: colors.primary.DEFAULT,
		alignItems: "center",
		justifyContent: "center",
	},
	timelineNodeNextInner: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: colors.white,
	},
	timelineNodeUpcoming: {
		width: 28,
		height: 28,
		borderRadius: 14,
		borderWidth: 2,
		borderColor: colors.text.muted,
		backgroundColor: "transparent",
	},
	timelineLine: {
		width: 2,
		height: 48,
	},
	timelineLineCompleted: {
		backgroundColor: colors.success.DEFAULT,
	},
	timelineLineUpcoming: {
		backgroundColor: colors.text.muted,
		opacity: 0.3,
	},
	timelineContent: {
		flex: 1,
		paddingTop: 4,
	},
	timelineStopName: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.text.primary,
		marginBottom: 4,
	},
	timelineStopNameNext: {
		color: colors.primary.DEFAULT,
	},
	timelineStopNameCompleted: {
		color: colors.success.DEFAULT,
	},
	timelineStopTime: {
		fontSize: 13,
		color: colors.text.muted,
	},
	nextBadge: {
		backgroundColor: "rgba(245, 166, 35, 0.15)",
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 8,
		marginTop: 4,
	},
	nextBadgeText: {
		fontSize: 11,
		fontWeight: "700",
		color: colors.primary.DEFAULT,
	},
	completeButtonContainer: {
		paddingHorizontal: 20,
		marginTop: 24,
	},
	completeButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.success.DEFAULT,
		borderRadius: borderRadius.xl,
		paddingVertical: 18,
		gap: 8,
	},
	completeButtonDisabled: {
		backgroundColor: colors.text.muted,
	},
	completeButtonText: {
		fontSize: 18,
		fontWeight: "700",
		color: colors.white,
	},
});
