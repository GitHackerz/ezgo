import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
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
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";
import type { RootStackParamList } from "../../navigation/types";
import routeService from "../../services/routeService";
import tripService, { type Trip } from "../../services/tripService";

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, "Search">;
};

export default function SearchScreen({ navigation }: Props) {
	const [origin, setOrigin] = useState("");
	const [destination, setDestination] = useState("");
	const [date, setDate] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [searchResults, setSearchResults] = useState<Trip[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const [originCities, setOriginCities] = useState<string[]>([]);
	const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
	const [showDestinationSuggestions, setShowDestinationSuggestions] =
		useState(false);
	const [destinationCities, setDestinationCities] = useState<string[]>([]);

	const fetchCities = useCallback(async () => {
		try {
			const cities = await routeService.getOriginCities();
			setOriginCities(cities);
			setDestinationCities(cities);
		} catch (error) {
			console.error("Failed to fetch cities:", error);
		}
	}, []);

	useEffect(() => {
		fetchCities();
	}, [fetchCities]);

	const handleSearch = async () => {
		setIsLoading(true);
		setHasSearched(true);
		try {
			const results = await tripService.searchTrips({
				originCity: origin || undefined,
				destinationCity: destination || undefined,
				date: date.toISOString().split("T")[0],
			});
			setSearchResults(results);
		} catch (error) {
			console.error("Search failed:", error);
			setSearchResults([]);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	};

	const onRefresh = () => {
		if (hasSearched) {
			setIsRefreshing(true);
			handleSearch();
		}
	};

	const formatTime = (dateString: string) => {
		const d = new Date(dateString);
		return d.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatDuration = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	const formatPrice = (price: number) => {
		return `${price.toFixed(2)} TND`;
	};

	const filteredOriginCities = originCities.filter((city) =>
		city.toLowerCase().includes(origin.toLowerCase()),
	);

	const filteredDestinationCities = destinationCities.filter((city) =>
		city.toLowerCase().includes(destination.toLowerCase()),
	);

	return (
		<ImageBackground
			source={require("../../../assets/bg.png")}
			style={styles.background}
			resizeMode="cover"
		>
			<View style={styles.overlay}>
				<StatusBar style="light" />
				<SafeAreaView style={styles.container} edges={["top"]}>
					{/* Search Header */}
					<View style={styles.searchHeader}>
						<Text style={styles.headerTitle}>Search Trips</Text>

						{/* Origin Input */}
						<View style={styles.inputWrapper}>
							<View style={styles.inputContainer}>
								<View style={styles.inputIconContainer}>
									<Feather
										name="map-pin"
										size={18}
										color={colors.primary.DEFAULT}
									/>
								</View>
								<TextInput
									style={styles.input}
									placeholder="From (Origin)"
									value={origin}
									onChangeText={(text) => {
										setOrigin(text);
										setShowOriginSuggestions(true);
									}}
									onFocus={() => setShowOriginSuggestions(true)}
									onBlur={() =>
										setTimeout(() => setShowOriginSuggestions(false), 200)
									}
									placeholderTextColor={colors.text.muted}
								/>
								{origin.length > 0 && (
									<TouchableOpacity
										onPress={() => setOrigin("")}
										style={styles.clearButton}
									>
										<Feather name="x" size={16} color={colors.text.muted} />
									</TouchableOpacity>
								)}
							</View>
							{showOriginSuggestions && filteredOriginCities.length > 0 && (
								<View style={styles.suggestionsContainer}>
									<ScrollView
										style={styles.suggestionsList}
										nestedScrollEnabled
									>
										{filteredOriginCities.map((city, index) => (
											<TouchableOpacity
												key={city}
												style={[
													styles.suggestionItem,
													index < filteredOriginCities.length - 1 &&
														styles.suggestionBorder,
												]}
												onPress={() => {
													setOrigin(city);
													setShowOriginSuggestions(false);
												}}
											>
												<Text style={styles.suggestionText}>{city}</Text>
											</TouchableOpacity>
										))}
									</ScrollView>
								</View>
							)}
						</View>

						{/* Swap Button */}
						<TouchableOpacity
							style={styles.swapButton}
							onPress={() => {
								const temp = origin;
								setOrigin(destination);
								setDestination(temp);
							}}
						>
							<Feather name="repeat" size={16} color={colors.primary.DEFAULT} />
						</TouchableOpacity>

						{/* Destination Input */}
						<View style={styles.inputWrapper}>
							<View style={styles.inputContainer}>
								<View
									style={[
										styles.inputIconContainer,
										{ backgroundColor: "rgba(239, 68, 68, 0.15)" },
									]}
								>
									<Feather name="map-pin" size={18} color="#EF4444" />
								</View>
								<TextInput
									style={styles.input}
									placeholder="To (Destination)"
									value={destination}
									onChangeText={(text) => {
										setDestination(text);
										setShowDestinationSuggestions(true);
									}}
									onFocus={() => setShowDestinationSuggestions(true)}
									onBlur={() =>
										setTimeout(() => setShowDestinationSuggestions(false), 200)
									}
									placeholderTextColor={colors.text.muted}
								/>
								{destination.length > 0 && (
									<TouchableOpacity
										onPress={() => setDestination("")}
										style={styles.clearButton}
									>
										<Feather name="x" size={16} color={colors.text.muted} />
									</TouchableOpacity>
								)}
							</View>
							{showDestinationSuggestions &&
								filteredDestinationCities.length > 0 && (
									<View style={styles.suggestionsContainer}>
										<ScrollView
											style={styles.suggestionsList}
											nestedScrollEnabled
										>
											{filteredDestinationCities.map((city, index) => (
												<TouchableOpacity
													key={city}
													style={[
														styles.suggestionItem,
														index < filteredDestinationCities.length - 1 &&
															styles.suggestionBorder,
													]}
													onPress={() => {
														setDestination(city);
														setShowDestinationSuggestions(false);
													}}
												>
													<Text style={styles.suggestionText}>{city}</Text>
												</TouchableOpacity>
											))}
										</ScrollView>
									</View>
								)}
						</View>

						{/* Date Picker */}
						<TouchableOpacity
							style={styles.datePickerButton}
							onPress={() => setShowDatePicker(true)}
						>
							<View
								style={[
									styles.inputIconContainer,
									{ backgroundColor: "rgba(139, 92, 246, 0.15)" },
								]}
							>
								<Feather name="calendar" size={18} color="#8B5CF6" />
							</View>
							<Text style={styles.dateText}>
								{date.toLocaleDateString("en-US", {
									weekday: "short",
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
							</Text>
						</TouchableOpacity>

						{showDatePicker && (
							<DateTimePicker
								value={date}
								mode="date"
								display="default"
								minimumDate={new Date()}
								onChange={(_event, selectedDate) => {
									setShowDatePicker(false);
									if (selectedDate) {
										setDate(selectedDate);
									}
								}}
							/>
						)}

						{/* Search Button */}
						<TouchableOpacity
							style={styles.searchButton}
							onPress={handleSearch}
							disabled={isLoading}
						>
							{isLoading ? (
								<ActivityIndicator color={colors.background.DEFAULT} />
							) : (
								<>
									<Feather
										name="search"
										size={20}
										color={colors.background.DEFAULT}
									/>
									<Text style={styles.searchButtonText}>Search Trips</Text>
								</>
							)}
						</TouchableOpacity>
					</View>

					{/* Results */}
					<ScrollView
						style={styles.resultsContainer}
						contentContainerStyle={styles.resultsContent}
						refreshControl={
							<RefreshControl
								refreshing={isRefreshing}
								onRefresh={onRefresh}
								tintColor={colors.primary.DEFAULT}
							/>
						}
					>
						{hasSearched && (
							<Text style={styles.resultsTitle}>
								{searchResults.length} trips found
							</Text>
						)}

						{isLoading ? (
							<View style={styles.centerContent}>
								<ActivityIndicator
									size="large"
									color={colors.primary.DEFAULT}
								/>
								<Text style={styles.loadingText}>Searching...</Text>
							</View>
						) : searchResults.length > 0 ? (
							searchResults.map((trip) => (
								<TouchableOpacity
									key={trip.id}
									style={styles.tripCard}
									onPress={() =>
										navigation.navigate("TripDetails", { tripId: trip.id })
									}
								>
									<View style={styles.tripHeader}>
										<View style={styles.tripRoute}>
											<Text style={styles.tripRouteText}>
												{trip.route?.originCity} → {trip.route?.destinationCity}
											</Text>
											{trip.bus?.company && (
												<Text style={styles.companyName}>
													{trip.bus.company.name}
												</Text>
											)}
										</View>
										<Text style={styles.tripPrice}>
											{formatPrice(trip.dynamicPrice || trip.basePrice)}
										</Text>
									</View>

									<View style={styles.tripDetails}>
										<View style={styles.tripDetailRow}>
											<Feather
												name="clock"
												size={14}
												color={colors.text.muted}
											/>
											<Text style={styles.tripDetailText}>
												{formatTime(trip.departureTime)} -{" "}
												{formatTime(trip.arrivalTime)}
											</Text>
											<Text style={styles.tripDetailDivider}>•</Text>
											<Text style={styles.tripDetailText}>
												{trip.route?.estimatedDuration
													? formatDuration(trip.route.estimatedDuration)
													: "N/A"}
											</Text>
										</View>

										<View style={styles.tripInfoRow}>
											<View style={styles.seatsInfo}>
												<Feather
													name="users"
													size={14}
													color={colors.text.muted}
												/>
												<Text style={styles.seatsText}>
													{trip.availableSeats} seats available
												</Text>
											</View>

											{trip.amenities && trip.amenities.length > 0 && (
												<View style={styles.amenitiesRow}>
													{trip.amenities.slice(0, 3).map((amenity) => (
														<View key={amenity} style={styles.amenityBadge}>
															<Text style={styles.amenityText}>{amenity}</Text>
														</View>
													))}
												</View>
											)}
										</View>
									</View>

									<TouchableOpacity
										style={styles.bookButton}
										onPress={() =>
											navigation.navigate("Booking", { tripId: trip.id })
										}
									>
										<Text style={styles.bookButtonText}>Book Now</Text>
									</TouchableOpacity>
								</TouchableOpacity>
							))
						) : hasSearched ? (
							<View style={styles.centerContent}>
								<View style={styles.emptyIconContainer}>
									<Feather name="search" size={32} color={colors.text.muted} />
								</View>
								<Text style={styles.emptyTitle}>No trips found</Text>
								<Text style={styles.emptySubtitle}>
									Try different dates or locations.
								</Text>
							</View>
						) : (
							<View style={styles.centerContent}>
								<View style={styles.emptyIconContainer}>
									<Feather
										name="map"
										size={32}
										color={colors.primary.DEFAULT}
									/>
								</View>
								<Text style={styles.emptyTitle}>Find Your Trip</Text>
								<Text style={styles.emptySubtitle}>
									Enter your origin and destination to find available trips.
								</Text>
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
	searchHeader: {
		backgroundColor: colors.background.secondary,
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 20,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
		borderBottomWidth: 1,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderColor: colors.background.card,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.text.primary,
		marginBottom: 20,
	},
	inputWrapper: {
		position: "relative",
		zIndex: 10,
		marginBottom: 12,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.background.card,
		borderRadius: 12,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
	},
	inputIconContainer: {
		width: 36,
		height: 36,
		borderRadius: 10,
		backgroundColor: "rgba(245, 166, 35, 0.15)",
		alignItems: "center",
		justifyContent: "center",
	},
	input: {
		flex: 1,
		paddingVertical: 14,
		paddingHorizontal: 12,
		fontSize: 15,
		color: colors.text.primary,
	},
	clearButton: {
		padding: 6,
	},
	swapButton: {
		position: "absolute",
		right: 20,
		top: 95,
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: colors.background.card,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: colors.primary.DEFAULT,
		zIndex: 20,
	},
	suggestionsContainer: {
		position: "absolute",
		top: 60,
		left: 0,
		right: 0,
		backgroundColor: colors.background.card,
		borderRadius: 12,
		maxHeight: 150,
		zIndex: 100,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
		overflow: "hidden",
	},
	suggestionsList: {
		maxHeight: 150,
	},
	suggestionItem: {
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	suggestionBorder: {
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.05)",
	},
	suggestionText: {
		fontSize: 15,
		color: colors.text.primary,
	},
	datePickerButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.background.card,
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 12,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
	},
	dateText: {
		flex: 1,
		marginLeft: 12,
		fontSize: 15,
		color: colors.text.primary,
	},
	searchButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.primary.DEFAULT,
		borderRadius: 12,
		paddingVertical: 16,
		shadowColor: colors.primary.DEFAULT,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	searchButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: colors.background.DEFAULT,
		marginLeft: 8,
	},
	resultsContainer: {
		flex: 1,
	},
	resultsContent: {
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	resultsTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.text.primary,
		marginBottom: 16,
	},
	centerContent: {
		alignItems: "center",
		paddingVertical: 48,
	},
	loadingText: {
		color: colors.text.muted,
		marginTop: 12,
		fontSize: 14,
	},
	tripCard: {
		backgroundColor: colors.background.card,
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
	},
	tripHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 12,
	},
	tripRoute: {
		flex: 1,
	},
	tripRouteText: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.text.primary,
	},
	companyName: {
		fontSize: 13,
		color: colors.text.muted,
		marginTop: 4,
	},
	tripPrice: {
		fontSize: 18,
		fontWeight: "700",
		color: colors.primary.DEFAULT,
	},
	tripDetails: {
		marginBottom: 12,
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
	tripDetailDivider: {
		color: colors.text.muted,
		marginHorizontal: 8,
	},
	tripInfoRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	seatsInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	seatsText: {
		fontSize: 13,
		color: colors.text.secondary,
		marginLeft: 6,
	},
	amenitiesRow: {
		flexDirection: "row",
	},
	amenityBadge: {
		backgroundColor: "rgba(245, 166, 35, 0.15)",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		marginLeft: 6,
	},
	amenityText: {
		fontSize: 11,
		color: colors.primary.DEFAULT,
	},
	bookButton: {
		backgroundColor: colors.primary.DEFAULT,
		borderRadius: 10,
		paddingVertical: 12,
		alignItems: "center",
	},
	bookButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.background.DEFAULT,
	},
	emptyIconContainer: {
		width: 72,
		height: 72,
		borderRadius: 36,
		backgroundColor: colors.background.secondary,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
		borderWidth: 1,
		borderColor: colors.background.card,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.text.primary,
		marginBottom: 8,
	},
	emptySubtitle: {
		fontSize: 14,
		color: colors.text.muted,
		textAlign: "center",
	},
});
