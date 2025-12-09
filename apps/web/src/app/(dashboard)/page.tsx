"use client";
import {
    Activity,
    Bus,
    DollarSign,
    MapPin,
    Route,
    Ticket,
    Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
	const { data: session, status } = useSession();
	const [stats, setStats] = useState({
		totalRevenue: 0,
		activeBuses: 0,
		totalUsers: 0,
		activeTrips: 0,
		totalBookings: 0,
		totalRoutes: 0,
		totalCompanies: 0,
	});
	const [recentBookings, setRecentBookings] = useState([]);

	useEffect(() => {
		(async () => {
			const statsRes = await fetch("/api/analytics/stats");
			const bookingsRes = await fetch("/api/analytics/recent-bookings");
			setStats(await statsRes.json());
			setRecentBookings(await bookingsRes.json());
		})();
	}, []);

	// Always show session debug info at the top for troubleshooting
	// Remove this after confirming the session structure
	return (
		<div>
			<div className="p-4 border-b border-red-500 bg-black text-white">
				<h2 className="font-bold">Session Debug</h2>
				<div>Status: {status}</div>
				<pre className="p-2 rounded text-xs overflow-x-auto">
					{JSON.stringify(session, null, 2)}
				</pre>
				<p>Role: {session?.user?.role || 'N/A'}</p>
			</div>
			{/* ...existing dashboard code below... */}
			{/* DRIVER dashboard */}
			{session?.user?.role === "DRIVER" ? (
				<div className="space-y-6">
					<h1 className="text-3xl font-bold tracking-tight">Driver Dashboard</h1>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						<Card className="glass-card">
							<CardHeader>
								<CardTitle>Assigned Route</CardTitle>
							</CardHeader>
							<CardContent>Tunis to Sfax Express</CardContent>
						</Card>
						<Card className="glass-card">
							<CardHeader>
								<CardTitle>Assigned Bus</CardTitle>
							</CardHeader>
							<CardContent>Mercedes-Benz Sprinter (TN-123-AB)</CardContent>
						</Card>
						<Card className="glass-card">
							<CardHeader>
								<CardTitle>Next Station</CardTitle>
							</CardHeader>
							<CardContent>Sousse Centre</CardContent>
						</Card>
						<Card className="glass-card">
							<CardHeader>
								<CardTitle>Available Seats</CardTitle>
							</CardHeader>
							<CardContent>12</CardContent>
						</Card>
						<Card className="glass-card">
							<CardHeader>
								<CardTitle>Next Route</CardTitle>
							</CardHeader>
							<CardContent>Sfax to Tunis at 14:30</CardContent>
						</Card>
					</div>
				</div>
			) : (
				// Default dashboard for other roles
				// PASSENGER dashboard design
				if (session?.user?.role === "PASSENGER") {
					// Mock nearby buses data
					const nearbyBuses = [
						{
							id: 'bus1',
							model: 'Mercedes-Benz Sprinter',
							plateNumber: 'TN-123-AB',
							timeToStation: '5 min',
							availableSeats: 12,
							price: 25,
							station: 'Tunis Centre Ville',
						},
						{
							id: 'bus2',
							model: 'Volvo 9700',
							plateNumber: 'TN-456-CD',
							timeToStation: '12 min',
							availableSeats: 8,
							price: 20,
							station: 'Sousse Centre',
						},
					];

					return (
						<div className="space-y-8">
							<div className="rounded-xl p-6 shadow-lg" style={{ background: 'oklch(0.62 0.22 40)' }}>
								<h1 className="text-3xl font-bold mb-2" style={{ color: 'oklch(0.98 0 0)' }}>Passenger Dashboard</h1>
								<p className="text-muted-foreground">Your booked tickets, trips, and quick actions</p>
							</div>
							{/* First row: Nearby Buses & Booked Tickets */}
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
								{/* Nearby Buses */}
								<Card className="glass-card" style={{ background: 'oklch(0.98 0.005 40)', color: 'oklch(0.62 0.22 40)' }}>
									<CardHeader>
										<CardTitle className="text-lg font-semibold" style={{ color: 'oklch(0.62 0.22 40)' }}>Nearby Buses</CardTitle>
									</CardHeader>
									<CardContent>
										{nearbyBuses.length === 0 ? (
											<div className="text-center text-muted-foreground">No nearby buses</div>
										) : (
											<div className="space-y-4">
												{nearbyBuses.map((bus) => (
													<div key={bus.id} className="flex items-center justify-between">
														<div>
															<div className="font-bold text-base" style={{ color: 'oklch(0.62 0.22 40)' }}>{bus.model} ({bus.plateNumber})</div>
															<div className="text-xs text-muted-foreground">Station: {bus.station}</div>
															<div className="text-xs text-muted-foreground">Time to station: {bus.timeToStation}</div>
														</div>
														<div className="text-right">
															<div className="text-sm font-medium" style={{ color: 'oklch(0.62 0.22 40)' }}>Seats: {bus.availableSeats}</div>
															<div className="text-sm font-medium" style={{ color: 'oklch(0.62 0.22 40)' }}>Price: {bus.price} TND</div>
														</div>
													</div>
												))}
											</div>
										)}
									</CardContent>
								</Card>
								{/* Booked Tickets */}
								<Card className="glass-card" style={{ background: 'oklch(0.98 0.005 40)', color: 'oklch(0.62 0.22 40)' }}>
									<CardHeader className="flex flex-row items-center justify-between pb-2">
										<CardTitle className="text-lg font-semibold" style={{ color: 'oklch(0.62 0.22 40)' }}>Booked Ticket</CardTitle>
										<Ticket className="h-6 w-6" style={{ color: 'oklch(0.62 0.22 40)' }} />
									</CardHeader>
									<CardContent>
										{recentBookings[0] ? (
											<div className="space-y-2">
												<div className="font-bold text-xl" style={{ color: 'oklch(0.62 0.22 40)' }}>
													{recentBookings[0].trip?.route?.name || "Trip booking"}
												</div>
												<div className="text-muted-foreground text-sm">
													Bus: {recentBookings[0].trip?.bus?.model || "-"} ({recentBookings[0].trip?.bus?.plateNumber || "-"})
												</div>
												<div className="text-muted-foreground text-sm">
													Time: {recentBookings[0].trip?.departureTime ? new Date(recentBookings[0].trip.departureTime).toLocaleString() : "-"}
												</div>
												<div className="text-muted-foreground text-sm">
													Price: <span className="font-semibold" style={{ color: 'oklch(0.62 0.22 40)' }}>{recentBookings[0].trip?.price || "-"} TND</span>
												</div>
											</div>
										) : (
											<div className="text-center text-muted-foreground">No booked ticket</div>
										)}
									</CardContent>
								</Card>
							</div>
							{/* Second row: Recent Booked Tickets */}
							<div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
								<Card className="glass-card" style={{ background: 'oklch(0.98 0.005 40)', color: 'oklch(0.62 0.22 40)' }}>
									<CardHeader>
										<CardTitle className="text-lg font-semibold" style={{ color: 'oklch(0.62 0.22 40)' }}>Recent Booked Tickets</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{recentBookings.length === 0 ? (
												<p className="text-sm text-muted-foreground text-center py-4">No recent bookings</p>
											) : (
												recentBookings.slice(0, 5).map((booking: any) => (
													<div key={booking.id} className="flex items-center">
														<div className="p-2 rounded-full mr-3" style={{ background: 'oklch(0.62 0.22 40)' }}>
															<Ticket className="h-4 w-4" style={{ color: 'oklch(0.98 0 0)' }} />
														</div>
														<div className="flex-1 space-y-1">
															<p className="text-sm font-medium leading-none" style={{ color: 'oklch(0.62 0.22 40)' }}>
																{booking.trip?.route?.name || "Trip booking"}
															</p>
															<p className="text-xs text-muted-foreground">
																Bus: {booking.trip?.bus?.model || "-"} ({booking.trip?.bus?.plateNumber || "-"})
															</p>
															<p className="text-xs text-muted-foreground">
																Time: {booking.trip?.departureTime ? new Date(booking.trip.departureTime).toLocaleString() : "-"}
															</p>
														</div>
														<div className="text-right">
															<p className="text-sm font-medium" style={{ color: 'oklch(0.62 0.22 40)' }}>
																{booking.trip?.price || "-"} TND
															</p>
															<Badge
																variant={booking.status === "CONFIRMED" ? "default" : "secondary"}
																className="text-xs"
															>
																{booking.status}
															</Badge>
														</div>
													</div>
												))
											)}
										</div>
									</CardContent>
								</Card>
							</div>
							{/* Action Buttons */}
							<div className="flex gap-4 justify-center mt-6">
								<button className="px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform" style={{ background: 'oklch(0.62 0.22 40)', color: 'oklch(0.98 0 0)' }}>Book a Seat</button>
								<button className="px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform" style={{ background: 'oklch(0.8 0.15 85)', color: 'oklch(0.98 0 0)' }}>Book a Trip</button>
							</div>
						</div>
					);
				}
			)}
		</div>
	);
}
		// Example placeholders, replace with real data fetches as needed
		const assignedRoute = "Tunis to Sfax Express";
		const assignedBus = "Mercedes-Benz Sprinter (TN-123-AB)";
		const nextStation = "Sousse Centre";
		const availableSeats = 12;
		const nextRoute = "Sfax to Tunis at 14:30";

		return (
			<div className="space-y-6">
				<h1 className="text-3xl font-bold tracking-tight">Driver Dashboard</h1>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					<Card className="glass-card">
						<CardHeader>
							<CardTitle>Assigned Route</CardTitle>
						</CardHeader>
						<CardContent>{assignedRoute}</CardContent>
					</Card>
					<Card className="glass-card">
						<CardHeader>
							<CardTitle>Assigned Bus</CardTitle>
						</CardHeader>
						<CardContent>{assignedBus}</CardContent>
					</Card>
					<Card className="glass-card">
						<CardHeader>
							<CardTitle>Next Station</CardTitle>
						</CardHeader>
						<CardContent>{nextStation}</CardContent>
					</Card>
					<Card className="glass-card">
						<CardHeader>
							<CardTitle>Available Seats</CardTitle>
						</CardHeader>
						<CardContent>{availableSeats}</CardContent>
					</Card>
					<Card className="glass-card">
						<CardHeader>
							<CardTitle>Next Route</CardTitle>
						</CardHeader>
						<CardContent>{nextRoute}</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	// Default dashboard for other roles
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					Overview of your transport management system
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="glass-card">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalRevenue.toLocaleString()} TND
						</div>
						<p className="text-xs text-muted-foreground">From all bookings</p>
					</CardContent>
				</Card>
				<Card className="glass-card">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Buses</CardTitle>
						<Bus className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.activeBuses}</div>
						<p className="text-xs text-muted-foreground">
							Currently in service
						</p>
					</CardContent>
				</Card>
				<Card className="glass-card">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalUsers.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">Registered users</p>
					</CardContent>
				</Card>
				<Card className="glass-card">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Trips</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.activeTrips}</div>
						<p className="text-xs text-muted-foreground">
							Currently in progress
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card className="glass-card">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Bookings
						</CardTitle>
						<Ticket className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalBookings}</div>
						<p className="text-xs text-muted-foreground">All time bookings</p>
					</CardContent>
				</Card>
				<Card className="glass-card">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Routes</CardTitle>
						<Route className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalRoutes}</div>
						<p className="text-xs text-muted-foreground">Available routes</p>
					</CardContent>
				</Card>
				<Card className="glass-card">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Companies</CardTitle>
						<MapPin className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalCompanies || 0}
						</div>
						<p className="text-xs text-muted-foreground">Transport companies</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="glass-card col-span-4">
					<CardHeader>
						<CardTitle>Overview</CardTitle>
					</CardHeader>
					<CardContent className="pl-2">
						<div className="h-[200px] flex items-center justify-center text-muted-foreground">
							<div className="text-center">
								<Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
								<p>Revenue chart coming soon</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="glass-card col-span-3">
					<CardHeader>
						<CardTitle>Recent Bookings</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recentBookings.length === 0 ? (
								<p className="text-sm text-muted-foreground text-center py-4">
									No recent bookings
								</p>
							) : (
								recentBookings.slice(0, 5).map((booking: any) => (
									<div key={booking.id} className="flex items-center">
										<div className="bg-primary/10 p-2 rounded-full mr-3">
											<Ticket className="h-4 w-4 text-primary" />
										</div>
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium leading-none">
												{booking.user?.firstName} {booking.user?.lastName}
											</p>
											<p className="text-xs text-muted-foreground">
												{booking.trip?.route?.name || "Trip booking"}
											</p>
										</div>
										<div className="text-right">
											<p className="text-sm font-medium">
												{booking.totalPrice} TND
											</p>
											<Badge
												variant={
													booking.status === "CONFIRMED"
														? "default"
														: "secondary"
												}
												className="text-xs"
											>
												{booking.status}
											</Badge>
										</div>
									</div>
								))
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
