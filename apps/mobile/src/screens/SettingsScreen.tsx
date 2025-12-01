import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { borderRadius, colors, shadows } from "../constants/theme";

type IconName =
	| "bell"
	| "globe"
	| "moon"
	| "lock"
	| "help-circle"
	| "info"
	| "shield";

interface SettingItem {
	icon: IconName;
	label: string;
	type: "toggle" | "link";
	value?: boolean | string;
	onToggle?: (value: boolean) => void;
	route?: string;
}

interface SettingSection {
	title: string;
	items: SettingItem[];
}

export default function SettingsScreen({
	navigation,
}: {
	navigation: { goBack: () => void; navigate: (route: string) => void };
}) {
	const [notifications, setNotifications] = useState(true);
	const [darkMode, setDarkMode] = useState(true);

	const settingsSections: SettingSection[] = [
		{
			title: "Preferences",
			items: [
				{
					icon: "bell",
					label: "Push Notifications",
					type: "toggle",
					value: notifications,
					onToggle: setNotifications,
				},
				{
					icon: "globe",
					label: "Language",
					type: "link",
					value: "English",
					route: "Language",
				},
				{
					icon: "moon",
					label: "Dark Mode",
					type: "toggle",
					value: darkMode,
					onToggle: setDarkMode,
				},
			],
		},
		{
			title: "Security",
			items: [
				{
					icon: "lock",
					label: "Change Password",
					type: "link",
					route: "ChangePassword",
				},
				{
					icon: "shield",
					label: "Two-Factor Authentication",
					type: "link",
					route: "TwoFactor",
				},
			],
		},
		{
			title: "Support",
			items: [
				{
					icon: "help-circle",
					label: "Help Center",
					type: "link",
					route: "Help",
				},
				{ icon: "info", label: "About", type: "link", route: "About" },
			],
		},
	];

	const getIconBackgroundColor = (icon: IconName) => {
		switch (icon) {
			case "bell":
				return colors.primary.DEFAULT + "20";
			case "moon":
				return "#6366F1" + "20";
			case "globe":
				return "#10B981" + "20";
			case "lock":
			case "shield":
				return colors.error.DEFAULT + "20";
			case "help-circle":
				return "#3B82F6" + "20";
			case "info":
				return colors.text.secondary + "20";
			default:
				return colors.primary.DEFAULT + "20";
		}
	};

	const getIconColor = (icon: IconName) => {
		switch (icon) {
			case "bell":
				return colors.primary.DEFAULT;
			case "moon":
				return "#6366F1";
			case "globe":
				return "#10B981";
			case "lock":
			case "shield":
				return colors.error.DEFAULT;
			case "help-circle":
				return "#3B82F6";
			case "info":
				return colors.text.secondary;
			default:
				return colors.primary.DEFAULT;
		}
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<SafeAreaView edges={["top"]}>
					<View style={styles.headerContent}>
						<TouchableOpacity
							onPress={() => navigation.goBack()}
							style={styles.backButton}
						>
							<Feather
								name="arrow-left"
								size={24}
								color={colors.text.primary}
							/>
						</TouchableOpacity>
						<View style={styles.headerTextContainer}>
							<Text style={styles.headerTitle}>Settings</Text>
							<Text style={styles.headerSubtitle}>Manage your preferences</Text>
						</View>
					</View>
				</SafeAreaView>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				{/* Settings Sections */}
				{settingsSections.map((section, sectionIndex) => (
					<View key={`section-${section.title}`} style={styles.section}>
						<Text style={styles.sectionTitle}>{section.title}</Text>

						<View style={styles.sectionCard}>
							{section.items.map((item, itemIndex) => (
								<View key={`item-${item.label}`}>
									<TouchableOpacity
										style={styles.settingItem}
										onPress={() => {
											if (item.type === "link" && item.route) {
												navigation.navigate(item.route);
											}
										}}
										disabled={item.type === "toggle"}
									>
										<View style={styles.settingItemLeft}>
											<View
												style={[
													styles.iconContainer,
													{
														backgroundColor: getIconBackgroundColor(item.icon),
													},
												]}
											>
												<Feather
													name={item.icon}
													size={20}
													color={getIconColor(item.icon)}
												/>
											</View>
											<View style={styles.labelContainer}>
												<Text style={styles.settingLabel}>{item.label}</Text>
												{item.value && item.type === "link" && (
													<Text style={styles.settingValue}>{item.value}</Text>
												)}
											</View>
										</View>

										{item.type === "toggle" && item.onToggle && (
											<Switch
												value={item.value as boolean}
												onValueChange={item.onToggle}
												trackColor={{
													false: colors.background.tertiary,
													true: colors.primary.DEFAULT,
												}}
												thumbColor={colors.text.primary}
											/>
										)}

										{item.type === "link" && item.route && (
											<Feather
												name="chevron-right"
												size={20}
												color={colors.text.muted}
											/>
										)}
									</TouchableOpacity>
									{itemIndex < section.items.length - 1 && (
										<View style={styles.divider} />
									)}
								</View>
							))}
						</View>
					</View>
				))}

				{/* App Version */}
				<View style={styles.versionContainer}>
					<View style={styles.versionBadge}>
						<Feather name="smartphone" size={16} color={colors.text.muted} />
						<Text style={styles.versionText}>EZGO v1.0.0</Text>
					</View>
					<Text style={styles.copyrightText}>
						© 2024 EZGO. All rights reserved.
					</Text>
				</View>

				<View style={styles.bottomSpacer} />
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.DEFAULT,
	},
	header: {
		backgroundColor: colors.background.secondary,
		paddingBottom: 20,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 16,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.background.tertiary,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	headerTextContainer: {
		flex: 1,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.text.primary,
	},
	headerSubtitle: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: 2,
	},
	scrollView: {
		flex: 1,
		paddingHorizontal: 20,
	},
	section: {
		marginTop: 24,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.text.secondary,
		textTransform: "uppercase",
		letterSpacing: 0.5,
		marginBottom: 12,
		marginLeft: 4,
	},
	sectionCard: {
		backgroundColor: colors.background.card,
		borderRadius: borderRadius.xl,
		overflow: "hidden",
		...shadows.sm,
	},
	settingItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 16,
	},
	settingItemLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	iconContainer: {
		width: 44,
		height: 44,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	labelContainer: {
		marginLeft: 14,
		flex: 1,
	},
	settingLabel: {
		fontSize: 16,
		color: colors.text.primary,
		fontWeight: "500",
	},
	settingValue: {
		fontSize: 13,
		color: colors.text.muted,
		marginTop: 2,
	},
	divider: {
		height: 1,
		backgroundColor: colors.border.DEFAULT,
		marginLeft: 74,
	},
	versionContainer: {
		alignItems: "center",
		marginTop: 40,
		paddingVertical: 20,
	},
	versionBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.background.card,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: borderRadius.full,
		marginBottom: 8,
	},
	versionText: {
		color: colors.text.muted,
		fontSize: 14,
		marginLeft: 8,
	},
	copyrightText: {
		color: colors.text.muted,
		fontSize: 12,
	},
	bottomSpacer: {
		height: 32,
	},
});
