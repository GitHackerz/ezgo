import { ENDPOINTS } from "../config/api";
import apiClient from "./api";

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phone?: string;
	role?: "PASSENGER" | "DRIVER";
}

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone?: string;
	role: "ADMIN" | "COMPANY_ADMIN" | "DRIVER" | "PASSENGER";
	avatar?: string;
	isVerified: boolean;
	companyId?: string;
}

export interface AuthResponse {
	user: User;
	accessToken: string;
	refreshToken: string;
}

export const authService = {
	async login(credentials: LoginRequest): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>(
			ENDPOINTS.AUTH.LOGIN,
			credentials,
		);
		return response.data;
	},

	async register(data: RegisterRequest): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>(
			ENDPOINTS.AUTH.REGISTER,
			data,
		);
		return response.data;
	},

	async refreshToken(
		refreshToken: string,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const response = await apiClient.post(ENDPOINTS.AUTH.REFRESH, {
			refreshToken,
		});
		return response.data;
	},

	async forgotPassword(email: string): Promise<void> {
		await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
	},

	async resetPassword(token: string, password: string): Promise<void> {
		await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
	},

	async getMe(): Promise<User> {
		const response = await apiClient.get<User>(ENDPOINTS.USERS.ME);
		return response.data;
	},

	async updateProfile(data: Partial<User>): Promise<User> {
		const response = await apiClient.patch<User>(ENDPOINTS.USERS.UPDATE, data);
		return response.data;
	},
};
