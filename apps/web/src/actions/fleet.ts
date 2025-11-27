"use server";

import { handleRequest } from "@/lib/api";

export async function getFleet(_query?: string) {
	// If query is present, we might want to filter, but for now let's just get all
	// The backend might support filtering, if not we filter here or just return all
	return handleRequest<any[]>("get", "buses");
}

export async function getBus(id: string) {
	return handleRequest<any>("get", `buses/${id}`);
}
