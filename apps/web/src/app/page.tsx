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
import { getDashboardStats, getRecentBookings } from "@/actions/analytics";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
	const [statsResult, bookingsResult] = await Promise.all([
		getDashboardStats(),
		getRecentBookings(),
	]);

	const stats = statsResult.data || {
		totalRevenue: 0,
		activeBuses: 0,
		totalUsers: 0,
		activeTrips: 0,
		totalBookings: 0,
		totalRoutes: 0,
	};

	const recentBookings = bookingsResult.data || [];

	return (
		<DashboardShell>
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
		</DashboardShell>
	);
}
