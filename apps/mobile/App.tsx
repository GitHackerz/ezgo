import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { AuthNavigator } from "./src/navigation/AuthNavigator";
import { DriverNavigator } from "./src/navigation/DriverNavigator";
import { PassengerNavigator } from "./src/navigation/PassengerNavigator";

function RootNavigator() {
	const { isAuthenticated, isLoading, user } = useAuth();

	// Show loading screen while checking auth status
	if (isLoading) {
		return (
			<View className="flex-1 bg-white items-center justify-center">
				<ActivityIndicator size="large" color="#3b82f6" />
				<Text className="text-gray-600 mt-4">Loading...</Text>
			</View>
		);
	}

	// Not authenticated - show auth screens
	if (!isAuthenticated || !user) {
		return <AuthNavigator />;
	}

	// Authenticated - show appropriate navigator based on role
	switch (user.role) {
		case "DRIVER":
			return <DriverNavigator />;
		case "ADMIN":
		case "COMPANY_ADMIN":
			// For now, admins use the passenger app
			// You can create an AdminNavigator later
			return <PassengerNavigator />;
		case "PASSENGER":
		default:
			return <PassengerNavigator />;
	}
}

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<AuthProvider>
					<NavigationContainer>
						<StatusBar style="auto" />
						<RootNavigator />
					</NavigationContainer>
				</AuthProvider>
				<Toast />
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
