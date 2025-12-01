import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	ImageBackground,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import type { RootStackParamList } from "../../navigation/types";
import notificationService from "../../services/notificationService";
import userService from "../../services/userService";

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, "Profile">;
};

type IconName =
	| "user"
	| "bell"
	| "credit-card"
	| "map-pin"
	| "settings"
	| "help-circle";

interface UserStats {
	totalTrips: number;
	averageRating: number;
	memberSince: string;
}

export default function ProfileScreen({ navigation }: Props) {
	const { user: authUser, logout } = useAuth();
	const [stats, setStats] = useState<UserStats>({
		totalTrips: 0,
		averageRating: 0,
		memberSince: "",
	});
	const [unreadCount, setUnreadCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const fetchUserData = useCallback(async () => {
		try {
			const [userStats, notifications] = await Promise.all([
				userService.getStats(),
				notificationService.getNotifications(),
			]);

			setStats({
				totalTrips: userStats.totalTrips || 0,
				averageRating: 4.8, // Default rating if not available
				memberSince: new Date().toLocaleDateString("en-US", {
					month: "short",
					year: "numeric",
				}),
			});

			// Count unread notifications
			const unread = notifications.filter((n) => !n.isRead).length;
			setUnreadCount(unread);
		} catch (error) {
			console.error("Failed to fetch user data:", error);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	const onRefresh = () => {
		setIsRefreshing(true);
		fetchUserData();
	};

	const handleLogout = () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Logout",
				style: "destructive",
				onPress: () => logout(),
			},
		]);
	};

	const menuItems: {
		icon: IconName;
		label: string;
		route: keyof RootStackParamList;
		badge?: string;
		iconBg: string;
		iconColor: string;
	}[] = [
		{
			icon: "user",
			label: "Edit Profile",
			route: "EditProfile",
			iconBg: "rgba(245, 166, 35, 0.15)",
			iconColor: colors.primary.DEFAULT,
		},
		{
			icon: "bell",
			label: "Notifications",
			route: "Notifications",
			badge: unreadCount > 0 ? String(unreadCount) : undefined,
			iconBg: "rgba(139, 92, 246, 0.15)",
			iconColor: "#8B5CF6",
		},
		{
			icon: "credit-card",
			label: "Payment Methods",
			route: "PaymentMethods",
			iconBg: "rgba(34, 197, 94, 0.15)",
			iconColor: "#22c55e",
		},
		{
			icon: "map-pin",
			label: "Saved Addresses",
			route: "SavedAddresses",
			iconBg: "rgba(59, 130, 246, 0.15)",
			iconColor: "#3B82F6",
		},
		{
			icon: "help-circle",
			label: "Help & Support",
			route: "Settings",
			iconBg: "rgba(236, 72, 153, 0.15)",
			iconColor: "#EC4899",
		},
		{
			icon: "settings",
			label: "Settings",
			route: "Settings",
			iconBg: "rgba(107, 114, 128, 0.15)",
			iconColor: "#6B7280",
		},
	];

	const getUserInitials = () => {
		if (!authUser?.firstName && !authUser?.lastName) return "?";
		const first = authUser.firstName?.[0] || "";
		const last = authUser.lastName?.[0] || "";
		return `${first}${last}`.toUpperCase();
	};

	if (isLoading) {
		return (
			<ImageBackground
				source={require("../../../assets/bg.png")}
				style={styles.background}
				resizeMode="cover"
			>
				<View style={styles.overlay}>
					<SafeAreaView style={styles.loadingContainer}>
						<ActivityIndicator size="large" color={colors.primary.DEFAULT} />
					</SafeAreaView>
				</View>
			</ImageBackground>
		);
	}

	return (
		<ImageBackground
			source={require("../../../assets/bg.png")}
			style={styles.background}
			resizeMode="cover"
		>
			<View style={styles.overlay}>
				<StatusBar style="light" />
				<SafeAreaView style={styles.container} edges={["top"]}>
					<ScrollView
						style={styles.scrollView}
						refreshControl={
							<RefreshControl
								refreshing={isRefreshing}
								onRefresh={onRefresh}
								tintColor={colors.primary.DEFAULT}
							/>
						}
					>
						{/* Header */}
						<View style={styles.header}>
							<View style={styles.avatarContainer}>
								{authUser?.avatar ? (
									<Image
										source={{ uri: authUser.avatar }}
										style={styles.avatar}
									/>
								) : (
									<View style={styles.avatarPlaceholder}>
										<Text style={styles.avatarText}>{getUserInitials()}</Text>
									</View>
								)}
								<View style={styles.editAvatarButton}>
									<Feather
										name="camera"
										size={14}
										color={colors.text.primary}
									/>
								</View>
							</View>
							<Text style={styles.userName}>
								{authUser?.firstName} {authUser?.lastName}
							</Text>
							<Text style={styles.userEmail}>{authUser?.email}</Text>
							{authUser?.phone && (
								<Text style={styles.userPhone}>{authUser.phone}</Text>
							)}
						</View>

						{/* Stats */}
						<View style={styles.statsContainer}>
							<View style={styles.statsCard}>
								<View style={styles.statItem}>
									<Text style={styles.statValue}>{stats.totalTrips}</Text>
									<Text style={styles.statLabel}>Total Trips</Text>
								</View>
								<View style={styles.statDivider} />
								<View style={styles.statItem}>
									<View style={styles.ratingRow}>
										<Text style={styles.statValue}>
											{stats.averageRating.toFixed(1)}
										</Text>
										<Feather
											name="star"
											size={16}
											color="#F59E0B"
											style={{ marginLeft: 4 }}
										/>
									</View>
									<Text style={styles.statLabel}>Rating</Text>
								</View>
								<View style={styles.statDivider} />
								<View style={styles.statItem}>
									<Text style={styles.statValueSmall}>{stats.memberSince}</Text>
									<Text style={styles.statLabel}>Member Since</Text>
								</View>
							</View>
						</View>

						{/* Menu Items */}
						<View style={styles.menuContainer}>
							{menuItems.map((item) => (
								<TouchableOpacity
									key={item.route + item.label}
									style={styles.menuItem}
									onPress={() => navigation.navigate(item.route as never)}
								>
									<View style={styles.menuItemLeft}>
										<View
											style={[
												styles.menuIconContainer,
												{ backgroundColor: item.iconBg },
											]}
										>
											<Feather
												name={item.icon}
												size={20}
												color={item.iconColor}
											/>
										</View>
										<Text style={styles.menuItemLabel}>{item.label}</Text>
									</View>
									<View style={styles.menuItemRight}>
										{item.badge && (
											<View style={styles.badge}>
												<Text style={styles.badgeText}>{item.badge}</Text>
											</View>
										)}
										<Feather
											name="chevron-right"
											size={18}
											color={colors.text.muted}
										/>
									</View>
								</TouchableOpacity>
							))}
						</View>

						{/* App Version */}
						<View style={styles.versionContainer}>
							<Text style={styles.versionText}>EZGO v1.0.0</Text>
						</View>

						{/* Logout */}
						<View style={styles.logoutContainer}>
							<TouchableOpacity
								style={styles.logoutButton}
								onPress={handleLogout}
							>
								<Feather name="log-out" size={18} color="#EF4444" />
								<Text style={styles.logoutText}>Logout</Text>
							</TouchableOpacity>
						</View>

						<View style={{ height: 32 }} />
					</ScrollView>
				</SafeAreaView>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(13, 13, 26, 0.95)",
	},
	container: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	scrollView: {
		flex: 1,
	},
	header: {
		alignItems: "center",
		paddingTop: 24,
		paddingBottom: 32,
		paddingHorizontal: 20,
	},
	avatarContainer: {
		position: "relative",
		marginBottom: 16,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 3,
		borderColor: colors.primary.DEFAULT,
	},
	avatarPlaceholder: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: colors.background.secondary,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 3,
		borderColor: colors.primary.DEFAULT,
	},
	avatarText: {
		fontSize: 36,
		fontWeight: "700",
		color: colors.primary.DEFAULT,
	},
	editAvatarButton: {
		position: "absolute",
		bottom: 0,
		right: 0,
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: colors.background.card,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: colors.background.DEFAULT,
	},
	userName: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.text.primary,
		marginBottom: 4,
	},
	userEmail: {
		fontSize: 14,
		color: colors.text.secondary,
	},
	userPhone: {
		fontSize: 13,
		color: colors.text.muted,
		marginTop: 2,
	},
	statsContainer: {
		paddingHorizontal: 20,
		marginTop: -16,
	},
	statsCard: {
		backgroundColor: colors.background.card,
		borderRadius: 16,
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
	},
	statItem: {
		alignItems: "center",
	},
	statValue: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.text.primary,
	},
	statValueSmall: {
		fontSize: 16,
		fontWeight: "700",
		color: colors.text.primary,
	},
	statLabel: {
		fontSize: 12,
		color: colors.text.muted,
		marginTop: 4,
	},
	statDivider: {
		width: 1,
		height: 40,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
	},
	ratingRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	menuContainer: {
		paddingHorizontal: 20,
		marginTop: 24,
	},
	menuItem: {
		backgroundColor: colors.background.card,
		borderRadius: 14,
		padding: 16,
		marginBottom: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
	},
	menuItemLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	menuIconContainer: {
		width: 42,
		height: 42,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	menuItemLabel: {
		fontSize: 15,
		fontWeight: "500",
		color: colors.text.primary,
		marginLeft: 14,
	},
	menuItemRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	badge: {
		backgroundColor: "#EF4444",
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 10,
		marginRight: 8,
	},
	badgeText: {
		color: "#FFFFFF",
		fontSize: 11,
		fontWeight: "700",
	},
	versionContainer: {
		paddingHorizontal: 20,
		marginTop: 20,
	},
	versionText: {
		textAlign: "center",
		fontSize: 12,
		color: colors.text.muted,
	},
	logoutContainer: {
		paddingHorizontal: 20,
		marginTop: 16,
	},
	logoutButton: {
		backgroundColor: "rgba(239, 68, 68, 0.1)",
		borderRadius: 14,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "rgba(239, 68, 68, 0.2)",
	},
	logoutText: {
		fontSize: 15,
		fontWeight: "600",
		color: "#EF4444",
		marginLeft: 8,
	},
});
