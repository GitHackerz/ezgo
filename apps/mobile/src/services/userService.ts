import api from "./api";
import type { User } from "./authService";

export interface UpdateProfileData {
	firstName?: string;
	lastName?: string;
	phone?: string;
	avatar?: string;
	address?: string;
	dateOfBirth?: string;
}

export interface ChangePasswordData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export interface SavedAddress {
	id: string;
	userId: string;
	label: string;
	address: string;
	city: string;
	location: { lat: number; lng: number };
	isDefault: boolean;
	createdAt: string;
}

export interface PaymentMethod {
	id: string;
	userId: string;
	type: "CARD" | "WALLET" | "BANK_ACCOUNT";
	cardLast4?: string;
	cardBrand?: string;
	expiryMonth?: string;
	expiryYear?: string;
	isDefault: boolean;
	createdAt: string;
}

export interface UserStats {
	totalTrips: number;
	totalSpent: number;
	savedAddresses: number;
	upcomingBookings: number;
	completedBookings: number;
}

export interface DriverStats {
	totalTrips: number;
	totalEarnings: number;
	averageRating: number;
	totalPassengers: number;
	completedTrips: number;
	cancelledTrips: number;
	currentMonthEarnings: number;
	currentMonthTrips: number;
}

const userService = {
	// Get current user profile
	async getProfile(): Promise<User> {
		const response = await api.get("/users/profile");
		return response.data;
	},

	// Update user profile
	async updateProfile(data: UpdateProfileData): Promise<User> {
		const response = await api.patch("/users/profile", data);
		return response.data;
	},

	// Upload avatar
	async uploadAvatar(formData: FormData): Promise<{ avatarUrl: string }> {
		const response = await api.post("/users/avatar", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	},

	// Change password
	async changePassword(data: ChangePasswordData): Promise<void> {
		await api.post("/users/change-password", data);
	},

	// Get user stats
	async getStats(): Promise<UserStats> {
		const response = await api.get("/users/stats");
		return response.data;
	},

	// Get driver stats (for drivers only)
	async getDriverStats(): Promise<DriverStats> {
		const response = await api.get("/users/driver/stats");
		return response.data;
	},

	// Get saved addresses
	async getSavedAddresses(): Promise<SavedAddress[]> {
		const response = await api.get("/users/addresses");
		return response.data;
	},

	// Add saved address
	async addAddress(
		address: Omit<SavedAddress, "id" | "userId" | "createdAt">,
	): Promise<SavedAddress> {
		const response = await api.post("/users/addresses", address);
		return response.data;
	},

	// Update saved address
	async updateAddress(
		addressId: string,
		data: Partial<SavedAddress>,
	): Promise<SavedAddress> {
		const response = await api.patch(`/users/addresses/${addressId}`, data);
		return response.data;
	},

	// Delete saved address
	async deleteAddress(addressId: string): Promise<void> {
		await api.delete(`/users/addresses/${addressId}`);
	},

	// Get payment methods
	async getPaymentMethods(): Promise<PaymentMethod[]> {
		const response = await api.get("/users/payment-methods");
		return response.data;
	},

	// Add payment method
	async addPaymentMethod(data: any): Promise<PaymentMethod> {
		const response = await api.post("/users/payment-methods", data);
		return response.data;
	},

	// Delete payment method
	async deletePaymentMethod(paymentMethodId: string): Promise<void> {
		await api.delete(`/users/payment-methods/${paymentMethodId}`);
	},

	// Set default payment method
	async setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
		await api.patch(`/users/payment-methods/${paymentMethodId}/default`);
	},

	// Delete account
	async deleteAccount(password: string): Promise<void> {
		await api.delete("/users/account", { data: { password } });
	},

	// Get travel history
	async getTravelHistory(): Promise<any[]> {
		const response = await api.get("/users/travel-history");
		return response.data;
	},
};

export default userService;
