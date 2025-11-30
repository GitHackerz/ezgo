"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/providers/theme-provider";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="p-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
			aria-label="Toggle theme"
		>
			{theme === "light" ? (
				<Moon className="h-5 w-5 text-foreground" />
			) : (
				<Sun className="h-5 w-5 text-foreground" />
			)}
		</button>
	);
}
