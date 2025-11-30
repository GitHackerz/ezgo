"use server";

import { handleRequest } from "@/lib/api";

export interface Bus {
	id: string;
	plateNumber: string;
	capacity: number;
	model?: string;
	year?: number;
	status: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
	latitude?: number;
	longitude?: number;
	lastUpdated?: string;
	companyId: string;
	company?: {
		id: string;
		name: string;
	};
}

export interface CreateBusDto {
	plateNumber: string;
	capacity: number;
	model?: string;
	year?: number;
	status?: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
	companyId: string;
}

export interface UpdateBusDto {
	plateNumber?: string;
	capacity?: number;
	model?: string;
	year?: number;
	status?: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
}

export interface UpdateBusLocationDto {
	latitude: number;
	longitude: number;
}

export async function getFleet(companyId?: string, status?: string) {
	let url = "buses";
	const params: string[] = [];
	if (companyId) params.push(`companyId=${companyId}`);
	if (status) params.push(`status=${status}`);
	if (params.length > 0) url += `?${params.join("&")}`;

	return handleRequest<Bus[]>("get", url);
}

export async function getBus(id: string) {
	return handleRequest<Bus>("get", `buses/${id}`);
}

export async function createBus(data: CreateBusDto) {
	return handleRequest<Bus>("post", "buses", data);
}

export async function updateBus(id: string, data: UpdateBusDto) {
	return handleRequest<Bus>("patch", `buses/${id}`, data);
}

export async function updateBusLocation(
	id: string,
	data: UpdateBusLocationDto,
) {
	return handleRequest<Bus>("patch", `buses/${id}/location`, data);
}

export async function deleteBus(id: string) {
	return handleRequest<void>("delete", `buses/${id}`);
}

export async function getNearbyBuses(
	lat: number,
	lon: number,
	radius?: number,
) {
	let url = `buses/nearby?lat=${lat}&lon=${lon}`;
	if (radius) url += `&radius=${radius}`;
	return handleRequest<Bus[]>("get", url);
}
