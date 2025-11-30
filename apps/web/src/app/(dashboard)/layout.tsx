import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen">
			<Sidebar />
			<div className="ml-72 flex flex-col min-h-screen">
				<Header />
				<main className="flex-1 p-6 bg-background">{children}</main>
			</div>
		</div>
	);
}
