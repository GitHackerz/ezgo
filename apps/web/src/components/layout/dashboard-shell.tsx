"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useState } from "react";

interface DashboardShellProps {
	children: React.ReactNode;
}

export function DashboardShell({ children }: Readonly<DashboardShellProps>) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<div className="flex h-screen overflow-hidden bg-background">
			{/* Sidebar */}
			<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			{/* Main Content Area */}
			<div
				className={
					isSidebarOpen
						? "flex flex-1 flex-col overflow-hidden transition-all duration-200 lg:ml-72"
						: "flex flex-1 flex-col overflow-hidden transition-all duration-200 lg:ml-0"
				}
			>
				<Header onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />
				<main className="flex-1 overflow-y-auto">
					<div className="container max-w-7xl mx-auto p-6 lg:p-8">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
