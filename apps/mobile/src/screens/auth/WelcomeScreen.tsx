import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";

interface Props {
	navigation: {
		replace: (screen: string) => void;
	};
}

export default function WelcomeScreen({ navigation }: Props) {
	const logoOpacity = useRef(new Animated.Value(0)).current;
	const logoScale = useRef(new Animated.Value(0.8)).current;
	const textOpacity = useRef(new Animated.Value(0)).current;
	const textTranslateY = useRef(new Animated.Value(20)).current;

	useEffect(() => {
		// Animate logo
		Animated.parallel([
			Animated.timing(logoOpacity, {
				toValue: 1,
				duration: 800,
				useNativeDriver: true,
			}),
			Animated.spring(logoScale, {
				toValue: 1,
				friction: 4,
				useNativeDriver: true,
			}),
		]).start();

		// Animate text with delay
		setTimeout(() => {
			Animated.parallel([
				Animated.timing(textOpacity, {
					toValue: 1,
					duration: 600,
					useNativeDriver: true,
				}),
				Animated.timing(textTranslateY, {
					toValue: 0,
					duration: 600,
					useNativeDriver: true,
				}),
			]).start();
		}, 500);

		// Navigate to onboarding after delay
		const timer = setTimeout(() => {
			navigation.replace("Onboarding");
		}, 2500);

		return () => clearTimeout(timer);
	}, [navigation, logoOpacity, logoScale, textOpacity, textTranslateY]);

	return (
		<View style={styles.container}>
			<StatusBar style="light" />

			{/* Logo and Brand */}
			<View style={styles.content}>
				<Animated.View
					style={[
						styles.logoContainer,
						{
							opacity: logoOpacity,
							transform: [{ scale: logoScale }],
						},
					]}
				>
					{/* EZGO Logo */}
					<View style={styles.logoWrapper}>
						<View style={styles.logoCircle}>
							<Text style={styles.logoIcon}>🚌</Text>
						</View>
					</View>

					{/* Brand Name */}
					<Text style={styles.brandName}>EZGO</Text>
				</Animated.View>

				<Animated.View
					style={[
						styles.taglineContainer,
						{
							opacity: textOpacity,
							transform: [{ translateY: textTranslateY }],
						},
					]}
				>
					<Text style={styles.tagline}>Smart Mobility for Tunisia</Text>
				</Animated.View>
			</View>

			{/* Bottom decorative element */}
			<View style={styles.bottomDecoration}>
				<View style={styles.decorLine} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		alignItems: "center",
		justifyContent: "center",
	},
	logoContainer: {
		alignItems: "center",
	},
	logoWrapper: {
		marginBottom: 24,
	},
	logoCircle: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: colors.primary.DEFAULT,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: colors.primary.DEFAULT,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.5,
		shadowRadius: 20,
		elevation: 10,
	},
	logoIcon: {
		fontSize: 50,
	},
	brandName: {
		fontSize: 56,
		fontWeight: "800",
		color: colors.white,
		letterSpacing: 8,
	},
	taglineContainer: {
		marginTop: 16,
	},
	tagline: {
		fontSize: 16,
		color: colors.text.secondary,
		letterSpacing: 2,
	},
	bottomDecoration: {
		position: "absolute",
		bottom: 60,
		alignItems: "center",
	},
	decorLine: {
		width: 60,
		height: 4,
		backgroundColor: colors.primary.DEFAULT,
		borderRadius: 2,
	},
});
