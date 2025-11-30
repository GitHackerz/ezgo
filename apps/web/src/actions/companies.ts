"use server";

import { handleRequest } from "@/lib/api";

export interface Company {
	id: string;
	name: string;
	address?: string;
	contact?: string;
	email?: string;
	logo?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateCompanyDto {
	name: string;
	address?: string;
	contact?: string;
	email?: string;
	logo?: string;
}

export interface UpdateCompanyDto {
	name?: string;
	address?: string;
	contact?: string;
	email?: string;
	logo?: string;
}

export async function getCompanies() {
	return handleRequest<Company[]>("get", "company");
}

export async function getCompany(id: string) {
	return handleRequest<Company>("get", `company/${id}`);
}

export async function createCompany(data: CreateCompanyDto) {
	return handleRequest<Company>("post", "company", data);
}

export async function updateCompany(id: string, data: UpdateCompanyDto) {
	return handleRequest<Company>("patch", `company/${id}`, data);
}

export async function deleteCompany(id: string) {
	return handleRequest<void>("delete", `company/${id}`);
}
