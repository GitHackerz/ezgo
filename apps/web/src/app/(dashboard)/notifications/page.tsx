import { getNotifications } from "@/actions/notifications";
import { handleServerActionResult } from "@/lib/server-action-handler";
import { NotificationsClient } from "./notifications-client";

export default async function NotificationsPage() {
	const result = await getNotifications();
	const notifications = handleServerActionResult(result);

	if (!result.success && result.status !== 401 && result.status !== 403) {
		return (
			<div>
				Error loading notifications:{" "}
				{typeof result.error === "string" ? result.error : "Unknown error"}
			</div>
		);
	}

	return <NotificationsClient initialNotifications={notifications || []} />;
}
