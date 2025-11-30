import {
	MapContainer,
	Marker,
	Polyline,
	Popup,
	TileLayer,
	useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useEffect } from "react";
import { type Bus } from "@/actions/fleet";
import { type Route } from "@/actions/routes";

// Fix for default marker icons in react-leaflet
const busIcon = new Icon({
	iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
	iconSize: [32, 32],
	iconAnchor: [16, 32],
	popupAnchor: [0, -32],
});

const selectedBusIcon = new Icon({
	iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
	iconSize: [40, 40],
	iconAnchor: [20, 40],
	popupAnchor: [0, -40],
});

const locationIcon = new Icon({
	iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
	iconSize: [24, 24],
	iconAnchor: [12, 24],
	popupAnchor: [0, -24],
});

interface MapContentProps {
	buses: Bus[];
	routes: Route[];
	selectedBus: Bus | null;
	onBusSelect: (bus: Bus | null) => void;
}

function FlyToSelectedBus({ selectedBus }: { selectedBus: Bus | null }) {
	const map = useMap();

	useEffect(() => {
		if (selectedBus?.latitude && selectedBus?.longitude) {
			map.flyTo([selectedBus.latitude, selectedBus.longitude], 14, {
				duration: 1,
			});
		}
	}, [selectedBus, map]);

	return null;
}

export default function MapContent({
	buses,
	routes,
	selectedBus,
	onBusSelect,
}: MapContentProps) {
	// Default center (Tunis, Tunisia)
	const defaultCenter: [number, number] = [36.8065, 10.1815];

	// Calculate center based on buses or use default
	const center: [number, number] =
		buses.length > 0 && buses[0].latitude && buses[0].longitude
			? [buses[0].latitude, buses[0].longitude]
			: defaultCenter;

	// Create route paths
	const routePaths = routes.map((route) => {
		const stops = route.stops || [];
		const path: [number, number][] = [];

		// Add origin
		if (route.origin?.latitude && route.origin?.longitude) {
			path.push([route.origin.latitude, route.origin.longitude]);
		}

		// Add stops
		stops.forEach((stop) => {
			if (stop.latitude && stop.longitude) {
				path.push([stop.latitude, stop.longitude]);
			}
		});

		// Add destination
		if (route.destination?.latitude && route.destination?.longitude) {
			path.push([route.destination.latitude, route.destination.longitude]);
		}

		return {
			id: route.id,
			name: route.name,
			path,
			type: route.tripType,
			origin: route.origin,
			destination: route.destination,
		};
	});

	const routeColors = {
		REGULAR: "#3B82F6", // Blue
		SPECIAL: "#EF4444", // Red
	};

	return (
		<div
			className="rounded-lg border overflow-hidden"
			style={{ height: "600px" }}
		>
			<MapContainer
				center={center}
				zoom={10}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<FlyToSelectedBus selectedBus={selectedBus} />

				{/* Route paths and markers */}
				{routePaths.map((route) => (
					<div key={route.id}>
						{/* Route Line */}
						{route.path.length > 1 && (
							<Polyline
								positions={route.path}
								color={
									routeColors[route.type as keyof typeof routeColors] || "gray"
								}
								weight={4}
								opacity={0.7}
							>
								<Popup>
									<div className="p-2">
										<h3 className="font-bold">{route.name}</h3>
										<p className="text-sm">{route.type} Trip</p>
									</div>
								</Popup>
							</Polyline>
						)}

						{/* Origin Marker */}
						{route.origin?.latitude && route.origin?.longitude && (
							<Marker
								position={[route.origin.latitude, route.origin.longitude]}
								icon={locationIcon}
							>
								<Popup>
									<div className="p-2">
										<h3 className="font-bold">{route.origin.name}</h3>
										<p className="text-xs text-gray-500">Origin</p>
									</div>
								</Popup>
							</Marker>
						)}

						{/* Destination Marker */}
						{route.destination?.latitude && route.destination?.longitude && (
							<Marker
								position={[
									route.destination.latitude,
									route.destination.longitude,
								]}
								icon={locationIcon}
							>
								<Popup>
									<div className="p-2">
										<h3 className="font-bold">{route.destination.name}</h3>
										<p className="text-xs text-gray-500">Destination</p>
									</div>
								</Popup>
							</Marker>
						)}
					</div>
				))}

				{/* Bus markers */}
				{buses
					.filter((bus) => bus.latitude != null && bus.longitude != null)
					.map((bus) => (
						<Marker
							key={bus.id}
							position={[bus.latitude as number, bus.longitude as number]}
							icon={selectedBus?.id === bus.id ? selectedBusIcon : busIcon}
							eventHandlers={{
								click: () => onBusSelect(bus),
							}}
						>
							<Popup>
								<div className="p-2">
									<h3 className="font-bold">{bus.plateNumber}</h3>
									<p className="text-sm">{bus.model || "Unknown model"}</p>
									<p className="text-sm">Capacity: {bus.capacity} seats</p>
									{bus.company && (
										<p className="text-sm text-gray-600">{bus.company.name}</p>
									)}
									<p className="text-xs text-green-600 mt-1">● Active</p>
									{bus.lastUpdated && (
										<p className="text-xs text-gray-500 mt-1">
											Last updated:{" "}
											{new Date(bus.lastUpdated).toLocaleTimeString()}
										</p>
									)}
								</div>
							</Popup>
						</Marker>
					))}

				{/* Show message if no buses have location data */}
				{buses.length === 0 && (
					<Marker position={defaultCenter}>
						<Popup>
							<div className="p-2">
								<p className="text-sm text-gray-600">
									No buses with GPS data available
								</p>
							</div>
						</Popup>
					</Marker>
				)}
			</MapContainer>
		</div>
	);
}
