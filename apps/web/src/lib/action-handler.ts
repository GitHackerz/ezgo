"use client";

import { signOut } from "next-auth/react";

interface ActionResult<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	status?: number;
}

export async function handleActionResult<T>(
	result: ActionResult<T>,
	onSuccess?: (data: T) => void,
	onError?: (error: string) => void,
): Promise<boolean> {
	if (!result.success) {
		if (result.status === 401 || result.status === 403) {
			signOut({ callbackUrl: "/auth/login" });
			return false;
		}
		if (onError) {
			onError(result.error || "An error occurred");
		}
		return false;
	}

	if (onSuccess && result.data) {
		onSuccess(result.data);
	}
	return true;
}