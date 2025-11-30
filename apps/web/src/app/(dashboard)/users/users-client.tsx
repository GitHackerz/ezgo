"use client";

import {
	MoreHorizontal,
	Pencil,
	Plus,
	Trash2,
	User as UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Company } from "@/actions/companies";
import { createUser, deleteUser, updateUser } from "@/actions/users";
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

interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone?: string;
	role: string;
	companyId?: string;
	company?: { id: string; name: string };
}

interface UsersClientProps {
	initialUsers: User[];
	companies: Company[];
}

export function UsersClient({ initialUsers, companies }: UsersClientProps) {
	const router = useRouter();
	const [users, setUsers] = useState(initialUsers);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState("");

	const [formData, setFormData] = useState({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
		phone: "",
		role: "PASSENGER",
		companyId: "",
	});

	const resetForm = () => {
		setFormData({
			email: "",
			password: "",
			firstName: "",
			lastName: "",
			phone: "",
			role: "PASSENGER",
			companyId: "",
		});
		setSelectedUser(null);
	};

	const handleCreate = async () => {
		setIsLoading(true);
		const payload: Parameters<typeof createUser>[0] = {
			email: formData.email,
			password: formData.password,
			firstName: formData.firstName,
			lastName: formData.lastName,
			role: formData.role as "ADMIN" | "COMPANY_ADMIN" | "DRIVER" | "PASSENGER",
		};
		if (formData.phone) payload.phone = formData.phone;
		if (formData.companyId) payload.companyId = formData.companyId;

		const { data, error } = await createUser(payload);
		setIsLoading(false);

		if (data && !error) {
			setUsers([...users, data]);
			setIsCreateOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const handleEdit = async () => {
		if (!selectedUser) return;
		setIsLoading(true);
		const payload: Parameters<typeof updateUser>[1] = {
			firstName: formData.firstName,
			lastName: formData.lastName,
			role: formData.role as "ADMIN" | "COMPANY_ADMIN" | "DRIVER" | "PASSENGER",
		};
		if (formData.phone) payload.phone = formData.phone;
		if (formData.companyId) payload.companyId = formData.companyId;

		const { data, error } = await updateUser(selectedUser.id, payload);
		setIsLoading(false);

		if (data && !error) {
			setUsers(users.map((u) => (u.id === data.id ? data : u)));
			setIsEditOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const handleDelete = async () => {
		if (!selectedUser) return;
		setIsLoading(true);
		const { error } = await deleteUser(selectedUser.id);
		setIsLoading(false);

		if (!error) {
			setUsers(users.filter((u) => u.id !== selectedUser.id));
			setIsDeleteOpen(false);
			resetForm();
			router.refresh();
		}
	};

	const openEdit = (user: User) => {
		setSelectedUser(user);
		setFormData({
			email: user.email,
			password: "",
			firstName: user.firstName,
			lastName: user.lastName,
			phone: user.phone || "",
			role: user.role,
			companyId: user.companyId || "",
		});
		setIsEditOpen(true);
	};

	const openDelete = (user: User) => {
		setSelectedUser(user);
		setIsDeleteOpen(true);
	};

	const getRoleBadge = (role: string) => {
		const variants: Record<
			string,
			"default" | "secondary" | "outline" | "destructive"
		> = {
			ADMIN: "destructive",
			COMPANY_ADMIN: "default",
			DRIVER: "secondary",
			PASSENGER: "outline",
		};
		return (
			<Badge variant={variants[role] || "outline"}>
				{role.replace("_", " ")}
			</Badge>
		);
	};

	const filteredUsers = users
		.filter((u) => roleFilter === "all" || u.role === roleFilter)
		.filter(
			(u) =>
				searchQuery === "" ||
				`${u.firstName} ${u.lastName}`
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				u.email.toLowerCase().includes(searchQuery.toLowerCase()),
		);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Users & Drivers</h1>
					<p className="text-muted-foreground">
						Manage system users and driver accounts
					</p>
				</div>
				<Button
					onClick={() => {
						resetForm();
						setIsCreateOpen(true);
					}}
				>
					<Plus className="mr-2 h-4 w-4" />
					Add User
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-4">
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Total Users
					</div>
					<div className="text-2xl font-bold">{users.length}</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Drivers
					</div>
					<div className="text-2xl font-bold text-blue-600">
						{users.filter((u) => u.role === "DRIVER").length}
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Passengers
					</div>
					<div className="text-2xl font-bold text-green-600">
						{users.filter((u) => u.role === "PASSENGER").length}
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Admins
					</div>
					<div className="text-2xl font-bold text-purple-600">
						{
							users.filter(
								(u) => u.role === "ADMIN" || u.role === "COMPANY_ADMIN",
							).length
						}
					</div>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<Input
					placeholder="Search users..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="max-w-sm"
				/>
				<Select value={roleFilter} onValueChange={setRoleFilter}>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="Filter by role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Roles</SelectItem>
						<SelectItem value="ADMIN">Admin</SelectItem>
						<SelectItem value="COMPANY_ADMIN">Company Admin</SelectItem>
						<SelectItem value="DRIVER">Driver</SelectItem>
						<SelectItem value="PASSENGER">Passenger</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Company</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredUsers.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-8 text-muted-foreground"
								>
									No users found.
								</TableCell>
							</TableRow>
						) : (
							filteredUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="bg-primary/10 p-2 rounded-full">
												<UserIcon className="h-5 w-5 text-primary" />
											</div>
											<span className="font-medium">
												{user.firstName} {user.lastName}
											</span>
										</div>
									</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.phone || "-"}</TableCell>
									<TableCell>{getRoleBadge(user.role)}</TableCell>
									<TableCell>{user.company?.name || "-"}</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => openEdit(user)}>
													<Pencil className="mr-2 h-4 w-4" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => openDelete(user)}
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
						<DialogTitle>Add New User</DialogTitle>
						<DialogDescription>Create a new user account.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>First Name *</Label>
								<Input
									value={formData.firstName}
									onChange={(e) =>
										setFormData({ ...formData, firstName: e.target.value })
									}
									placeholder="John"
								/>
							</div>
							<div className="grid gap-2">
								<Label>Last Name *</Label>
								<Input
									value={formData.lastName}
									onChange={(e) =>
										setFormData({ ...formData, lastName: e.target.value })
									}
									placeholder="Doe"
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label>Email *</Label>
							<Input
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								placeholder="john@example.com"
							/>
						</div>
						<div className="grid gap-2">
							<Label>Password *</Label>
							<Input
								type="password"
								value={formData.password}
								onChange={(e) =>
									setFormData({ ...formData, password: e.target.value })
								}
								placeholder="••••••••"
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Phone</Label>
								<Input
									value={formData.phone}
									onChange={(e) =>
										setFormData({ ...formData, phone: e.target.value })
									}
									placeholder="+216 XX XXX XXX"
								/>
							</div>
							<div className="grid gap-2">
								<Label>Role *</Label>
								<Select
									value={formData.role}
									onValueChange={(value) =>
										setFormData({ ...formData, role: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="PASSENGER">Passenger</SelectItem>
										<SelectItem value="DRIVER">Driver</SelectItem>
										<SelectItem value="COMPANY_ADMIN">Company Admin</SelectItem>
										<SelectItem value="ADMIN">Admin</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						{(formData.role === "DRIVER" ||
							formData.role === "COMPANY_ADMIN") && (
							<div className="grid gap-2">
								<Label>Company</Label>
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
						)}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsCreateOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleCreate}
							disabled={
								!formData.email ||
								!formData.password ||
								!formData.firstName ||
								!formData.lastName ||
								isLoading
							}
						>
							{isLoading ? "Creating..." : "Create User"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Edit User</DialogTitle>
						<DialogDescription>Update user information.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>First Name *</Label>
								<Input
									value={formData.firstName}
									onChange={(e) =>
										setFormData({ ...formData, firstName: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label>Last Name *</Label>
								<Input
									value={formData.lastName}
									onChange={(e) =>
										setFormData({ ...formData, lastName: e.target.value })
									}
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label>Email</Label>
							<Input type="email" value={formData.email} disabled />
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Phone</Label>
								<Input
									value={formData.phone}
									onChange={(e) =>
										setFormData({ ...formData, phone: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label>Role *</Label>
								<Select
									value={formData.role}
									onValueChange={(value) =>
										setFormData({ ...formData, role: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="PASSENGER">Passenger</SelectItem>
										<SelectItem value="DRIVER">Driver</SelectItem>
										<SelectItem value="COMPANY_ADMIN">Company Admin</SelectItem>
										<SelectItem value="ADMIN">Admin</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						{(formData.role === "DRIVER" ||
							formData.role === "COMPANY_ADMIN") && (
							<div className="grid gap-2">
								<Label>Company</Label>
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
						)}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleEdit}
							disabled={!formData.firstName || !formData.lastName || isLoading}
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
						<DialogTitle>Delete User</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete "{selectedUser?.firstName}{" "}
							{selectedUser?.lastName}"? This action cannot be undone.
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
