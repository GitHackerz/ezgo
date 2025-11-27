"use server";

import { handleRequest } from "@/lib/api";

export async function getRoutes() {
	return handleRequest<any[]>("get", "routes");
}

export async function getRoute(id: string) {
	return handleRequest<any>("get", `routes/${id}`);
}
