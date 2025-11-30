import {
	Activity,
	Bus,
	DollarSign,
	MapPin,
	Route,
	Ticket,
	Users,
} from "lucide-react";
import { getDashboardStats, getRecentBookings } from "@/actions/analytics";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { handleServerActionResult } from "@/lib/server-action-handler";

export default async function DashboardPage() {
	const [statsResult, bookingsResult] = await Promise.all([
		getDashboardStats(),
		getRecentBookings(),
	]);

	const stats = handleServerActionResult(statsResult) || {
		totalRevenue: 0,
		activeBuses: 0,
		totalUsers: 0,
		activeTrips: 0,
		totalBookings: 0,
		totalRoutes: 0,
	};

	const recentBookings = handleServerActionResult(bookingsResult) || [];

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
