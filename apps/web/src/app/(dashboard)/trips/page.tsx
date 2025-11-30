import { getFleet } from "@/actions/fleet";
import { getRoutes } from "@/actions/routes";
import { getTrips } from "@/actions/trips";
import { getDrivers } from "@/actions/users";
import { handleServerActionResult } from "@/lib/server-action-handler";
import { TripsClient } from "./trips-client";

export default async function TripsPage() {
	const [tripsResult, routesResult, busesResult, driversResult] =
		await Promise.all([getTrips(), getRoutes(), getFleet(), getDrivers()]);

	const trips = handleServerActionResult(tripsResult) || [];
	const routes = handleServerActionResult(routesResult) || [];
	const buses = handleServerActionResult(busesResult) || [];
	const drivers = handleServerActionResult(driversResult) || [];

	return (
		<TripsClient
			initialTrips={trips}
			routes={routes}
			buses={buses}
			drivers={drivers}
		/>
	);
}
