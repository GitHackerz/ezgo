"use client";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useState } from "react";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<div className="flex h-screen overflow-hidden bg-background">
			<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<div
				className={
					isSidebarOpen
						? "flex flex-1 flex-col overflow-hidden transition-all duration-200 lg:ml-72"
						: "flex flex-1 flex-col overflow-hidden transition-all duration-200 lg:ml-0"
				}
			>
				<Header onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />
				<main className="flex-1 p-6 bg-background">{children}</main>
			</div>
		</div>
	);
}
