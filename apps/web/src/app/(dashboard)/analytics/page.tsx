import {
	getDashboardStats,
	getOccupancyData,
	getPopularRoutes,
	getRevenueData,
	getTripStats,
} from "@/actions/analytics";
import { AnalyticsClient } from "./analytics-client";

export default async function AnalyticsPage() {
	const [
		statsResult,
		revenueResult,
		tripStatsResult,
		occupancyResult,
		routesResult,
	] = await Promise.all([
		getDashboardStats(),
		getRevenueData(),
		getTripStats(),
		getOccupancyData(),
		getPopularRoutes(),
	]);

	return (
		<AnalyticsClient
			stats={
				statsResult.data || {
					totalRevenue: 0,
					activeBuses: 0,
					totalUsers: 0,
					activeTrips: 0,
					totalBookings: 0,
					totalRoutes: 0,
				}
			}
			revenueData={revenueResult.data || { labels: [], data: [] }}
			tripStats={
				tripStatsResult.data || { labels: [], completed: [], cancelled: [] }
			}
			occupancyData={occupancyResult.data || { labels: [], data: [] }}
			popularRoutes={routesResult.data || []}
		/>
	);
}
