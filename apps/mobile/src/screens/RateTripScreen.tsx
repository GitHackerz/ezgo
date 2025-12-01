import { Feather } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { borderRadius, colors, shadows } from "../constants/theme";
import type { RootStackParamList } from "../navigation/types";
import bookingService, { type Booking } from "../services/bookingService";

type Props = {
	route: RouteProp<RootStackParamList, "RateTrip">;
	navigation: NativeStackNavigationProp<RootStackParamList, "RateTrip">;
};

export default function RateTripScreen({ route, navigation }: Props) {
	const { bookingId } = route.params;
	const [booking, setBooking] = useState<Booking | null>(null);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	useEffect(() => {
		const loadBooking = async () => {
			try {
				const data = await bookingService.getBookingById(bookingId);
				setBooking(data);

				// Check if already rated
				const existingRating = await bookingService.getBookingRating(bookingId);
				if (existingRating) {
					setRating(existingRating.rating);
					setComment(existingRating.review || "");
				}
			} catch (error) {
				console.error("Failed to load booking:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadBooking();
	}, [bookingId]);

	const handleSubmit = async () => {
		if (rating === 0) {
			Alert.alert(
				"Rating Required",
				"Please select a rating before submitting.",
			);
			return;
		}

		setIsSubmitting(true);
		try {
			const fullComment =
				selectedTags.length > 0
					? `${comment}${comment ? ". " : ""}Tags: ${selectedTags.join(", ")}`
					: comment;
			await bookingService.rateTrip(
				bookingId,
				rating,
				fullComment || undefined,
			);
			Alert.alert("Thank You!", "Your rating has been submitted.", [
				{ text: "OK", onPress: () => navigation.goBack() },
			]);
		} catch (error) {
			console.error("Failed to submit rating:", error);
			Alert.alert("Error", "Failed to submit rating. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
		);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	if (isLoading) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={colors.primary.DEFAULT} />
			</SafeAreaView>
		);
	}

	const trip = booking?.trip;
	const route_info = trip?.route;
	const driver = trip?.driver;

	const getRatingText = () => {
		switch (rating) {
			case 1:
				return "Poor";
			case 2:
				return "Fair";
			case 3:
				return "Good";
			case 4:
				return "Very Good";
			case 5:
				return "Excellent";
			default:
				return "Tap to rate";
		}
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<SafeAreaView edges={["top"]}>
					<View style={styles.headerContent}>
						<TouchableOpacity
							onPress={() => navigation.goBack()}
							style={styles.backButton}
						>
							<Feather
								name="arrow-left"
								size={24}
								color={colors.text.primary}
							/>
						</TouchableOpacity>
						<View style={styles.headerTextContainer}>
							<Text style={styles.headerTitle}>Rate Your Trip</Text>
							<Text style={styles.headerSubtitle}>
								Your feedback helps us improve!
							</Text>
						</View>
					</View>
				</SafeAreaView>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				{/* Trip Info Card */}
				<View style={styles.tripCard}>
					<View style={styles.tripRouteContainer}>
						<View style={styles.routeEndpoint}>
							<View style={styles.routeDot} />
							<Text style={styles.cityText}>{route_info?.originCity}</Text>
						</View>
						<View style={styles.routeLine} />
						<View style={styles.routeEndpoint}>
							<View style={[styles.routeDot, styles.routeDotDestination]} />
							<Text style={styles.cityText}>{route_info?.destinationCity}</Text>
						</View>
					</View>
					<View style={styles.tripMetaContainer}>
						<View style={styles.tripMetaItem}>
							<Feather
								name="calendar"
								size={16}
								color={colors.text.secondary}
							/>
							<Text style={styles.tripMetaText}>
								{trip?.departureTime ? formatDate(trip.departureTime) : "N/A"}
							</Text>
						</View>
						{driver && (
							<View style={styles.tripMetaItem}>
								<Feather name="user" size={16} color={colors.text.secondary} />
								<Text style={styles.tripMetaText}>
									{driver.firstName} {driver.lastName}
								</Text>
							</View>
						)}
					</View>
				</View>

				{/* Star Rating Card */}
				<View style={styles.ratingCard}>
					<Text style={styles.ratingQuestion}>How was your experience?</Text>
					<View style={styles.starsContainer}>
						{[1, 2, 3, 4, 5].map((star) => (
							<TouchableOpacity
								key={`star-${star}`}
								onPress={() => setRating(star)}
								style={styles.starButton}
							>
								<Feather
									name="star"
									size={44}
									color={
										star <= rating
											? colors.primary.DEFAULT
											: colors.background.tertiary
									}
								/>
							</TouchableOpacity>
						))}
					</View>
					<View style={styles.ratingLabelContainer}>
						<Text
							style={[
								styles.ratingLabel,
								rating > 0 && styles.ratingLabelActive,
							]}
						>
							{getRatingText()}
						</Text>
					</View>
				</View>

				{/* Quick Tags */}
				<View style={styles.tagsSection}>
					<Text style={styles.sectionTitle}>Quick Feedback</Text>
					<View style={styles.tagsGrid}>
						{[
							"Clean bus",
							"On time",
							"Friendly driver",
							"Comfortable",
							"Safe",
							"Good AC",
						].map((tag) => (
							<TouchableOpacity
								key={`tag-${tag}`}
								style={[
									styles.tagButton,
									selectedTags.includes(tag) && styles.tagButtonActive,
								]}
								onPress={() => toggleTag(tag)}
							>
								<Text
									style={[
										styles.tagText,
										selectedTags.includes(tag) && styles.tagTextActive,
									]}
								>
									{tag}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Comment Section */}
				<View style={styles.commentSection}>
					<Text style={styles.sectionTitle}>Additional Comments</Text>
					<View style={styles.textAreaContainer}>
						<TextInput
							style={styles.textArea}
							placeholder="Share your experience..."
							value={comment}
							onChangeText={setComment}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
							placeholderTextColor={colors.text.muted}
						/>
					</View>
				</View>

				<View style={styles.bottomSpacer} />
			</ScrollView>

			{/* Submit Button */}
			<View style={styles.footer}>
				<TouchableOpacity
					style={[
						styles.submitButton,
						(isSubmitting || rating === 0) && styles.submitButtonDisabled,
					]}
					onPress={handleSubmit}
					disabled={isSubmitting || rating === 0}
				>
					{isSubmitting ? (
						<ActivityIndicator color={colors.text.inverse} />
					) : (
						<>
							<Feather name="send" size={20} color={colors.text.inverse} />
							<Text style={styles.submitButtonText}>Submit Rating</Text>
						</>
					)}
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
		backgroundColor: colors.background.DEFAULT,
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		backgroundColor: colors.background.secondary,
		paddingBottom: 20,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 16,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.background.tertiary,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	headerTextContainer: {
		flex: 1,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.text.primary,
	},
	headerSubtitle: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: 2,
	},
	scrollView: {
		flex: 1,
		paddingHorizontal: 20,
	},
	tripCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 20,
		marginTop: 20,
		...shadows.sm,
	},
	tripRouteContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	routeEndpoint: {
		flexDirection: "row",
		alignItems: "center",
	},
	routeDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: colors.primary.DEFAULT,
		marginRight: 8,
	},
	routeDotDestination: {
		backgroundColor: colors.success.DEFAULT,
	},
	routeLine: {
		flex: 1,
		height: 2,
		backgroundColor: colors.border.DEFAULT,
		marginHorizontal: 8,
	},
	cityText: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.text.primary,
	},
	tripMetaContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: colors.border.DEFAULT,
	},
	tripMetaItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	tripMetaText: {
		color: colors.text.secondary,
		marginLeft: 8,
		fontSize: 14,
	},
	ratingCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 24,
		marginTop: 16,
		alignItems: "center",
		...shadows.sm,
	},
	ratingQuestion: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.text.primary,
		marginBottom: 20,
	},
	starsContainer: {
		flexDirection: "row",
		justifyContent: "center",
	},
	starButton: {
		paddingHorizontal: 6,
	},
	ratingLabelContainer: {
		marginTop: 16,
		paddingHorizontal: 20,
		paddingVertical: 8,
		backgroundColor: colors.background.tertiary,
		borderRadius: borderRadius.full,
	},
	ratingLabel: {
		fontSize: 14,
		color: colors.text.muted,
	},
	ratingLabelActive: {
		color: colors.primary.DEFAULT,
		fontWeight: "600",
	},
	tagsSection: {
		marginTop: 24,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.text.primary,
		marginBottom: 12,
	},
	tagsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	tagButton: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.full,
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
	},
	tagButtonActive: {
		backgroundColor: colors.primary.DEFAULT + "20",
		borderColor: colors.primary.DEFAULT,
	},
	tagText: {
		color: colors.text.secondary,
		fontSize: 14,
	},
	tagTextActive: {
		color: colors.primary.DEFAULT,
		fontWeight: "500",
	},
	commentSection: {
		marginTop: 24,
	},
	textAreaContainer: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		borderWidth: 1,
		borderColor: colors.border.DEFAULT,
		overflow: "hidden",
	},
	textArea: {
		padding: 16,
		color: colors.text.primary,
		fontSize: 16,
		minHeight: 120,
	},
	bottomSpacer: {
		height: 32,
	},
	footer: {
		padding: 20,
		backgroundColor: colors.background.secondary,
		borderTopWidth: 1,
		borderTopColor: colors.border.DEFAULT,
	},
	submitButton: {
		backgroundColor: colors.primary.DEFAULT,
		borderRadius: borderRadius.xl,
		paddingVertical: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		...shadows.md,
	},
	submitButtonDisabled: {
		backgroundColor: colors.background.tertiary,
	},
	submitButtonText: {
		color: colors.text.inverse,
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 8,
	},
});
