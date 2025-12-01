import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfileScreen from "../screens/EditProfileScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import PaymentMethodsScreen from "../screens/PaymentMethodsScreen";
import BookingScreen from "../screens/passenger/BookingScreen";
// Passenger screens
import PassengerHomeScreen from "../screens/passenger/HomeScreen";
import MyTripsScreen from "../screens/passenger/MyTripsScreen";
import ProfileScreen from "../screens/passenger/ProfileScreen";
import SearchScreen from "../screens/passenger/SearchScreen";
import RateTripScreen from "../screens/RateTripScreen";
import SavedAddressesScreen from "../screens/SavedAddressesScreen";
// Shared screens
import SettingsScreen from "../screens/SettingsScreen";
import TicketDetailsScreen from "../screens/TicketDetailsScreen";
import TripDetailsScreen from "../screens/TripDetailsScreen";

import type { PassengerTabParamList, RootStackParamList } from "./types";

const Tab = createBottomTabNavigator<PassengerTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function PassengerTabs() {
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
				tabBarIcon: ({ focused, color, size }) => {
					let iconName: keyof typeof Feather.glyphMap = "home";

					if (route.name === "Home") {
						iconName = "home";
					} else if (route.name === "Search") {
						iconName = "search";
					} else if (route.name === "MyTrips") {
						iconName = "calendar";
					} else if (route.name === "Profile") {
						iconName = "user";
					}

					return <Feather name={iconName} size={size} color={color} />;
				},
			})}
		>
			<Tab.Screen
				name="Home"
				component={PassengerHomeScreen}
				options={{ tabBarLabel: "Home" }}
			/>
			<Tab.Screen
				name="Search"
				component={SearchScreen}
				options={{ tabBarLabel: "Search" }}
			/>
			<Tab.Screen
				name="MyTrips"
				component={MyTripsScreen}
				options={{ tabBarLabel: "My Trips" }}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{ tabBarLabel: "Profile" }}
			/>
		</Tab.Navigator>
	);
}

export function PassengerNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="PassengerTabs" component={PassengerTabs} />
			<Stack.Screen name="TripDetails" component={TripDetailsScreen} />
			<Stack.Screen name="Booking" component={BookingScreen} />
			<Stack.Screen name="TicketDetails" component={TicketDetailsScreen} />
			<Stack.Screen name="Notifications" component={NotificationsScreen} />
			<Stack.Screen name="Settings" component={SettingsScreen} />
			<Stack.Screen name="RateTrip" component={RateTripScreen} />
			<Stack.Screen name="EditProfile" component={EditProfileScreen} />
			<Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
			<Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
		</Stack.Navigator>
	);
}
