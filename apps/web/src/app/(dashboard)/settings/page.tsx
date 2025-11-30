import { getProfile } from "@/actions/users";
import { handleServerActionResult } from "@/lib/server-action-handler";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
	const result = await getProfile();
	const profile = handleServerActionResult(result);

	if (!result.success && result.status !== 401 && result.status !== 403) {
		return (
			<div>
				Error loading profile:{" "}
				{typeof result.error === "string" ? result.error : "Unknown error"}
			</div>
		);
	}

	return <SettingsClient profile={profile} />;
}
