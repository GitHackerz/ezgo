import { getBookings } from "@/actions/bookings";
import { handleServerActionResult } from "@/lib/server-action-handler";
import { BookingsClient } from "./bookings-client";

export default async function BookingsPage() {
	const result = await getBookings();
	const bookings = handleServerActionResult(result);

	if (!result.success && result.status !== 401 && result.status !== 403) {
		return (
			<div>Error loading bookings: {typeof result.error === 'string' ? result.error : "Unknown error"}</div>
		);
	}

	return <BookingsClient initialBookings={bookings || []} />;
}
