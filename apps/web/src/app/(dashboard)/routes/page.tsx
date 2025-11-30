import { getCompanies } from "@/actions/companies";
import { getRoutes } from "@/actions/routes";
import { handleServerActionResult } from "@/lib/server-action-handler";
import { RoutesClient } from "./routes-client";

export default async function RoutesPage() {
	const [routesResult, companiesResult] = await Promise.all([
		getRoutes(),
		getCompanies(),
	]);

	const routes = handleServerActionResult(routesResult);
	const companies = handleServerActionResult(companiesResult);

	if (!routesResult.success && routesResult.status !== 401 && routesResult.status !== 403) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-destructive">Failed to load routes</p>
			</div>
		);
	}

	return (
		<RoutesClient
			initialRoutes={routes || []}
			companies={companies || []}
		/>
	);
}
