import { signOut } from "next-auth/react";

interface ActionResult<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	status?: number;
}

export function handleServerActionResult<T>(result: ActionResult<T>): T | null {
	if (!result.success) {
		if (result.status === 401 || result.status === 403) {
			signOut({ callbackUrl: "/auth/login" });
		}
		return null;
	}
	return result.data || null;
}
