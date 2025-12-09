
"use client";
import {
	Activity,
	ArrowUpRight,
	Bus,
	Calendar,
	DollarSign,
	MapPin,
	MoreHorizontal,
	Route,
	Ticket,
	TrendingUp,
	Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { driverWorkHoursYear } from "./driverWorkHoursData";

export default function HomePage() {
		const router = useRouter();
		const [showBookingModal, setShowBookingModal] = useState(false);
		const [selectedBus, setSelectedBus] = useState<any>(null);
		const [seatCount, setSeatCount] = useState(1);
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
	type Booking = {
		id?: string;
		trip?: {
			route?: { name?: string };
			bus?: { model?: string; plateNumber?: string };
			departureTime?: string;
			price?: number;
		};
		route?: string;
		bus?: string;
		departureTime?: string;
		amount?: number;
		status?: string;
	};
	const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

	useEffect(() => {
		(async () => {
			const statsRes = await fetch("/api/analytics/stats");
			const bookingsRes = await fetch("/api/analytics/recent-bookings");
			setStats(await statsRes.json());
			setRecentBookings(await bookingsRes.json());
		})();
	}, []);

	return (
		<DashboardShell>
			{/* Role-based dashboards */}
			{session?.user?.role === "DRIVER" ? (
				<div className="space-y-8">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
								Welcome, Driver!
							</h1>
							<p className="text-muted-foreground mt-1">
								Here is your assigned information and next actions.
							</p>
						</div>
					</div>
					<div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
						{/* Row 1 */}
						<Card className="shadow-lg border-0 bg-gradient-to-br from-orange-500 to-yellow-400 text-white">
							<CardHeader className="flex flex-row items-center gap-3 pb-2">
								<Bus className="h-7 w-7" />
								<CardTitle className="text-lg font-semibold">Assigned Route</CardTitle>
							</CardHeader>
							<CardContent className="text-xl font-bold">Tunis to Sfax Express</CardContent>
						</Card>
						<Card className="shadow-lg border-0 bg-gradient-to-br from-blue-600 to-cyan-400 text-white">
							<CardHeader className="flex flex-row items-center gap-3 pb-2">
								<Activity className="h-7 w-7" />
								<CardTitle className="text-lg font-semibold">Assigned Bus</CardTitle>
							</CardHeader>
							<CardContent className="text-xl font-bold">Mercedes-Benz Sprinter (TN-123-AB)</CardContent>
						</Card>
						<Card className="shadow-lg border-0 bg-gradient-to-br from-pink-500 to-red-400 text-white">
							<CardHeader className="flex flex-row items-center gap-3 pb-2">
								<MapPin className="h-7 w-7" />
								<CardTitle className="text-lg font-semibold">Company</CardTitle>
							</CardHeader>
							<CardContent className="text-xl font-bold">TunisBus Express</CardContent>
						</Card>
						{/* Row 2 */}
						<Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-emerald-400 text-white">
							<CardHeader className="flex flex-row items-center gap-3 pb-2">
								<MapPin className="h-7 w-7" />
								<CardTitle className="text-lg font-semibold">Next Station</CardTitle>
							</CardHeader>
							<CardContent className="text-xl font-bold">Sousse Centre</CardContent>
						</Card>
						<Card className="shadow-lg border-0 bg-gradient-to-br from-purple-600 to-pink-400 text-white">
							<CardHeader className="flex flex-row items-center gap-3 pb-2">
								<Users className="h-7 w-7" />
								<CardTitle className="text-lg font-semibold">Available Seats</CardTitle>
							</CardHeader>
							<CardContent className="text-xl font-bold">12</CardContent>
						</Card>
						<Card className="shadow-lg border-0 bg-gradient-to-br from-gray-700 to-gray-400 text-white">
							<CardHeader className="flex flex-row items-center gap-3 pb-2">
								<Route className="h-7 w-7" />
								<CardTitle className="text-lg font-semibold">Next Route</CardTitle>
							</CardHeader>
							<CardContent className="text-xl font-bold">Sfax to Tunis at 14:30</CardContent>
						</Card>
					</div>
					{/* Chart Section */}
					<div className="mt-8">
						<Card className="shadow-lg border-0">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-lg font-semibold">Hours of Work</CardTitle>
								<div>
									<select className="rounded-lg px-3 py-1 border text-sm bg-muted text-foreground">
										<option value="day">Per Day</option>
										<option value="month">Per Month</option>
										<option value="year">Per Year</option>
									</select>
								</div>
							</CardHeader>
							<CardContent>
								{/* Simple static bar chart for year data */}
								<div className="h-64 flex flex-col justify-end items-center bg-muted rounded-xl border border-dashed border-border p-6">
									<div className="w-full flex items-end justify-between h-40">
										{driverWorkHoursYear.map((data, idx) => (
											<div key={data.month} className="flex flex-col items-center w-6">
												<div
													className="w-5 rounded bg-primary"
													style={{ height: `${data.hours / 2}px` }}
													title={`${data.hours} hours`}
												></div>
												<span className="text-xs mt-2 text-muted-foreground">{data.month}</span>
											</div>
										))}
									</div>
									<div className="mt-4 text-center">
										<p className="text-muted-foreground font-medium">
											Hours worked per month (Year)
										</p>
										<p className="text-sm text-muted-foreground/70 mt-1">
											Filter UI is static, chart shows yearly data
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			) : session?.user?.role === "COMPANY_ADMIN" ? (
				<div className="space-y-8">
					{/* Page Header */}
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
								Dashboard
							</h1>
							<p className="text-muted-foreground mt-1">
								Welcome back! Here's what's happening with your transit network.
							</p>
						</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
							>
								<Calendar className="h-4 w-4" />
								View Reports
							</button>
						</div>
					</div>

					{/* Stats Grid */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{/* Revenue Card */}
						<Card className="relative overflow-hidden border-0 gradient-primary text-white">
							<div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium text-white/80">
									Total Revenue
								</CardTitle>
								<div className="p-2 rounded-lg bg-white/20">
									<DollarSign className="h-4 w-4" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold">
									{stats.totalRevenue?.toLocaleString() || "0"}
									<span className="text-lg ml-1">TND</span>
								</div>
								<div className="flex items-center gap-1 mt-2 text-sm text-white/80">
									<ArrowUpRight className="h-4 w-4" />
									<span>+12.5% from last month</span>
								</div>
							</CardContent>
						</Card>

						{/* Active Buses */}
						<Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									Active Buses
								</CardTitle>
								<div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
									<Bus className="h-4 w-4" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold">{stats.activeBuses || 0}</div>
								<p className="text-sm text-muted-foreground mt-1">
									Currently in service
								</p>
								<div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
									<div
										className="h-full rounded-full bg-emerald-500"
										style={{
											width: `${Math.min((stats.activeBuses || 0) * 10, 100)}%`,
										}}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Total Users */}
						<Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									Total Users
								</CardTitle>
								<div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
									<Users className="h-4 w-4" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold">
									{stats.totalUsers?.toLocaleString() || "0"}
								</div>
								<p className="text-sm text-muted-foreground mt-1">
									Registered users
								</p>
								<div className="flex items-center gap-1 mt-2 text-sm text-emerald-600">
									<TrendingUp className="h-4 w-4" />
									<span>+8 new today</span>
								</div>
							</CardContent>
						</Card>

						{/* Active Trips */}
						<Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									Active Trips
								</CardTitle>
								<div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
									<Activity className="h-4 w-4" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold">{stats.activeTrips || 0}</div>
								<p className="text-sm text-muted-foreground mt-1">
									In progress now
								</p>
								<div className="flex items-center gap-2 mt-2">
									<span className="relative flex h-2 w-2">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
										<span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
									</span>
									<span className="text-sm text-muted-foreground">
										Live tracking
									</span>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Secondary Stats */}
					<div className="grid gap-4 md:grid-cols-3">
						<Card className="border-border/50 hover:border-primary/30 transition-colors">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Total Bookings
										</p>
										<p className="text-2xl font-bold mt-1">
											{stats.totalBookings || 0}
										</p>
									</div>
									<div className="p-3 rounded-2xl bg-primary/10">
										<Ticket className="h-6 w-6 text-primary" />
									</div>
								</div>
								<div className="mt-4 flex items-center gap-2">
									<Badge
										variant="secondary"
										className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
									>
										<ArrowUpRight className="h-3 w-3 mr-1" />
										23%
									</Badge>
									<span className="text-xs text-muted-foreground">
										vs last week
									</span>
								</div>
							</CardContent>
						</Card>

						<Card className="border-border/50 hover:border-primary/30 transition-colors">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Total Routes
										</p>
										<p className="text-2xl font-bold mt-1">
											{stats.totalRoutes || 0}
										</p>
									</div>
									<div className="p-3 rounded-2xl bg-cyan-500/10">
										<Route className="h-6 w-6 text-cyan-600" />
									</div>
								</div>
								<div className="mt-4 flex items-center gap-2">
									<Badge
										variant="secondary"
										className="bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20"
									>
										Active
									</Badge>
									<span className="text-xs text-muted-foreground">
										All operational
									</span>
								</div>
							</CardContent>
						</Card>

						<Card className="border-border/50 hover:border-primary/30 transition-colors">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Companies
										</p>
										<p className="text-2xl font-bold mt-1">
											{stats.totalCompanies || 0}
										</p>
									</div>
									<div className="p-3 rounded-2xl bg-rose-500/10">
										<MapPin className="h-6 w-6 text-rose-600" />
									</div>
								</div>
								<div className="mt-4 flex items-center gap-2">
									<Badge
										variant="secondary"
										className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
									>
										Partners
									</Badge>
									<span className="text-xs text-muted-foreground">
										Transport companies
									</span>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Charts and Recent Activity */}
					<div className="grid gap-6 lg:grid-cols-7">
						{/* Chart Placeholder */}
						<Card className="lg:col-span-4 border-border/50">
							<CardHeader className="flex flex-row items-center justify-between">
								<div>
									<CardTitle className="text-lg font-semibold">
										Revenue Overview
									</CardTitle>
									<p className="text-sm text-muted-foreground mt-1">
										Monthly revenue trends
									</p>
								</div>
								<button
									type="button"
									className="p-2 rounded-lg hover:bg-muted transition-colors"
								>
									<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
								</button>
							</CardHeader>
							<CardContent>
								<div className="h-[280px] flex items-center justify-center rounded-xl bg-muted/30 border border-dashed border-border">
									<div className="text-center">
										<div className="p-4 rounded-2xl bg-primary/10 w-fit mx-auto mb-4">
											<TrendingUp className="h-8 w-8 text-primary" />
										</div>
										<p className="text-muted-foreground font-medium">
											Revenue chart coming soon
										</p>
										<p className="text-sm text-muted-foreground/70 mt-1">
											Analytics data will appear here
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Recent Bookings */}
						<Card className="lg:col-span-3 border-border/50">
							<CardHeader className="flex flex-row items-center justify-between">
								<div>
									<CardTitle className="text-lg font-semibold">
										Recent Bookings
									</CardTitle>
									<p className="text-sm text-muted-foreground mt-1">
										Latest transactions
									</p>
								</div>
								<Badge variant="secondary" className="bg-primary/10 text-primary">
									{recentBookings.length} new
								</Badge>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{recentBookings.length === 0 ? (
										<div className="text-center py-8">
											<div className="p-4 rounded-2xl bg-muted/50 w-fit mx-auto mb-3">
												<Ticket className="h-6 w-6 text-muted-foreground" />
											</div>
											<p className="text-sm text-muted-foreground">
												No recent bookings
											</p>
										</div>
									) : (
										recentBookings
											.slice(0, 5)
											.map((booking: any, index: number) => (
												<div
													key={booking.id}
													className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
												>
													<div className="relative">
														<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
															{booking.passengerName?.charAt(0) || "U"}
														</div>
														{index === 0 && (
															<span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
														)}
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium truncate">
															{booking.passengerName}
														</p>
														<p className="text-xs text-muted-foreground truncate">
															{booking.route}
														</p>
													</div>
													<div className="text-right">
														<p className="text-sm font-semibold">
															{booking.amount} TND
														</p>
														<Badge
															variant="secondary"
															className="text-[10px] bg-emerald-500/10 text-emerald-600"
														>
															Confirmed
														</Badge>
													</div>
												</div>
											))
									)}
								</div>
								{recentBookings.length > 0 && (
									<button
										type="button"
										className="w-full mt-4 py-2.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
									>
										View all bookings →
									</button>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			) : session?.user?.role === "PASSENGER" ? (
				(() => {
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
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div>
									<h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
										Welcome, Passenger!
									</h1>
									<p className="text-muted-foreground mt-1">
										Here is your nearby buses, tickets, and next actions.
									</p>
								</div>
							</div>
							{/* Row 1 - Nearby Buses */}
							<Card className="shadow-xl border-0 bg-black text-white">
								<CardHeader className="flex flex-row items-center gap-3 pb-2 bg-gradient-to-r from-orange-500 to-yellow-400">
									<Bus className="h-7 w-7" />
									<CardTitle className="text-lg font-semibold">Nearby Buses</CardTitle>
								</CardHeader>
								<CardContent>
									{nearbyBuses.length === 0 ? (
										<div className="text-center text-white/80">No nearby buses</div>
									) : (
										<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
											{nearbyBuses.map((bus, index) => (
												<div key={bus.id} className={`p-4 rounded-xl shadow-lg ${
													index % 3 === 0 ? 'bg-gradient-to-br from-orange-500 to-yellow-400' :
													index % 3 === 1 ? 'bg-gradient-to-br from-purple-600 to-pink-400' :
													'bg-gradient-to-br from-blue-600 to-cyan-400'
												}`}>
													<div className="text-base font-bold mb-2 text-white">{bus.model}</div>
													<div className="text-xs mb-1 text-white/90">Plate: {bus.plateNumber}</div>
													<div className="text-xs mb-1 text-white/90">Station: {bus.station}</div>
													<div className="text-xs mb-1 text-white/90">Time: {bus.timeToStation}</div>
													<div className="text-xs mb-1 text-white/90">Seats: {bus.availableSeats}</div>
													<div className="text-sm font-semibold mb-3 text-white">{bus.price} TND</div>
													<div className="flex gap-2">
														<button
															className="flex-1 px-2 py-1 text-xs rounded-lg font-bold shadow-md bg-white/20 hover:bg-white/30 transition-colors text-white backdrop-blur-sm"
															onClick={() => { setSelectedBus(bus); setShowBookingModal(true); setSeatCount(1); }}
														>
															Book Now
														</button>
														<button
															className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
															title="View Live Map"
															onClick={() => router.push(`/map`)}
														>
															<MapPin className="h-4 w-4 text-white" />
														</button>
													</div>
												</div>
											))}
										</div>
									)}
								</CardContent>
							</Card>
							{/* Row 2 - Booked Ticket */}
							<Card className="shadow-xl border-0 bg-black text-white mt-6">
								<CardHeader className="flex flex-row items-center gap-3 pb-2 bg-gradient-to-r from-blue-600 to-cyan-400">
									<Ticket className="h-7 w-7" />
									<CardTitle className="text-lg font-semibold">Booked Ticket</CardTitle>
								</CardHeader>
								<CardContent>
									{recentBookings[0] ? (
										<div className="space-y-1">
											<div className="font-bold text-xl">
												{recentBookings[0]?.trip?.route?.name ?? recentBookings[0]?.route ?? "Trip booking"}
											</div>
											<div className="text-sm">
												Bus: {recentBookings[0]?.trip?.bus?.model ?? recentBookings[0]?.bus ?? "-"} ({recentBookings[0]?.trip?.bus?.plateNumber ?? "-"})
											</div>
											<div className="text-sm">
												Time: {recentBookings[0]?.trip?.departureTime ? new Date(recentBookings[0].trip.departureTime!).toLocaleString() : (recentBookings[0]?.departureTime ? new Date(recentBookings[0].departureTime!).toLocaleString() : "-")}
											</div>
											<div className="text-sm">
												Price: <span className="font-semibold">{recentBookings[0]?.trip?.price ?? recentBookings[0]?.amount ?? "-"} TND</span>
											</div>
										</div>
									) : (
										<div className="text-center text-white/80">No booked ticket</div>
									)}
								</CardContent>
							</Card>
							{/* Row 3 - Action Buttons */}
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-6 max-w-xl mx-auto">
								<button 
									className="px-3 py-2 rounded-lg shadow border-0 bg-gradient-to-br from-green-500 to-emerald-400 text-white hover:scale-105 transition-transform"
									onClick={() => router.push("/booking-history")}
								>
									<div className="flex items-center justify-center gap-2">
										<Ticket className="h-4 w-4" />
										<span className="text-sm font-medium">Booking History</span>
									</div>
								</button>
								<button 
									className="px-3 py-2 rounded-lg shadow border-0 bg-gradient-to-br from-purple-600 to-pink-400 text-white hover:scale-105 transition-transform"
									onClick={() => router.push("/book-trip")}
								>
									<div className="flex items-center justify-center gap-2">
										<Bus className="h-4 w-4" />
										<span className="text-sm font-medium">Book a Trip</span>
									</div>
								</button>
							</div>
							{/* Booking Modal */}
							{showBookingModal && selectedBus && (
								<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
									<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-0 overflow-hidden animate-fadeIn">
										<div className="bg-gradient-to-r from-orange-500 to-yellow-400 px-6 py-4 flex items-center justify-between">
											<h2 className="text-xl font-bold text-white">Book Seats</h2>
											<button className="text-white text-2xl font-bold" onClick={() => { setShowBookingModal(false); setSelectedBus(null); }}>&times;</button>
										</div>
										<div className="px-6 py-6 flex flex-col gap-4">
											<div className="font-semibold text-lg" style={{ color: 'oklch(0.62 0.22 40)' }}>{selectedBus.model} <span className="text-sm text-muted-foreground">({selectedBus.plateNumber})</span></div>
											<div className="flex gap-4 text-sm">
												<span className="bg-muted px-2 py-1 rounded">Station: {selectedBus.station}</span>
												<span className="bg-muted px-2 py-1 rounded">Available: {selectedBus.availableSeats}</span>
												<span className="bg-muted px-2 py-1 rounded">Price: {selectedBus.price} TND</span>
											</div>
											<div className="flex flex-col gap-2 mt-2">
												<label className="font-medium text-[#b45309]" htmlFor="seatCount">Number of seats:</label>
												<input
													id="seatCount"
													type="number"
													min={1}
													max={selectedBus.availableSeats}
													value={seatCount}
													onChange={e => setSeatCount(Math.max(1, Math.min(selectedBus.availableSeats, Number(e.target.value))))}
													className="border-2 border-orange-400 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 text-[#b45309]"
												/>
											</div>
											<div className="flex gap-3 mt-4 justify-end">
												<button
													className="px-5 py-2 rounded-lg font-bold shadow bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:scale-105 transition-transform"
													onClick={() => { setShowBookingModal(false); setSelectedBus(null); }}
												>
													Confirm ({seatCount * selectedBus.price} TND)
												</button>
												<button
													className="px-5 py-2 rounded-lg font-bold shadow bg-gray-200 text-gray-700 hover:bg-gray-300"
													onClick={() => { setShowBookingModal(false); setSelectedBus(null); }}
												>
													Cancel
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					);
				})()
			) : (
				<div className="space-y-6">
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">Overview of your transport management system</p>
				</div>
			)}
		</DashboardShell>
	);
}
