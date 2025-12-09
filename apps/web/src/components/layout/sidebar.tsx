"use client";

import {
    BarChart3,
    Bell,
    Building2,
    Bus,
    Calendar,
    ChevronRight,
    CreditCard,
    LayoutDashboard,
    Map as MapIcon,
    Route,
    Settings,
    Ticket,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

type NavItem = {
	name: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	roles?: string[];
	badge?: string;
};

const navigation: NavItem[] = [
	{ name: "Dashboard", href: "/", icon: LayoutDashboard },
	{ name: "Live Map", href: "/map", icon: MapIcon, badge: "Live" },
	{ name: "Fleet", href: "/fleet", icon: Bus, roles: ["ADMIN", "COMPANY_ADMIN", "DRIVER"] },
	{ name: "Routes", href: "/routes", icon: Route, roles: ["ADMIN", "COMPANY_ADMIN", "DRIVER"] },
	{ name: "Trips", href: "/trips", icon: Calendar, roles: ["ADMIN", "COMPANY_ADMIN", "DRIVER"] },
	{ name: "Bookings", href: "/bookings", icon: Ticket, roles: ["ADMIN", "COMPANY_ADMIN", "DRIVER"] },
	{ name: "Book Trip", href: "/book-trip", icon: Bus, roles: ["PASSENGER"] },
	{ name: "Booking History", href: "/booking-history", icon: Ticket, roles: ["PASSENGER"] },
	{
		name: "Payments",
		href: "/payments",
		icon: CreditCard,
		roles: ["ADMIN", "COMPANY_ADMIN"],
	},
	{
		name: "Users & Drivers",
		href: "/users",
		icon: Users,
		roles: ["ADMIN", "COMPANY_ADMIN"],
	},
	{
		name: "Companies",
		href: "/companies",
		icon: Building2,
		roles: ["ADMIN"],
	},
	{ name: "Notifications", href: "/notifications", icon: Bell },
	{
		name: "Analytics",
		href: "/analytics",
		icon: BarChart3,
		roles: ["ADMIN", "COMPANY_ADMIN"],
	},
	{ name: "Settings", href: "/settings", icon: Settings },
];

type SidebarProps = {
	isOpen?: boolean;
	onClose?: () => void;
};

export function Sidebar({ isOpen = true, onClose }: Readonly<SidebarProps>) {
	const pathname = usePathname();
	const { data: session } = useSession();
	const userRole = session?.user?.role || "PASSENGER";

	const filteredNavigation = navigation.filter((item) => {
		if (!item.roles || item.roles.length === 0) return true;
		return item.roles.includes(userRole);
	});

	return (
		<>
			{/* Overlay for small screens when sidebar is open */}
			<button
				type="button"
				className={cn(
					"fixed inset-0 bg-black/30 z-20 transition-opacity lg:hidden border-0 p-0 m-0",
					isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
				)}
				onClick={() => onClose?.()}
				aria-hidden={!isOpen}
				aria-label="Close sidebar overlay"
			/>

			<div
				className={cn(
					"fixed left-0 top-0 flex w-72 flex-col bg-sidebar border-r border-sidebar-border h-screen z-30 transform transition-transform duration-200 ease-in-out",
					isOpen ? "translate-x-0" : "-translate-x-72",
				)}
			>
			{/* Logo Section */}
			<div className="flex h-20 items-center justify-center px-6">
				<Link href="/">
					<Image
						src="/images/logo.png"
						alt="EZGO Logo"
						width={140}
						height={40}
						className="object-contain transition-opacity group-hover:opacity-90"
						priority
					/>
				</Link>
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
				<div className="mb-4">
					<span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
						Navigation
					</span>
				</div>
				{filteredNavigation.map((item) => {
					const isActive =
						pathname === item.href ||
						(item.href !== "/" && pathname.startsWith(item.href));
					return (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								"group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
								isActive
									? "bg-sidebar-accent text-sidebar-accent-foreground"
									: "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
							)}
						>
							{isActive && (
								<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full gradient-primary" />
							)}
							<div
								className={cn(
									"p-1.5 rounded-lg transition-colors",
									isActive
										? "bg-primary/20"
										: "bg-sidebar-accent/30 group-hover:bg-sidebar-accent/50",
								)}
							>
								<item.icon
									className={cn(
										"h-4 w-4 transition-colors",
										isActive ? "text-primary" : "text-sidebar-foreground/60",
									)}
								/>
							</div>
							<span className="flex-1">{item.name}</span>
							{item.badge && (
								<span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-primary/20 text-primary animate-pulse-soft">
									{item.badge}
								</span>
							)}
							{isActive && (
								<ChevronRight className="h-4 w-4 text-primary opacity-60" />
							)}
						</Link>
					);
				})}
			</nav>

			{/* User Section */}
			<div className="border-t border-sidebar-border p-4">
				{session?.user && (
					<div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-sidebar-accent/30 transition-colors cursor-pointer">
						<div className="relative">
							<div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
								<span className="text-sm font-semibold text-primary-foreground">
									{session.user.name
										?.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase() || "U"}
								</span>
							</div>
							<div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-sidebar" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-sidebar-foreground truncate">
								{session.user.name}
							</p>
							<p className="text-xs text-sidebar-foreground/50 truncate">
								{userRole.replace("_", " ").toLowerCase()}
							</p>
						</div>
						<ChevronRight className="h-4 w-4 text-sidebar-foreground/40" />
					</div>
				)}
			</div>
		</div>
		</>
	);
}
