import { type Bus, getFleet } from "@/actions/fleet";
import { getRoutes, type Route } from "@/actions/routes";
import { MapClient } from "./map-client";

export default async function LiveMapPage() {
	const [busesResult, routesResult] = await Promise.all([
		getFleet(undefined, "ACTIVE"),
		getRoutes(),
	]);

	const buses: Bus[] =
		busesResult.success && busesResult.data ? busesResult.data : [];
	const routes: Route[] =
		routesResult.success && routesResult.data ? routesResult.data : [];

	return <MapClient initialBuses={buses} routes={routes} />;
}
