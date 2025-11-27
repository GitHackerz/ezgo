"use server";

import axios, { type AxiosRequestConfig } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-options";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3001";

async function getAuthToken() {
	const session = await getServerSession(authOptions);
	return session?.token;
}

export async function handleRequest<T>(
	method: "get" | "post" | "patch" | "put" | "delete",
	urlPath: string,
	data?: any,
	withToken: boolean = true,
): Promise<{ data?: T; error?: any }> {
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
			// If no token available, don't add Authorization header
			// This prevents sending malformed Bearer tokens
			return {
				error: {
					status: 401,
					message: "No authentication token available",
				},
			};
		}
		// Merge Authorization into existing headers
		config.headers = {
			...config.headers,
			Authorization: `Bearer ${token}`,
		};
	}

	// Note: For FormData, axios automatically sets Content-Type with boundary
	// Don't manually set it as it will break file uploads

	try {
		const response = await axios(config);

		return { data: response.data };
	} catch (error: any) {
		console.error(
			`API Error [${method} ${urlPath}]:`,
			error.response?.data || error.message,
		);
		return { error: error.response?.data ?? "An error occurred" };
	}
}
