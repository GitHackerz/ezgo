"use client";

import {
	CheckCircle,
	Download,
	MoreHorizontal,
	Ticket,
	Trash2,
	XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	type Booking,
	cancelBooking,
	confirmBooking,
	deleteBooking,
} from "@/actions/bookings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
	initialBookings: Booking[];
}) {
	const router = useRouter();
	const [bookings, setBookings] = useState(initialBookings);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState("");

	const handleConfirm = async (booking: Booking) => {
		setIsLoading(true);
		const { data, error } = await confirmBooking(booking.id);
		setIsLoading(false);

		if (data && !error) {
			setBookings(bookings.map((b) => (b.id === data.id ? data : b)));
			router.refresh();
		}
	};

	const handleCancel = async (booking: Booking) => {
		setIsLoading(true);
		const { data, error } = await cancelBooking(booking.id);
		setIsLoading(false);

		if (data && !error) {
			setBookings(bookings.map((b) => (b.id === data.id ? data : b)));
			router.refresh();
		}
	};

	const handleDelete = async () => {
		if (!selectedBooking) return;
		setIsLoading(true);
		const { error } = await deleteBooking(selectedBooking.id);
		setIsLoading(false);

		if (!error) {
			setBookings(bookings.filter((b) => b.id !== selectedBooking.id));
			setIsDeleteOpen(false);
			setSelectedBooking(null);
			router.refresh();
		}
	};

	const openDelete = (booking: Booking) => {
		setSelectedBooking(booking);
		setIsDeleteOpen(true);
	};

	const getStatusBadge = (status: string) => {
		const variants: Record<
			string,
			"default" | "secondary" | "destructive" | "outline"
		> = {
			CONFIRMED: "default",
			PENDING: "secondary",
			CANCELLED: "destructive",
			COMPLETED: "outline",
		};
		return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
	};

	const filteredBookings = bookings
		.filter((b) => statusFilter === "all" || b.status === statusFilter)
		.filter(
			(b) =>
				searchQuery === "" ||
				`${b.user?.firstName} ${b.user?.lastName}`
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				b.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				b.trip?.route?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
		);

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
					<div className="text-2xl font-bold">{bookings.length}</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Confirmed
					</div>
					<div className="text-2xl font-bold text-green-600">
						{bookings.filter((b) => b.status === "CONFIRMED").length}
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Pending
					</div>
					<div className="text-2xl font-bold text-yellow-600">
						{bookings.filter((b) => b.status === "PENDING").length}
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Cancelled
					</div>
					<div className="text-2xl font-bold text-red-600">
						{bookings.filter((b) => b.status === "CANCELLED").length}
					</div>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<Input
					placeholder="Search bookings..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="max-w-sm"
				/>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Statuses</SelectItem>
						<SelectItem value="PENDING">Pending</SelectItem>
						<SelectItem value="CONFIRMED">Confirmed</SelectItem>
						<SelectItem value="CANCELLED">Cancelled</SelectItem>
						<SelectItem value="COMPLETED">Completed</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Booking</TableHead>
							<TableHead>Passenger</TableHead>
							<TableHead>Trip</TableHead>
							<TableHead>Departure</TableHead>
							<TableHead>Seat</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredBookings.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={8}
									className="text-center py-8 text-muted-foreground"
								>
									No bookings found.
								</TableCell>
							</TableRow>
						) : (
							filteredBookings.map((booking) => (
								<TableRow key={booking.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="bg-primary/10 p-2 rounded-lg">
												<Ticket className="h-5 w-5 text-primary" />
											</div>
											<span className="font-mono text-sm">
												{booking.id.slice(0, 8)}...
											</span>
										</div>
									</TableCell>
									<TableCell>
										<div>
											<div className="font-medium">
												{booking.user?.firstName} {booking.user?.lastName}
											</div>
											<div className="text-sm text-muted-foreground">
												{booking.user?.email}
											</div>
										</div>
									</TableCell>
									<TableCell>
										{booking.trip?.route ? (
											<div>
												<div className="font-medium">
													{booking.trip.route.name}
												</div>
												<div className="text-sm text-muted-foreground">
													{booking.trip.route.origin} →{" "}
													{booking.trip.route.destination}
												</div>
											</div>
										) : (
											"N/A"
										)}
									</TableCell>
									<TableCell>
										{booking.trip?.departureTime
											? new Date(booking.trip.departureTime).toLocaleString()
											: "N/A"}
									</TableCell>
									<TableCell>{booking.seatNumber || "-"}</TableCell>
									<TableCell>
										{booking.payment?.amount || booking.trip?.price || 0} TND
									</TableCell>
									<TableCell>{getStatusBadge(booking.status)}</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												{booking.status === "PENDING" && (
													<DropdownMenuItem
														onClick={() => handleConfirm(booking)}
													>
														<CheckCircle className="mr-2 h-4 w-4" />
														Confirm
													</DropdownMenuItem>
												)}
												{(booking.status === "PENDING" ||
													booking.status === "CONFIRMED") && (
													<DropdownMenuItem
														onClick={() => handleCancel(booking)}
													>
														<XCircle className="mr-2 h-4 w-4" />
														Cancel
													</DropdownMenuItem>
												)}
												<DropdownMenuItem
													onClick={() => openDelete(booking)}
													className="text-destructive"
												>
													<Trash2 className="mr-2 h-4 w-4" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Booking</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this booking? This action cannot
							be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isLoading}
						>
							{isLoading ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
