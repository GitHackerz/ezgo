// API Configuration
export const API_CONFIG = {
	BASE_URL: __DEV__
		? "http://10.0.2.2:3001" // Android Emulator
		: // ? 'http://localhost:3001' // iOS Simulator
			"https://api.ezgo.tn", // Production URL
	TIMEOUT: 10000,
};

// API Endpoints
export const ENDPOINTS = {
	// Auth
	AUTH: {
		LOGIN: "/auth/login",
		REGISTER: "/auth/register",
		REFRESH: "/auth/refresh",
		FORGOT_PASSWORD: "/auth/forgot-password",
		RESET_PASSWORD: "/auth/reset-password",
	},

	// Users
	USERS: {
		ME: "/users/me",
		UPDATE: "/users",
		PROFILE: (id: string) => `/users/${id}`,
	},

	// Routes
	ROUTES: {
		LIST: "/routes",
		SEARCH: "/routes/search",
		POPULAR: "/routes/popular",
		DETAIL: (id: string) => `/routes/${id}`,
	},

	// Trips
	TRIPS: {
		LIST: "/trips",
		UPCOMING: "/trips/upcoming",
		DETAIL: (id: string) => `/trips/${id}`,
		DRIVER: "/trips/driver",
	},

	// Bookings
	BOOKINGS: {
		LIST: "/bookings",
		CREATE: "/bookings",
		DETAIL: (id: string) => `/bookings/${id}`,
		CANCEL: (id: string) => `/bookings/${id}/cancel`,
	},

	// Ratings
	RATINGS: {
		CREATE: "/ratings",
		TRIP: (tripId: string) => `/ratings/trip/${tripId}`,
	},

	// Notifications
	NOTIFICATIONS: {
		LIST: "/notifications",
		MARK_READ: (id: string) => `/notifications/${id}/read`,
		MARK_ALL_READ: "/notifications/read-all",
	},

	// Favorites
	FAVORITES: {
		LIST: "/favorites",
		ADD: "/favorites",
		REMOVE: (id: string) => `/favorites/${id}`,
	},
};
