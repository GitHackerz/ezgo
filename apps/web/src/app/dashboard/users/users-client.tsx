"use client";

import { Plus } from "lucide-react";
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

export function UsersClient({ initialUsers }: { initialUsers: any[] }) {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Users & Drivers</h1>
					<p className="text-muted-foreground">
						Manage system users and driver accounts
					</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add User
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-4">
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Total Users
					</div>
					<div className="text-2xl font-bold">{initialUsers.length}</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Drivers
					</div>
					<div className="text-2xl font-bold">
						{initialUsers.filter((u) => u.role === "DRIVER").length}
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Passengers
					</div>
					<div className="text-2xl font-bold">
						{initialUsers.filter((u) => u.role === "PASSENGER").length}
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Admins
					</div>
					<div className="text-2xl font-bold">
						{
							initialUsers.filter(
								(u) => u.role === "ADMIN" || u.role === "COMPANY_ADMIN",
							).length
						}
					</div>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Company</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{initialUsers.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-8 text-muted-foreground"
								>
									No users found.
								</TableCell>
							</TableRow>
						) : (
							initialUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell className="font-medium">
										{user.firstName} {user.lastName}
									</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										<Badge variant="outline">
											{user.role.replace("_", " ")}
										</Badge>
									</TableCell>
									<TableCell>{user.company?.name || "-"}</TableCell>
									<TableCell>
										<Badge variant="default">Active</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button variant="ghost" size="sm">
											Edit
										</Button>
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
