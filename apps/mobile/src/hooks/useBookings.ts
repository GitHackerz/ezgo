import { useCallback, useEffect, useState } from "react";
import bookingService, {
	type Booking,
	type CreateBookingData,
} from "../services/bookingService";

export function useBookings() {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
	const [pastBookings, setPastBookings] = useState<Booking[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchBookings = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const [upcoming, past] = await Promise.all([
				bookingService.getUpcomingBookings(),
				bookingService.getPastBookings(),
			]);
			setUpcomingBookings(upcoming);
			setPastBookings(past);
			setBookings([...upcoming, ...past]);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to fetch bookings";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchBookings();
	}, [fetchBookings]);

	return {
		bookings,
		upcomingBookings,
		pastBookings,
		isLoading,
		error,
		refetch: fetchBookings,
	};
}

export function useBooking(bookingId: string) {
	const [booking, setBooking] = useState<Booking | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchBooking = useCallback(async () => {
		if (!bookingId) return;
		setIsLoading(true);
		setError(null);
		try {
			const data = await bookingService.getBookingById(bookingId);
			setBooking(data);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to fetch booking";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [bookingId]);

	useEffect(() => {
		fetchBooking();
	}, [fetchBooking]);

	return { booking, isLoading, error, refetch: fetchBooking };
}

export function useCreateBooking() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createBooking = async (
		data: CreateBookingData,
	): Promise<Booking | null> => {
		setIsLoading(true);
		setError(null);
		try {
			const booking = await bookingService.createBooking(data);
			return booking;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to create booking";
			setError(errorMessage);
			return null;
		} finally {
			setIsLoading(false);
		}
	};

	const cancelBooking = async (
		bookingId: string,
		reason?: string,
	): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
		try {
			await bookingService.cancelBooking(bookingId, reason);
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to cancel booking";
			setError(errorMessage);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return { createBooking, cancelBooking, isLoading, error };
}
