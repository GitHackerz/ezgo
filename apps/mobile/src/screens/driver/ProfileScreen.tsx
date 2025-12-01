import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import { SafeAreaView } from "react-native-safe-area-context";
import {
	borderRadius,
	colors,
	gradients,
	shadows,
} from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import userService, { DriverStats } from "../../services/userService";

type IconName =
	| "user"
	| "bell"
	| "truck"
	| "calendar"
	| "star"
	| "settings"
	| "help-circle";

interface MenuItem {
	icon: IconName;
	label: string;
	route: string;
	value?: string;
	badge?: string;
}

export default function DriverProfileScreen({
	navigation,
}: {
	navigation: { navigate: (route: string) => void };
}) {
	const { user, logout } = useAuth();
	const [stats, setStats] = useState<DriverStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const fetchStats = useCallback(async () => {
		try {
			const data = await userService.getDriverStats();
			setStats(data);
		} catch (error) {
			console.error("Error fetching driver stats:", error);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	const handleRefresh = () => {
		setIsRefreshing(true);
		fetchStats();
	};

	const menuItems: MenuItem[] = [
		{ icon: "user", label: "Edit Profile", route: "EditProfile" },
		{
			icon: "bell",
			label: "Notifications",
			route: "Notifications",
			badge: "2",
		},
		{ icon: "truck", label: "My Vehicle", route: "VehicleDetails" },
		{ icon: "calendar", label: "Trip History", route: "TripHistory" },
		{
			icon: "star",
			label: "My Ratings",
			route: "Ratings",
			value: stats?.averageRating?.toFixed(1) ?? "-",
		},
		{ icon: "settings", label: "Settings", route: "Settings" },
		{ icon: "help-circle", label: "Help & Support", route: "Support" },
	];

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={colors.primary.DEFAULT} />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={handleRefresh}
						tintColor={colors.primary.DEFAULT}
					/>
				}
			>
				{/* Header */}
				<LinearGradient
					colors={gradients.primary}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={styles.header}
				>
					<View style={styles.headerContent}>
						<View style={styles.avatarContainer}>
							<Text style={styles.avatarText}>👨‍✈️</Text>
						</View>
						<Text style={styles.userName}>
							{user?.firstName} {user?.lastName}
						</Text>
						<Text style={styles.userEmail}>{user?.email}</Text>
						<View style={styles.roleBadge}>
							<Text style={styles.roleText}>Professional Driver</Text>
						</View>
					</View>
				</LinearGradient>

				{/* Stats */}
				<View style={styles.statsSection}>
					<View style={styles.statsCard}>
						<View style={styles.statItem}>
							<Text style={styles.statValue}>{stats?.totalTrips ?? 0}</Text>
							<Text style={styles.statLabel}>Total Trips</Text>
						</View>
						<View style={styles.statDivider} />
						<View style={styles.statItem}>
							<View style={styles.ratingRow}>
								<Feather name="star" size={20} color={colors.warning.DEFAULT} />
								<Text style={styles.statValue}>
									{stats?.averageRating?.toFixed(1) ?? "N/A"}
								</Text>
							</View>
							<Text style={styles.statLabel}>Rating</Text>
						</View>
						<View style={styles.statDivider} />
						<View style={styles.statItem}>
							<Text style={styles.statValue}>{stats?.completedTrips ?? 0}</Text>
							<Text style={styles.statLabel}>Completed</Text>
						</View>
					</View>
				</View>

				{/* Menu Items */}
				<View style={styles.menuSection}>
					{menuItems.map((item) => (
						<TouchableOpacity
							key={item.route}
							style={styles.menuItem}
							onPress={() => navigation.navigate(item.route)}
						>
							<View style={styles.menuItemLeft}>
								<View style={styles.menuIconContainer}>
									<Feather
										name={item.icon}
										size={24}
										color={colors.primary.DEFAULT}
									/>
								</View>
								<Text style={styles.menuLabel}>{item.label}</Text>
							</View>
							<View style={styles.menuItemRight}>
								{item.value && (
									<Text style={styles.menuValue}>{item.value}</Text>
								)}
								{item.badge && (
									<View style={styles.menuBadge}>
										<Text style={styles.menuBadgeText}>{item.badge}</Text>
									</View>
								)}
								<Feather
									name="chevron-right"
									size={20}
									color={colors.text.muted}
								/>
							</View>
						</TouchableOpacity>
					))}
				</View>

				{/* Logout */}
				<View style={styles.logoutSection}>
					<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
						<Feather name="log-out" size={20} color={colors.error.DEFAULT} />
						<Text style={styles.logoutText}>Logout</Text>
					</TouchableOpacity>
				</View>

				<View style={{ height: 32 }} />
			</ScrollView>
		</SafeAreaView>
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
	scrollView: {
		flex: 1,
	},
	header: {
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 48,
	},
	headerContent: {
		alignItems: "center",
	},
	avatarContainer: {
		width: 96,
		height: 96,
		borderRadius: 48,
		backgroundColor: colors.background.card,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
	},
	avatarText: {
		fontSize: 48,
	},
	userName: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.text.inverse,
	},
	userEmail: {
		fontSize: 14,
		color: colors.text.inverse,
		opacity: 0.8,
		marginTop: 4,
	},
	roleBadge: {
		backgroundColor: "rgba(255,255,255,0.2)",
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: borderRadius.full,
		marginTop: 8,
	},
	roleText: {
		fontSize: 14,
		color: colors.text.inverse,
	},
	statsSection: {
		paddingHorizontal: 24,
		marginTop: -32,
	},
	statsCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-around",
		...shadows.lg,
	},
	statItem: {
		alignItems: "center",
		flex: 1,
	},
	statDivider: {
		width: 1,
		backgroundColor: colors.border.DEFAULT,
	},
	ratingRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	statValue: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.text.primary,
	},
	statLabel: {
		fontSize: 12,
		color: colors.text.secondary,
		marginTop: 4,
	},
	menuSection: {
		paddingHorizontal: 24,
		marginTop: 24,
	},
	menuItem: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		padding: 16,
		marginBottom: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		...shadows.sm,
	},
	menuItemLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	menuIconContainer: {
		width: 48,
		height: 48,
		borderRadius: borderRadius.lg,
		backgroundColor: colors.primary.DEFAULT + "20",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 16,
	},
	menuLabel: {
		fontSize: 16,
		fontWeight: "500",
		color: colors.text.primary,
	},
	menuItemRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	menuValue: {
		fontSize: 14,
		color: colors.text.secondary,
	},
	menuBadge: {
		backgroundColor: colors.error.DEFAULT,
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: borderRadius.full,
	},
	menuBadgeText: {
		fontSize: 12,
		fontWeight: "bold",
		color: colors.text.inverse,
	},
	logoutSection: {
		paddingHorizontal: 24,
		marginTop: 24,
	},
	logoutButton: {
		backgroundColor: colors.error.background,
		borderRadius: borderRadius.xl,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	logoutText: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.error.DEFAULT,
		marginLeft: 8,
	},
});
