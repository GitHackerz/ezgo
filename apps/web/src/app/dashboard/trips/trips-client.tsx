"use client";

import { Plus, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function TripsClient({ initialTrips }: { initialTrips: any[] }) {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Trip Schedule</h1>
					<p className="text-muted-foreground">
						Manage and monitor all scheduled trips
					</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Schedule Trip
				</Button>
			</div>

			<div className="flex items-center gap-4">
				<Button variant="outline">
					<Calendar className="mr-2 h-4 w-4" />
					Today
				</Button>
				<Button variant="outline">This Week</Button>
				<Button variant="outline">This Month</Button>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Route</TableHead>
							<TableHead>Departure</TableHead>
							<TableHead>Bus</TableHead>
							<TableHead>Driver</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{initialTrips.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className="text-center py-8 text-muted-foreground"
								>
									No trips scheduled.
								</TableCell>
							</TableRow>
						) : (
							initialTrips.map((trip) => (
								<TableRow key={trip.id}>
									<TableCell className="font-medium">
										{trip.route?.name || "N/A"}
									</TableCell>
									<TableCell>
										{new Date(trip.departureTime).toLocaleString()}
									</TableCell>
									<TableCell>{trip.bus?.plateNumber || "N/A"}</TableCell>
									<TableCell>
										{trip.driver?.firstName} {trip.driver?.lastName}
									</TableCell>
									<TableCell>{trip.price} TND</TableCell>
									<TableCell>
										<Badge
											variant={
												trip.status === "IN_PROGRESS" ? "default" : "secondary"
											}
										>
											{trip.status.replace("_", " ")}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button variant="ghost" size="sm">
											View
										</Button>
										<Button variant="ghost" size="sm">
											Edit
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
