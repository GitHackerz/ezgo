"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Ticket, Calendar, MapPin, CreditCard, Download, Clock } from "lucide-react";

type Booking = {
	id: string;
	seatNumber: string;
	status: string;
	qrCode: string;
	createdAt: string;
	trip?: {
		departureTime?: string;
		arrivalTime?: string;
		price?: number;
		route?: {
			name?: string;
			origin?: { name?: string };
			destination?: { name?: string };
		};
		bus?: {
			model?: string;
			plateNumber?: string;
		};
	};
};

export default function BookingHistoryPage() {
	const { data: session } = useSession();
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				// Mock data for now - replace with actual API call
				const mockBookings: Booking[] = [
					{
						id: "1",
						seatNumber: "A1",
						status: "CONFIRMED",
						qrCode: "QR123456789",
						createdAt: new Date().toISOString(),
						trip: {
							departureTime: new Date(Date.now() + 86400000).toISOString(),
							arrivalTime: new Date(Date.now() + 100800000).toISOString(),
							price: 25.0,
							route: {
								name: "Tunis to Sfax Express",
								origin: { name: "Tunis Centre Ville" },
								destination: { name: "Sfax Centre Ville" },
							},
							bus: {
								model: "Mercedes-Benz Sprinter",
								plateNumber: "TN-123-AB",
							},
						},
					},
					{
						id: "2",
						seatNumber: "B5",
						status: "COMPLETED",
						qrCode: "QR987654321",
						createdAt: new Date(Date.now() - 86400000).toISOString(),
						trip: {
							departureTime: new Date(Date.now() - 86400000).toISOString(),
							arrivalTime: new Date(Date.now() - 72000000).toISOString(),
							price: 5.0,
							route: {
								name: "Tunis to Carthage",
								origin: { name: "Tunis Centre Ville" },
								destination: { name: "Carthage" },
							},
							bus: {
								model: "Volvo 9700",
								plateNumber: "TN-456-CD",
							},
						},
					},
					{
						id: "3",
						seatNumber: "C3",
						status: "PENDING",
						qrCode: "QR456789123",
						createdAt: new Date().toISOString(),
						trip: {
							departureTime: new Date(Date.now() + 172800000).toISOString(),
							arrivalTime: new Date(Date.now() + 187200000).toISOString(),
							price: 15.0,
							route: {
								name: "Sousse to Monastir",
								origin: { name: "Sousse" },
								destination: { name: "Monastir" },
							},
							bus: {
								model: "Scania Touring",
								plateNumber: "TN-789-EF",
							},
						},
					},
					{
						id: "4",
						seatNumber: "D2",
						status: "COMPLETED",
						qrCode: "QR321654987",
						createdAt: new Date(Date.now() - 604800000).toISOString(),
						trip: {
							departureTime: new Date(Date.now() - 604800000).toISOString(),
							arrivalTime: new Date(Date.now() - 590400000).toISOString(),
							price: 30.0,
							route: {
								name: "Tunis to Tozeur",
								origin: { name: "Tunis Centre Ville" },
								destination: { name: "Tozeur" },
							},
							bus: {
								model: "Neoplan Cityliner",
								plateNumber: "TN-999-GH",
							},
						},
					},
				];
				setBookings(mockBookings);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching bookings:", error);
				setLoading(false);
			}
		};

		fetchBookings();
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "CONFIRMED":
				return "bg-green-500/20 text-green-600";
			case "COMPLETED":
				return "bg-blue-500/20 text-blue-600";
			case "CANCELLED":
				return "bg-red-500/20 text-red-600";
			case "PENDING":
				return "bg-yellow-500/20 text-yellow-600";
			default:
				return "bg-gray-500/20 text-gray-600";
		}
	};

	return (
		<DashboardShell>
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Booking History</h1>
					<p className="text-muted-foreground mt-2">
						View all your past and upcoming bookings
					</p>
				</div>

				{loading ? (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
						{[1, 2, 3, 4].map((i) => (
							<Card key={i} className="animate-pulse">
								<CardHeader>
									<div className="h-6 bg-gray-200 rounded w-3/4" />
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										<div className="h-4 bg-gray-200 rounded" />
										<div className="h-4 bg-gray-200 rounded w-5/6" />
										<div className="h-4 bg-gray-200 rounded w-4/6" />
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				) : bookings.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-16">
							<Ticket className="h-16 w-16 text-muted-foreground/50 mb-4" />
							<h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
							<p className="text-muted-foreground text-center">
								You haven't made any bookings yet. Book your first trip to get started!
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
						{bookings.map((booking) => (
							<Card key={booking.id} className="shadow-lg hover:shadow-xl transition-shadow">
								<CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white">
									<CardTitle className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Ticket className="h-5 w-5" />
											<span className="text-lg">
												{booking.trip?.route?.name || "Trip Booking"}
											</span>
										</div>
										<span
											className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}
										>
											{booking.status}
										</span>
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-6 space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="flex items-start gap-2">
											<MapPin className="h-4 w-4 text-orange-500 mt-1" />
											<div>
												<p className="text-xs text-muted-foreground">From</p>
												<p className="font-semibold">
													{booking.trip?.route?.origin?.name || "N/A"}
												</p>
											</div>
										</div>
										<div className="flex items-start gap-2">
											<MapPin className="h-4 w-4 text-orange-500 mt-1" />
											<div>
												<p className="text-xs text-muted-foreground">To</p>
												<p className="font-semibold">
													{booking.trip?.route?.destination?.name || "N/A"}
												</p>
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2 text-sm">
										<Calendar className="h-4 w-4 text-orange-500" />
										<span>
											{booking.trip?.departureTime
												? new Date(booking.trip.departureTime).toLocaleString()
												: "N/A"}
										</span>
									</div>

									<div className="flex items-center gap-2 text-sm">
										<Clock className="h-4 w-4 text-orange-500" />
										<span>
											Arrival:{" "}
											{booking.trip?.arrivalTime
												? new Date(booking.trip.arrivalTime).toLocaleString()
												: "N/A"}
										</span>
									</div>

									<div className="flex items-center justify-between pt-2 border-t">
										<div className="flex items-center gap-2">
											<Ticket className="h-4 w-4 text-orange-500" />
											<span className="text-sm">Seat: {booking.seatNumber}</span>
										</div>
										<div className="flex items-center gap-2">
											<CreditCard className="h-4 w-4 text-orange-500" />
											<span className="font-bold text-lg">
												{booking.trip?.price || 0} TND
											</span>
										</div>
									</div>

									<div className="pt-2">
										<p className="text-xs text-muted-foreground mb-1">Bus Details</p>
										<p className="text-sm font-medium">
											{booking.trip?.bus?.model || "N/A"} (
											{booking.trip?.bus?.plateNumber || "N/A"})
										</p>
									</div>

									<button className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2">
										<Download className="h-4 w-4" />
										Download Ticket
									</button>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</DashboardShell>
	);
}
