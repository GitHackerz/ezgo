"use server";

import { handleRequest } from "@/lib/api";

export async function getBookings() {
	return handleRequest<any[]>("get", "bookings");
}

export async function getBooking(id: string) {
	return handleRequest<any>("get", `bookings/${id}`);
}
