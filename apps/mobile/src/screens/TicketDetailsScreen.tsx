import { Feather } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
import { borderRadius, colors, shadows } from "../constants/theme";
import type { RootStackParamList } from "../navigation/types";
import bookingService, { type Booking } from "../services/bookingService";

type Props = {
	route: RouteProp<RootStackParamList, "TicketDetails">;
	navigation: NativeStackNavigationProp<RootStackParamList, "TicketDetails">;
};

export default function TicketDetailsScreen({ route, navigation }: Props) {
	const { bookingId } = route.params;
	const [booking, setBooking] = useState<Booking | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);

	const fetchBooking = useCallback(async () => {
		try {
			const data = await bookingService.getBookingById(bookingId);
			setBooking(data);
		} catch (error) {
			console.error("Failed to fetch booking:", error);
			Alert.alert("Error", "Failed to load ticket details");
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, [bookingId]);

	useEffect(() => {
		fetchBooking();
	}, [fetchBooking]);

	const onRefresh = () => {
		setIsRefreshing(true);
		fetchBooking();
	};

	const handleCallDriver = (phone: string) => {
		Linking.openURL(`tel:${phone}`);
	};

	const handleCancelBooking = () => {
		Alert.alert(
			"Cancel Booking",
			"Are you sure you want to cancel this booking? This action cannot be undone.",
			[
				{ text: "No, Keep It", style: "cancel" },
				{
					text: "Yes, Cancel",
					style: "destructive",
					onPress: async () => {
						setIsCancelling(true);
						try {
							await bookingService.cancelBooking(bookingId);
							Alert.alert("Success", "Your booking has been cancelled", [
								{ text: "OK", onPress: () => navigation.goBack() },
							]);
						} catch (error) {
							console.error("Failed to cancel booking:", error);
							Alert.alert(
								"Error",
								"Failed to cancel booking. Please try again.",
							);
						} finally {
							setIsCancelling(false);
						}
					},
				},
			],
		);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "CONFIRMED":
				return { bg: colors.success.background, text: colors.success.DEFAULT };
			case "PENDING":
				return { bg: colors.warning.background, text: colors.warning.DEFAULT };
			case "CANCELLED":
				return { bg: colors.error.background, text: colors.error.DEFAULT };
			case "COMPLETED":
				return { bg: colors.info.background, text: colors.info.DEFAULT };
			default:
				return { bg: colors.background.tertiary, text: colors.text.secondary };
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (isLoading) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={colors.primary.DEFAULT} />
			</SafeAreaView>
		);
	}

	if (!booking) {
		return (
			<SafeAreaView style={styles.errorContainer}>
				<Feather name="alert-circle" size={48} color={colors.error.DEFAULT} />
				<Text style={styles.errorText}>Booking not found</Text>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.errorButton}
				>
					<Text style={styles.errorButtonText}>Go Back</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	const trip = booking.trip;
	const route_info = trip?.route;
	const bus = trip?.bus;
	const driver = trip?.driver;
	const statusColors = getStatusColor(booking.status);

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
					<Text style={styles.headerTitle}>Ticket Details</Text>
					<TouchableOpacity style={styles.shareButton}>
						<Feather name="share-2" size={20} color={colors.text.primary} />
					</TouchableOpacity>
				</View>
			</View>

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
				{/* QR Code Card */}
				<View style={styles.section}>
					<View style={styles.qrCard}>
						<View style={styles.qrContainer}>
							<Feather
								name="maximize"
								size={100}
								color={colors.primary.DEFAULT}
							/>
							<Text style={styles.qrLabel}>QR Code</Text>
						</View>
						<Text style={styles.bookingRef}>
							{booking.bookingReference || booking.id.slice(0, 8).toUpperCase()}
						</Text>
						<View
							style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}
						>
							<Text style={[styles.statusText, { color: statusColors.text }]}>
								{booking.status}
							</Text>
						</View>
					</View>
				</View>

				{/* Trip Info */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Trip Information</Text>
					<View style={styles.tripCard}>
						<Text style={styles.routeTitle}>
							{route_info?.originCity} → {route_info?.destinationCity}
						</Text>

						<View style={styles.routeContainer}>
							<View style={styles.routeIndicator}>
								<View style={styles.dotGreen} />
								<View style={styles.routeLine} />
								<View style={styles.dotRed} />
							</View>
							<View style={styles.routeDetails}>
								<View style={styles.stationInfo}>
									<Text style={styles.stationName}>
										{route_info?.originStation || route_info?.originCity}
									</Text>
									<Text style={styles.stationTime}>
										{trip?.departureTime
											? formatTime(trip.departureTime)
											: "--:--"}
									</Text>
								</View>
								<View style={[styles.stationInfo, styles.stationInfoEnd]}>
									<Text style={styles.stationName}>
										{route_info?.destinationStation ||
											route_info?.destinationCity}
									</Text>
									<Text style={styles.stationTime}>
										{trip?.arrivalTime ? formatTime(trip.arrivalTime) : "--:--"}
									</Text>
								</View>
							</View>
						</View>

						<View style={styles.divider} />

						<View style={styles.tripFooter}>
							<View>
								<Text style={styles.footerLabel}>Date</Text>
								<Text style={styles.footerValue}>
									{trip?.departureTime ? formatDate(trip.departureTime) : "N/A"}
								</Text>
							</View>
							<View style={styles.alignEnd}>
								<Text style={styles.footerLabel}>Seats</Text>
								<Text style={styles.seatsValue}>
									{booking.seatNumbers?.length || 1}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Bus & Driver */}
				{(bus || driver) && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Bus & Driver</Text>
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
										<Text style={styles.infoTitle}>{bus.busType || "Bus"}</Text>
										<Text style={styles.infoSubtitle}>
											{bus.plateNumber || "N/A"}
										</Text>
									</View>
								</View>
							)}
							{bus && driver && <View style={styles.infoDivider} />}
							{driver && (
								<View style={styles.driverRow}>
									<View style={styles.driverInfo}>
										<View style={styles.iconContainerGreen}>
											<Feather
												name="user"
												size={24}
												color={colors.success.DEFAULT}
											/>
										</View>
										<View>
											<Text style={styles.infoTitle}>
												{driver.firstName} {driver.lastName}
											</Text>
											{driver.phone && (
												<Text style={styles.infoSubtitle}>{driver.phone}</Text>
											)}
										</View>
									</View>
									{driver.phone && (
										<TouchableOpacity
											onPress={() => handleCallDriver(driver.phone || "")}
											style={styles.callButton}
										>
											<Feather
												name="phone"
												size={20}
												color={colors.success.DEFAULT}
											/>
										</TouchableOpacity>
									)}
								</View>
							)}
						</View>
					</View>
				)}

				{/* Payment Info */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Payment</Text>
					<View style={styles.paymentCard}>
						<View style={styles.paymentRow}>
							<Text style={styles.paymentLabel}>Amount</Text>
							<Text style={styles.paymentAmount}>
								{booking.totalAmount.toFixed(2)} TND
							</Text>
						</View>
						<View style={styles.paymentRow}>
							<Text style={styles.paymentLabel}>Payment Method</Text>
							<Text style={styles.paymentValue}>
								{booking.paymentMethod?.replace("_", " ") || "N/A"}
							</Text>
						</View>
						<View style={styles.paymentRow}>
							<Text style={styles.paymentLabel}>Status</Text>
							<View
								style={[
									styles.statusBadgeSmall,
									{ backgroundColor: statusColors.bg },
								]}
							>
								<Text
									style={[styles.statusTextSmall, { color: statusColors.text }]}
								>
									{booking.paymentStatus || "PENDING"}
								</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={styles.bottomSpacer} />
			</ScrollView>

			{/* Action Buttons */}
			{booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
				<View style={styles.footer}>
					<TouchableOpacity style={styles.downloadButton}>
						<Feather name="download" size={20} color={colors.text.primary} />
						<Text style={styles.downloadButtonText}>Download</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleCancelBooking}
						disabled={isCancelling}
						style={styles.cancelButton}
					>
						{isCancelling ? (
							<ActivityIndicator size="small" color={colors.error.DEFAULT} />
						) : (
							<>
								<Feather
									name="x-circle"
									size={20}
									color={colors.error.DEFAULT}
								/>
								<Text style={styles.cancelButtonText}>Cancel Booking</Text>
							</>
						)}
					</TouchableOpacity>
				</View>
			)}
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
		backgroundColor: colors.background.DEFAULT,
		justifyContent: "center",
		alignItems: "center",
	},
	errorContainer: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	errorText: {
		color: colors.text.primary,
		fontSize: 18,
		fontWeight: "500",
		marginTop: 16,
	},
	errorButton: {
		marginTop: 16,
		backgroundColor: colors.primary.DEFAULT,
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: borderRadius.xl,
	},
	errorButtonText: {
		color: colors.text.inverse,
		fontWeight: "500",
	},
	header: {
		backgroundColor: colors.background.secondary,
		paddingHorizontal: 20,
		paddingTop: 48,
		paddingBottom: 16,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.background.tertiary,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	headerTitle: {
		color: colors.text.primary,
		fontSize: 20,
		fontWeight: "bold",
		flex: 1,
	},
	shareButton: {
		backgroundColor: colors.background.tertiary,
		padding: 10,
		borderRadius: borderRadius.lg,
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
	qrCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 24,
		alignItems: "center",
		...shadows.md,
	},
	qrContainer: {
		backgroundColor: colors.background.tertiary,
		width: 192,
		height: 192,
		borderRadius: borderRadius.xl,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
	},
	qrLabel: {
		color: colors.text.secondary,
		fontSize: 12,
		marginTop: 8,
	},
	bookingRef: {
		color: colors.text.primary,
		fontFamily: "monospace",
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 12,
	},
	statusBadge: {
		paddingHorizontal: 16,
		paddingVertical: 6,
		borderRadius: borderRadius.full,
	},
	statusText: {
		fontWeight: "600",
		fontSize: 14,
	},
	tripCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 20,
		...shadows.sm,
	},
	routeTitle: {
		color: colors.text.primary,
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 16,
	},
	routeContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 16,
	},
	routeIndicator: {
		alignItems: "center",
		marginRight: 16,
	},
	dotGreen: {
		width: 12,
		height: 12,
		backgroundColor: colors.success.DEFAULT,
		borderRadius: 6,
	},
	routeLine: {
		width: 2,
		height: 48,
		backgroundColor: colors.border.DEFAULT,
	},
	dotRed: {
		width: 12,
		height: 12,
		backgroundColor: colors.error.DEFAULT,
		borderRadius: 6,
	},
	routeDetails: {
		flex: 1,
	},
	stationInfo: {
		marginBottom: 24,
	},
	stationInfoEnd: {
		marginBottom: 0,
	},
	stationName: {
		color: colors.text.primary,
		fontWeight: "500",
		fontSize: 16,
	},
	stationTime: {
		color: colors.text.secondary,
		fontSize: 14,
		marginTop: 2,
	},
	divider: {
		height: 1,
		backgroundColor: colors.border.DEFAULT,
		marginVertical: 16,
	},
	tripFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	footerLabel: {
		color: colors.text.secondary,
		fontSize: 12,
	},
	footerValue: {
		color: colors.text.primary,
		fontWeight: "500",
		marginTop: 4,
	},
	alignEnd: {
		alignItems: "flex-end",
	},
	seatsValue: {
		color: colors.text.primary,
		fontWeight: "bold",
		fontSize: 18,
		marginTop: 4,
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
	driverRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	driverInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	callButton: {
		backgroundColor: colors.success.DEFAULT + "20",
		padding: 12,
		borderRadius: borderRadius.lg,
	},
	paymentCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 20,
		...shadows.sm,
	},
	paymentRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	paymentLabel: {
		color: colors.text.secondary,
		fontSize: 15,
	},
	paymentAmount: {
		color: colors.primary.DEFAULT,
		fontWeight: "bold",
		fontSize: 18,
	},
	paymentValue: {
		color: colors.text.primary,
		fontSize: 15,
	},
	statusBadgeSmall: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: borderRadius.full,
	},
	statusTextSmall: {
		fontWeight: "500",
		fontSize: 12,
	},
	bottomSpacer: {
		height: 100,
	},
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: "row",
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: colors.background.secondary,
		borderTopWidth: 1,
		borderTopColor: colors.border.DEFAULT,
	},
	downloadButton: {
		flex: 1,
		backgroundColor: colors.background.tertiary,
		borderRadius: borderRadius.xl,
		paddingVertical: 14,
		marginRight: 8,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	downloadButtonText: {
		color: colors.text.primary,
		fontWeight: "500",
		marginLeft: 8,
	},
	cancelButton: {
		flex: 1,
		backgroundColor: colors.error.background,
		borderRadius: borderRadius.xl,
		paddingVertical: 14,
		marginLeft: 8,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	cancelButtonText: {
		color: colors.error.DEFAULT,
		fontWeight: "500",
		marginLeft: 8,
	},
});
