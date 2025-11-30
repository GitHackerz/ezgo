"use server";

import { handleRequest } from "@/lib/api";

export interface Payment {
	id: string;
	amount: number;
	currency: string;
	status: string;
	paymentMethod?: string;
	transactionId?: string;
	bookingId: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
	booking?: {
		id: string;
		seatNumber?: string;
		trip?: {
			route?: {
				name: string;
			};
		};
	};
	user?: {
		firstName: string;
		lastName: string;
		email: string;
	};
}

export async function getPayments() {
	return handleRequest<Payment[]>("get", "payments");
}

export async function getPayment(id: string) {
	return handleRequest<Payment>("get", `payments/${id}`);
}

export async function refundPayment(id: string) {
	return handleRequest<Payment>("post", `payments/${id}/refund`);
}
