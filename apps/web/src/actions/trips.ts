"use server";

import { handleRequest } from "@/lib/api";

export async function getTrips() {
	return handleRequest<any[]>("get", "trips");
}

export async function getTrip(id: string) {
	return handleRequest<any>("get", `trips/${id}`);
}
