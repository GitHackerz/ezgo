import {
	MapContainer,
	Marker,
	Polyline,
	Popup,
	TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

// Fix for default marker icons in react-leaflet
const busIcon = new Icon({
	iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
	iconSize: [32, 32],
	iconAnchor: [16, 32],
	popupAnchor: [0, -32],
});

export default function MapContent() {
	const buses = [
		{
			id: "1",
			name: "TUN-1234",
			position: [36.8065, 10.1815],
			route: "Tunis - Sousse",
			status: "active",
		},
		{
			id: "2",
			name: "TUN-5678",
			position: [36.7538, 10.2588],
			route: "Sfax - Gabès",
			status: "active",
		},
		{
			id: "3",
			name: "TUN-9012",
			position: [36.85, 10.195],
			route: "Bizerte - Tunis",
			status: "active",
		},
	];

	const routePath: [number, number][] = [
		[36.8065, 10.1815],
		[36.85, 10.195],
		[36.7538, 10.2588],
	];

	return (
		<div
			className="rounded-lg border overflow-hidden"
			style={{ height: "600px" }}
		>
			<MapContainer
				center={[36.8065, 10.1815]}
				zoom={10}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{/* Route path */}
				<Polyline positions={routePath} color="blue" weight={3} opacity={0.5} />

				{/* Bus markers */}
				{buses.map((bus) => (
					<Marker
						key={bus.id}
						position={bus.position as [number, number]}
						icon={busIcon}
					>
						<Popup>
							<div className="p-2">
								<h3 className="font-bold">{bus.name}</h3>
								<p className="text-sm">{bus.route}</p>
								<p className="text-xs text-green-600 mt-1">● {bus.status}</p>
							</div>
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
}
