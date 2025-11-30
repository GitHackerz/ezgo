"use client";

import { Bell, Lock, Save, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updatePassword, updateProfile } from "@/actions/users";
import { handleActionResult } from "@/lib/action-handler";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Profile {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone?: string;
	role: string;
	company?: { id: string; name: string };
}

export function SettingsClient({ profile }: { profile: Profile | null }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const [profileData, setProfileData] = useState({
		firstName: profile?.firstName || "",
		lastName: profile?.lastName || "",
		phone: profile?.phone || "",
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [notifications, setNotifications] = useState({
		email: true,
		push: true,
		sms: false,
		marketing: false,
	});

	const handleUpdateProfile = async () => {
		setIsLoading(true);
		setMessage(null);
		const result = await updateProfile(profileData);
		setIsLoading(false);

		await handleActionResult(
			result,
			() => {
				setMessage({ type: "success", text: "Profile updated successfully" });
				router.refresh();
			},
			(error) => {
				setMessage({
					type: "error",
					text: error,
				});
			},
		);
	};

	const handleUpdatePassword = async () => {
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setMessage({ type: "error", text: "Passwords do not match" });
			return;
		}

		setIsLoading(true);
		setMessage(null);
		const result = await updatePassword(
			passwordData.currentPassword,
			passwordData.newPassword,
		);
		setIsLoading(false);

		await handleActionResult(
			result,
			() => {
				setMessage({ type: "success", text: "Password updated successfully" });
				setPasswordData({
					currentPassword: "",
					newPassword: "",
					confirmPassword: "",
				});
			},
			(error) => {
				setMessage({
					type: "error",
					text: error,
				});
			},
		);
	};

	if (!profile) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-muted-foreground">Please log in to view settings.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account settings and preferences
				</p>
			</div>

			{message && (
				<div
					className={`p-4 rounded-lg ${
						message.type === "success"
							? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
							: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
					}`}
				>
					{message.text}
				</div>
			)}

			<Tabs defaultValue="profile" className="space-y-4">
				<TabsList>
					<TabsTrigger value="profile">
						<User className="mr-2 h-4 w-4" />
						Profile
					</TabsTrigger>
					<TabsTrigger value="security">
						<Lock className="mr-2 h-4 w-4" />
						Security
					</TabsTrigger>
					<TabsTrigger value="notifications">
						<Bell className="mr-2 h-4 w-4" />
						Notifications
					</TabsTrigger>
				</TabsList>

				<TabsContent value="profile">
					<Card>
						<CardHeader>
							<CardTitle>Profile Information</CardTitle>
							<CardDescription>
								Update your personal information
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="grid gap-2">
									<Label>First Name</Label>
									<Input
										value={profileData.firstName}
										onChange={(e) =>
											setProfileData({
												...profileData,
												firstName: e.target.value,
											})
										}
									/>
								</div>
								<div className="grid gap-2">
									<Label>Last Name</Label>
									<Input
										value={profileData.lastName}
										onChange={(e) =>
											setProfileData({
												...profileData,
												lastName: e.target.value,
											})
										}
									/>
								</div>
							</div>
							<div className="grid gap-2">
								<Label>Email</Label>
								<Input value={profile.email} disabled />
								<p className="text-sm text-muted-foreground">
									Email cannot be changed
								</p>
							</div>
							<div className="grid gap-2">
								<Label>Phone</Label>
								<Input
									value={profileData.phone}
									onChange={(e) =>
										setProfileData({ ...profileData, phone: e.target.value })
									}
									placeholder="+216 XX XXX XXX"
								/>
							</div>
							<div className="grid gap-2">
								<Label>Role</Label>
								<Input value={profile.role.replace("_", " ")} disabled />
							</div>
							{profile.company && (
								<div className="grid gap-2">
									<Label>Company</Label>
									<Input value={profile.company.name} disabled />
								</div>
							)}
							<Button onClick={handleUpdateProfile} disabled={isLoading}>
								<Save className="mr-2 h-4 w-4" />
								{isLoading ? "Saving..." : "Save Changes"}
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="security">
					<Card>
						<CardHeader>
							<CardTitle>Change Password</CardTitle>
							<CardDescription>
								Update your password to keep your account secure
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-2">
								<Label>Current Password</Label>
								<Input
									type="password"
									value={passwordData.currentPassword}
									onChange={(e) =>
										setPasswordData({
											...passwordData,
											currentPassword: e.target.value,
										})
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label>New Password</Label>
								<Input
									type="password"
									value={passwordData.newPassword}
									onChange={(e) =>
										setPasswordData({
											...passwordData,
											newPassword: e.target.value,
										})
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label>Confirm New Password</Label>
								<Input
									type="password"
									value={passwordData.confirmPassword}
									onChange={(e) =>
										setPasswordData({
											...passwordData,
											confirmPassword: e.target.value,
										})
									}
								/>
							</div>
							<Button
								onClick={handleUpdatePassword}
								disabled={
									isLoading ||
									!passwordData.currentPassword ||
									!passwordData.newPassword
								}
							>
								<Lock className="mr-2 h-4 w-4" />
								{isLoading ? "Updating..." : "Update Password"}
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="notifications">
					<Card>
						<CardHeader>
							<CardTitle>Notification Preferences</CardTitle>
							<CardDescription>
								Choose how you want to receive notifications
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium">Email Notifications</div>
									<div className="text-sm text-muted-foreground">
										Receive booking confirmations and updates via email
									</div>
								</div>
								<Switch
									checked={notifications.email}
									onCheckedChange={(checked) =>
										setNotifications({ ...notifications, email: checked })
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium">Push Notifications</div>
									<div className="text-sm text-muted-foreground">
										Receive real-time updates in your browser
									</div>
								</div>
								<Switch
									checked={notifications.push}
									onCheckedChange={(checked) =>
										setNotifications({ ...notifications, push: checked })
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium">SMS Notifications</div>
									<div className="text-sm text-muted-foreground">
										Receive trip reminders via SMS
									</div>
								</div>
								<Switch
									checked={notifications.sms}
									onCheckedChange={(checked) =>
										setNotifications({ ...notifications, sms: checked })
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium">Marketing Emails</div>
									<div className="text-sm text-muted-foreground">
										Receive offers and promotions
									</div>
								</div>
								<Switch
									checked={notifications.marketing}
									onCheckedChange={(checked) =>
										setNotifications({ ...notifications, marketing: checked })
									}
								/>
							</div>
							<Button>
								<Save className="mr-2 h-4 w-4" />
								Save Preferences
							</Button>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
