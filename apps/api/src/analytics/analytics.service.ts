import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AnalyticsService {
	constructor(private prisma: PrismaService) {}

	async getDashboardStats() {
		const now = new Date();
		const lastMonth = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate(),
		);

		// Total revenue
		const payments = await this.prisma.payment.aggregate({
			where: { status: "COMPLETED" },
			_sum: { amount: true },
		});
		const totalRevenue = payments._sum.amount || 0;

		const lastMonthPayments = await this.prisma.payment.aggregate({
			where: {
				status: "COMPLETED",
				createdAt: { gte: lastMonth },
			},
			_sum: { amount: true },
		});
		const revenueChange = lastMonthPayments._sum.amount || 0;

		// Total trips
		const totalTrips = await this.prisma.trip.count();
		const tripsThisMonth = await this.prisma.trip.count({
			where: { createdAt: { gte: lastMonth } },
		});
		const tripsChange = tripsThisMonth;

		// Total passengers (users with PASSENGER role who have bookings)
		const totalPassengers = await this.prisma.user.count({
			where: { role: "PASSENGER" },
		});
		const passengersChange = await this.prisma.user.count({
			where: {
				role: "PASSENGER",
				createdAt: { gte: lastMonth },
			},
		});

		// Active buses
		const activeBuses = await this.prisma.bus.count({
			where: { status: "ACTIVE" },
		});
		// No busesChange since Bus doesn't have createdAt field
		const busesChange = 0;

		// Average occupancy (calculate from bookings and trip capacity)
		const recentTrips = await this.prisma.trip.findMany({
			where: {
				status: "COMPLETED",
				departureTime: { gte: lastMonth },
			},
			include: {
				bookings: true,
				bus: true,
			},
		});

		let avgOccupancy = 0;
		if (recentTrips.length > 0) {
			const occupancies = recentTrips.map((trip) => {
				const confirmedBookings = trip.bookings.filter(
					(b) => b.status === "CONFIRMED",
				).length;
				return trip.bus?.capacity
					? (confirmedBookings / trip.bus.capacity) * 100
					: 0;
			});
			avgOccupancy =
				occupancies.reduce((a, b) => a + b, 0) / occupancies.length;
		}

		// Total users
		const totalUsers = await this.prisma.user.count();

		// Active trips (scheduled or in progress)
		const activeTrips = await this.prisma.trip.count({
			where: { status: { in: ["SCHEDULED", "IN_PROGRESS"] } },
		});

		// Total bookings
		const totalBookings = await this.prisma.booking.count();

		// Total routes
		const totalRoutes = await this.prisma.route.count();

		// Total companies
		const totalCompanies = await this.prisma.company.count();

		return {
			totalRevenue,
			revenueChange,
			totalTrips,
			tripsChange,
			totalPassengers,
			passengersChange,
			activeBuses,
			busesChange,
			avgOccupancy: Math.round(avgOccupancy),
			occupancyChange: 0,
			totalUsers,
			activeTrips,
			totalBookings,
			totalRoutes,
			totalCompanies,
		};
	}

	async getRevenueData(period: string) {
		const now = new Date();
		const months = period === "12months" ? 12 : 6;
		const startDate = new Date(
			now.getFullYear(),
			now.getMonth() - months + 1,
			1,
		);

		const payments = await this.prisma.payment.findMany({
			where: {
				status: "COMPLETED",
				createdAt: { gte: startDate },
			},
			select: {
				amount: true,
				createdAt: true,
			},
		});

		// Group by month
		const monthlyData: { [key: string]: number } = {};
		const labels: string[] = [];

		for (let i = 0; i < months; i++) {
			const date = new Date(
				now.getFullYear(),
				now.getMonth() - months + 1 + i,
				1,
			);
			const key = date.toLocaleDateString("en-US", { month: "short" });
			labels.push(key);
			monthlyData[key] = 0;
		}

		payments.forEach((payment) => {
			const key = new Date(payment.createdAt).toLocaleDateString("en-US", {
				month: "short",
			});
			if (monthlyData[key] !== undefined) {
				monthlyData[key] += payment.amount;
			}
		});

		return {
			labels,
			data: labels.map((l) => monthlyData[l] || 0),
		};
	}

	async getTripStats(period: string) {
		const now = new Date();
		const days = period === "month" ? 30 : 7;
		const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

		const trips = await this.prisma.trip.findMany({
			where: {
				departureTime: { gte: startDate },
			},
			select: {
				status: true,
				departureTime: true,
			},
		});

		// Group by day of week
		const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const completedByDay: { [key: string]: number } = {};
		const cancelledByDay: { [key: string]: number } = {};

		dayNames.forEach((day) => {
			completedByDay[day] = 0;
			cancelledByDay[day] = 0;
		});

		trips.forEach((trip) => {
			const dayName = dayNames[new Date(trip.departureTime).getDay()];
			if (trip.status === "COMPLETED") {
				completedByDay[dayName]++;
			} else if (trip.status === "CANCELLED") {
				cancelledByDay[dayName]++;
			}
		});

		return {
			labels: dayNames,
			completed: dayNames.map((d) => completedByDay[d]),
			cancelled: dayNames.map((d) => cancelledByDay[d]),
		};
	}

	async getOccupancyData() {
		const recentTrips = await this.prisma.trip.findMany({
			where: { status: "COMPLETED" },
			take: 100,
			orderBy: { departureTime: "desc" },
			include: {
				bookings: true,
				bus: true,
			},
		});

		const ranges = ["0-25%", "26-50%", "51-75%", "76-100%"];
		const counts = [0, 0, 0, 0];

		recentTrips.forEach((trip) => {
			if (!trip.bus?.capacity) return;
			const confirmedBookings = trip.bookings.filter(
				(b) => b.status === "CONFIRMED",
			).length;
			const occupancy = (confirmedBookings / trip.bus.capacity) * 100;

			if (occupancy <= 25) counts[0]++;
			else if (occupancy <= 50) counts[1]++;
			else if (occupancy <= 75) counts[2]++;
			else counts[3]++;
		});

		return {
			labels: ranges,
			data: counts,
		};
	}

	async getPopularRoutes(limit: number) {
		const routes = await this.prisma.route.findMany({
			include: {
				trips: {
					include: {
						bookings: {
							where: { status: "CONFIRMED" },
							include: {
								payment: true,
							},
						},
					},
				},
			},
		});

		const routeStats = routes.map((route) => {
			const totalTrips = route.trips.length;
			const totalRevenue = route.trips.reduce((sum, trip) => {
				return (
					sum +
					trip.bookings.reduce((bookingSum, booking) => {
						return bookingSum + (booking.payment?.amount || 0);
					}, 0)
				);
			}, 0);

			return {
				route: route.name,
				trips: totalTrips,
				revenue: totalRevenue,
			};
		});

		return routeStats.sort((a, b) => b.revenue - a.revenue).slice(0, limit);
	}

	async getRecentBookings(limit: number) {
		const bookings = await this.prisma.booking.findMany({
			take: limit,
			orderBy: { createdAt: "desc" },
			include: {
				user: {
					select: {
						firstName: true,
						lastName: true,
						email: true,
					},
				},
				trip: {
					include: {
						route: true,
					},
				},
				payment: true,
			},
		});

		return bookings.map((booking) => ({
			id: booking.id,
			passengerName: `${booking.user.firstName} ${booking.user.lastName}`,
			passengerEmail: booking.user.email,
			route: booking.trip.route.name,
			amount: booking.payment?.amount || booking.trip.price,
			createdAt: booking.createdAt.toISOString(),
		}));
	}
}
