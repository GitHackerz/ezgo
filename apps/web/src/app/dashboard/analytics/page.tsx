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
import { BarChart3, DollarSign, TrendingUp, Users } from "lucide-react";
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

export default function AnalyticsPage() {
	const revenueData = {
		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
		datasets: [
			{
				label: "Revenue (TND)",
				data: [12000, 19000, 15000, 25000, 22000, 30000],
				borderColor: "rgb(37, 99, 235)",
				backgroundColor: "rgba(37, 99, 235, 0.1)",
				tension: 0.4,
			},
		],
	};

	const tripData = {
		labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		datasets: [
			{
				label: "Completed",
				data: [45, 52, 48, 60, 55, 70, 65],
				backgroundColor: "rgba(34, 197, 94, 0.8)",
			},
			{
				label: "Cancelled",
				data: [5, 3, 4, 2, 3, 5, 4],
				backgroundColor: "rgba(239, 68, 68, 0.8)",
			},
		],
	};

	const occupancyData = {
		labels: ["0-25%", "26-50%", "51-75%", "76-100%"],
		datasets: [
			{
				data: [10, 15, 35, 40],
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
						<div className="text-2xl font-bold">123,000 TND</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-600">+20.1%</span> from last month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Trips</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">2,350</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-600">+180</span> from last month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Passengers
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">12,234</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-600">+19%</span> from last month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">87%</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-600">+5%</span> from last month
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
							<Line data={revenueData} options={chartOptions} />
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
							<Bar data={tripData} options={chartOptions} />
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
								<Doughnut data={occupancyData} options={chartOptions} />
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
							{[
								{ route: "Tunis - Sousse", trips: 245, revenue: "12,450 TND" },
								{ route: "Sfax - Gabès", trips: 198, revenue: "9,870 TND" },
								{ route: "Bizerte - Tunis", trips: 167, revenue: "7,340 TND" },
							].map((item, i) => (
								<div key={i} className="flex items-center justify-between">
									<div>
										<p className="font-medium">{item.route}</p>
										<p className="text-sm text-muted-foreground">
											{item.trips} trips
										</p>
									</div>
									<div className="text-right">
										<p className="font-medium">{item.revenue}</p>
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
