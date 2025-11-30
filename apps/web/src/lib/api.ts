"use server";

import axios, { type AxiosRequestConfig } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-options";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:4050";

async function getAuthToken() {
	const session = await getServerSession(authOptions);
	return session?.user?.accessToken;
}

export async function handleRequest<T>(
	method: "get" | "post" | "patch" | "put" | "delete",
	urlPath: string,
	data?: unknown,
	withToken: boolean = true,
): Promise<{ success: boolean; data?: T; error?: string; status?: number }> {
	console.log(`${SERVER_URL}/${urlPath}`);

	const config: AxiosRequestConfig = {
		method,
		url: `${SERVER_URL}/${urlPath}`,
		data,
		// Start with the required Cache-Control header
		headers: {
			"Cache-Control": "no-store, no-cache, must-revalidate, private",
		},
	};

	if (withToken) {
		const token = await getAuthToken();
		if (!token) {
			return {
				success: false,
				error: "No authentication token available",
			};
		}
		config.headers = {
			...config.headers,
			Authorization: `Bearer ${token}`,
		};
	}

	try {
		const response = await axios(config);

		return { success: true, data: response.data };
	} catch (error) {
		const err = error as {
			response?: { status?: number; data?: unknown };
			message?: string;
		};
		// Include HTTP status and response body when available to help debugging 401/403 issues
		console.error(
			`API Error [${method} ${urlPath}] status=${err.response?.status || "?"}:`,
			err.response?.data || err.message,
		);
		// Prefer structured message from response, fall back to error.message or stringified error
		const respData = err.response?.data as { message?: string } | undefined;
		const fallbackMessage =
			typeof err === "object"
				? (err as { message?: string }).message
				: String(err);
		return {
			success: false,
			error: respData?.message || fallbackMessage || "An error occurred",
			// expose status for callers that may want to handle 401/403 specially
			status: err.response?.status,
		};
	}
}
