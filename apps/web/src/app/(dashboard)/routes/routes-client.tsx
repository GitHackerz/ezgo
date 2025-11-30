"use client";

import {
	MapPin,
	MoreHorizontal,
	Pencil,
	Plus,
	Route as RouteIcon,
	Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Company } from "@/actions/companies";
import {
	createRoute,
	deleteRoute,
	type Route,
	updateRoute,
} from "@/actions/routes";
import { LocationAutocomplete } from "@/components/location-autocomplete";
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
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface RoutesClientProps {
	initialRoutes: Route[];
	companies: Company[];
}

export function RoutesClient({ initialRoutes, companies }: RoutesClientProps) {
	const router = useRouter();
	const [routes, setRoutes] = useState(initialRoutes);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		originId: "",
		destinationId: "",
		distance: 0,
		duration: 0,
		isActive: true,
		tripType: "REGULAR" as "REGULAR" | "SPECIAL",
		companyId: "",
	});

	const resetForm = () => {
		setFormData({
			name: "",
			originId: "",
			destinationId: "",
			distance: 0,
			duration: 0,
			isActive: true,
			tripType: "REGULAR",
			companyId: companies[0]?.id || "",
		});
		setSelectedRoute(null);
	};

	const handleCreate = async () => {
		setIsLoading(true);
		const { data, error } = await createRoute(formData);
		setIsLoading(false);

		if (data && !error) {
			setRoutes([...routes, data]);
			setIsCreateOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const handleEdit = async () => {
		if (!selectedRoute) return;
		setIsLoading(true);
		const { data, error } = await updateRoute(selectedRoute.id, {
			name: formData.name,
			originId: formData.originId,
			destinationId: formData.destinationId,
			distance: formData.distance,
			duration: formData.duration,
			isActive: formData.isActive,
			tripType: formData.tripType,
		});
		setIsLoading(false);

		if (data && !error) {
			setRoutes(routes.map((r) => (r.id === data.id ? data : r)));
			setIsEditOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const handleDelete = async () => {
		if (!selectedRoute) return;
		setIsLoading(true);
		const { error } = await deleteRoute(selectedRoute.id);
		setIsLoading(false);

		if (!error) {
			setRoutes(routes.filter((r) => r.id !== selectedRoute.id));
			setIsDeleteOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const openEdit = (route: Route) => {
		setSelectedRoute(route);
		setFormData({
			name: route.name,
			originId: route.originId,
			destinationId: route.destinationId,
			distance: route.distance || 0,
			duration: route.duration || 0,
			isActive: route.isActive,
			tripType: route.tripType,
			companyId: route.companyId,
		});
		setIsEditOpen(true);
	};

	const openDelete = (route: Route) => {
		setSelectedRoute(route);
		setIsDeleteOpen(true);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Routes</h1>
					<p className="text-muted-foreground">
						Manage your bus routes and stops
					</p>
				</div>
				<Button
					onClick={() => {
						resetForm();
						setIsCreateOpen(true);
					}}
				>
					<Plus className="mr-2 h-4 w-4" />
					Create Route
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Total Routes
					</div>
					<div className="text-2xl font-bold">{routes.length}</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Active
					</div>
					<div className="text-2xl font-bold text-green-600">
						{routes.filter((r) => r.isActive).length}
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Inactive
					</div>
					<div className="text-2xl font-bold text-gray-600">
						{routes.filter((r) => !r.isActive).length}
					</div>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Route</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Origin</TableHead>
							<TableHead>Destination</TableHead>
							<TableHead>Distance</TableHead>
							<TableHead>Duration</TableHead>
							<TableHead>Company</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{routes.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={9}
									className="text-center py-8 text-muted-foreground"
								>
									No routes found.
								</TableCell>
							</TableRow>
						) : (
							routes.map((route) => (
								<TableRow key={route.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="bg-primary/10 p-2 rounded-lg">
												<RouteIcon className="h-5 w-5 text-primary" />
											</div>
											<span className="font-medium">{route.name}</span>
										</div>
									</TableCell>
									<TableCell>
										<Badge
											variant={
												route.tripType === "SPECIAL" ? "destructive" : "outline"
											}
										>
											{route.tripType}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4 text-green-600" />
											{route.origin?.name || "Unknown"}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4 text-red-600" />
											{route.destination?.name || "Unknown"}
										</div>
									</TableCell>
									<TableCell>
										{route.distance ? `${route.distance} km` : "-"}
									</TableCell>
									<TableCell>
										{route.duration ? `${route.duration} min` : "-"}
									</TableCell>
									<TableCell>{route.company?.name || "-"}</TableCell>
									<TableCell>
										<Badge variant={route.isActive ? "default" : "secondary"}>
											{route.isActive ? "Active" : "Inactive"}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => openEdit(route)}>
													<Pencil className="mr-2 h-4 w-4" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => openDelete(route)}
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
						<DialogTitle>Create New Route</DialogTitle>
						<DialogDescription>
							Add a new bus route to the system.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Route Name *</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								placeholder="Tunis - Sousse Express"
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Origin *</Label>
								<LocationAutocomplete
									value={formData.originId}
									onChange={(id) => setFormData({ ...formData, originId: id })}
									placeholder="Search origin..."
								/>
							</div>
							<div className="grid gap-2">
								<Label>Destination *</Label>
								<LocationAutocomplete
									value={formData.destinationId}
									onChange={(id) =>
										setFormData({ ...formData, destinationId: id })
									}
									placeholder="Search destination..."
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="tripType">Trip Type</Label>
								<Select
									value={formData.tripType}
									onValueChange={(value: "REGULAR" | "SPECIAL") =>
										setFormData({ ...formData, tripType: value })
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="REGULAR">Regular</SelectItem>
										<SelectItem value="SPECIAL">Special</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="company">Company *</Label>
								<Select
									value={formData.companyId}
									onValueChange={(value) =>
										setFormData({ ...formData, companyId: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select company" />
									</SelectTrigger>
									<SelectContent>
										{companies.map((company) => (
											<SelectItem key={company.id} value={company.id}>
												{company.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="distance">Distance (km)</Label>
								<Input
									id="distance"
									type="number"
									value={formData.distance}
									onChange={(e) =>
										setFormData({
											...formData,
											distance: parseFloat(e.target.value),
										})
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="duration">Duration (min)</Label>
								<Input
									id="duration"
									type="number"
									value={formData.duration}
									onChange={(e) =>
										setFormData({
											...formData,
											duration: parseInt(e.target.value),
										})
									}
								/>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								id="isActive"
								checked={formData.isActive}
								onCheckedChange={(checked) =>
									setFormData({ ...formData, isActive: checked })
								}
							/>
							<Label htmlFor="isActive">Active</Label>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsCreateOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleCreate}
							disabled={
								!formData.name ||
								!formData.originId ||
								!formData.destinationId ||
								!formData.companyId ||
								isLoading
							}
						>
							{isLoading ? "Creating..." : "Create Route"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Edit Route</DialogTitle>
						<DialogDescription>Update route information.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="edit-name">Route Name *</Label>
							<Input
								id="edit-name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Origin *</Label>
								<LocationAutocomplete
									value={formData.originId}
									onChange={(id) => setFormData({ ...formData, originId: id })}
									placeholder="Search origin..."
								/>
							</div>
							<div className="grid gap-2">
								<Label>Destination *</Label>
								<LocationAutocomplete
									value={formData.destinationId}
									onChange={(id) =>
										setFormData({ ...formData, destinationId: id })
									}
									placeholder="Search destination..."
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="edit-tripType">Trip Type</Label>
							<Select
								value={formData.tripType}
								onValueChange={(value: "REGULAR" | "SPECIAL") =>
									setFormData({ ...formData, tripType: value })
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="REGULAR">Regular</SelectItem>
									<SelectItem value="SPECIAL">Special</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="edit-distance">Distance (km)</Label>
								<Input
									id="edit-distance"
									type="number"
									value={formData.distance}
									onChange={(e) =>
										setFormData({
											...formData,
											distance: parseFloat(e.target.value),
										})
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-duration">Duration (min)</Label>
								<Input
									id="edit-duration"
									type="number"
									value={formData.duration}
									onChange={(e) =>
										setFormData({
											...formData,
											duration: parseInt(e.target.value),
										})
									}
								/>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								id="edit-isActive"
								checked={formData.isActive}
								onCheckedChange={(checked) =>
									setFormData({ ...formData, isActive: checked })
								}
							/>
							<Label htmlFor="edit-isActive">Active</Label>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleEdit}
							disabled={
								!formData.name ||
								!formData.originId ||
								!formData.destinationId ||
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
						<DialogTitle>Delete Route</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete "{selectedRoute?.name}"? This
							action cannot be undone.
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
