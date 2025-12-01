import { Feather } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
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
import { borderRadius, colors, shadows } from "../../constants/theme";
import type { RootStackParamList } from "../../navigation/types";
import bookingService from "../../services/bookingService";
import tripService, { type Trip } from "../../services/tripService";

type Props = {
	route: RouteProp<RootStackParamList, "Booking">;
	navigation: NativeStackNavigationProp<RootStackParamList, "Booking">;
};

type PaymentMethod = "CREDIT_CARD" | "CASH" | "MOBILE_MONEY";

export default function BookingScreen({ route, navigation }: Props) {
	const { tripId } = route.params;
	const [trip, setTrip] = useState<Trip | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isBooking, setIsBooking] = useState(false);
	const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
	const [numSeats, setNumSeats] = useState(1);
	const [paymentMethod, setPaymentMethod] =
		useState<PaymentMethod>("CREDIT_CARD");
	const [error, setError] = useState<string | null>(null);

	const fetchTrip = useCallback(async () => {
		try {
			setIsLoading(true);
			const tripData = await tripService.getTripById(tripId);
			setTrip(tripData);

			// Auto-select first available seat
			if (tripData.availableSeats > 0) {
				setSelectedSeats([1]);
			}
		} catch (err) {
			setError("Failed to load trip details");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}, [tripId]);

	useEffect(() => {
		fetchTrip();
	}, [fetchTrip]);

	const formatTime = (dateString: string) => {
		const d = new Date(dateString);
		return d.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatDate = (dateString: string) => {
		const d = new Date(dateString);
		return d.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};

	const ticketPrice = trip?.dynamicPrice || trip?.basePrice || 0;
	const serviceFee = 0.5;
	const totalPrice = ticketPrice * numSeats + serviceFee;

	const handleBooking = async () => {
		if (!trip) return;

		try {
			setIsBooking(true);

			const booking = await bookingService.createBooking({
				tripId: trip.id,
				seatNumbers: selectedSeats.map((s) => String(s)),
				paymentMethod,
			});

			Alert.alert(
				"Booking Confirmed!",
				"Your ticket has been booked successfully.",
				[
					{
						text: "View Ticket",
						onPress: () =>
							navigation.navigate("TicketDetails", { bookingId: booking.id }),
					},
				],
			);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to create booking";
			Alert.alert("Booking Failed", errorMessage);
			console.error(err);
		} finally {
			setIsBooking(false);
		}
	};

	const incrementSeats = () => {
		if (trip && numSeats < Math.min(trip.availableSeats, 5)) {
			const newNumSeats = numSeats + 1;
			setNumSeats(newNumSeats);
			setSelectedSeats(Array.from({ length: newNumSeats }, (_, i) => i + 1));
		}
	};

	const decrementSeats = () => {
		if (numSeats > 1) {
			const newNumSeats = numSeats - 1;
			setNumSeats(newNumSeats);
			setSelectedSeats(Array.from({ length: newNumSeats }, (_, i) => i + 1));
		}
	};

	const paymentMethods: {
		id: PaymentMethod;
		name: string;
		icon: keyof typeof Feather.glyphMap;
	}[] = [
		{ id: "CREDIT_CARD", name: "Credit Card", icon: "credit-card" },
		{ id: "CASH", name: "Cash on Bus", icon: "dollar-sign" },
		{ id: "MOBILE_MONEY", name: "Mobile Money", icon: "smartphone" },
	];

	if (isLoading) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={colors.primary.DEFAULT} />
				<Text style={styles.loadingText}>Loading trip details...</Text>
			</SafeAreaView>
		);
	}

	if (error || !trip) {
		return (
			<SafeAreaView style={styles.errorContainer}>
				<Feather name="alert-circle" size={48} color={colors.error.DEFAULT} />
				<Text style={styles.errorTitle}>{error || "Trip not found"}</Text>
				<TouchableOpacity
					style={styles.errorButton}
					onPress={() => navigation.goBack()}
				>
					<Text style={styles.errorButtonText}>Go Back</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.headerContent}>
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
						<View style={styles.headerTextContainer}>
							<Text style={styles.headerTitle}>Booking Details</Text>
							<Text style={styles.headerSubtitle}>
								Review and confirm your trip
							</Text>
						</View>
					</View>
				</View>

				{/* Trip Info Card */}
				<View style={styles.section}>
					<View style={styles.tripCard}>
						<View style={styles.routeHeader}>
							<View style={styles.routeContainer}>
								<View style={styles.cityRow}>
									<View style={styles.dotOrange} />
									<Text style={styles.cityText}>{trip.route?.originCity}</Text>
								</View>
								<View style={styles.routeLine} />
								<View style={styles.cityRow}>
									<View style={styles.dotWhite} />
									<Text style={styles.cityText}>
										{trip.route?.destinationCity}
									</Text>
								</View>
							</View>
							{trip.bus?.company && (
								<View style={styles.companyBadge}>
									<Text style={styles.companyText}>
										{trip.bus.company.name}
									</Text>
								</View>
							)}
						</View>

						<View style={styles.divider} />

						<View style={styles.tripDetails}>
							<View style={styles.detailRow}>
								<View style={styles.iconContainer}>
									<Feather
										name="calendar"
										size={18}
										color={colors.primary.DEFAULT}
									/>
								</View>
								<Text style={styles.detailText}>
									{formatDate(trip.departureTime)}
								</Text>
							</View>

							<View style={styles.detailRow}>
								<View style={styles.iconContainer}>
									<Feather
										name="clock"
										size={18}
										color={colors.primary.DEFAULT}
									/>
								</View>
								<Text style={styles.detailText}>
									{formatTime(trip.departureTime)} -{" "}
									{formatTime(trip.arrivalTime)}
								</Text>
							</View>

							<View style={styles.detailRow}>
								<View style={styles.iconContainer}>
									<Feather
										name="users"
										size={18}
										color={colors.primary.DEFAULT}
									/>
								</View>
								<Text style={styles.detailText}>
									{trip.availableSeats} seats available
								</Text>
							</View>

							{trip.bus && (
								<View style={styles.detailRow}>
									<View style={styles.iconContainer}>
										<Feather
											name="truck"
											size={18}
											color={colors.primary.DEFAULT}
										/>
									</View>
									<Text style={styles.detailText}>
										Bus: {trip.bus.plateNumber}
									</Text>
								</View>
							)}
						</View>
					</View>
				</View>

				{/* Seat Selection */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Number of Seats</Text>
					<View style={styles.seatSelector}>
						<TouchableOpacity
							style={[
								styles.seatButton,
								numSeats <= 1 && styles.seatButtonDisabled,
							]}
							onPress={decrementSeats}
							disabled={numSeats <= 1}
						>
							<Feather
								name="minus"
								size={20}
								color={
									numSeats <= 1 ? colors.text.muted : colors.primary.DEFAULT
								}
							/>
						</TouchableOpacity>

						<View style={styles.seatCountContainer}>
							<Text style={styles.seatCount}>{numSeats}</Text>
							<Text style={styles.seatLabel}>
								seat{numSeats > 1 ? "s" : ""}
							</Text>
						</View>

						<TouchableOpacity
							style={[
								styles.seatButton,
								numSeats >= Math.min(trip.availableSeats, 5) &&
									styles.seatButtonDisabled,
							]}
							onPress={incrementSeats}
							disabled={numSeats >= Math.min(trip.availableSeats, 5)}
						>
							<Feather
								name="plus"
								size={20}
								color={
									numSeats >= Math.min(trip.availableSeats, 5)
										? colors.text.muted
										: colors.primary.DEFAULT
								}
							/>
						</TouchableOpacity>
					</View>
				</View>

				{/* Price Summary */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Price Summary</Text>
					<View style={styles.priceCard}>
						<View style={styles.priceRow}>
							<Text style={styles.priceLabel}>
								Ticket Price ({numSeats} x {ticketPrice.toFixed(2)} TND)
							</Text>
							<Text style={styles.priceValue}>
								{(ticketPrice * numSeats).toFixed(2)} TND
							</Text>
						</View>
						<View style={styles.priceRow}>
							<Text style={styles.priceLabel}>Service Fee</Text>
							<Text style={styles.priceValue}>{serviceFee.toFixed(2)} TND</Text>
						</View>
						<View style={styles.priceDivider} />
						<View style={styles.priceRow}>
							<Text style={styles.totalLabel}>Total</Text>
							<Text style={styles.totalValue}>{totalPrice.toFixed(2)} TND</Text>
						</View>
					</View>
				</View>

				{/* Payment Method */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Payment Method</Text>
					{paymentMethods.map((method) => (
						<TouchableOpacity
							key={method.id}
							style={[
								styles.paymentOption,
								paymentMethod === method.id && styles.paymentOptionSelected,
							]}
							onPress={() => setPaymentMethod(method.id)}
						>
							<View style={styles.paymentOptionContent}>
								<View style={styles.paymentIconContainer}>
									<Feather
										name={method.icon}
										size={22}
										color={colors.primary.DEFAULT}
									/>
								</View>
								<Text style={styles.paymentOptionText}>{method.name}</Text>
							</View>
							{paymentMethod === method.id && (
								<Feather
									name="check-circle"
									size={22}
									color={colors.primary.DEFAULT}
								/>
							)}
						</TouchableOpacity>
					))}
				</View>

				{/* Confirm Button */}
				<View style={styles.buttonSection}>
					<TouchableOpacity
						style={[
							styles.confirmButton,
							isBooking && styles.confirmButtonDisabled,
						]}
						onPress={handleBooking}
						disabled={isBooking}
					>
						{isBooking ? (
							<ActivityIndicator color={colors.text.inverse} />
						) : (
							<Text style={styles.confirmButtonText}>
								Confirm & Pay {totalPrice.toFixed(2)} TND
							</Text>
						)}
					</TouchableOpacity>
				</View>
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
	loadingContainer: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		color: colors.text.secondary,
		marginTop: 16,
		fontSize: 16,
	},
	errorContainer: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	errorTitle: {
		color: colors.text.primary,
		fontSize: 18,
		fontWeight: "600",
		marginTop: 16,
		textAlign: "center",
	},
	errorButton: {
		backgroundColor: colors.primary.DEFAULT,
		borderRadius: borderRadius.lg,
		paddingHorizontal: 24,
		paddingVertical: 12,
		marginTop: 16,
	},
	errorButtonText: {
		color: colors.text.inverse,
		fontWeight: "600",
		fontSize: 16,
	},
	header: {
		backgroundColor: colors.background.secondary,
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 24,
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
	},
	headerTextContainer: {
		marginLeft: 16,
		flex: 1,
	},
	headerTitle: {
		color: colors.text.primary,
		fontSize: 22,
		fontWeight: "bold",
	},
	headerSubtitle: {
		color: colors.text.secondary,
		fontSize: 14,
		marginTop: 4,
	},
	section: {
		paddingHorizontal: 20,
		marginTop: 24,
	},
	sectionTitle: {
		color: colors.text.primary,
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 12,
	},
	tripCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 20,
		...shadows.md,
	},
	routeHeader: {
		marginBottom: 16,
	},
	routeContainer: {
		marginBottom: 12,
	},
	cityRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	dotOrange: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: colors.primary.DEFAULT,
		marginRight: 12,
	},
	dotWhite: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: colors.text.primary,
		marginRight: 12,
	},
	routeLine: {
		width: 2,
		height: 24,
		backgroundColor: colors.border.DEFAULT,
		marginLeft: 5,
		marginVertical: 4,
	},
	cityText: {
		color: colors.text.primary,
		fontSize: 18,
		fontWeight: "600",
	},
	companyBadge: {
		alignSelf: "flex-start",
		backgroundColor: colors.primary.DEFAULT + "20",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: borderRadius.full,
	},
	companyText: {
		color: colors.primary.DEFAULT,
		fontSize: 12,
		fontWeight: "600",
	},
	divider: {
		height: 1,
		backgroundColor: colors.border.DEFAULT,
		marginVertical: 16,
	},
	tripDetails: {
		gap: 12,
	},
	detailRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	iconContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: colors.primary.DEFAULT + "15",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	detailText: {
		color: colors.text.secondary,
		fontSize: 15,
		flex: 1,
	},
	seatSelector: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	seatButton: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: colors.primary.DEFAULT + "20",
		justifyContent: "center",
		alignItems: "center",
	},
	seatButtonDisabled: {
		backgroundColor: colors.background.tertiary,
	},
	seatCountContainer: {
		alignItems: "center",
	},
	seatCount: {
		color: colors.text.primary,
		fontSize: 36,
		fontWeight: "bold",
	},
	seatLabel: {
		color: colors.text.secondary,
		fontSize: 14,
	},
	priceCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 20,
	},
	priceRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	priceLabel: {
		color: colors.text.secondary,
		fontSize: 15,
	},
	priceValue: {
		color: colors.text.primary,
		fontSize: 15,
		fontWeight: "500",
	},
	priceDivider: {
		height: 1,
		backgroundColor: colors.border.DEFAULT,
		marginVertical: 12,
	},
	totalLabel: {
		color: colors.text.primary,
		fontSize: 18,
		fontWeight: "bold",
	},
	totalValue: {
		color: colors.primary.DEFAULT,
		fontSize: 20,
		fontWeight: "bold",
	},
	paymentOption: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
		borderWidth: 2,
		borderColor: "transparent",
	},
	paymentOptionSelected: {
		borderColor: colors.primary.DEFAULT,
	},
	paymentOptionContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	paymentIconContainer: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: colors.primary.DEFAULT + "15",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 14,
	},
	paymentOptionText: {
		color: colors.text.primary,
		fontSize: 16,
		fontWeight: "500",
	},
	buttonSection: {
		paddingHorizontal: 20,
		paddingTop: 32,
		paddingBottom: 32,
	},
	confirmButton: {
		backgroundColor: colors.primary.DEFAULT,
		borderRadius: borderRadius.xl,
		paddingVertical: 18,
		alignItems: "center",
		...shadows.glow,
	},
	confirmButtonDisabled: {
		backgroundColor: colors.primary.dark,
		shadowOpacity: 0,
	},
	confirmButtonText: {
		color: colors.text.inverse,
		fontSize: 18,
		fontWeight: "bold",
	},
});
