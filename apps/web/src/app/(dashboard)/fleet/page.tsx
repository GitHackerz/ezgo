import { getCompanies } from "@/actions/companies";
import { getFleet } from "@/actions/fleet";
import { handleServerActionResult } from "@/lib/server-action-handler";
import { FleetClient } from "./fleet-client";

export default async function FleetPage() {
	const [fleetResult, companiesResult] = await Promise.all([
		getFleet(),
		getCompanies(),
	]);

	const fleet = handleServerActionResult(fleetResult);
	const companies = handleServerActionResult(companiesResult);

	if (!fleetResult.success && fleetResult.status !== 401 && fleetResult.status !== 403) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-destructive">Failed to load fleet data</p>
			</div>
		);
	}

	return (
		<FleetClient
			initialBuses={fleet || []}
			companies={companies || []}
		/>
	);
}
