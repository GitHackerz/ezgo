import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "EZGO - Smart Bus Transportation for Tunisia",
	description:
		"Book bus tickets online, track buses in real-time, and travel smart across Tunisia. EZGO is the modern way to travel by bus.",
	keywords: [
		"bus tickets",
		"Tunisia transport",
		"online booking",
		"bus tracking",
		"EZGO",
		"smart mobility",
	],
	authors: [{ name: "EZGO Team" }],
	creator: "EZGO",
	publisher: "EZGO",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://ezgo.tn"),
	alternates: {
		canonical: "/",
		languages: {
			"en-US": "/en",
			"fr-FR": "/fr",
			"ar-TN": "/ar",
		},
	},
	openGraph: {
		title: "EZGO - Smart Bus Transportation for Tunisia",
		description:
			"Book bus tickets online, track buses in real-time, and travel smart across Tunisia.",
		url: "https://ezgo.tn",
		siteName: "EZGO",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "EZGO - Smart Bus Transportation",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "EZGO - Smart Bus Transportation for Tunisia",
		description:
			"Book bus tickets online, track buses in real-time, and travel smart across Tunisia.",
		images: ["/og-image.png"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: "your-google-verification-code",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<link rel="manifest" href="/manifest.json" />
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
