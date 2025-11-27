"use client";

import { getBookings } from "@/actions/bookings";
import { BookingsClient } from "./bookings-client";

export default async function BookingsPage() {
	const { data: bookings, error } = await getBookings();

	if (error) {
		return (
			<div>Error loading bookings: {error.message || "Unknown error"}</div>
		);
	}

	return <BookingsClient initialBookings={bookings || []} />;
}
