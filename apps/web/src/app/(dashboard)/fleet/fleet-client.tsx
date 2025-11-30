"use client";

import {
	Bus as BusIcon,
	MoreHorizontal,
	Pencil,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Company } from "@/actions/companies";
import { type Bus, createBus, deleteBus, updateBus } from "@/actions/fleet";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface FleetClientProps {
	initialBuses: Bus[];
	companies: Company[];
}

export function FleetClient({ initialBuses, companies }: FleetClientProps) {
	const router = useRouter();
	const [buses, setBuses] = useState(initialBuses);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		plateNumber: "",
		model: "",
		capacity: 50,
		year: new Date().getFullYear(),
		status: "ACTIVE" as "ACTIVE" | "MAINTENANCE" | "INACTIVE",
		companyId: "",
	});

	const resetForm = () => {
		setFormData({
			plateNumber: "",
			model: "",
			capacity: 50,
			year: new Date().getFullYear(),
			status: "ACTIVE",
			companyId: companies[0]?.id || "",
		});
		setSelectedBus(null);
	};

	const filteredBuses = buses.filter((bus) => {
		const matchesSearch =
			bus.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
			bus.model?.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === "all" || bus.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const handleCreate = async () => {
		setIsLoading(true);
		const { data, error } = await createBus(formData);
		setIsLoading(false);

		if (data && !error) {
			setBuses([...buses, data]);
			setIsCreateOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const handleEdit = async () => {
		if (!selectedBus) return;
		setIsLoading(true);
		const { data, error } = await updateBus(selectedBus.id, {
			plateNumber: formData.plateNumber,
			model: formData.model,
			capacity: formData.capacity,
			year: formData.year,
			status: formData.status,
		});
		setIsLoading(false);

		if (data && !error) {
			setBuses(buses.map((b) => (b.id === data.id ? data : b)));
			setIsEditOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const handleDelete = async () => {
		if (!selectedBus) return;
		setIsLoading(true);
		const { error } = await deleteBus(selectedBus.id);
		setIsLoading(false);

		if (!error) {
			setBuses(buses.filter((b) => b.id !== selectedBus.id));
			setIsDeleteOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const openEdit = (bus: Bus) => {
		setSelectedBus(bus);
		setFormData({
			plateNumber: bus.plateNumber,
			model: bus.model || "",
			capacity: bus.capacity,
			year: bus.year || new Date().getFullYear(),
			status: bus.status,
			companyId: bus.companyId,
		});
		setIsEditOpen(true);
	};

	const openDelete = (bus: Bus) => {
		setSelectedBus(bus);
		setIsDeleteOpen(true);
	};

	const getStatusBadgeVariant = (status: string) => {
		switch (status) {
			case "ACTIVE":
				return "default";
			case "MAINTENANCE":
				return "secondary";
			case "INACTIVE":
				return "destructive";
			default:
				return "outline";
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Fleet Management
					</h1>
					<p className="text-muted-foreground">
						Manage your bus fleet and track real-time locations
					</p>
				</div>
				<Button
					onClick={() => {
						resetForm();
						setIsCreateOpen(true);
					}}
				>
					<Plus className="mr-2 h-4 w-4" />
					Add Bus
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-4">
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Total Buses
					</div>
					<div className="text-2xl font-bold">{buses.length}</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Active
					</div>
					<div className="text-2xl font-bold text-green-600">
						{buses.filter((b) => b.status === "ACTIVE").length}
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Maintenance
					</div>
					<div className="text-2xl font-bold text-yellow-600">
						{buses.filter((b) => b.status === "MAINTENANCE").length}
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Inactive
					</div>
					<div className="text-2xl font-bold text-red-600">
						{buses.filter((b) => b.status === "INACTIVE").length}
					</div>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search by plate number or model..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="ACTIVE">Active</SelectItem>
						<SelectItem value="MAINTENANCE">Maintenance</SelectItem>
						<SelectItem value="INACTIVE">Inactive</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Bus</TableHead>
							<TableHead>Model</TableHead>
							<TableHead>Capacity</TableHead>
							<TableHead>Year</TableHead>
							<TableHead>Company</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredBuses.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className="text-center py-8 text-muted-foreground"
								>
									No buses found.
								</TableCell>
							</TableRow>
						) : (
							filteredBuses.map((bus) => (
								<TableRow key={bus.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="bg-primary/10 p-2 rounded-lg">
												<BusIcon className="h-5 w-5 text-primary" />
											</div>
											<span className="font-medium">{bus.plateNumber}</span>
										</div>
									</TableCell>
									<TableCell>{bus.model || "-"}</TableCell>
									<TableCell>{bus.capacity} seats</TableCell>
									<TableCell>{bus.year || "-"}</TableCell>
									<TableCell>{bus.company?.name || "-"}</TableCell>
									<TableCell>
										<Badge variant={getStatusBadgeVariant(bus.status)}>
											{bus.status}
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
												<DropdownMenuItem onClick={() => openEdit(bus)}>
													<Pencil className="mr-2 h-4 w-4" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => openDelete(bus)}
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
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Bus</DialogTitle>
						<DialogDescription>Add a new bus to your fleet.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="plateNumber">Plate Number *</Label>
							<Input
								id="plateNumber"
								value={formData.plateNumber}
								onChange={(e) =>
									setFormData({ ...formData, plateNumber: e.target.value })
								}
								placeholder="TUN-XXXX"
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="model">Model</Label>
								<Input
									id="model"
									value={formData.model}
									onChange={(e) =>
										setFormData({ ...formData, model: e.target.value })
									}
									placeholder="Mercedes Sprinter"
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="year">Year</Label>
								<Input
									id="year"
									type="number"
									value={formData.year}
									onChange={(e) =>
										setFormData({ ...formData, year: parseInt(e.target.value) })
									}
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="capacity">Capacity *</Label>
								<Input
									id="capacity"
									type="number"
									value={formData.capacity}
									onChange={(e) =>
										setFormData({
											...formData,
											capacity: parseInt(e.target.value),
										})
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="status">Status</Label>
								<Select
									value={formData.status}
									onValueChange={(
										value: "ACTIVE" | "MAINTENANCE" | "INACTIVE",
									) => setFormData({ ...formData, status: value })}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="ACTIVE">Active</SelectItem>
										<SelectItem value="MAINTENANCE">Maintenance</SelectItem>
										<SelectItem value="INACTIVE">Inactive</SelectItem>
									</SelectContent>
								</Select>
							</div>
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
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsCreateOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleCreate}
							disabled={
								!formData.plateNumber || !formData.companyId || isLoading
							}
						>
							{isLoading ? "Adding..." : "Add Bus"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Bus</DialogTitle>
						<DialogDescription>Update bus information.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="edit-plateNumber">Plate Number *</Label>
							<Input
								id="edit-plateNumber"
								value={formData.plateNumber}
								onChange={(e) =>
									setFormData({ ...formData, plateNumber: e.target.value })
								}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="edit-model">Model</Label>
								<Input
									id="edit-model"
									value={formData.model}
									onChange={(e) =>
										setFormData({ ...formData, model: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-year">Year</Label>
								<Input
									id="edit-year"
									type="number"
									value={formData.year}
									onChange={(e) =>
										setFormData({ ...formData, year: parseInt(e.target.value) })
									}
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="edit-capacity">Capacity *</Label>
								<Input
									id="edit-capacity"
									type="number"
									value={formData.capacity}
									onChange={(e) =>
										setFormData({
											...formData,
											capacity: parseInt(e.target.value),
										})
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-status">Status</Label>
								<Select
									value={formData.status}
									onValueChange={(
										value: "ACTIVE" | "MAINTENANCE" | "INACTIVE",
									) => setFormData({ ...formData, status: value })}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="ACTIVE">Active</SelectItem>
										<SelectItem value="MAINTENANCE">Maintenance</SelectItem>
										<SelectItem value="INACTIVE">Inactive</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleEdit}
							disabled={!formData.plateNumber || isLoading}
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
						<DialogTitle>Delete Bus</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete bus "{selectedBus?.plateNumber}"?
							This action cannot be undone.
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
