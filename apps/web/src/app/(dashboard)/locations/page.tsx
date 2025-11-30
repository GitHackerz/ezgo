import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getLocations } from "@/actions/locations";
import { authOptions } from "@/lib/auth";
import { LocationsClient } from "./locations-client";

export default async function LocationsPage() {
	const session = await getServerSession(authOptions);

	if (!session || session.user.role !== "ADMIN") {
		redirect("/");
	}

	const result = await getLocations();
	const locations = result.success && result.data ? result.data : [];

	return <LocationsClient initialLocations={locations} />;
}
