import api from "./api";

export type NotificationType =
	| "BOOKING_CONFIRMED"
	| "BOOKING_CANCELLED"
	| "TRIP_REMINDER"
	| "TRIP_STARTED"
	| "TRIP_COMPLETED"
	| "TRIP_DELAYED"
	| "TRIP_CANCELLED"
	| "PAYMENT_SUCCESS"
	| "PAYMENT_FAILED"
	| "REFUND_PROCESSED"
	| "PROMOTION"
	| "SYSTEM";

export interface Notification {
	id: string;
	userId: string;
	type: NotificationType;
	title: string;
	message: string;
	data?: Record<string, any>;
	isRead: boolean;
	createdAt: string;
}

export interface NotificationPreferences {
	pushEnabled: boolean;
	emailEnabled: boolean;
	smsEnabled: boolean;
	tripReminders: boolean;
	promotions: boolean;
	updates: boolean;
}

const notificationService = {
	// Get all notifications
	async getNotifications(): Promise<Notification[]> {
		const response = await api.get("/notifications");
		return response.data;
	},

	// Get unread notifications
	async getUnreadNotifications(): Promise<Notification[]> {
		const response = await api.get("/notifications/unread");
		return response.data;
	},

	// Get unread count
	async getUnreadCount(): Promise<number> {
		const response = await api.get("/notifications/unread/count");
		return response.data.count;
	},

	// Mark notification as read
	async markAsRead(notificationId: string): Promise<void> {
		await api.patch(`/notifications/${notificationId}/read`);
	},

	// Mark all notifications as read
	async markAllAsRead(): Promise<void> {
		await api.patch("/notifications/read-all");
	},

	// Delete a notification
	async deleteNotification(notificationId: string): Promise<void> {
		await api.delete(`/notifications/${notificationId}`);
	},

	// Delete all notifications
	async deleteAllNotifications(): Promise<void> {
		await api.delete("/notifications/all");
	},

	// Get notification preferences
	async getPreferences(): Promise<NotificationPreferences> {
		const response = await api.get("/notifications/preferences");
		return response.data;
	},

	// Update notification preferences
	async updatePreferences(
		preferences: Partial<NotificationPreferences>,
	): Promise<NotificationPreferences> {
		const response = await api.patch("/notifications/preferences", preferences);
		return response.data;
	},

	// Register push token
	async registerPushToken(
		token: string,
		platform: "ios" | "android",
	): Promise<void> {
		await api.post("/notifications/push-token", { token, platform });
	},

	// Unregister push token
	async unregisterPushToken(token: string): Promise<void> {
		await api.delete("/notifications/push-token", { data: { token } });
	},
};

export default notificationService;
