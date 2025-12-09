"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Bus, MapPin, Calendar, Users, Check } from "lucide-react";

export default function BookTripPage() {
	const [origin, setOrigin] = useState("");
	const [destination, setDestination] = useState("");
	const [date, setDate] = useState("");
	const [numberOfPersons, setNumberOfPersons] = useState(1);
	const [numberOfBuses, setNumberOfBuses] = useState(1);
	const [submitting, setSubmitting] = useState(false);

	const handleConfirm = async () => {
		setSubmitting(true);

		// Simulate API call - replace with actual booking API
		setTimeout(() => {
			console.log("Booking confirmed:", {
				origin,
				destination,
				date,
				numberOfPersons,
				numberOfBuses,
			});
			// You can add success message or redirect here
			setSubmitting(false);
			// Optionally redirect to booking history
			// router.push("/booking-history");
		}, 1000);
	};

	return (
		<DashboardShell>
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Book a Trip</h1>
					<p className="text-muted-foreground mt-2">
						Fill in the details to book your bus journey
					</p>
				</div>

				{/* Booking Form Card */}
				<Card className="shadow-lg max-w-3xl mx-auto">
					<CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white">
						<CardTitle className="flex items-center gap-2">
							<Bus className="h-6 w-6" />
							Trip Booking Form
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-8">
						<div className="space-y-6">
							<div className="grid gap-6 md:grid-cols-2">
								<div>
									<label htmlFor="origin" className="block text-sm font-semibold mb-2">
										From
									</label>
									<div className="relative">
										<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
										<input
											id="origin"
											type="text"
											placeholder="Origin city"
											value={origin}
											onChange={(e) => setOrigin(e.target.value)}
											className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										/>
									</div>
								</div>

								<div>
									<label htmlFor="destination" className="block text-sm font-semibold mb-2">
										To
									</label>
									<div className="relative">
										<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
										<input
											id="destination"
											type="text"
											placeholder="Destination city"
											value={destination}
											onChange={(e) => setDestination(e.target.value)}
											className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										/>
									</div>
								</div>
							</div>

							<div>
								<label htmlFor="date" className="block text-sm font-semibold mb-2">
									Date
								</label>
								<div className="relative">
									<Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
									<input
										id="date"
										type="date"
										value={date}
										onChange={(e) => setDate(e.target.value)}
										className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									/>
								</div>
							</div>

							<div className="grid gap-6 md:grid-cols-2">
								<div>
									<label htmlFor="persons" className="block text-sm font-semibold mb-2">
										Number of Persons
									</label>
									<div className="relative">
										<Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
										<input
											id="persons"
											type="number"
											min="1"
											value={numberOfPersons}
											onChange={(e) => setNumberOfPersons(Number(e.target.value))}
											className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										/>
									</div>
								</div>

								<div>
									<label htmlFor="buses" className="block text-sm font-semibold mb-2">
										Number of Buses
									</label>
									<div className="relative">
										<Bus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
										<input
											id="buses"
											type="number"
											min="1"
											value={numberOfBuses}
											onChange={(e) => setNumberOfBuses(Number(e.target.value))}
											className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										/>
									</div>
								</div>
							</div>

							<button
								type="button"
								onClick={handleConfirm}
								disabled={submitting || !origin || !destination || !date}
								className="w-full mt-6 px-6 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
							>
								{submitting ? (
									<>
										<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
										Processing...
									</>
								) : (
									<>
										<Check className="h-6 w-6" />
										Confirm Booking
									</>
								)}
							</button>
						</div>
					</CardContent>
				</Card>
			</div>
		</DashboardShell>
	);
}

