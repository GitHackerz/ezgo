"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-options";
import { handleRequest } from "@/lib/api";

export interface DashboardStats {
	totalRevenue: number;
	revenueChange?: number;
	totalTrips?: number;
	tripsChange?: number;
	totalPassengers?: number;
	passengersChange?: number;
	activeBuses: number;
	busesChange?: number;
	avgOccupancy?: number;
	occupancyChange?: number;
	totalUsers: number;
	activeTrips: number;
	totalBookings: number;
	totalRoutes: number;
	totalCompanies?: number;
}

export interface RevenueData {
	labels: string[];
	data: number[];
}

export interface TripStats {
	labels: string[];
	completed: number[];
	cancelled: number[];
}

export interface OccupancyData {
	labels: string[];
	data: number[];
}

export interface PopularRoute {
	route: string;
	trips: number;
	revenue: number;
}

export interface RecentBooking {
	id: string;
	passengerName: string;
	passengerEmail: string;
	route: string;
	amount: number;
	createdAt: string;
}

export async function getDashboardStats() {
	// Only call protected analytics endpoints when a server session exists
	// and the user has an ADMIN or COMPANY_ADMIN role. This avoids 401 logs
	// for regular visitors or unauthenticated requests during SSR.
	try {
		const session = await getServerSession(authOptions);
		const role = session?.user?.role;
		if (!role || (role !== "ADMIN" && role !== "COMPANY_ADMIN")) {
			return { success: false, error: "Not authorized", status: 401 };
		}
	} catch {
		// If we can't resolve session for some reason, avoid calling the API
		return { success: false, error: "Session unavailable", status: 401 };
	}
	return handleRequest<DashboardStats>("get", "analytics/dashboard");
}

export async function getRevenueData(period: string = "6months") {
	return handleRequest<RevenueData>(
		"get",
		`analytics/revenue?period=${period}`,
	);
}

export async function getTripStats(period: string = "week") {
	return handleRequest<TripStats>("get", `analytics/trips?period=${period}`);
}

export async function getOccupancyData() {
	return handleRequest<OccupancyData>("get", "analytics/occupancy");
}

export async function getPopularRoutes(limit: number = 5) {
	return handleRequest<PopularRoute[]>(
		"get",
		`analytics/popular-routes?limit=${limit}`,
	);
}

export async function getRecentBookings(limit: number = 5) {
	try {
		const session = await getServerSession(authOptions);
		const role = session?.user?.role;
		if (!role || (role !== "ADMIN" && role !== "COMPANY_ADMIN")) {
			return { success: false, error: "Not authorized", status: 401 };
		}
	} catch {
		return { success: false, error: "Session unavailable", status: 401 };
	}

	return handleRequest<RecentBooking[]>(
		"get",
		`analytics/recent-bookings?limit=${limit}`,
	);
}
