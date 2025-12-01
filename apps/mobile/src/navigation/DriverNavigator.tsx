import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ActiveTripScreen from "../screens/driver/ActiveTripScreen";
// Driver screens
import DriverDashboardScreen from "../screens/driver/DashboardScreen";
import DriverEarningsScreen from "../screens/driver/EarningsScreen";
import DriverProfileScreen from "../screens/driver/ProfileScreen";
import DriverScheduleScreen from "../screens/driver/ScheduleScreen";
import TripPassengersScreen from "../screens/driver/TripPassengersScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
// Shared screens
import SettingsScreen from "../screens/SettingsScreen";

import type { DriverTabParamList, RootStackParamList } from "./types";

const Tab = createBottomTabNavigator<DriverTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function DriverTabs() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarStyle: {
					backgroundColor: "#ffffff",
					borderTopWidth: 1,
					borderTopColor: "#E5E7EB",
					paddingBottom: 8,
					paddingTop: 8,
					height: 60,
				},
				tabBarActiveTintColor: "#3B82F6",
				tabBarInactiveTintColor: "#6B7280",
				tabBarIcon: ({ color, size }) => {
					let iconName: keyof typeof Feather.glyphMap = "home";

					if (route.name === "Dashboard") {
						iconName = "home";
					} else if (route.name === "Schedule") {
						iconName = "calendar";
					} else if (route.name === "Earnings") {
						iconName = "dollar-sign";
					} else if (route.name === "Profile") {
						iconName = "user";
					}

					return <Feather name={iconName} size={size} color={color} />;
				},
			})}
		>
			<Tab.Screen
				name="Dashboard"
				component={DriverDashboardScreen}
				options={{ tabBarLabel: "Home" }}
			/>
			<Tab.Screen
				name="Schedule"
				component={DriverScheduleScreen}
				options={{ tabBarLabel: "Schedule" }}
			/>
			<Tab.Screen
				name="Earnings"
				component={DriverEarningsScreen}
				options={{ tabBarLabel: "Earnings" }}
			/>
			<Tab.Screen
				name="Profile"
				component={DriverProfileScreen}
				options={{ tabBarLabel: "Profile" }}
			/>
		</Tab.Navigator>
	);
}

export function DriverNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="DriverTabs" component={DriverTabs} />
			<Stack.Screen name="ActiveTrip" component={ActiveTripScreen} />
			<Stack.Screen name="TripPassengers" component={TripPassengersScreen} />
			<Stack.Screen name="Notifications" component={NotificationsScreen} />
			<Stack.Screen name="Settings" component={SettingsScreen} />
			<Stack.Screen name="EditProfile" component={EditProfileScreen} />
		</Stack.Navigator>
	);
}
