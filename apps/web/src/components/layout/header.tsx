"use client";

import {
    Bell,
    Command,
    LogOut,
    Menu,
    Moon,
    Search,
    Settings,
    Sun,
    User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
	onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: Readonly<HeaderProps>) {
	const { data: session } = useSession();
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleSignOut = () => {
		signOut({ callbackUrl: "/auth/login" });
	};

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	const userInitials = session?.user?.name
		? session.user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
		: "U";

	const currentTime = mounted
		? new Date().toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			})
		: "";

	const currentDate = mounted
		? new Date().toLocaleDateString("en-US", {
				weekday: "long",
				month: "short",
				day: "numeric",
			})
		: "";

	return (
		<header className="sticky top-0 z-40 h-16 flex items-center px-6 justify-between backdrop-blur-xl border-b border-border/50 bg-background">
		{/* Left Section - Search */}
		<div className="flex items-center gap-4 flex-1">
			{/* Sidebar toggle - visible on all sizes but styled for small screens */}
			<button
				aria-label="Toggle sidebar"
				onClick={() => onToggleSidebar?.()}
				className="mr-2 inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted"
			>
				<Menu className="h-4 w-4" />
			</button>
				<div className="relative max-w-md w-full">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<Search className="h-4 w-4 text-muted-foreground" />
					</div>
					<input
						type="text"
						placeholder="Search anything..."
						className="w-full h-10 pl-10 pr-4 bg-muted/50 border-0 rounded-xl text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-muted transition-all"
					/>
					<div className="absolute inset-y-0 right-0 flex items-center pr-3">
						<kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
							<Command className="h-3 w-3" />K
						</kbd>
					</div>
				</div>
			</div>

			{/* Center Section - Date/Time */}
			<div className="hidden lg:flex items-center gap-2 text-sm">
				<span className="text-muted-foreground">{currentDate}</span>
				<span className="text-foreground font-medium">{currentTime}</span>
			</div>

			{/* Right Section - Actions */}
			<div className="flex items-center gap-2">
				{/* Theme Toggle */}
				<Button
					variant="ghost"
					size="icon"
					className="h-9 w-9 rounded-xl hover:bg-muted"
					onClick={toggleTheme}
				>
					{mounted && (
						<>
							<Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
							<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
						</>
					)}
					<span className="sr-only">Toggle theme</span>
				</Button>

				{/* Notifications */}
				<Button
					variant="ghost"
					size="icon"
					className="relative h-9 w-9 rounded-xl hover:bg-muted"
				>
					<Bell className="h-4 w-4" />
					<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
				</Button>

				{/* Separator */}
				<div className="w-px h-6 bg-border mx-2" />

				{/* User Menu */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="relative h-9 gap-2 rounded-xl hover:bg-muted px-2"
						>
							<Avatar className="h-7 w-7 rounded-lg">
								<AvatarImage src="" alt={session?.user?.name || "User"} />
								<AvatarFallback className="rounded-lg gradient-primary text-primary-foreground text-xs font-medium">
									{userInitials}
								</AvatarFallback>
							</Avatar>
							<div className="hidden md:flex flex-col items-start">
								<span className="text-sm font-medium">
									{session?.user?.name || "User"}
								</span>
							</div>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-56 rounded-xl"
						align="end"
						forceMount
					>
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium leading-none">
									{session?.user?.name || "User"}
								</p>
								<p className="text-xs leading-none text-muted-foreground">
									{session?.user?.email || ""}
								</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="rounded-lg cursor-pointer">
							<User className="mr-2 h-4 w-4" />
							Profile
						</DropdownMenuItem>
						<DropdownMenuItem className="rounded-lg cursor-pointer">
							<Settings className="mr-2 h-4 w-4" />
							Settings
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
							onClick={handleSignOut}
						>
							<LogOut className="mr-2 h-4 w-4" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
