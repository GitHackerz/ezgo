"use server";

import { handleRequest } from "@/lib/api";

export interface Booking {
	id: string;
	seatNumber?: string;
	status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
	qrCode?: string;
	tripId: string;
	trip?: {
		id: string;
		departureTime: string;
		price: number;
		route?: {
			id: string;
			name: string;
			origin: string;
			destination: string;
		};
		bus?: {
			plateNumber: string;
		};
		driver?: {
			firstName: string;
			lastName: string;
		};
	};
	userId: string;
	user?: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		phone?: string;
	};
	payment?: {
		id: string;
		amount: number;
		status: string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface CreateBookingDto {
	tripId: string;
	seatNumber?: string;
}

export async function getBookings(tripId?: string) {
	const url = tripId ? `bookings?tripId=${tripId}` : "bookings";
	return handleRequest<Booking[]>("get", url);
}

export async function getBooking(id: string) {
	return handleRequest<Booking>("get", `bookings/${id}`);
}

export async function createBooking(data: CreateBookingDto) {
	return handleRequest<Booking>("post", "bookings", data);
}

export async function cancelBooking(id: string) {
	return handleRequest<Booking>("patch", `bookings/${id}/cancel`);
}

export async function deleteBooking(id: string) {
	return handleRequest<void>("delete", `bookings/${id}`);
}

export async function confirmBooking(id: string) {
	// This would typically be handled by payment completion
	return handleRequest<Booking>("patch", `bookings/${id}`, {
		status: "CONFIRMED",
	});
}
