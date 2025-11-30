"use client";

import { Bus as BusIcon, Info, MapPin, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { type Bus, getFleet } from "@/actions/fleet";
import { type Route } from "@/actions/routes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

const MapContent = dynamic(() => import("./MapContent"), { ssr: false });

interface MapClientProps {
	initialBuses: Bus[];
	routes: Route[];
}

export function MapClient({ initialBuses, routes }: MapClientProps) {
	const [buses, setBuses] = useState<Bus[]>(initialBuses);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
	const { toast } = useToast();

	// Auto-refresh every 30 seconds
	useEffect(() => {
		const interval = setInterval(async () => {
			const result = await getFleet(undefined, "ACTIVE");
			if (result.success && result.data) {
				setBuses(result.data);
			}
		}, 30000);

		return () => clearInterval(interval);
	}, []);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		try {
			const result = await getFleet(undefined, "ACTIVE");
			if (result.success && result.data) {
				setBuses(result.data);
				toast({
					title: "Map Updated",
					description: "Bus locations have been refreshed",
				});
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to refresh bus locations",
					variant: "destructive",
				});
			}
		} catch {
			toast({
				title: "Error",
				description: "Failed to refresh bus locations",
				variant: "destructive",
			});
		} finally {
			setIsRefreshing(false);
		}
	};

	const busesWithLocation = buses.filter(
		(bus) => bus.latitude != null && bus.longitude != null,
	);

	const getRouteName = (bus: Bus) => {
		// Find if bus is assigned to a route through its company
		return bus.company?.name || "Unassigned";
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Live Map</h1>
					<p className="text-muted-foreground">
						Track all buses in real-time ({busesWithLocation.length} buses with
						location data)
					</p>
				</div>
				<div className="flex items-center gap-2">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="icon">
									<Info className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<div className="space-y-2">
									<p className="font-semibold">Map Legend</p>
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 rounded-full bg-blue-500" />
										<span className="text-xs">Regular Route</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 rounded-full bg-red-500" />
										<span className="text-xs">Special Trip</span>
									</div>
									<div className="flex items-center gap-2">
										<MapPin className="h-3 w-3 text-gray-500" />
										<span className="text-xs">Location</span>
									</div>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<Button
						variant="outline"
						onClick={handleRefresh}
						disabled={isRefreshing}
					>
						<RefreshCw
							className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
						/>
						Refresh
					</Button>
				</div>
			</div>

			{/* Map */}
			<MapContent
				buses={busesWithLocation}
				routes={routes}
				selectedBus={selectedBus}
				onBusSelect={setSelectedBus}
			/>

			{/* Statistics */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Buses</CardTitle>
						<BusIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{buses.length}</div>
						<p className="text-xs text-muted-foreground">Total active fleet</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">With GPS</CardTitle>
						<MapPin className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{busesWithLocation.length}</div>
						<p className="text-xs text-muted-foreground">Reporting location</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Routes</CardTitle>
						<MapPin className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{routes.length}</div>
						<p className="text-xs text-muted-foreground">Total routes</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Offline</CardTitle>
						<BusIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-amber-600">
							{buses.length - busesWithLocation.length}
						</div>
						<p className="text-xs text-muted-foreground">No GPS signal</p>
					</CardContent>
				</Card>
			</div>

			{/* Bus List */}
			<Card>
				<CardHeader>
					<CardTitle>Active Buses</CardTitle>
				</CardHeader>
				<CardContent>
					{buses.length === 0 ? (
						<p className="text-muted-foreground text-center py-8">
							No active buses found
						</p>
					) : (
						<div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
							{buses.map((bus) => (
								<div
									key={bus.id}
									className={`rounded-lg border p-4 cursor-pointer transition-colors hover:bg-muted ${
										selectedBus?.id === bus.id ? "border-primary bg-muted" : ""
									}`}
									onClick={() => setSelectedBus(bus)}
								>
									<div className="flex items-center justify-between mb-2">
										<h3 className="font-semibold">{bus.plateNumber}</h3>
										<Badge
											variant={
												bus.latitude && bus.longitude ? "default" : "secondary"
											}
										>
											{bus.latitude && bus.longitude ? "Online" : "Offline"}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground">
										{bus.model || "Unknown model"}
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										{getRouteName(bus)}
									</p>
									{bus.latitude && bus.longitude && (
										<p className="text-xs text-muted-foreground mt-1">
											📍 {bus.latitude.toFixed(4)}, {bus.longitude.toFixed(4)}
										</p>
									)}
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
