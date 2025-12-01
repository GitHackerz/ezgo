import { useCallback, useEffect, useState } from "react";
import notificationService, {
	type Notification,
} from "../services/notificationService";

export function useNotifications() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchNotifications = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const [allNotifications, count] = await Promise.all([
				notificationService.getNotifications(),
				notificationService.getUnreadCount(),
			]);
			setNotifications(allNotifications);
			setUnreadCount(count);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to fetch notifications";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	const markAsRead = async (notificationId: string) => {
		try {
			await notificationService.markAsRead(notificationId);
			setNotifications((prev) =>
				prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
			);
			setUnreadCount((prev) => Math.max(0, prev - 1));
		} catch (err) {
			console.error("Failed to mark as read:", err);
		}
	};

	const markAllAsRead = async () => {
		try {
			await notificationService.markAllAsRead();
			setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
			setUnreadCount(0);
		} catch (err) {
			console.error("Failed to mark all as read:", err);
		}
	};

	const deleteNotification = async (notificationId: string) => {
		try {
			await notificationService.deleteNotification(notificationId);
			setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
		} catch (err) {
			console.error("Failed to delete notification:", err);
		}
	};

	return {
		notifications,
		unreadCount,
		isLoading,
		error,
		refetch: fetchNotifications,
		markAsRead,
		markAllAsRead,
		deleteNotification,
	};
}
