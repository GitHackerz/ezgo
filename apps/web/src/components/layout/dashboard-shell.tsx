"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

interface DashboardShellProps {
	children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
	return (
		<div className="flex h-screen overflow-hidden bg-background">
			{/* Sidebar */}
			<Sidebar />

			{/* Main Content Area */}
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header />
				<main className="flex-1 overflow-y-auto">
					<div className="container max-w-7xl mx-auto p-6 lg:p-8">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
