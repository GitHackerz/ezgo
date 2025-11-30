"use client";

import {
	Bus as BusIcon,
	MoreHorizontal,
	Pencil,
	Play,
	Plus,
	Square,
	Trash2,
	XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Bus } from "@/actions/fleet";
import { type Route } from "@/actions/routes";
import {
	cancelTrip,
	createTrip,
	deleteTrip,
	endTrip,
	startTrip,
	type Trip,
	updateTrip,
} from "@/actions/trips";
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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface User {
	id: string;
	firstName: string;
	lastName: string;
}

interface TripsClientProps {
	initialTrips: Trip[];
	routes: Route[];
	buses: Bus[];
	drivers: User[];
}

export function TripsClient({
	initialTrips,
	routes,
	buses,
	drivers,
}: TripsClientProps) {
	const router = useRouter();
	const [trips, setTrips] = useState(initialTrips);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const [formData, setFormData] = useState({
		routeId: "",
		busId: "",
		driverId: "",
		departureTime: "",
		arrivalTime: "",
		price: 0,
		availableSeats: 0,
	});

	const resetForm = () => {
		setFormData({
			routeId: routes[0]?.id || "",
			busId: buses[0]?.id || "",
			driverId: drivers[0]?.id || "",
			departureTime: "",
			arrivalTime: "",
			price: 0,
			availableSeats: 50,
		});
		setSelectedTrip(null);
	};

	const handleCreate = async () => {
		setIsLoading(true);
		const { data, error } = await createTrip({
			...formData,
			departureTime: new Date(formData.departureTime).toISOString(),
			arrivalTime: new Date(formData.arrivalTime).toISOString(),
		});
		setIsLoading(false);

		if (data && !error) {
			setTrips([...trips, data]);
			setIsCreateOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const handleEdit = async () => {
		if (!selectedTrip) return;
		setIsLoading(true);
		const { data, error } = await updateTrip(selectedTrip.id, {
			routeId: formData.routeId,
			busId: formData.busId,
			driverId: formData.driverId,
			departureTime: new Date(formData.departureTime).toISOString(),
			arrivalTime: new Date(formData.arrivalTime).toISOString(),
			price: formData.price,
			availableSeats: formData.availableSeats,
		});
		setIsLoading(false);

		if (data && !error) {
			setTrips(trips.map((t) => (t.id === data.id ? data : t)));
			setIsEditOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const handleDelete = async () => {
		if (!selectedTrip) return;
		setIsLoading(true);
		const { error } = await deleteTrip(selectedTrip.id);
		setIsLoading(false);

		if (!error) {
			setTrips(trips.filter((t) => t.id !== selectedTrip.id));
			setIsDeleteOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const handleStartTrip = async (trip: Trip) => {
		const { data, error } = await startTrip(trip.id);
		if (data && !error) {
			setTrips(trips.map((t) => (t.id === data.id ? data : t)));
			router.refresh();
		}
	};

	const handleEndTrip = async (trip: Trip) => {
		const { data, error } = await endTrip(trip.id);
		if (data && !error) {
			setTrips(trips.map((t) => (t.id === data.id ? data : t)));
			router.refresh();
		}
	};

	const handleCancelTrip = async (trip: Trip) => {
		const { data, error } = await cancelTrip(trip.id);
		if (data && !error) {
			setTrips(trips.map((t) => (t.id === data.id ? data : t)));
			router.refresh();
		}
	};

	const openEdit = (trip: Trip) => {
		setSelectedTrip(trip);
		const departureDate = new Date(trip.departureTime);
		const arrivalDate = trip.arrivalTime
			? new Date(trip.arrivalTime)
			: departureDate;
		setFormData({
			routeId: trip.routeId,
			busId: trip.busId,
			driverId: trip.driverId,
			departureTime: departureDate.toISOString().slice(0, 16),
			arrivalTime: arrivalDate.toISOString().slice(0, 16),
			price: trip.price,
			availableSeats: trip.availableSeats,
		});
		setIsEditOpen(true);
	};

	const openDelete = (trip: Trip) => {
		setSelectedTrip(trip);
		setIsDeleteOpen(true);
	};

	const getStatusBadge = (status: string) => {
		const variants: Record<
			string,
			"default" | "secondary" | "destructive" | "outline"
		> = {
			SCHEDULED: "secondary",
			IN_PROGRESS: "default",
			COMPLETED: "outline",
			CANCELLED: "destructive",
		};
		return (
			<Badge variant={variants[status] || "secondary"}>
				{status.replace("_", " ")}
			</Badge>
		);
	};

	const filteredTrips =
		statusFilter === "all"
			? trips
			: trips.filter((t) => t.status === statusFilter);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Trip Schedule</h1>
					<p className="text-muted-foreground">
						Manage and monitor all scheduled trips
					</p>
				</div>
				<Button
					onClick={() => {
						resetForm();
						setIsCreateOpen(true);
					}}
				>
					<Plus className="mr-2 h-4 w-4" />
					Schedule Trip
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-4">
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Total Trips
					</div>
					<div className="text-2xl font-bold">{trips.length}</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Scheduled
					</div>
					<div className="text-2xl font-bold text-blue-600">
						{trips.filter((t) => t.status === "SCHEDULED").length}
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						In Progress
					</div>
					<div className="text-2xl font-bold text-green-600">
						{trips.filter((t) => t.status === "IN_PROGRESS").length}
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Completed
					</div>
					<div className="text-2xl font-bold text-gray-600">
						{trips.filter((t) => t.status === "COMPLETED").length}
					</div>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Statuses</SelectItem>
						<SelectItem value="SCHEDULED">Scheduled</SelectItem>
						<SelectItem value="IN_PROGRESS">In Progress</SelectItem>
						<SelectItem value="COMPLETED">Completed</SelectItem>
						<SelectItem value="CANCELLED">Cancelled</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Route</TableHead>
							<TableHead>Departure</TableHead>
							<TableHead>Arrival</TableHead>
							<TableHead>Bus</TableHead>
							<TableHead>Driver</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Seats</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredTrips.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={9}
									className="text-center py-8 text-muted-foreground"
								>
									No trips found.
								</TableCell>
							</TableRow>
						) : (
							filteredTrips.map((trip) => (
								<TableRow key={trip.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="bg-primary/10 p-2 rounded-lg">
												<BusIcon className="h-5 w-5 text-primary" />
											</div>
											<span className="font-medium">
												{trip.route?.name || "N/A"}
											</span>
										</div>
									</TableCell>
									<TableCell>
										{new Date(trip.departureTime).toLocaleString()}
									</TableCell>
									<TableCell>
										{trip.arrivalTime
											? new Date(trip.arrivalTime).toLocaleString()
											: "TBD"}
									</TableCell>
									<TableCell>{trip.bus?.plateNumber || "N/A"}</TableCell>
									<TableCell>
										{trip.driver
											? `${trip.driver.firstName} ${trip.driver.lastName}`
											: "N/A"}
									</TableCell>
									<TableCell>{trip.price} TND</TableCell>
									<TableCell>{trip.availableSeats}</TableCell>
									<TableCell>{getStatusBadge(trip.status)}</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												{trip.status === "SCHEDULED" && (
													<DropdownMenuItem
														onClick={() => handleStartTrip(trip)}
													>
														<Play className="mr-2 h-4 w-4" />
														Start Trip
													</DropdownMenuItem>
												)}
												{trip.status === "IN_PROGRESS" && (
													<DropdownMenuItem onClick={() => handleEndTrip(trip)}>
														<Square className="mr-2 h-4 w-4" />
														End Trip
													</DropdownMenuItem>
												)}
												{(trip.status === "SCHEDULED" ||
													trip.status === "IN_PROGRESS") && (
													<DropdownMenuItem
														onClick={() => handleCancelTrip(trip)}
													>
														<XCircle className="mr-2 h-4 w-4" />
														Cancel Trip
													</DropdownMenuItem>
												)}
												<DropdownMenuSeparator />
												<DropdownMenuItem onClick={() => openEdit(trip)}>
													<Pencil className="mr-2 h-4 w-4" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => openDelete(trip)}
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

			{/* Create Dialog */}
			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Schedule New Trip</DialogTitle>
						<DialogDescription>Create a new trip schedule.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label>Route *</Label>
							<Select
								value={formData.routeId}
								onValueChange={(value) =>
									setFormData({ ...formData, routeId: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select route" />
								</SelectTrigger>
								<SelectContent>
									{routes.map((route) => (
										<SelectItem key={route.id} value={route.id}>
											{route.name} ({route.origin} → {route.destination})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Bus *</Label>
								<Select
									value={formData.busId}
									onValueChange={(value) =>
										setFormData({ ...formData, busId: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select bus" />
									</SelectTrigger>
									<SelectContent>
										{buses
											.filter((b) => b.status === "ACTIVE")
											.map((bus) => (
												<SelectItem key={bus.id} value={bus.id}>
													{bus.plateNumber} ({bus.capacity} seats)
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label>Driver *</Label>
								<Select
									value={formData.driverId}
									onValueChange={(value) =>
										setFormData({ ...formData, driverId: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select driver" />
									</SelectTrigger>
									<SelectContent>
										{drivers.map((driver) => (
											<SelectItem key={driver.id} value={driver.id}>
												{driver.firstName} {driver.lastName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Departure Time *</Label>
								<Input
									type="datetime-local"
									value={formData.departureTime}
									onChange={(e) =>
										setFormData({ ...formData, departureTime: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label>Arrival Time *</Label>
								<Input
									type="datetime-local"
									value={formData.arrivalTime}
									onChange={(e) =>
										setFormData({ ...formData, arrivalTime: e.target.value })
									}
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Price (TND) *</Label>
								<Input
									type="number"
									value={formData.price}
									onChange={(e) =>
										setFormData({
											...formData,
											price: parseFloat(e.target.value),
										})
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label>Available Seats *</Label>
								<Input
									type="number"
									value={formData.availableSeats}
									onChange={(e) =>
										setFormData({
											...formData,
											availableSeats: parseInt(e.target.value),
										})
									}
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsCreateOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleCreate}
							disabled={
								!formData.routeId ||
								!formData.busId ||
								!formData.driverId ||
								!formData.departureTime ||
								!formData.arrivalTime ||
								isLoading
							}
						>
							{isLoading ? "Creating..." : "Schedule Trip"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Edit Trip</DialogTitle>
						<DialogDescription>Update trip information.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label>Route *</Label>
							<Select
								value={formData.routeId}
								onValueChange={(value) =>
									setFormData({ ...formData, routeId: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select route" />
								</SelectTrigger>
								<SelectContent>
									{routes.map((route) => (
										<SelectItem key={route.id} value={route.id}>
											{route.name} ({route.origin} → {route.destination})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Bus *</Label>
								<Select
									value={formData.busId}
									onValueChange={(value) =>
										setFormData({ ...formData, busId: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select bus" />
									</SelectTrigger>
									<SelectContent>
										{buses.map((bus) => (
											<SelectItem key={bus.id} value={bus.id}>
												{bus.plateNumber} ({bus.capacity} seats)
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label>Driver *</Label>
								<Select
									value={formData.driverId}
									onValueChange={(value) =>
										setFormData({ ...formData, driverId: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select driver" />
									</SelectTrigger>
									<SelectContent>
										{drivers.map((driver) => (
											<SelectItem key={driver.id} value={driver.id}>
												{driver.firstName} {driver.lastName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Departure Time *</Label>
								<Input
									type="datetime-local"
									value={formData.departureTime}
									onChange={(e) =>
										setFormData({ ...formData, departureTime: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label>Arrival Time *</Label>
								<Input
									type="datetime-local"
									value={formData.arrivalTime}
									onChange={(e) =>
										setFormData({ ...formData, arrivalTime: e.target.value })
									}
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Price (TND) *</Label>
								<Input
									type="number"
									value={formData.price}
									onChange={(e) =>
										setFormData({
											...formData,
											price: parseFloat(e.target.value),
										})
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label>Available Seats *</Label>
								<Input
									type="number"
									value={formData.availableSeats}
									onChange={(e) =>
										setFormData({
											...formData,
											availableSeats: parseInt(e.target.value),
										})
									}
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleEdit}
							disabled={
								!formData.routeId ||
								!formData.busId ||
								!formData.driverId ||
								isLoading
							}
						>
							{isLoading ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Trip</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this trip? This action cannot be
							undone.
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
