import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	FlatList,
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { colors } from "../../constants/theme";

const { width } = Dimensions.get("window");

interface Props {
	navigation: {
		replace: (screen: string) => void;
	};
}

interface OnboardingItem {
	id: string;
	title: string;
	subtitle: string;
	icon: keyof typeof Feather.glyphMap;
}

const onboardingData: OnboardingItem[] = [
	{
		id: "1",
		title: "Book Your Ride",
		subtitle:
			"Find and book comfortable bus trips across Tunisia with just a few taps",
		icon: "map-pin",
	},
	{
		id: "2",
		title: "Real-Time Tracking",
		subtitle: "Track your bus in real-time and never miss your departure",
		icon: "navigation",
	},
	{
		id: "3",
		title: "Safe & Reliable",
		subtitle: "Travel with trusted operators and enjoy a seamless journey",
		icon: "shield",
	},
];

export default function OnboardingScreen({ navigation }: Props) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const flatListRef = useRef<FlatList>(null);
	const scrollX = useRef(new Animated.Value(0)).current;

	const handleNext = () => {
		if (currentIndex < onboardingData.length - 1) {
			flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
			setCurrentIndex(currentIndex + 1);
		} else {
			handleGetStarted();
		}
	};

	const handleGetStarted = () => {
		navigation.replace("Login");
	};

	const handleSkip = () => {
		navigation.replace("Login");
	};

	const renderItem = ({ item }: { item: OnboardingItem }) => (
		<View style={styles.slide}>
			<View style={styles.iconContainer}>
				<View style={styles.iconCircle}>
					<Feather name={item.icon} size={48} color={colors.primary.DEFAULT} />
				</View>
			</View>
			<Text style={styles.title}>{item.title}</Text>
			<Text style={styles.subtitle}>{item.subtitle}</Text>
		</View>
	);

	const renderDots = () => (
		<View style={styles.dotsContainer}>
			{onboardingData.map((_, index) => {
				const inputRange = [
					(index - 1) * width,
					index * width,
					(index + 1) * width,
				];
				const dotWidth = scrollX.interpolate({
					inputRange,
					outputRange: [8, 24, 8],
					extrapolate: "clamp",
				});
				const opacity = scrollX.interpolate({
					inputRange,
					outputRange: [0.4, 1, 0.4],
					extrapolate: "clamp",
				});
				return (
					<Animated.View
						key={index}
						style={[styles.dot, { width: dotWidth, opacity }]}
					/>
				);
			})}
		</View>
	);

	return (
		<ImageBackground
			source={require("../../../assets/bg.png")}
			style={styles.container}
			resizeMode="cover"
		>
			<StatusBar style="light" />

			{/* Dark Overlay */}
			<View style={styles.overlay} />

			{/* Skip Button */}
			<TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
				<Text style={styles.skipText}>Skip</Text>
			</TouchableOpacity>

			{/* Content */}
			<View style={styles.content}>
				{/* Logo */}
				<View style={styles.logoSection}>
					<View style={styles.logoCircle}>
						<Text style={styles.logoIcon}>🚌</Text>
					</View>
					<Text style={styles.brandName}>EZGO</Text>
				</View>

				{/* Slides */}
				<Animated.FlatList
					ref={flatListRef}
					data={onboardingData}
					renderItem={renderItem}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					keyExtractor={(item) => item.id}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { x: scrollX } } }],
						{ useNativeDriver: false },
					)}
					onMomentumScrollEnd={(event) => {
						const index = Math.round(event.nativeEvent.contentOffset.x / width);
						setCurrentIndex(index);
					}}
				/>

				{/* Dots */}
				{renderDots()}

				{/* Get Started Button */}
				<TouchableOpacity style={styles.button} onPress={handleNext}>
					<Text style={styles.buttonText}>
						{currentIndex === onboardingData.length - 1
							? "Get Started"
							: "Next"}
					</Text>
					<Feather
						name="arrow-right"
						size={20}
						color={colors.background.DEFAULT}
					/>
				</TouchableOpacity>

				{/* Login Link */}
				<View style={styles.loginContainer}>
					<Text style={styles.loginText}>Already have an account? </Text>
					<TouchableOpacity onPress={() => navigation.replace("Login")}>
						<Text style={styles.loginLink}>Sign In</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(13, 13, 26, 0.85)",
	},
	skipButton: {
		position: "absolute",
		top: 60,
		right: 24,
		zIndex: 10,
	},
	skipText: {
		color: colors.text.secondary,
		fontSize: 16,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 80,
	},
	logoSection: {
		alignItems: "center",
		marginBottom: 40,
	},
	logoCircle: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: colors.primary.DEFAULT,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
		shadowColor: colors.primary.DEFAULT,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.5,
		shadowRadius: 15,
		elevation: 8,
	},
	logoIcon: {
		fontSize: 36,
	},
	brandName: {
		fontSize: 36,
		fontWeight: "800",
		color: colors.white,
		letterSpacing: 6,
	},
	slide: {
		width,
		alignItems: "center",
		paddingHorizontal: 40,
	},
	iconContainer: {
		marginBottom: 24,
	},
	iconCircle: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: colors.background.secondary,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: colors.primary.DEFAULT,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: colors.white,
		textAlign: "center",
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 16,
		color: colors.text.secondary,
		textAlign: "center",
		lineHeight: 24,
	},
	dotsContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 32,
		marginBottom: 40,
	},
	dot: {
		height: 8,
		borderRadius: 4,
		backgroundColor: colors.primary.DEFAULT,
		marginHorizontal: 4,
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.primary.DEFAULT,
		paddingVertical: 16,
		paddingHorizontal: 48,
		borderRadius: 30,
		gap: 8,
		shadowColor: colors.primary.DEFAULT,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.4,
		shadowRadius: 8,
		elevation: 6,
	},
	buttonText: {
		color: colors.background.DEFAULT,
		fontSize: 18,
		fontWeight: "700",
	},
	loginContainer: {
		flexDirection: "row",
		marginTop: 24,
		marginBottom: 40,
	},
	loginText: {
		color: colors.text.secondary,
		fontSize: 14,
	},
	loginLink: {
		color: colors.primary.DEFAULT,
		fontSize: 14,
		fontWeight: "600",
	},
});
