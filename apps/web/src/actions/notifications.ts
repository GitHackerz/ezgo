"use server";

import { handleRequest } from "@/lib/api";

export interface Notification {
	id: string;
	title: string;
	message: string;
	type: string;
	isRead: boolean;
	data?: any;
	userId: string;
	createdAt: string;
}

export interface CreateNotificationDto {
	title: string;
	message: string;
	type: string;
	userId: string;
	data?: any;
}

export interface SendBulkNotificationDto {
	title: string;
	message: string;
	type: string;
	userIds?: string[];
	role?: string;
}

export async function getNotifications() {
	return handleRequest<Notification[]>("get", "notifications");
}

export async function getUnreadCount() {
	return handleRequest<{ count: number }>("get", "notifications/unread-count");
}

export async function createNotification(data: CreateNotificationDto) {
	return handleRequest<Notification>("post", "notifications", data);
}

export async function sendBulkNotification(data: SendBulkNotificationDto) {
	return handleRequest<void>("post", "notifications/bulk", data);
}

export async function markAsRead(id: string) {
	return handleRequest<Notification>("patch", `notifications/${id}/read`);
}

export async function markAllAsRead() {
	return handleRequest<void>("patch", "notifications/read-all");
}
