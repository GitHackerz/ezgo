"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MapContent = dynamic(() => import("./MapContent"), { ssr: false });

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

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Live Map</h1>
				<p className="text-muted-foreground">Track all buses in real-time</p>
			</div>

			<MapContent />

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
