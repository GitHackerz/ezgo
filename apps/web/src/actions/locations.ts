"use server";

import { handleRequest } from "@/lib/api";

export interface Location {
	id: string;
	name: string;
	city: string;
	governorate: string;
	address?: string;
	latitude: number;
	longitude: number;
	type: "CITY" | "STATION" | "LANDMARK";
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateLocationDto {
	name: string;
	city: string;
	governorate: string;
	address?: string;
	latitude: number;
	longitude: number;
	type?: string;
	isActive?: boolean;
}

export interface UpdateLocationDto {
	name?: string;
	city?: string;
	governorate?: string;
	address?: string;
	latitude?: number;
	longitude?: number;
	type?: string;
	isActive?: boolean;
}

export interface FilterLocationsDto {
	city?: string;
	governorate?: string;
	type?: string;
	isActive?: boolean;
}

export async function getLocations(filters?: FilterLocationsDto) {
	let url = "locations";
	const params: string[] = [];

	if (filters) {
		if (filters.city) params.push(`city=${encodeURIComponent(filters.city)}`);
		if (filters.governorate)
			params.push(`governorate=${encodeURIComponent(filters.governorate)}`);
		if (filters.type) params.push(`type=${filters.type}`);
		if (filters.isActive !== undefined)
			params.push(`isActive=${filters.isActive}`);
	}

	if (params.length > 0) url += `?${params.join("&")}`;

	return handleRequest<Location[]>("get", url);
}

export async function searchLocations(query: string) {
	return handleRequest<Location[]>(
		"get",
		`locations/search?q=${encodeURIComponent(query)}`,
	);
}

export async function getLocation(id: string) {
	return handleRequest<Location>("get", `locations/${id}`);
}

export async function createLocation(data: CreateLocationDto) {
	return handleRequest<Location>("post", "locations", data);
}

export async function updateLocation(id: string, data: UpdateLocationDto) {
	return handleRequest<Location>("patch", `locations/${id}`, data);
}

export async function deleteLocation(id: string) {
	return handleRequest<void>("delete", `locations/${id}`);
}
