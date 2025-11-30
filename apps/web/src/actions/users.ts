"use server";

import { handleRequest } from "@/lib/api";

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone?: string;
	avatar?: string;
	role: "ADMIN" | "COMPANY_ADMIN" | "DRIVER" | "PASSENGER";
	isVerified: boolean;
	companyId?: string;
	company?: {
		id: string;
		name: string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface CreateUserDto {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phone?: string;
	role: "ADMIN" | "COMPANY_ADMIN" | "DRIVER" | "PASSENGER";
	companyId?: string;
}

export interface UpdateUserDto {
	email?: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
	avatar?: string;
	role?: "ADMIN" | "COMPANY_ADMIN" | "DRIVER" | "PASSENGER";
	companyId?: string;
}

export async function getUsers(companyId?: string) {
	const url = companyId ? `users?companyId=${companyId}` : "users";
	return handleRequest<User[]>("get", url);
}

export async function getUser(id: string) {
	return handleRequest<User>("get", `users/${id}`);
}

export async function getProfile() {
	return handleRequest<User>("get", "users/profile");
}

export async function createUser(data: CreateUserDto) {
	return handleRequest<User>("post", "users", data);
}

export async function updateUser(id: string, data: UpdateUserDto) {
	return handleRequest<User>("patch", `users/${id}`, data);
}

export async function updateProfile(data: UpdateUserDto) {
	return handleRequest<User>("patch", "users/profile", data);
}

export async function updatePassword(
	currentPassword: string,
	newPassword: string,
) {
	return handleRequest<void>("patch", "users/password", {
		currentPassword,
		newPassword,
	});
}

export async function deleteUser(id: string) {
	return handleRequest<void>("delete", `users/${id}`);
}

export async function getDrivers(companyId?: string) {
	const users = await getUsers(companyId);
	if (users.data) {
		return { data: users.data.filter((u) => u.role === "DRIVER") };
	}
	return users;
}
