import { useCallback, useEffect, useState } from "react";
import tripService, {
	type SearchTripsParams,
	type Trip,
} from "../services/tripService";

export function useTrips(params?: SearchTripsParams) {
	const [trips, setTrips] = useState<Trip[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchTrips = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = params
				? await tripService.searchTrips(params)
				: await tripService.getUpcomingTrips();
			setTrips(data);
		} catch (err: any) {
			setError(err.message || "Failed to fetch trips");
		} finally {
			setIsLoading(false);
		}
	}, [JSON.stringify(params)]);

	useEffect(() => {
		fetchTrips();
	}, [fetchTrips]);

	return { trips, isLoading, error, refetch: fetchTrips };
}

export function useTrip(tripId: string) {
	const [trip, setTrip] = useState<Trip | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchTrip = useCallback(async () => {
		if (!tripId) return;
		setIsLoading(true);
		setError(null);
		try {
			const data = await tripService.getTripDetails(tripId);
			setTrip(data);
		} catch (err: any) {
			setError(err.message || "Failed to fetch trip");
		} finally {
			setIsLoading(false);
		}
	}, [tripId]);

	useEffect(() => {
		fetchTrip();
	}, [fetchTrip]);

	return { trip, isLoading, error, refetch: fetchTrip };
}

export function useDriverTrips() {
	const [trips, setTrips] = useState<Trip[]>([]);
	const [todayTrips, setTodayTrips] = useState<Trip[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchTrips = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const [allTrips, today] = await Promise.all([
				tripService.getDriverTrips(),
				tripService.getDriverTodayTrips(),
			]);
			setTrips(allTrips);
			setTodayTrips(today);
		} catch (err: any) {
			setError(err.message || "Failed to fetch driver trips");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchTrips();
	}, [fetchTrips]);

	const startTrip = async (tripId: string) => {
		const updatedTrip = await tripService.startTrip(tripId);
		setTrips((prev) => prev.map((t) => (t.id === tripId ? updatedTrip : t)));
		setTodayTrips((prev) =>
			prev.map((t) => (t.id === tripId ? updatedTrip : t)),
		);
		return updatedTrip;
	};

	const completeTrip = async (tripId: string) => {
		const updatedTrip = await tripService.completeTrip(tripId);
		setTrips((prev) => prev.map((t) => (t.id === tripId ? updatedTrip : t)));
		setTodayTrips((prev) =>
			prev.map((t) => (t.id === tripId ? updatedTrip : t)),
		);
		return updatedTrip;
	};

	return {
		trips,
		todayTrips,
		isLoading,
		error,
		refetch: fetchTrips,
		startTrip,
		completeTrip,
	};
}

export function useAvailableSeats(tripId: string) {
	const [seats, setSeats] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!tripId) return;

		const fetchSeats = async () => {
			setIsLoading(true);
			try {
				const data = await tripService.getAvailableSeats(tripId);
				setSeats(data);
			} catch (err: any) {
				setError(err.message || "Failed to fetch seats");
			} finally {
				setIsLoading(false);
			}
		};

		fetchSeats();
	}, [tripId]);

	return { seats, isLoading, error };
}
