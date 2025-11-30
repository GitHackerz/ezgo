"use client";

import { Building2, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	type Company,
	createCompany,
	deleteCompany,
	updateCompany,
} from "@/actions/companies";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface CompaniesClientProps {
	initialCompanies: Company[];
}

export function CompaniesClient({ initialCompanies }: CompaniesClientProps) {
	const router = useRouter();
	const [companies, setCompanies] = useState(initialCompanies);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		contact: "",
		address: "",
	});

	const resetForm = () => {
		setFormData({ name: "", email: "", contact: "", address: "" });
		setSelectedCompany(null);
	};

	const handleCreate = async () => {
		setIsLoading(true);
		const { data, error } = await createCompany(formData);
		setIsLoading(false);

		if (data && !error) {
			setCompanies([...companies, data]);
			setIsCreateOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const handleEdit = async () => {
		if (!selectedCompany) return;
		setIsLoading(true);
		const { data, error } = await updateCompany(selectedCompany.id, formData);
		setIsLoading(false);

		if (data && !error) {
			setCompanies(companies.map((c) => (c.id === data.id ? data : c)));
			setIsEditOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const handleDelete = async () => {
		if (!selectedCompany) return;
		setIsLoading(true);
		const { error } = await deleteCompany(selectedCompany.id);
		setIsLoading(false);

		if (!error) {
			setCompanies(companies.filter((c) => c.id !== selectedCompany.id));
			setIsDeleteOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const openEdit = (company: Company) => {
		setSelectedCompany(company);
		setFormData({
			name: company.name,
			email: company.email || "",
			contact: company.contact || "",
			address: company.address || "",
		});
		setIsEditOpen(true);
	};

	const openDelete = (company: Company) => {
		setSelectedCompany(company);
		setIsDeleteOpen(true);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Companies</h1>
					<p className="text-muted-foreground">
						Manage transport companies in the system
					</p>
				</div>
				<Button onClick={() => setIsCreateOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Add Company
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Total Companies
					</div>
					<div className="text-2xl font-bold">{companies.length}</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Active Companies
					</div>
					<div className="text-2xl font-bold">{companies.length}</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Total Fleet
					</div>
					<div className="text-2xl font-bold">-</div>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Company</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Contact</TableHead>
							<TableHead>Address</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{companies.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-8 text-muted-foreground"
								>
									No companies found.
								</TableCell>
							</TableRow>
						) : (
							companies.map((company) => (
								<TableRow key={company.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="bg-primary/10 p-2 rounded-lg">
												<Building2 className="h-5 w-5 text-primary" />
											</div>
											<span className="font-medium">{company.name}</span>
										</div>
									</TableCell>
									<TableCell>{company.email || "-"}</TableCell>
									<TableCell>{company.contact || "-"}</TableCell>
									<TableCell>{company.address || "-"}</TableCell>
									<TableCell>
										<Badge variant="default">Active</Badge>
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => openEdit(company)}>
													<Pencil className="mr-2 h-4 w-4" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => openDelete(company)}
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
						<DialogTitle>Add New Company</DialogTitle>
						<DialogDescription>
							Create a new transport company in the system.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Company Name *</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								placeholder="Enter company name"
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								placeholder="company@example.com"
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="contact">Contact Number</Label>
							<Input
								id="contact"
								value={formData.contact}
								onChange={(e) =>
									setFormData({ ...formData, contact: e.target.value })
								}
								placeholder="+216 XX XXX XXX"
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="address">Address</Label>
							<Input
								id="address"
								value={formData.address}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
								placeholder="Company address"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsCreateOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleCreate}
							disabled={!formData.name || isLoading}
						>
							{isLoading ? "Creating..." : "Create Company"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Company</DialogTitle>
						<DialogDescription>Update company information.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="edit-name">Company Name *</Label>
							<Input
								id="edit-name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="edit-email">Email</Label>
							<Input
								id="edit-email"
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="edit-contact">Contact Number</Label>
							<Input
								id="edit-contact"
								value={formData.contact}
								onChange={(e) =>
									setFormData({ ...formData, contact: e.target.value })
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="edit-address">Address</Label>
							<Input
								id="edit-address"
								value={formData.address}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleEdit} disabled={!formData.name || isLoading}>
							{isLoading ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Company</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete "{selectedCompany?.name}"? This
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
