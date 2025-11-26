"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Map,
    Bus,
    Route,
    Calendar,
    Ticket,
    Users,
    BarChart3,
    Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Live Map", href: "/dashboard/map", icon: Map },
  { name: "Fleet", href: "/dashboard/fleet", icon: Bus },
  { name: "Routes", href: "/dashboard/routes", icon: Route },
  { name: "Trips", href: "/dashboard/trips", icon: Calendar },
  { name: "Bookings", href: "/dashboard/bookings", icon: Ticket },
  { name: "Users & Drivers", href: "/dashboard/users", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Bus className="h-6 w-6" />
          <span className="text-xl font-bold">EZGO</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          © 2025 EZGO. All rights reserved.
        </div>
      </div>
    </div>
  );
}
