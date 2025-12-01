/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				// Primary Orange
				primary: {
					DEFAULT: "#F5A623",
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
				// Dark Backgrounds
				dark: {
					DEFAULT: "#0D0D1A",
					100: "#1A1A2E",
					200: "#252540",
					300: "#2D2D47",
					400: "#3D3D5C",
				},
				// Text colors for dark theme
				light: {
					DEFAULT: "#FFFFFF",
					100: "#F5F5F7",
					200: "#E5E5EA",
					300: "#B0B0C3",
					400: "#6B6B80",
				},
			},
		},
	},
	plugins: [],
};
