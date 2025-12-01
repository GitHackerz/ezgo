import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { borderRadius, colors, shadows } from "../constants/theme";
import notificationService, {
	Notification,
	NotificationType,
} from "../services/notificationService";

export default function NotificationsScreen({
	navigation,
}: {
	navigation: { goBack: () => void };
}) {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const fetchNotifications = useCallback(async () => {
		try {
			const data = await notificationService.getNotifications();
			setNotifications(data);
		} catch (error) {
			console.error("Error fetching notifications:", error);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	const handleRefresh = () => {
		setIsRefreshing(true);
		fetchNotifications();
	};

	const handleMarkAllRead = async () => {
		try {
			await notificationService.markAllAsRead();
			setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
		} catch (error) {
			console.error("Error marking all as read:", error);
		}
	};

	const handleMarkAsRead = async (notificationId: string) => {
		try {
			await notificationService.markAsRead(notificationId);
			setNotifications((prev) =>
				prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
			);
		} catch (error) {
			console.error("Error marking as read:", error);
		}
	};

	const getIcon = (type: NotificationType): keyof typeof Feather.glyphMap => {
		switch (type) {
			case "TRIP_REMINDER":
			case "TRIP_STARTED":
			case "TRIP_COMPLETED":
			case "TRIP_DELAYED":
			case "TRIP_CANCELLED":
				return "navigation";
			case "BOOKING_CONFIRMED":
			case "BOOKING_CANCELLED":
				return "check-circle";
			case "PAYMENT_SUCCESS":
			case "PAYMENT_FAILED":
			case "REFUND_PROCESSED":
				return "credit-card";
			case "PROMOTION":
				return "gift";
			case "SYSTEM":
			default:
				return "bell";
		}
	};

	const getIconColor = (type: NotificationType): string => {
		switch (type) {
			case "TRIP_REMINDER":
			case "TRIP_STARTED":
			case "TRIP_COMPLETED":
				return colors.primary.DEFAULT;
			case "TRIP_DELAYED":
			case "TRIP_CANCELLED":
			case "BOOKING_CANCELLED":
			case "PAYMENT_FAILED":
				return colors.error.DEFAULT;
			case "BOOKING_CONFIRMED":
			case "PAYMENT_SUCCESS":
			case "REFUND_PROCESSED":
				return colors.success.DEFAULT;
			case "PROMOTION":
				return colors.warning.DEFAULT;
			case "SYSTEM":
			default:
				return colors.text.secondary;
		}
	};

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins} minutes ago`;
		if (diffHours < 24) return `${diffHours} hours ago`;
		if (diffDays < 7) return `${diffDays} days ago`;
		return date.toLocaleDateString();
	};

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={colors.primary.DEFAULT} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerContent}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<Feather name="arrow-left" size={24} color={colors.text.primary} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Notifications</Text>
					<TouchableOpacity onPress={handleMarkAllRead}>
						<Text style={styles.markAllText}>Mark all read</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Notifications List */}
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={handleRefresh}
						tintColor={colors.primary.DEFAULT}
					/>
				}
			>
				{notifications.map((notification) => (
					<TouchableOpacity
						key={notification.id}
						style={[
							styles.notificationCard,
							!notification.isRead && styles.unreadCard,
						]}
						onPress={() => handleMarkAsRead(notification.id)}
					>
						<View
							style={[
								styles.iconContainer,
								{ backgroundColor: getIconColor(notification.type) + "20" },
							]}
						>
							<Feather
								name={getIcon(notification.type)}
								size={24}
								color={getIconColor(notification.type)}
							/>
						</View>
						<View style={styles.contentContainer}>
							<View style={styles.titleRow}>
								<Text
									style={[
										styles.notificationTitle,
										!notification.isRead && styles.unreadTitle,
									]}
								>
									{notification.title}
								</Text>
								{!notification.isRead && <View style={styles.unreadDot} />}
							</View>
							<Text style={styles.notificationMessage}>
								{notification.message}
							</Text>
							<Text style={styles.notificationTime}>
								{formatDate(notification.createdAt)}
							</Text>
						</View>
					</TouchableOpacity>
				))}

				{notifications.length === 0 && (
					<View style={styles.emptyContainer}>
						<Feather name="bell-off" size={64} color={colors.text.muted} />
						<Text style={styles.emptyText}>No notifications yet</Text>
					</View>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
		alignItems: "center",
		justifyContent: "center",
	},
	header: {
		backgroundColor: colors.background.secondary,
		paddingHorizontal: 20,
		paddingTop: 48,
		paddingBottom: 16,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.background.tertiary,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	headerTitle: {
		color: colors.text.primary,
		fontSize: 24,
		fontWeight: "bold",
		flex: 1,
	},
	markAllText: {
		color: colors.primary.DEFAULT,
		fontSize: 14,
		fontWeight: "500",
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 24,
	},
	notificationCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		marginBottom: 12,
		flexDirection: "row",
		...shadows.sm,
	},
	unreadCard: {
		borderLeftWidth: 4,
		borderLeftColor: colors.primary.DEFAULT,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 16,
	},
	contentContainer: {
		flex: 1,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 4,
	},
	notificationTitle: {
		color: colors.text.secondary,
		fontWeight: "600",
		fontSize: 15,
		flex: 1,
	},
	unreadTitle: {
		color: colors.text.primary,
	},
	unreadDot: {
		width: 8,
		height: 8,
		backgroundColor: colors.primary.DEFAULT,
		borderRadius: 4,
		marginLeft: 8,
	},
	notificationMessage: {
		color: colors.text.secondary,
		fontSize: 14,
		marginBottom: 8,
		lineHeight: 20,
	},
	notificationTime: {
		color: colors.text.muted,
		fontSize: 12,
	},
	emptyContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 80,
	},
	emptyText: {
		color: colors.text.secondary,
		marginTop: 16,
		fontSize: 18,
	},
});
