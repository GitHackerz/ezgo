import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/auth-options";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);

	// If user is already authenticated, redirect to dashboard
	if (session) {
		redirect("/");
	}

	return <>{children}</>;
}
