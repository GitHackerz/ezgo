import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("🌱 Starting database seeding...");

	// Clear existing data in reverse order of dependencies
	console.log("🧹 Clearing existing data...");
	await prisma.message.deleteMany();
	await prisma.maintenance.deleteMany();
	await prisma.notification.deleteMany();
	await prisma.favorite.deleteMany();
	await prisma.rating.deleteMany();
	await prisma.payment.deleteMany();
	await prisma.booking.deleteMany();
	await prisma.trip.deleteMany();
	await prisma.route.deleteMany();
	await prisma.bus.deleteMany();
	await prisma.user.deleteMany();
	await prisma.company.deleteMany();
	await prisma.location.deleteMany();
	console.log("✅ Cleared existing data");

	// Create Tunisian locations
	const locations = await Promise.all([
		// Tunis Governorate
		prisma.location.create({
			data: {
				name: "Tunis Centre Ville",
				city: "Tunis",
				governorate: "Tunis",
				address: "Avenue Habib Bourguiba, Tunis",
				latitude: 36.8065,
				longitude: 10.1815,
				type: "CITY",
			},
		}),
		prisma.location.create({
			data: {
				name: "La Marsa",
				city: "La Marsa",
				governorate: "Tunis",
				address: "La Marsa, Tunis",
				latitude: 36.8781,
				longitude: 10.3247,
				type: "CITY",
			},
		}),
		prisma.location.create({
			data: {
				name: "Carthage",
				city: "Carthage",
				governorate: "Tunis",
				address: "Carthage, Tunis",
				latitude: 36.8528,
				longitude: 10.325,
				type: "LANDMARK",
			},
		}),
		prisma.location.create({
			data: {
				name: "Ariana",
				city: "Ariana",
				governorate: "Ariana",
				address: "Ariana Centre",
				latitude: 36.8625,
				longitude: 10.1956,
				type: "CITY",
			},
		}),
		// Sfax Governorate
		prisma.location.create({
			data: {
				name: "Sfax Centre Ville",
				city: "Sfax",
				governorate: "Sfax",
				address: "Avenue Habib Bourguiba, Sfax",
				latitude: 34.7398,
				longitude: 10.76,
				type: "CITY",
			},
		}),
		// Sousse Governorate
		prisma.location.create({
			data: {
				name: "Sousse Centre",
				city: "Sousse",
				governorate: "Sousse",
				address: "Avenue Habib Bourguiba, Sousse",
				latitude: 35.8256,
				longitude: 10.6369,
				type: "CITY",
			},
		}),
		prisma.location.create({
			data: {
				name: "Port El Kantaoui",
				city: "Sousse",
				governorate: "Sousse",
				address: "Port El Kantaoui, Sousse",
				latitude: 35.8931,
				longitude: 10.5953,
				type: "STATION",
			},
		}),
		// Nabeul Governorate
		prisma.location.create({
			data: {
				name: "Nabeul",
				city: "Nabeul",
				governorate: "Nabeul",
				address: "Nabeul Centre",
				latitude: 36.4561,
				longitude: 10.7344,
				type: "CITY",
			},
		}),
		prisma.location.create({
			data: {
				name: "Hammamet",
				city: "Hammamet",
				governorate: "Nabeul",
				address: "Hammamet Centre",
				latitude: 36.4,
				longitude: 10.6167,
				type: "CITY",
			},
		}),
		// Bizerte Governorate
		prisma.location.create({
			data: {
				name: "Bizerte",
				city: "Bizerte",
				governorate: "Bizerte",
				address: "Bizerte Centre",
				latitude: 37.2744,
				longitude: 9.8739,
				type: "CITY",
			},
		}),
		// Monastir Governorate
		prisma.location.create({
			data: {
				name: "Monastir",
				city: "Monastir",
				governorate: "Monastir",
				address: "Monastir Centre",
				latitude: 35.7772,
				longitude: 10.8264,
				type: "CITY",
			},
		}),
		// Kairouan Governorate
		prisma.location.create({
			data: {
				name: "Kairouan",
				city: "Kairouan",
				governorate: "Kairouan",
				address: "Kairouan Centre",
				latitude: 35.6781,
				longitude: 10.0963,
				type: "CITY",
			},
		}),
		// Gabès Governorate
		prisma.location.create({
			data: {
				name: "Gabès",
				city: "Gabès",
				governorate: "Gabès",
				address: "Gabès Centre",
				latitude: 33.8815,
				longitude: 10.0982,
				type: "CITY",
			},
		}),
		// Medenine Governorate
		prisma.location.create({
			data: {
				name: "Djerba",
				city: "Houmt Souk",
				governorate: "Medenine",
				address: "Djerba Island",
				latitude: 33.8076,
				longitude: 10.8451,
				type: "CITY",
			},
		}),
		// Gafsa Governorate
		prisma.location.create({
			data: {
				name: "Gafsa",
				city: "Gafsa",
				governorate: "Gafsa",
				address: "Gafsa Centre",
				latitude: 34.425,
				longitude: 8.7842,
				type: "CITY",
			},
		}),
	]);

	console.log("✅ Created locations");

	// Create companies
	const companies = await Promise.all([
		prisma.company.create({
			data: {
				name: "TunisBus Express",
				address: "123 Avenue Habib Bourguiba, Tunis",
				contact: "+216 71 123 456",
				email: "contact@tunisbus.tn",
				logo: "https://example.com/tunisbus-logo.png",
			},
		}),
		prisma.company.create({
			data: {
				name: "Sfax Transport",
				address: "456 Rue de la République, Sfax",
				contact: "+216 74 987 654",
				email: "info@sfaxtransport.tn",
				logo: "https://example.com/sfaxtransport-logo.png",
			},
		}),
		prisma.company.create({
			data: {
				name: "Carthage Lines",
				address: "789 Boulevard 7 Novembre, Carthage",
				contact: "+216 71 555 789",
				email: "support@carthagelines.tn",
				logo: "https://example.com/carthagelines-logo.png",
			},
		}),
	]);

	console.log("✅ Created companies");

	// Hash password for users
	const hashedPassword = await bcrypt.hash("password123", 10);

	// Create users
	const users = await Promise.all([
		// Company Admins
		prisma.user.create({
			data: {
				email: "admin@tunisbus.tn",
				password: hashedPassword,
				firstName: "Ahmed",
				lastName: "Ben Ali",
				phone: "+216 20 123 456",
				role: "COMPANY_ADMIN",
				isVerified: true,
				companyId: companies[0].id,
			},
		}),
		prisma.user.create({
			data: {
				email: "admin@sfaxtransport.tn",
				password: hashedPassword,
				firstName: "Fatma",
				lastName: "Trabelsi",
				phone: "+216 21 987 654",
				role: "COMPANY_ADMIN",
				isVerified: true,
				companyId: companies[1].id,
			},
		}),
		prisma.user.create({
			data: {
				email: "admin@carthagelines.tn",
				password: hashedPassword,
				firstName: "Mohamed",
				lastName: "Kacem",
				phone: "+216 22 555 789",
				role: "COMPANY_ADMIN",
				isVerified: true,
				companyId: companies[2].id,
			},
		}),
		// Drivers
		prisma.user.create({
			data: {
				email: "driver1@tunisbus.tn",
				password: hashedPassword,
				firstName: "Karim",
				lastName: "Jelassi",
				phone: "+216 23 111 222",
				role: "DRIVER",
				isVerified: true,
				companyId: companies[0].id,
			},
		}),
		prisma.user.create({
			data: {
				email: "driver2@tunisbus.tn",
				password: hashedPassword,
				firstName: "Sami",
				lastName: "Mansouri",
				phone: "+216 24 333 444",
				role: "DRIVER",
				isVerified: true,
				companyId: companies[0].id,
			},
		}),
		prisma.user.create({
			data: {
				email: "driver1@sfaxtransport.tn",
				password: hashedPassword,
				firstName: "Hassen",
				lastName: "Bouzid",
				phone: "+216 25 555 666",
				role: "DRIVER",
				isVerified: true,
				companyId: companies[1].id,
			},
		}),
		// Passengers
		prisma.user.create({
			data: {
				email: "passenger1@example.com",
				password: hashedPassword,
				firstName: "Leila",
				lastName: "Cherif",
				phone: "+216 26 777 888",
				role: "PASSENGER",
				isVerified: true,
			},
		}),
		prisma.user.create({
			data: {
				email: "passenger2@example.com",
				password: hashedPassword,
				firstName: "Nour",
				lastName: "Saidi",
				phone: "+216 27 999 000",
				role: "PASSENGER",
				isVerified: true,
			},
		}),
		prisma.user.create({
			data: {
				email: "passenger3@example.com",
				password: hashedPassword,
				firstName: "Youssef",
				lastName: "Gharbi",
				phone: "+216 28 111 222",
				role: "PASSENGER",
				isVerified: true,
			},
		}),
		prisma.user.create({
			data: {
				email: "passenger4@example.com",
				password: hashedPassword,
				firstName: "Amina",
				lastName: "Ben Amor",
				phone: "+216 29 333 444",
				role: "PASSENGER",
				isVerified: true,
			},
		}),
	]);

	console.log("✅ Created users");

	// Create buses
	const buses = await Promise.all([
		// TunisBus buses
		prisma.bus.create({
			data: {
				plateNumber: "TN-123-AB",
				capacity: 50,
				model: "Mercedes-Benz Sprinter",
				year: 2022,
				status: "ACTIVE",
				latitude: 36.8065,
				longitude: 10.1815,
				companyId: companies[0].id,
			},
		}),
		prisma.bus.create({
			data: {
				plateNumber: "TN-456-CD",
				capacity: 45,
				model: "Volvo 9700",
				year: 2021,
				status: "ACTIVE",
				latitude: 36.8065,
				longitude: 10.1815,
				companyId: companies[0].id,
			},
		}),
		// Sfax Transport buses
		prisma.bus.create({
			data: {
				plateNumber: "TN-789-EF",
				capacity: 40,
				model: "Iveco Crossway",
				year: 2020,
				status: "ACTIVE",
				latitude: 34.7398,
				longitude: 10.76,
				companyId: companies[1].id,
			},
		}),
		// Carthage Lines buses
		prisma.bus.create({
			data: {
				plateNumber: "TN-101-GH",
				capacity: 55,
				model: "Scania Interlink",
				year: 2023,
				status: "ACTIVE",
				latitude: 36.8528,
				longitude: 10.325,
				companyId: companies[2].id,
			},
		}),
	]);

	console.log("✅ Created buses");

	// Create routes
	const routes = await Promise.all([
		prisma.route.create({
			data: {
				name: "Tunis to Sfax Express",
				originId: locations[0].id, // Tunis Centre Ville
				destinationId: locations[4].id, // Sfax Centre Ville
				distance: 270.0,
				duration: 240, // 4 hours
				tripType: "REGULAR",
				stops: [
					{
						locationId: locations[0].id,
						name: "Tunis Centre Ville",
						latitude: 36.8065,
						longitude: 10.1815,
						order: 1,
					},
					{
						locationId: locations[5].id,
						name: "Sousse Centre",
						latitude: 35.8256,
						longitude: 10.6369,
						order: 2,
					},
					{
						locationId: locations[4].id,
						name: "Sfax Centre Ville",
						latitude: 34.7398,
						longitude: 10.76,
						order: 3,
					},
				],
				companyId: companies[0].id,
			},
		}),
		prisma.route.create({
			data: {
				name: "Tunis to Carthage",
				originId: locations[0].id, // Tunis Centre Ville
				destinationId: locations[2].id, // Carthage
				distance: 15.0,
				duration: 30,
				tripType: "REGULAR",
				stops: [
					{
						locationId: locations[0].id,
						name: "Tunis Centre Ville",
						latitude: 36.8065,
						longitude: 10.1815,
						order: 1,
					},
					{
						locationId: locations[2].id,
						name: "Carthage",
						latitude: 36.8528,
						longitude: 10.325,
						order: 2,
					},
				],
				companyId: companies[0].id,
			},
		}),
		prisma.route.create({
			data: {
				name: "Sfax to Tunis",
				originId: locations[4].id, // Sfax Centre Ville
				destinationId: locations[0].id, // Tunis Centre Ville
				distance: 270.0,
				duration: 240,
				tripType: "REGULAR",
				stops: [
					{
						locationId: locations[4].id,
						name: "Sfax Centre Ville",
						latitude: 34.7398,
						longitude: 10.76,
						order: 1,
					},
					{
						locationId: locations[5].id,
						name: "Sousse Centre",
						latitude: 35.8256,
						longitude: 10.6369,
						order: 2,
					},
					{
						locationId: locations[0].id,
						name: "Tunis Centre Ville",
						latitude: 36.8065,
						longitude: 10.1815,
						order: 3,
					},
				],
				companyId: companies[1].id,
			},
		}),
		prisma.route.create({
			data: {
				name: "Carthage to Tunis",
				originId: locations[2].id, // Carthage
				destinationId: locations[0].id, // Tunis Centre Ville
				distance: 15.0,
				duration: 30,
				tripType: "REGULAR",
				stops: [
					{
						locationId: locations[2].id,
						name: "Carthage",
						latitude: 36.8528,
						longitude: 10.325,
						order: 1,
					},
					{
						locationId: locations[0].id,
						name: "Tunis Centre Ville",
						latitude: 36.8065,
						longitude: 10.1815,
						order: 2,
					},
				],
				companyId: companies[2].id,
			},
		}),
		// Special trip: Tunis to Hammamet (Tourist route)
		prisma.route.create({
			data: {
				name: "Tunis to Hammamet Special",
				originId: locations[0].id, // Tunis Centre Ville
				destinationId: locations[8].id, // Hammamet
				distance: 65.0,
				duration: 75,
				tripType: "SPECIAL",
				stops: [
					{
						locationId: locations[0].id,
						name: "Tunis Centre Ville",
						latitude: 36.8065,
						longitude: 10.1815,
						order: 1,
					},
					{
						locationId: locations[7].id,
						name: "Nabeul",
						latitude: 36.4561,
						longitude: 10.7344,
						order: 2,
					},
					{
						locationId: locations[8].id,
						name: "Hammamet",
						latitude: 36.4,
						longitude: 10.6167,
						order: 3,
					},
				],
				companyId: companies[0].id,
			},
		}),
	]);

	console.log("✅ Created routes");

	// Create trips
	const now = new Date();
	const tomorrow = new Date(now);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const trips = await Promise.all([
		// Tomorrow's trips
		prisma.trip.create({
			data: {
				departureTime: new Date(
					tomorrow.getFullYear(),
					tomorrow.getMonth(),
					tomorrow.getDate(),
					8,
					0,
					0,
				),
				arrivalTime: new Date(
					tomorrow.getFullYear(),
					tomorrow.getMonth(),
					tomorrow.getDate(),
					12,
					0,
					0,
				),
				status: "SCHEDULED",
				price: 25.0,
				availableSeats: 50,
				routeId: routes[0].id,
				busId: buses[0].id,
				driverId: users[3].id, // driver1@tunisbus.tn
			},
		}),
		prisma.trip.create({
			data: {
				departureTime: new Date(
					tomorrow.getFullYear(),
					tomorrow.getMonth(),
					tomorrow.getDate(),
					14,
					30,
					0,
				),
				arrivalTime: new Date(
					tomorrow.getFullYear(),
					tomorrow.getMonth(),
					tomorrow.getDate(),
					15,
					0,
					0,
				),
				status: "SCHEDULED",
				price: 5.0,
				availableSeats: 45,
				routeId: routes[1].id,
				busId: buses[1].id,
				driverId: users[4].id, // driver2@tunisbus.tn
			},
		}),
		prisma.trip.create({
			data: {
				departureTime: new Date(
					tomorrow.getFullYear(),
					tomorrow.getMonth(),
					tomorrow.getDate(),
					10,
					0,
					0,
				),
				arrivalTime: new Date(
					tomorrow.getFullYear(),
					tomorrow.getMonth(),
					tomorrow.getDate(),
					14,
					0,
					0,
				),
				status: "SCHEDULED",
				price: 25.0,
				availableSeats: 40,
				routeId: routes[2].id,
				busId: buses[2].id,
				driverId: users[5].id, // driver1@sfaxtransport.tn
			},
		}),
		prisma.trip.create({
			data: {
				departureTime: new Date(
					tomorrow.getFullYear(),
					tomorrow.getMonth(),
					tomorrow.getDate(),
					16,
					0,
					0,
				),
				arrivalTime: new Date(
					tomorrow.getFullYear(),
					tomorrow.getMonth(),
					tomorrow.getDate(),
					16,
					30,
					0,
				),
				status: "SCHEDULED",
				price: 5.0,
				availableSeats: 55,
				routeId: routes[3].id,
				busId: buses[3].id,
				driverId: users[3].id, // driver1@tunisbus.tn
			},
		}),
		// Past completed trip for ratings
		prisma.trip.create({
			data: {
				departureTime: new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate() - 1,
					8,
					0,
					0,
				),
				arrivalTime: new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate() - 1,
					12,
					0,
					0,
				),
				actualDeparture: new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate() - 1,
					8,
					5,
					0,
				),
				actualArrival: new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate() - 1,
					12,
					10,
					0,
				),
				status: "COMPLETED",
				price: 25.0,
				availableSeats: 0,
				routeId: routes[0].id,
				busId: buses[0].id,
				driverId: users[3].id,
			},
		}),
	]);

	console.log("✅ Created trips");

	// Create bookings
	const bookings = await Promise.all([
		prisma.booking.create({
			data: {
				seatNumber: "A1",
				status: "CONFIRMED",
				qrCode: "QR123456789",
				tripId: trips[0].id,
				userId: users[6].id, // passenger1
			},
		}),
		prisma.booking.create({
			data: {
				seatNumber: "B2",
				status: "CONFIRMED",
				qrCode: "QR987654321",
				tripId: trips[0].id,
				userId: users[7].id, // passenger2
			},
		}),
		prisma.booking.create({
			data: {
				seatNumber: "C3",
				status: "CONFIRMED",
				qrCode: "QR456789123",
				tripId: trips[1].id,
				userId: users[8].id, // passenger3
			},
		}),
		// Past booking for completed trip
		prisma.booking.create({
			data: {
				seatNumber: "A1",
				status: "COMPLETED",
				qrCode: "QR_COMPLETED_001",
				tripId: trips[4].id,
				userId: users[6].id,
			},
		}),
	]);

	console.log("✅ Created bookings");

	// Create payments
	await Promise.all([
		prisma.payment.create({
			data: {
				amount: 25.0,
				currency: "TND",
				status: "COMPLETED",
				paymentMethod: "card",
				transactionId: "TXN_001_123456",
				bookingId: bookings[0].id,
				userId: users[6].id,
			},
		}),
		prisma.payment.create({
			data: {
				amount: 25.0,
				currency: "TND",
				status: "COMPLETED",
				paymentMethod: "wallet",
				transactionId: "TXN_002_789012",
				bookingId: bookings[1].id,
				userId: users[7].id,
			},
		}),
		prisma.payment.create({
			data: {
				amount: 5.0,
				currency: "TND",
				status: "COMPLETED",
				paymentMethod: "cash",
				transactionId: "TXN_003_345678",
				bookingId: bookings[2].id,
				userId: users[8].id,
			},
		}),
		prisma.payment.create({
			data: {
				amount: 25.0,
				currency: "TND",
				status: "COMPLETED",
				paymentMethod: "card",
				transactionId: "TXN_COMPLETED_001",
				bookingId: bookings[3].id,
				userId: users[6].id,
			},
		}),
	]);

	console.log("✅ Created payments");

	// Create ratings
	await Promise.all([
		prisma.rating.create({
			data: {
				rating: 5,
				comment:
					"Excellent service! Driver was very professional and the bus was clean.",
				tripId: trips[4].id,
				userId: users[6].id,
			},
		}),
		prisma.rating.create({
			data: {
				rating: 4,
				comment: "Good trip, arrived on time. Would recommend.",
				tripId: trips[4].id,
				userId: users[7].id,
			},
		}),
	]);

	console.log("✅ Created ratings");

	// Create favorites
	await Promise.all([
		prisma.favorite.create({
			data: {
				userId: users[6].id,
				routeId: routes[0].id,
			},
		}),
		prisma.favorite.create({
			data: {
				userId: users[7].id,
				routeId: routes[1].id,
			},
		}),
	]);

	console.log("✅ Created favorites");

	// Create notifications
	await Promise.all([
		prisma.notification.create({
			data: {
				title: "Trip Reminder",
				message: "Your trip from Tunis to Sfax departs tomorrow at 8:00 AM",
				type: "TRIP_REMINDER",
				userId: users[6].id,
				data: { tripId: trips[0].id },
			},
		}),
		prisma.notification.create({
			data: {
				title: "Booking Confirmed",
				message: "Your booking for seat A1 has been confirmed",
				type: "BOOKING_CONFIRMED",
				userId: users[6].id,
				data: { bookingId: bookings[0].id },
			},
		}),
		prisma.notification.create({
			data: {
				title: "Payment Successful",
				message: "Payment of 25.000 TND has been processed successfully",
				type: "PAYMENT_SUCCESS",
				userId: users[6].id,
				data: { paymentId: "TXN_001_123456" },
			},
		}),
	]);

	console.log("✅ Created notifications");

	// Create maintenance records
	await Promise.all([
		prisma.maintenance.create({
			data: {
				description: "Regular maintenance check and oil change",
				cost: 1500.0,
				scheduledDate: new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate() + 7,
				),
				status: "SCHEDULED",
				busId: buses[0].id,
			},
		}),
		prisma.maintenance.create({
			data: {
				description: "Brake system inspection",
				cost: 800.0,
				scheduledDate: new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate() + 14,
				),
				status: "SCHEDULED",
				busId: buses[1].id,
			},
		}),
	]);

	console.log("✅ Created maintenance records");

	// Create messages
	await Promise.all([
		prisma.message.create({
			data: {
				content: "Hello, I would like to inquire about the bus schedule.",
				senderId: users[6].id,
				receiverId: users[0].id, // admin@tunisbus.tn
			},
		}),
		prisma.message.create({
			data: {
				content:
					"Sure, our buses run every hour from 6 AM to 8 PM. Which route are you interested in?",
				senderId: users[0].id,
				receiverId: users[6].id,
				isRead: true,
			},
		}),
	]);

	console.log("✅ Created messages");

	console.log("🎉 Database seeding completed successfully!");
	console.log("\n📊 Seed Summary:");
	console.log(`   • ${locations.length} locations`);
	console.log(`   • ${companies.length} companies`);
	console.log(`   • ${users.length} users`);
	console.log(`   • ${buses.length} buses`);
	console.log(`   • ${routes.length} routes`);
	console.log(`   • ${trips.length} trips`);
	console.log(`   • ${bookings.length} bookings`);
	console.log(`   • ${bookings.length} payments`);
	console.log(`   • 2 ratings`);
	console.log(`   • 2 favorites`);
	console.log(`   • 3 notifications`);
	console.log(`   • 2 maintenance records`);
	console.log(`   • 2 messages`);

	console.log("\n🔐 Test Accounts:");
	console.log("   Admin: admin@tunisbus.tn / password123");
	console.log("   Driver: driver1@tunisbus.tn / password123");
	console.log("   Passenger: passenger1@example.com / password123");
}

main()
	.catch((e) => {
		console.error("❌ Error during seeding:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
