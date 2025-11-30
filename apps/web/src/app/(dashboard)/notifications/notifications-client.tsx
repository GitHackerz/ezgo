"use client";

import {
	AlertCircle,
	Bell,
	CheckCheck,
	Info,
	MoreHorizontal,
	Send,
	Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	markAllAsRead,
	markAsRead,
	sendBulkNotification,
} from "@/actions/notifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";

interface Notification {
	id: string;
	type: string;
	title: string;
	message: string;
	isRead: boolean;
	createdAt: string;
	user?: { id: string; firstName: string; lastName: string };
}

export function NotificationsClient({
	initialNotifications,
}: {
	initialNotifications: Notification[];
}) {
	const router = useRouter();
	const [notifications, setNotifications] = useState(initialNotifications);
	const [isSendOpen, setIsSendOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [filter, setFilter] = useState<string>("all");

	const [formData, setFormData] = useState({
		title: "",
		message: "",
		type: "INFO",
		role: "",
	});

	const handleMarkAsRead = async (notification: Notification) => {
		const result = await markAsRead(notification.id);
		if (result.success && result.data) {
			setNotifications(
				notifications.map((n) => (n.id === result.data!.id ? result.data! : n)),
			);
			router.refresh();
		}
	};

	const handleMarkAllAsRead = async () => {
		setIsLoading(true);
		const result = await markAllAsRead();
		setIsLoading(false);

		if (result.success) {
			setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
			router.refresh();
		}
	};

	const handleSendBulk = async () => {
		setIsLoading(true);
		const result = await sendBulkNotification({
			title: formData.title,
			message: formData.message,
			type: formData.type,
			role: formData.role || undefined,
		});
		setIsLoading(false);

		if (result.success) {
			setIsSendOpen(false);
			setFormData({ title: "", message: "", type: "INFO", role: "" });
			router.refresh();
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "WARNING":
				return <AlertCircle className="h-5 w-5 text-yellow-500" />;
			case "ERROR":
				return <AlertCircle className="h-5 w-5 text-red-500" />;
			case "SUCCESS":
				return <CheckCheck className="h-5 w-5 text-green-500" />;
			default:
				return <Info className="h-5 w-5 text-blue-500" />;
		}
	};

	const filteredNotifications = notifications.filter((n) => {
		if (filter === "all") return true;
		if (filter === "unread") return !n.isRead;
		if (filter === "read") return n.isRead;
		return n.type === filter;
	});

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
					<p className="text-muted-foreground">
						Manage system notifications and alerts
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={handleMarkAllAsRead}
						disabled={unreadCount === 0 || isLoading}
					>
						<CheckCheck className="mr-2 h-4 w-4" />
						Mark All Read
					</Button>
					<Button onClick={() => setIsSendOpen(true)}>
						<Send className="mr-2 h-4 w-4" />
						Send Notification
					</Button>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-4">
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">Total</div>
					<div className="text-2xl font-bold">{notifications.length}</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Unread
					</div>
					<div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Warnings
					</div>
					<div className="text-2xl font-bold text-yellow-600">
						{notifications.filter((n) => n.type === "WARNING").length}
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-sm font-medium text-muted-foreground">
						Errors
					</div>
					<div className="text-2xl font-bold text-red-600">
						{notifications.filter((n) => n.type === "ERROR").length}
					</div>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<Select value={filter} onValueChange={setFilter}>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="Filter" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Notifications</SelectItem>
						<SelectItem value="unread">Unread</SelectItem>
						<SelectItem value="read">Read</SelectItem>
						<SelectItem value="INFO">Info</SelectItem>
						<SelectItem value="WARNING">Warning</SelectItem>
						<SelectItem value="ERROR">Error</SelectItem>
						<SelectItem value="SUCCESS">Success</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-4">
				{filteredNotifications.length === 0 ? (
					<Card>
						<CardContent className="py-8 text-center text-muted-foreground">
							<Bell className="mx-auto h-12 w-12 mb-4 opacity-50" />
							<p>No notifications found.</p>
						</CardContent>
					</Card>
				) : (
					filteredNotifications.map((notification) => (
						<Card
							key={notification.id}
							className={
								!notification.isRead ? "border-l-4 border-l-primary" : ""
							}
						>
							<CardHeader className="pb-2">
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-3">
										{getTypeIcon(notification.type)}
										<div>
											<CardTitle className="text-lg">
												{notification.title}
											</CardTitle>
											<CardDescription>
												{new Date(notification.createdAt).toLocaleString()}
												{notification.user && (
													<span>
														{" "}
														• {notification.user.firstName}{" "}
														{notification.user.lastName}
													</span>
												)}
											</CardDescription>
										</div>
									</div>
									<div className="flex items-center gap-2">
										{!notification.isRead && (
											<Badge variant="secondary">New</Badge>
										)}
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												{!notification.isRead && (
													<DropdownMenuItem
														onClick={() => handleMarkAsRead(notification)}
													>
														<CheckCheck className="mr-2 h-4 w-4" />
														Mark as Read
													</DropdownMenuItem>
												)}
												<DropdownMenuItem className="text-destructive">
													<Trash2 className="mr-2 h-4 w-4" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">{notification.message}</p>
							</CardContent>
						</Card>
					))
				)}
			</div>

			{/* Send Notification Dialog */}
			<Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Send Notification</DialogTitle>
						<DialogDescription>Send a notification to users.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label>Title *</Label>
							<Input
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								placeholder="Notification title"
							/>
						</div>
						<div className="grid gap-2">
							<Label>Message *</Label>
							<Textarea
								value={formData.message}
								onChange={(e) =>
									setFormData({ ...formData, message: e.target.value })
								}
								placeholder="Notification message"
								rows={4}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Type</Label>
								<Select
									value={formData.type}
									onValueChange={(value) =>
										setFormData({ ...formData, type: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="INFO">Info</SelectItem>
										<SelectItem value="WARNING">Warning</SelectItem>
										<SelectItem value="ERROR">Error</SelectItem>
										<SelectItem value="SUCCESS">Success</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label>Target Role (optional)</Label>
								<Select
									value={formData.role}
									onValueChange={(value) =>
										setFormData({ ...formData, role: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="All users" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">All Users</SelectItem>
										<SelectItem value="ADMIN">Admins</SelectItem>
										<SelectItem value="COMPANY_ADMIN">
											Company Admins
										</SelectItem>
										<SelectItem value="DRIVER">Drivers</SelectItem>
										<SelectItem value="PASSENGER">Passengers</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsSendOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleSendBulk}
							disabled={!formData.title || !formData.message || isLoading}
						>
							{isLoading ? "Sending..." : "Send Notification"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
