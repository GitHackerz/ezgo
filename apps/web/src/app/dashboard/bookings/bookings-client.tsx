"use client";

import { Download } from "lucide-react";
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

export function BookingsClient({
	initialBookings,
}: {
	initialBookings: any[];
}) {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
					<p className="text-muted-foreground">
						View and manage all passenger bookings
					</p>
				</div>
				<Button variant="outline">
					<Download className="mr-2 h-4 w-4" />
					Export
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-4">
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Total Bookings
					</div>
					<div className="text-2xl font-bold">{initialBookings.length}</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Confirmed
					</div>
					<div className="text-2xl font-bold">
						{initialBookings.filter((b) => b.status === "CONFIRMED").length}
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Pending
					</div>
					<div className="text-2xl font-bold">
						{initialBookings.filter((b) => b.status === "PENDING").length}
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Cancelled
					</div>
					<div className="text-2xl font-bold">
						{initialBookings.filter((b) => b.status === "CANCELLED").length}
					</div>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Passenger</TableHead>
							<TableHead>Trip</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Seat</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{initialBookings.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-8 text-muted-foreground"
								>
									No bookings found.
								</TableCell>
							</TableRow>
						) : (
							initialBookings.map((booking) => (
								<TableRow key={booking.id}>
									<TableCell className="font-medium">
										{booking.user?.firstName} {booking.user?.lastName}
									</TableCell>
									<TableCell>{booking.trip?.route?.name || "N/A"}</TableCell>
									<TableCell>
										{new Date(booking.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell>{booking.seatNumber || "N/A"}</TableCell>
									<TableCell>
										<Badge
											variant={
												booking.status === "CONFIRMED" ? "default" : "secondary"
											}
										>
											{booking.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button variant="ghost" size="sm">
											View
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
