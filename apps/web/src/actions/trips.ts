"use server";

import { handleRequest } from "@/lib/api";

export interface Trip {
	id: string;
	departureTime: string;
	arrivalTime?: string;
	actualDeparture?: string;
	actualArrival?: string;
	status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DELAYED";
	price: number;
	availableSeats: number;
	routeId: string;
	route?: {
		id: string;
		name: string;
		origin: string;
		destination: string;
	};
	busId: string;
	bus?: {
		id: string;
		plateNumber: string;
		capacity: number;
	};
	driverId: string;
	driver?: {
		id: string;
		firstName: string;
		lastName: string;
		phone?: string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface CreateTripDto {
	departureTime: string;
	arrivalTime?: string;
	price: number;
	availableSeats: number;
	routeId: string;
	busId: string;
	driverId: string;
}

export interface UpdateTripDto {
	departureTime?: string;
	arrivalTime?: string;
	actualDeparture?: string;
	actualArrival?: string;
	status?: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DELAYED";
	price?: number;
	availableSeats?: number;
	routeId?: string;
	busId?: string;
	driverId?: string;
}

export async function getTrips(
	routeId?: string,
	driverId?: string,
	status?: string,
) {
	let url = "trips";
	const params: string[] = [];
	if (routeId) params.push(`routeId=${routeId}`);
	if (driverId) params.push(`driverId=${driverId}`);
	if (status) params.push(`status=${status}`);
	if (params.length > 0) url += `?${params.join("&")}`;
	return handleRequest<Trip[]>("get", url);
}

export async function getTrip(id: string) {
	return handleRequest<Trip>("get", `trips/${id}`);
}

export async function createTrip(data: CreateTripDto) {
	return handleRequest<Trip>("post", "trips", data);
}

export async function updateTrip(id: string, data: UpdateTripDto) {
	return handleRequest<Trip>("patch", `trips/${id}`, data);
}

export async function deleteTrip(id: string) {
	return handleRequest<void>("delete", `trips/${id}`);
}

export async function getUpcomingTrips(limit?: number) {
	const url = limit ? `trips/upcoming?limit=${limit}` : "trips/upcoming";
	return handleRequest<Trip[]>("get", url);
}

export async function startTrip(id: string) {
	return handleRequest<Trip>("patch", `trips/${id}`, {
		status: "IN_PROGRESS",
		actualDeparture: new Date().toISOString(),
	});
}

export async function endTrip(id: string) {
	return handleRequest<Trip>("patch", `trips/${id}`, {
		status: "COMPLETED",
		actualArrival: new Date().toISOString(),
	});
}

export async function cancelTrip(id: string) {
	return handleRequest<Trip>("patch", `trips/${id}`, {
		status: "CANCELLED",
	});
}
