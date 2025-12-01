import api from "./api";
import type { Trip } from "./tripService";

export type BookingStatus =
	| "PENDING"
	| "CONFIRMED"
	| "CANCELLED"
	| "COMPLETED"
	| "REFUNDED"
	| "NO_SHOW";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Booking {
	id: string;
	tripId: string;
	userId: string;
	seatNumbers: string[];
	totalAmount: number;
	status: BookingStatus;
	paymentStatus: PaymentStatus;
	paymentMethod?: string;
	transactionId?: string;
	bookingReference: string;
	passengerDetails?: {
		name: string;
		phone: string;
		email?: string;
	};
	boardingPoint?: string;
	droppingPoint?: string;
	boardedAt?: string;
	cancelledAt?: string;
	cancellationReason?: string;
	createdAt: string;
	updatedAt: string;
	trip?: Trip;
}

export interface CreateBookingData {
	tripId: string;
	seatNumbers: string[];
	passengerDetails?: {
		name: string;
		phone: string;
		email?: string;
	};
	boardingPoint?: string;
	droppingPoint?: string;
	paymentMethod?: string;
}

export interface PaymentData {
	bookingId: string;
	paymentMethod: "CARD" | "WALLET" | "CASH";
	cardDetails?: {
		cardNumber: string;
		expiryMonth: string;
		expiryYear: string;
		cvv: string;
		cardHolderName: string;
	};
}

const bookingService = {
	// Create a new booking
	async createBooking(data: CreateBookingData): Promise<Booking> {
		const response = await api.post("/bookings", data);
		return response.data;
	},

	// Get booking by ID
	async getBookingById(id: string): Promise<Booking> {
		const response = await api.get(`/bookings/${id}`);
		return response.data;
	},

	// Get booking by reference
	async getBookingByReference(reference: string): Promise<Booking> {
		const response = await api.get(`/bookings/reference/${reference}`);
		return response.data;
	},

	// Get user's bookings
	async getMyBookings(status?: BookingStatus): Promise<Booking[]> {
		const params = status ? { status } : {};
		const response = await api.get("/bookings/my-bookings", { params });
		return response.data;
	},

	// Get upcoming bookings
	async getUpcomingBookings(): Promise<Booking[]> {
		const response = await api.get("/bookings/upcoming");
		return response.data;
	},

	// Get past bookings
	async getPastBookings(): Promise<Booking[]> {
		const response = await api.get("/bookings/history");
		return response.data;
	},

	// Cancel a booking
	async cancelBooking(bookingId: string, reason?: string): Promise<Booking> {
		const response = await api.post(`/bookings/${bookingId}/cancel`, {
			reason,
		});
		return response.data;
	},

	// Process payment for booking
	async processPayment(
		data: PaymentData,
	): Promise<{ success: boolean; transactionId: string }> {
		const response = await api.post("/bookings/payment", data);
		return response.data;
	},

	// Get ticket/QR code for booking
	async getTicket(
		bookingId: string,
	): Promise<{ qrCode: string; ticketData: any }> {
		const response = await api.get(`/bookings/${bookingId}/ticket`);
		return response.data;
	},

	// Request refund
	async requestRefund(
		bookingId: string,
		reason: string,
	): Promise<{ success: boolean; refundAmount: number }> {
		const response = await api.post(`/bookings/${bookingId}/refund`, {
			reason,
		});
		return response.data;
	},

	// Rate a completed trip
	async rateTrip(
		bookingId: string,
		rating: number,
		review?: string,
	): Promise<void> {
		await api.post(`/bookings/${bookingId}/rate`, { rating, review });
	},

	// Get rating for a booking
	async getBookingRating(
		bookingId: string,
	): Promise<{ rating: number; review?: string } | null> {
		const response = await api.get(`/bookings/${bookingId}/rating`);
		return response.data;
	},

	// Resend confirmation email
	async resendConfirmation(bookingId: string): Promise<void> {
		await api.post(`/bookings/${bookingId}/resend-confirmation`);
	},

	// Download ticket as PDF
	async downloadTicketPdf(bookingId: string): Promise<Blob> {
		const response = await api.get(`/bookings/${bookingId}/ticket/pdf`, {
			responseType: "blob",
		});
		return response.data;
	},
};

export default bookingService;
