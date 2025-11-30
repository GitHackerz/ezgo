import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) {}

	@Get("dashboard")
	@Roles(Role.ADMIN, Role.COMPANY_ADMIN)
	getDashboardStats() {
		return this.analyticsService.getDashboardStats();
	}

	@Get("revenue")
	@Roles(Role.ADMIN, Role.COMPANY_ADMIN)
	getRevenueData(@Query("period") period: string = "6months") {
		return this.analyticsService.getRevenueData(period);
	}

	@Get("trips")
	@Roles(Role.ADMIN, Role.COMPANY_ADMIN)
	getTripStats(@Query("period") period: string = "week") {
		return this.analyticsService.getTripStats(period);
	}

	@Get("occupancy")
	@Roles(Role.ADMIN, Role.COMPANY_ADMIN)
	getOccupancyData() {
		return this.analyticsService.getOccupancyData();
	}

	@Get("popular-routes")
	@Roles(Role.ADMIN, Role.COMPANY_ADMIN)
	getPopularRoutes(@Query("limit") limit: string = "5") {
		return this.analyticsService.getPopularRoutes(parseInt(limit, 10));
	}

	@Get("recent-bookings")
	@Roles(Role.ADMIN, Role.COMPANY_ADMIN)
	getRecentBookings(@Query("limit") limit: string = "5") {
		return this.analyticsService.getRecentBookings(parseInt(limit, 10));
	}
}
