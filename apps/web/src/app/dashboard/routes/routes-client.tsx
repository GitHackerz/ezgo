"use client";

import { Plus, MapPin } from "lucide-react";
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

export function RoutesClient({ initialRoutes }: { initialRoutes: any[] }) {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Routes</h1>
					<p className="text-muted-foreground">
						Manage your bus routes and stops
					</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Create Route
				</Button>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Route Name</TableHead>
							<TableHead>Origin</TableHead>
							<TableHead>Destination</TableHead>
							<TableHead>Distance</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{initialRoutes.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-8 text-muted-foreground"
								>
									No routes found.
								</TableCell>
							</TableRow>
						) : (
							initialRoutes.map((route) => (
								<TableRow key={route.id}>
									<TableCell className="font-medium">{route.name}</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4 text-muted-foreground" />
											{route.origin}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4 text-muted-foreground" />
											{route.destination}
										</div>
									</TableCell>
									<TableCell>{route.distance} km</TableCell>
									<TableCell>
										<Badge variant={route.isActive ? "default" : "secondary"}>
											{route.isActive ? "Active" : "Inactive"}
										</Badge>
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
