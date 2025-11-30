"use server";

import { handleRequest } from "@/lib/api";
import { type Location } from "./locations";

export interface RouteStop {
	locationId?: string;
	name: string;
	latitude: number;
	longitude: number;
	order: number;
}

export interface Route {
	id: string;
	name: string;
	originId: string;
	origin: Location;
	destinationId: string;
	destination: Location;
	distance?: number;
	duration?: number;
	stops?: RouteStop[];
	isActive: boolean;
	tripType: "REGULAR" | "SPECIAL";
	companyId: string;
	company?: {
		id: string;
		name: string;
	};
}

export interface CreateRouteDto {
	name: string;
	originId: string;
	destinationId: string;
	distance?: number;
	duration?: number;
	stops?: RouteStop[];
	isActive?: boolean;
	tripType?: "REGULAR" | "SPECIAL";
	companyId: string;
}

export interface UpdateRouteDto {
	name?: string;
	originId?: string;
	destinationId?: string;
	distance?: number;
	duration?: number;
	stops?: RouteStop[];
	isActive?: boolean;
	tripType?: "REGULAR" | "SPECIAL";
}

export async function getRoutes(companyId?: string, isActive?: boolean) {
	let url = "routes";
	const params: string[] = [];
	if (companyId) params.push(`companyId=${companyId}`);
	if (isActive !== undefined) params.push(`isActive=${isActive}`);
	if (params.length > 0) url += `?${params.join("&")}`;
	return handleRequest<Route[]>("get", url);
}

export async function getRoute(id: string) {
	return handleRequest<Route>("get", `routes/${id}`);
}

export async function createRoute(data: CreateRouteDto) {
	return handleRequest<Route>("post", "routes", data);
}

export async function updateRoute(id: string, data: UpdateRouteDto) {
	return handleRequest<Route>("patch", `routes/${id}`, data);
}

export async function deleteRoute(id: string) {
	return handleRequest<void>("delete", `routes/${id}`);
}

export async function searchRoutes(origin?: string, destination?: string) {
	let url = "routes/search";
	const params: string[] = [];
	if (origin) params.push(`origin=${origin}`);
	if (destination) params.push(`destination=${destination}`);
	if (params.length > 0) url += `?${params.join("&")}`;
	return handleRequest<Route[]>("get", url);
}

export async function getPopularRoutes(limit?: number) {
	const url = limit ? `routes/popular?limit=${limit}` : "routes/popular";
	return handleRequest<Route[]>("get", url);
}
