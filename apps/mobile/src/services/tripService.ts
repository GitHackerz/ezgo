import api from "./api";
import type { Route } from "./routeService";

export type TripStatus =
	| "SCHEDULED"
	| "BOARDING"
	| "IN_PROGRESS"
	| "COMPLETED"
	| "CANCELLED"
	| "DELAYED";

export interface Trip {
	id: string;
	routeId: string;
	busId: string;
	driverId?: string;
	departureTime: string;
	arrivalTime: string;
	status: TripStatus;
	actualDepartureTime?: string;
	actualArrivalTime?: string;
	availableSeats: number;
	basePrice: number;
	dynamicPrice?: number;
	amenities: string[];
	createdAt: string;
	updatedAt: string;
	route?: Route;
	bus?: {
		id: string;
		plateNumber: string;
		busType: string;
		capacity: number;
		amenities: string[];
		company?: {
			id: string;
			name: string;
			logo?: string;
			rating?: number;
		};
	};
	driver?: {
		id: string;
		firstName: string;
		lastName: string;
		phone?: string;
		avatar?: string;
	};
}

export interface SearchTripsParams {
	originCity?: string;
	destinationCity?: string;
	date?: string;
	passengers?: number;
	sortBy?: "price" | "departure" | "duration";
	sortOrder?: "asc" | "desc";
}

export interface TripStop {
	id: string;
	tripId: string;
	stopName: string;
	location: { lat: number; lng: number };
	arrivalTime: string;
	departureTime: string;
	order: number;
}

const tripService = {
	// Search trips
	async searchTrips(params: SearchTripsParams): Promise<Trip[]> {
		const response = await api.get("/trips/search", { params });
		return response.data;
	},

	// Get trip by ID
	async getTripById(id: string): Promise<Trip> {
		const response = await api.get(`/trips/${id}`);
		return response.data;
	},

	// Get trip details with all related data
	async getTripDetails(id: string): Promise<Trip> {
		const response = await api.get(`/trips/${id}/details`);
		return response.data;
	},

	// Get available seats for a trip
	async getAvailableSeats(tripId: string): Promise<string[]> {
		const response = await api.get(`/trips/${tripId}/available-seats`);
		return response.data;
	},

	// Get seat map for a trip
	async getSeatMap(tripId: string): Promise<{ seats: any[]; layout: any }> {
		const response = await api.get(`/trips/${tripId}/seat-map`);
		return response.data;
	},

	// Get trip stops
	async getTripStops(tripId: string): Promise<TripStop[]> {
		const response = await api.get(`/trips/${tripId}/stops`);
		return response.data;
	},

	// Get upcoming trips for passenger
	async getUpcomingTrips(): Promise<Trip[]> {
		const response = await api.get("/trips/upcoming");
		return response.data;
	},

	// Get past trips for passenger
	async getPastTrips(): Promise<Trip[]> {
		const response = await api.get("/trips/history");
		return response.data;
	},

	// For drivers: Get assigned trips
	async getDriverTrips(status?: TripStatus): Promise<Trip[]> {
		const params = status ? { status } : {};
		const response = await api.get("/trips/driver/my-trips", { params });
		return response.data;
	},

	// For drivers: Get today's trips
	async getDriverTodayTrips(): Promise<Trip[]> {
		const response = await api.get("/trips/driver/today");
		return response.data;
	},

	// For drivers: Start a trip
	async startTrip(tripId: string): Promise<Trip> {
		const response = await api.post(`/trips/${tripId}/start`);
		return response.data;
	},

	// For drivers: Complete a trip
	async completeTrip(tripId: string): Promise<Trip> {
		const response = await api.post(`/trips/${tripId}/complete`);
		return response.data;
	},

	// For drivers: Update trip status
	async updateTripStatus(tripId: string, status: TripStatus): Promise<Trip> {
		const response = await api.patch(`/trips/${tripId}/status`, { status });
		return response.data;
	},

	// For drivers: Get passengers on a trip
	async getTripPassengers(tripId: string): Promise<any[]> {
		const response = await api.get(`/trips/${tripId}/passengers`);
		return response.data;
	},

	// For drivers: Mark passenger as boarded
	async markPassengerBoarded(tripId: string, bookingId: string): Promise<void> {
		await api.post(`/trips/${tripId}/passengers/${bookingId}/board`);
	},

	// Track trip location (real-time)
	async getTripLocation(
		tripId: string,
	): Promise<{ lat: number; lng: number; updatedAt: string }> {
		const response = await api.get(`/trips/${tripId}/location`);
		return response.data;
	},

	// For drivers: Update current location
	async updateDriverLocation(
		tripId: string,
		location: { lat: number; lng: number },
	): Promise<void> {
		await api.post(`/trips/${tripId}/location`, location);
	},
};

export default tripService;
