import { getCompanies } from "@/actions/companies";
import { getUsers } from "@/actions/users";
import { handleServerActionResult } from "@/lib/server-action-handler";
import { UsersClient } from "./users-client";

export default async function UsersPage() {
	const [usersResult, companiesResult] = await Promise.all([
		getUsers(),
		getCompanies(),
	]);

	const users = handleServerActionResult(usersResult);
	const companies = handleServerActionResult(companiesResult);

	return (
		<UsersClient
			initialUsers={users || []}
			companies={companies || []}
		/>
	);
}
