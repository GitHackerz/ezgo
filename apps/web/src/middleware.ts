import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });
	const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
	const isDashboardPage =
		request.nextUrl.pathname === "/" ||
		request.nextUrl.pathname.startsWith("/dashboard");

	// Redirect to login if accessing dashboard without token
	if (isDashboardPage && !token) {
		const loginUrl = new URL("/auth/login", request.url);
		loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
		return NextResponse.redirect(loginUrl);
	}

	// Redirect to dashboard if accessing auth pages with token
	if (isAuthPage && token) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// Role-based access control
	if (token && isDashboardPage) {
		const role = token.role as string;
		const path = request.nextUrl.pathname;

		// Admin-only pages
		const adminOnlyPaths = ["/dashboard/companies"];
		if (adminOnlyPaths.some((p) => path.startsWith(p)) && role !== "ADMIN") {
			return NextResponse.redirect(new URL("/", request.url));
		}

		// Admin and Company Admin pages
		const adminCompanyPaths = [
			"/dashboard/users",
			"/dashboard/fleet",
			"/dashboard/routes",
			"/dashboard/trips",
		];
		if (
			adminCompanyPaths.some((p) => path.startsWith(p)) &&
			!["ADMIN", "COMPANY_ADMIN"].includes(role)
		) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/dashboard/:path*", "/auth/:path*"],
};
