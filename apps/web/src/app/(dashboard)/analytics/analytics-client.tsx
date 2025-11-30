"use client";

import {
	ArcElement,
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import { BarChart3, Bus, DollarSign, Route, Users } from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
);

interface AnalyticsClientProps {
	stats: {
		totalRevenue: number;
		activeBuses: number;
		totalUsers: number;
		activeTrips: number;
		totalBookings: number;
		totalRoutes: number;
	};
	revenueData: { labels: string[]; data: number[] };
	tripStats: { labels: string[]; completed: number[]; cancelled: number[] };
	occupancyData: { labels: string[]; data: number[] };
	popularRoutes: { route: string; trips: number; revenue: number }[];
}

export function AnalyticsClient({
	stats,
	revenueData,
	tripStats,
	occupancyData,
	popularRoutes,
}: AnalyticsClientProps) {
	const revenueChartData = {
		labels:
			revenueData.labels.length > 0
				? revenueData.labels
				: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
		datasets: [
			{
				label: "Revenue (TND)",
				data:
					revenueData.data.length > 0
						? revenueData.data
						: [12000, 19000, 15000, 25000, 22000, 30000],
				borderColor: "rgb(37, 99, 235)",
				backgroundColor: "rgba(37, 99, 235, 0.1)",
				tension: 0.4,
			},
		],
	};

	const tripChartData = {
		labels:
			tripStats.labels.length > 0
				? tripStats.labels
				: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		datasets: [
			{
				label: "Completed",
				data:
					tripStats.completed.length > 0
						? tripStats.completed
						: [45, 52, 48, 60, 55, 70, 65],
				backgroundColor: "rgba(34, 197, 94, 0.8)",
			},
			{
				label: "Cancelled",
				data:
					tripStats.cancelled.length > 0
						? tripStats.cancelled
						: [5, 3, 4, 2, 3, 5, 4],
				backgroundColor: "rgba(239, 68, 68, 0.8)",
			},
		],
	};

	const occupancyChartData = {
		labels:
			occupancyData.labels.length > 0
				? occupancyData.labels
				: ["0-25%", "26-50%", "51-75%", "76-100%"],
		datasets: [
			{
				data:
					occupancyData.data.length > 0 ? occupancyData.data : [10, 15, 35, 40],
				backgroundColor: [
					"rgba(239, 68, 68, 0.8)",
					"rgba(251, 191, 36, 0.8)",
					"rgba(59, 130, 246, 0.8)",
					"rgba(34, 197, 94, 0.8)",
				],
			},
		],
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom" as const,
			},
		},
	};

	const displayRoutes =
		popularRoutes.length > 0
			? popularRoutes
			: [
					{ route: "Tunis - Sousse", trips: 245, revenue: 12450 },
					{ route: "Sfax - Gabès", trips: 198, revenue: 9870 },
					{ route: "Bizerte - Tunis", trips: 167, revenue: 7340 },
				];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
				<p className="text-muted-foreground">
					Track your business performance and insights
				</p>
			</div>

			{/* KPI Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
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

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Bookings
						</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalBookings.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">All time bookings</p>
					</CardContent>
				</Card>

				<Card>
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

				<Card>
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
			</div>

			{/* Charts */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Revenue Overview</CardTitle>
						<CardDescription>
							Monthly revenue for the past 6 months
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-[300px]">
							<Line data={revenueChartData} options={chartOptions} />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Trip Statistics</CardTitle>
						<CardDescription>Weekly trip completion rates</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-[300px]">
							<Bar data={tripChartData} options={chartOptions} />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Occupancy & Popular Routes */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Occupancy Distribution</CardTitle>
						<CardDescription>
							Percentage of trips by occupancy rate
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-[300px] flex items-center justify-center">
							<div className="w-64">
								<Doughnut data={occupancyChartData} options={chartOptions} />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Popular Routes</CardTitle>
						<CardDescription>Top performing routes this month</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{displayRoutes.map((item, i) => (
								<div key={i} className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="bg-primary/10 p-2 rounded-lg">
											<Route className="h-4 w-4 text-primary" />
										</div>
										<div>
											<p className="font-medium">{item.route}</p>
											<p className="text-sm text-muted-foreground">
												{item.trips} trips
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-medium">
											{item.revenue.toLocaleString()} TND
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
