// EZGO Theme Constants - Dark Theme with Orange Accents

export const colors = {
	// Primary Colors
	primary: {
		DEFAULT: "#F5A623", // Main orange accent
		light: "#FFB84D",
		dark: "#E09000",
		50: "#FFF8E7",
		100: "#FFECC4",
		200: "#FFD98A",
		300: "#FFC64F",
		400: "#FFB323",
		500: "#F5A623",
		600: "#E09000",
		700: "#B87300",
		800: "#8F5900",
		900: "#664000",
	},

	// Background Colors (Dark Theme)
	background: {
		DEFAULT: "#0D0D1A", // Main dark background
		secondary: "#1A1A2E", // Card/elevated background
		tertiary: "#252540", // Input fields, subtle elements
		elevated: "#2D2D47", // Modals, floating elements
		card: "#1E1E32", // Card backgrounds
	},

	// Text Colors
	text: {
		primary: "#FFFFFF",
		secondary: "#B0B0C3",
		muted: "#6B6B80",
		inverse: "#0D0D1A",
	},

	// Status Colors
	success: {
		DEFAULT: "#22C55E",
		light: "#4ADE80",
		dark: "#16A34A",
		background: "rgba(34, 197, 94, 0.15)",
	},

	error: {
		DEFAULT: "#EF4444",
		light: "#F87171",
		dark: "#DC2626",
		background: "rgba(239, 68, 68, 0.15)",
	},

	warning: {
		DEFAULT: "#F59E0B",
		light: "#FBBF24",
		dark: "#D97706",
		background: "rgba(245, 158, 11, 0.15)",
	},

	info: {
		DEFAULT: "#3B82F6",
		light: "#60A5FA",
		dark: "#2563EB",
		background: "rgba(59, 130, 246, 0.15)",
	},

	// Border Colors
	border: {
		DEFAULT: "#2D2D47",
		light: "#3D3D5C",
		dark: "#1A1A2E",
	},

	// Overlay
	overlay: "rgba(0, 0, 0, 0.7)",

	// White & Black
	white: "#FFFFFF",
	black: "#000000",
	transparent: "transparent",
};

export const gradients = {
	primary: ["#F5A623", "#FF8C00"],
	dark: ["#0D0D1A", "#1A1A2E"],
	card: ["#1A1A2E", "#252540"],
	orange: ["#FFB84D", "#F5A623", "#E09000"],
};

export const shadows = {
	sm: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2,
	},
	md: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	lg: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
	},
	glow: {
		shadowColor: "#F5A623",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 10,
	},
};

export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
};

export const borderRadius = {
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	full: 9999,
};

export const typography = {
	fontSizes: {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 18,
		xl: 20,
		"2xl": 24,
		"3xl": 30,
		"4xl": 36,
	},
	fontWeights: {
		normal: "400" as const,
		medium: "500" as const,
		semibold: "600" as const,
		bold: "700" as const,
		extrabold: "800" as const,
	},
};

export default {
	colors,
	gradients,
	shadows,
	spacing,
	borderRadius,
	typography,
};
