// Export all types for navigation
export type RootStackParamList = {
	// Auth screens
	Welcome: undefined;
	Onboarding: undefined;
	Login: undefined;
	Register: undefined;
	ForgotPassword: undefined;

	// Passenger screens
	PassengerTabs: undefined;
	PassengerHome: undefined;
	Search: undefined;
	TripDetails: { tripId: string };
	Booking: { tripId: string };
	BookingConfirmation: { bookingId: string };
	TicketDetails: { bookingId: string };
	MyTrips: undefined;
	Profile: undefined;
	EditProfile: undefined;
	Notifications: undefined;
	PaymentMethods: undefined;
	SavedAddresses: undefined;
	Settings: undefined;
	Favorites: undefined;
	RateTrip: { bookingId: string };

	// Driver screens
	DriverTabs: undefined;
	DriverDashboard: undefined;
	DriverSchedule: undefined;
	DriverEarnings: undefined;
	ActiveTrip: { tripId: string };
	TripPassengers: { tripId: string };
	DriverProfile: undefined;
};

export type PassengerTabParamList = {
	Home: undefined;
	Search: undefined;
	MyTrips: undefined;
	Profile: undefined;
};

export type DriverTabParamList = {
	Dashboard: undefined;
	Schedule: undefined;
	Earnings: undefined;
	Profile: undefined;
};
