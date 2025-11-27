"use server";

import { handleRequest } from "@/lib/api";

export async function getUsers() {
	return handleRequest<any[]>("get", "users");
}
