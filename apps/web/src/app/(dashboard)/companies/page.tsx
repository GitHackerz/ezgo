import { getCompanies } from "@/actions/companies";
import { handleServerActionResult } from "@/lib/server-action-handler";
import { CompaniesClient } from "./companies-client";

export default async function CompaniesPage() {
	const result = await getCompanies();
	const companies = handleServerActionResult(result);

	if (!result.success && result.status !== 401 && result.status !== 403) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-destructive">Failed to load companies</p>
			</div>
		);
	}

	return <CompaniesClient initialCompanies={companies || []} />;
}
