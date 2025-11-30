"use client";

import { Loader2, MapPin, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	createLocation,
	deleteLocation,
	type Location,
	updateLocation,
} from "@/actions/locations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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

interface LocationsClientProps {
	initialLocations: Location[];
}

export function LocationsClient({ initialLocations }: LocationsClientProps) {
	const [locations, setLocations] = useState<Location[]>(initialLocations);
	const [searchQuery, setSearchQuery] = useState("");
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(false);

	// Form state
	const [formData, setFormData] = useState({
		name: "",
		city: "",
		governorate: "",
		address: "",
		latitude: "",
		longitude: "",
		type: "CITY",
	});

	const filteredLocations = locations.filter(
		(loc) =>
			loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
			loc.governorate.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const resetForm = () => {
		setFormData({
			name: "",
			city: "",
			governorate: "",
			address: "",
			latitude: "",
			longitude: "",
			type: "CITY",
		});
	};

	const handleAdd = async () => {
		setIsLoading(true);
		try {
			const result = await createLocation({
				...formData,
				latitude: parseFloat(formData.latitude),
				longitude: parseFloat(formData.longitude),
			});

			if (result.success && result.data) {
				setLocations([...locations, result.data]);
				setIsAddOpen(false);
				resetForm();
				toast.success("Location created successfully");
			} else {
				toast.error(result.error || "Failed to create location");
			}
		} catch (error) {
			toast.error("An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = async () => {
		if (!selectedLocation) return;

		setIsLoading(true);
		try {
			const result = await updateLocation(selectedLocation.id, {
				...formData,
				latitude: parseFloat(formData.latitude),
				longitude: parseFloat(formData.longitude),
			});

			if (result.success && result.data) {
				setLocations(
					locations.map((loc) =>
						loc.id === selectedLocation.id ? result.data! : loc,
					),
				);
				setIsEditOpen(false);
				toast.success("Location updated successfully");
			} else {
				toast.error(result.error || "Failed to update location");
			}
		} catch (error) {
			toast.error("An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!selectedLocation) return;

		setIsLoading(true);
		try {
			const result = await deleteLocation(selectedLocation.id);

			if (result.success) {
				setLocations(locations.filter((loc) => loc.id !== selectedLocation.id));
				setIsDeleteOpen(false);
				toast.success("Location deleted successfully");
			} else {
				toast.error(result.error || "Failed to delete location");
			}
		} catch (error) {
			toast.error("An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const openEdit = (location: Location) => {
		setSelectedLocation(location);
		setFormData({
			name: location.name,
			city: location.city,
			governorate: location.governorate,
			address: location.address || "",
			latitude: location.latitude.toString(),
			longitude: location.longitude.toString(),
			type: location.type,
		});
		setIsEditOpen(true);
	};

	const openDelete = (location: Location) => {
		setSelectedLocation(location);
		setIsDeleteOpen(true);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Locations</h1>
					<p className="text-muted-foreground">
						Manage cities, stations, and landmarks for routes
					</p>
				</div>
				<Button onClick={() => setIsAddOpen(true)}>
					<Plus className="mr-2 h-4 w-4" /> Add Location
				</Button>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>All Locations</CardTitle>
						<div className="relative w-64">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search locations..."
								className="pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>City</TableHead>
								<TableHead>Governorate</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Coordinates</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredLocations.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center py-8">
										No locations found
									</TableCell>
								</TableRow>
							) : (
								filteredLocations.map((location) => (
									<TableRow key={location.id}>
										<TableCell className="font-medium">
											<div className="flex items-center gap-2">
												<MapPin className="h-4 w-4 text-primary" />
												{location.name}
											</div>
										</TableCell>
										<TableCell>{location.city}</TableCell>
										<TableCell>{location.governorate}</TableCell>
										<TableCell>
											<Badge variant="outline">{location.type}</Badge>
										</TableCell>
										<TableCell className="text-xs text-muted-foreground">
											{location.latitude.toFixed(4)},{" "}
											{location.longitude.toFixed(4)}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => openEdit(location)}
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="text-destructive hover:text-destructive"
													onClick={() => openDelete(location)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Add Dialog */}
			<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Add New Location</DialogTitle>
						<DialogDescription>
							Create a new location for routes and trips.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder="e.g. Tunis Centre"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="type">Type</Label>
								<Select
									value={formData.type}
									onValueChange={(value) =>
										setFormData({ ...formData, type: value })
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="CITY">City</SelectItem>
										<SelectItem value="STATION">Station</SelectItem>
										<SelectItem value="LANDMARK">Landmark</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="city">City</Label>
								<Input
									id="city"
									value={formData.city}
									onChange={(e) =>
										setFormData({ ...formData, city: e.target.value })
									}
									placeholder="e.g. Tunis"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="governorate">Governorate</Label>
								<Input
									id="governorate"
									value={formData.governorate}
									onChange={(e) =>
										setFormData({ ...formData, governorate: e.target.value })
									}
									placeholder="e.g. Tunis"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="address">Address (Optional)</Label>
							<Input
								id="address"
								value={formData.address}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
								placeholder="Full address"
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="latitude">Latitude</Label>
								<Input
									id="latitude"
									type="number"
									step="any"
									value={formData.latitude}
									onChange={(e) =>
										setFormData({ ...formData, latitude: e.target.value })
									}
									placeholder="36.8065"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="longitude">Longitude</Label>
								<Input
									id="longitude"
									type="number"
									step="any"
									value={formData.longitude}
									onChange={(e) =>
										setFormData({ ...formData, longitude: e.target.value })
									}
									placeholder="10.1815"
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleAdd} disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Create Location
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Edit Location</DialogTitle>
						<DialogDescription>Update location details.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="edit-name">Name</Label>
								<Input
									id="edit-name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="edit-type">Type</Label>
								<Select
									value={formData.type}
									onValueChange={(value) =>
										setFormData({ ...formData, type: value })
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="CITY">City</SelectItem>
										<SelectItem value="STATION">Station</SelectItem>
										<SelectItem value="LANDMARK">Landmark</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="edit-city">City</Label>
								<Input
									id="edit-city"
									value={formData.city}
									onChange={(e) =>
										setFormData({ ...formData, city: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="edit-governorate">Governorate</Label>
								<Input
									id="edit-governorate"
									value={formData.governorate}
									onChange={(e) =>
										setFormData({ ...formData, governorate: e.target.value })
									}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-address">Address</Label>
							<Input
								id="edit-address"
								value={formData.address}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="edit-latitude">Latitude</Label>
								<Input
									id="edit-latitude"
									type="number"
									step="any"
									value={formData.latitude}
									onChange={(e) =>
										setFormData({ ...formData, latitude: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="edit-longitude">Longitude</Label>
								<Input
									id="edit-longitude"
									type="number"
									step="any"
									value={formData.longitude}
									onChange={(e) =>
										setFormData({ ...formData, longitude: e.target.value })
									}
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleEdit} disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Dialog */}
			<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Location</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this location? This action cannot
							be undone.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<p className="font-medium">{selectedLocation?.name}</p>
						<p className="text-sm text-muted-foreground">
							{selectedLocation?.city}, {selectedLocation?.governorate}
						</p>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isLoading}
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
