"use client";

import {
	MapContainer,
	Marker,
	Polyline,
	Popup,
	TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useState } from "react";

// Fix for default marker icons in react-leaflet
const busIcon = new Icon({
	iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
	iconSize: [32, 32],
	iconAnchor: [16, 32],
	popupAnchor: [0, -32],
});

export default function LiveMapPage() {
	const [buses, _setBuses] = useState([
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
	]);

	const routePath = [
		[36.8065, 10.1815],
		[36.85, 10.195],
		[36.7538, 10.2588],
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Live Map</h1>
				<p className="text-muted-foreground">Track all buses in real-time</p>
			</div>

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
					<Polyline
						positions={routePath}
						color="blue"
						weight={3}
						opacity={0.5}
					/>

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

			{/* Bus List */}
			<div className="grid gap-4 md:grid-cols-3">
				{buses.map((bus) => (
					<div key={bus.id} className="rounded-lg border p-4">
						<div className="flex items-center justify-between mb-2">
							<h3 className="font-semibold">{bus.name}</h3>
							<span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
								{bus.status}
							</span>
						</div>
						<p className="text-sm text-muted-foreground">{bus.route}</p>
					</div>
				))}
			</div>
		</div>
	);
}
