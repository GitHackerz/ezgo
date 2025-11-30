import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";

// Airstrike font for headings
const airstrike = localFont({
	src: [
		{
			path: "../../public/font/airstrike.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/font/airstrikebold.ttf",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-airstrike",
	display: "swap",
});

// Inter for body text
const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "EZGO Dashboard",
	description: "Smart Mobility Infrastructure for Tunisia",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.variable} ${airstrike.variable} antialiased font-sans`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
